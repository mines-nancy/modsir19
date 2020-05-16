# -*- coding: utf-8 -*-
"""
    Authors: Bart Lamiroy (Bart.Lamiroy@univ-lorraine.fr)
             Paul Festor
             Romain Pajda

    Invoke as python -m labs.model_fit.optimise [options] from the server directory to run the simulator
"""
import re
from typing import Dict
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import lmfit

import json

import os.path
from os import mkdir
import datetime
import argparse

from models.rule import RuleChangeField
from labs.defaults import get_default_params, import_json, export_json
from .ModelDiff import model_diff
from .ModelDiscr import model_disc


def plotter(time_indexes: np.ndarray, series: Dict[str, np.ndarray], x_ticks=None) -> None:
    series_label_base = {'SE': 'Susceptibles', 'INCUB': 'Incubés', 'I': 'Infectés', 'SI': 'Soins Intensifs',
                         'SM': 'Soins Médicaux', 'SS': 'Soins de Suite', 'R': 'Rétablis',
                         'DC': 'Décédés'}

    series_label_in = {'input_' + k: v + ' IN' for k, v in series_label_base.items()}
    series_label_out = {'output_' + k: v + ' OUT' for k, v in series_label_base.items()}

    series_label = {**series_label_base, **series_label_in, **series_label_out}

    f, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(20, 4))

    regex_in = re.compile('input_.*')
    regex_out = re.compile('output_.*')

    if x_ticks is None:
        x_values = time_indexes
    else:
        x_values = x_ticks

    for s, d in [(s, d) for s, d in series.items() if re.match(regex_in, s)]:
        ax1.plot(x_values, d, alpha=0.7, linewidth=2, label=series_label[s])
    for s, d in [(s, d) for s, d in series.items() if re.match(regex_out, s)]:
        ax2.plot(x_values, d, alpha=0.7, linewidth=2, label=series_label[s])
    for s, d in [(s, d) for s, d in series.items() if not re.match(regex_in, s) and not re.match(regex_out, s)]:
        ax3.plot(x_values, d, alpha=0.7, linewidth=2, label=series_label[s])

    if x_ticks is not None:
        ax1.xaxis.set_major_locator(mdates.YearLocator())
        ax1.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
        ax1.xaxis.set_minor_locator(mdates.MonthLocator())
        f.autofmt_xdate()

    ax1.title.set_text('Flux entrants SIR+H')
    ax1.grid(b=True, which='major', c='w', lw=2, ls='-')
    legend = ax1.legend()

    ax2.title.set_text('Flux sortants SIR+H')
    ax2.grid(b=True, which='major', c='w', lw=2, ls='-')
    legend = ax2.legend()

    ax3.title.set_text('Occupation SIR+H')
    ax3.grid(b=True, which='major', c='w', lw=2, ls='-')
    legend = ax3.legend()

    legend.get_frame().set_alpha(0.5)
    for spine in ('top', 'right', 'bottom', 'left'):
        ax1.spines[spine].set_visible(False)
        ax2.spines[spine].set_visible(False)
        ax3.spines[spine].set_visible(False)

    plt.show()


if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python -m optimise",
                                     description='Fit MODSIR-19 simulator parameters on provided measured data.')
    parser.add_argument('-p', '--params', metavar='parameters', type=str, nargs=1,
                        help='pathname to initial parameter set (JSON)')
    parser.add_argument('-v', '--variables', metavar='variables', type=str, nargs=1,
                        help='pathname to variable parameter set with bounds (JSON) on which to optimise the fitting '
                             'data')
    parser.add_argument('-i', '--input', metavar='input', type=str, nargs=1,
                        help='input file containing measured parameters (CSV format)')

    data_choice_options = ['SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC']
    data_choice_options_input = ['input_' + s for s in data_choice_options]
    data_choice_options_output = ['output_' + s for s in data_choice_options]
    data_choice_options += data_choice_options_input
    data_choice_options += data_choice_options_output

    parser.add_argument('-d', '--data', metavar='data',
                        choices=data_choice_options, nargs=1, default=['SI'],
                        help=f'identification of measured data used for optimization (\'data\' value in {data_choice_options})')
    parser.add_argument('-m', '--model', metavar='model', choices=['diff', 'disc_int', 'disc'], nargs=1,
                        default=['disc'],
                        help="Simulator model to use : differential, discrete state with integer flux, discrete state "
                             "with continuous flux ('model' value in 'diff', 'disc', 'disc_int')")
    parser.add_argument('--opt', metavar='optimiser', choices=['least-squares', 'trust-constr'], nargs=1,
                        default=['least-squares'],
                        help="Simulator model to use : differential, discrete state with integer flux, discrete state "
                             "with continuous flux ('model' value in 'diff', 'disc', 'disc_int')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', default='', type=str, nargs='?',
                        help='filename prefix to output obtained curve points in .csv file format')
    parser.add_argument('-n', metavar='points', type=int, nargs=1,
                        help="number of data points to consider for training")
    parser.add_argument('--path', metavar='pathname', type=str, nargs=1,
                        help='to be used with -s, --save parameter. Saves output files to provided path')

    ''' @TODO take into account --path arguments.
        Current behaviour is to take default parameters and to optimise for 'SI'
    '''

    args = parser.parse_args()

    default_model_params = get_default_params()
    day0 = default_model_params['data']['day0']

    read_target = None
    if args.input:
        """@TODO consider target dates to systematically start on 01/01/2020"""
        read_target = pd.read_csv(args.input[0], sep=';').to_numpy()
        target = read_target
    else:
        default_data = default_model_params['data']['data_chu_rea']
        target = np.array([[x - day0, y] for (x, y) in default_data.items() if y]).reshape([-1, 2])

    if args.n:
        target = target[:args.n[0], ]

    if args.params:
        model_parameters, model_rules, other = import_json(args.params[0])
    else:
        model_parameters = default_model_params['parameters']
        model_rules = default_model_params['rules']

    if args.model[0] == 'disc_int':
        model_parameters['integer_flux'] = True

    optim = args.opt[0]

    ''' @TODO the following hack is ugly and requires models to return data at the
        sames positions as those indexed below ... it would be better if models returned
        their data as a dictionary '''
    series_index = {'SE': 1, 'INCUB': 2, 'I': 3, 'SM': 4, 'SI': 5, 'R': 6, 'DC': 7}

    if args.path:
        outputdir = args.path[0] + '/'
    else:
        outputdir = "./outputs/"

    ''' following test is a hack due to weird choices in argparse defaulting to 'None' '''
    if args.save is not '':
        save_output = True
    else:
        save_output = False

    basename = None
    if save_output:
        if not os.path.exists(outputdir):
            mkdir(outputdir)

        # timestamp = datetime.datetime.now().strftime("%y%m%d_%H%M%S_")
        timestamp=''

        if args.save:
            basename = outputdir + timestamp + args.save
        else:
            basename = outputdir + timestamp + 'commando_covid_fit_' + args.model[0] + '_' + optim

    ''' defining simulator model functions '''
    if args.model[0] == 'diff':
        def simulator_model_func(p, s, **kwargs):
            return model_diff(p, s, **kwargs)
    elif args.model[0] == 'disc' or args.model[0] == 'disc_int':
        def simulator_model_func(p, s, **kwargs):
            return model_disc({'parameters': p, 'rules': model_rules}, s, **kwargs)
    else:
        simulator_model_func = None

    simple_data_tokens = [p.split('_')[-1] for p in args.data]
    full_data_tokens = args.data
    ''' plotting the baseline output of the simulator, before optimisation '''
    if not args.noplot:
        plotter(*simulator_model_func(model_parameters, simple_data_tokens).values())

    ''' Setting up the variables on which the optimisation is to run.
    
        params_init_min_max is a dictionary, the key() labels of which will appear with the same name in **kwargs
        passed to simulator_model_func() later on. These labels are supposed to be those used by the simulator as
        defined in defaults.py . The value() part is a tuple with 3 values (init, min, max) expressing the initial 
        value of the variable, and the min/max bounds it is allowed to evolve during optimisation.
    
        @TODO add computation of proportional default min/max values if non provided '''
    if args.variables:
        with open(args.variables[0]) as json_file:
            opt_variables = json.load(json_file)

        params_init_min_max = dict()
        for k,v in opt_variables.items():
            params_init_min_max[k] = tuple(v)
    else:
        params_init_min_max = {"beta": (3.0 / 9, 2.0 / 9, 5.0 / 9),
                               "beta_post": (0.6 / 9, 0.1 / 9, 2.0 / 9),
                               "patient0": (15, 1, 50),
                               # "dm_r": (9, 6, 21),
                               "dm_incub": (4, 3, 7),
                               "m_factor": (1.0, 0.1, 2)
                               }  # form: {parameter: (initial guess, minimum value, max value)}

    ''' @TODO we are currently assuming x_data goes by integer increments/values. This need not be true '''
    x_data = np.array(target[:, 0], dtype=int)
    y_data = target[:, 1]

    ''' defining the optimisation helper functions optimize() and fitter() '''


    def optimize(x_values, y_values, fitter_function):
        mod = lmfit.Model(fitter_function)
        for kwarg, (init, mini, maxi) in params_init_min_max.items():
            mod.set_param_hint(str(kwarg), value=init, min=mini, max=maxi, vary=True)

        params = mod.make_params()
        return mod.fit(y_values, params, method=optim, x=x_values)


    def fitter(x, **kwargs):
        ret = simulator_model_func(model_parameters, simple_data_tokens, **kwargs)
        return ret['series'][full_data_tokens[0]][x]


    ''' run the oprimisation '''
    result = optimize(x_data, y_data, fitter)

    ''' recover and display/save optimisation results '''
    opt_parameters = dict(model_parameters)
    opt_parameters.update(result.best_values)

    if save_output:
        f = open(basename + '.res', 'w')
        f.write(result.fit_report())
        f.write('\n\n')
        f.write(f'Optimal values : {result.best_values}')
        f.close()

        with open(basename + '_opt.json', 'w') as json_file:
            json.dump(result.best_values, json_file)
            json_file.close()

        ''' @TODO find a way to better integrate pre-existing rules and possible other
            confinement dates than the default ones '''
        opt_rules = [r for r in model_rules]
        try:
            t_confinement = get_default_params()['other']['confinement']
            opt_rules += [RuleChangeField(t_confinement, 'beta', opt_parameters['beta_post'])]
        except KeyError:
            pass

        try:
            t_deconfinement = get_default_params()['other']['deconfinement']
            opt_rules += [RuleChangeField(t_deconfinement, 'beta', opt_parameters['beta_end'])]
        except KeyError:
            pass

        export_json(basename + '.json', opt_parameters, opt_rules)
    else:
        print(result.fit_report())
        print('========')
        print(result.best_values)

    if not args.noplot:
        result.plot_fit(datafmt="-")

        full_days = model_parameters['lim_time']
        # first_date = np.datetime64(covid_data.Date.min()) - np.timedelta64(outbreak_shift,'D')
        first_date = np.datetime64('2020-01-06')
        x_ticks = pd.date_range(start=first_date, periods=full_days, freq="D")

        plotter(*simulator_model_func(model_parameters, simple_data_tokens, **result.best_values).values(), x_ticks=x_ticks)
