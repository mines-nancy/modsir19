# -*- coding: utf-8 -*-
''' Invoke as python -m labs.beyond_sir.new_model [options] from the server directory to run the simulator
'''

from models.sir_h.simulator import run_sir_h

from scipy.optimize import minimize
from scipy.optimize import Bounds
import numpy as np
import csv

import os.path
from os import mkdir

from models.rule import RuleChangeField
import matplotlib.pyplot as plt

from labs.defaults import get_default_params, import_json, export_json
import datetime
import argparse
import csv
import math
import pandas as pd

import matplotlib.dates as mdates

import lmfit
from lmfit.lineshapes import gaussian, lorentzian
from .ModelDiff import model_diff
from .ModelDiscr import model_disc

import warnings
warnings.filterwarnings('ignore')

def initial_code(data, model, model_parameters, model_rules) :

    def plotter(t, S, E, I, M, C, R, D, R_0, S_1=None, S_2=None, x_ticks=None):
        if S_1 is not None and S_2 is not None:
          print(f"percentage going to ICU: {S_1*100}; percentage dying in ICU: {S_2 * 100}")


        f, ax = plt.subplots(1,1,figsize=(20,4))
        if x_ticks is None:
            ax.plot(t, S, 'b', alpha=0.7, linewidth=2, label='Susceptibles')
            ax.plot(t, E, 'y', alpha=0.7, linewidth=2, label='Incubés')
            ax.plot(t, I, 'r', alpha=0.7, linewidth=2, label='Infectés')
            ax.plot(t, C, 'r--', alpha=0.7, linewidth=2, label='Soins Intensifs')
            ax.plot(t, R, 'g', alpha=0.7, linewidth=2, label='Rétablis')
            ax.plot(t, D, 'k', alpha=0.7, linewidth=2, label='Décédés')
        else:
            ax.plot(x_ticks, S, 'b', alpha=0.7, linewidth=2, label='Susceptibles')
            ax.plot(x_ticks, E, 'y', alpha=0.7, linewidth=2, label='Incubés')
            ax.plot(x_ticks, I, 'r', alpha=0.7, linewidth=2, label='Infectés')
            ax.plot(x_ticks, C, 'r--', alpha=0.7, linewidth=2, label='Soins Intensifs')
            ax.plot(x_ticks, R, 'g', alpha=0.7, linewidth=2, label='Rétablis')
            ax.plot(x_ticks, D, 'k', alpha=0.7, linewidth=2, label='Décédés')

            ax.xaxis.set_major_locator(mdates.YearLocator())
            ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()


        ax.title.set_text('extended SEIR-Model')

        ax.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        plt.show()

        f = plt.figure(figsize=(20,4))
        # sp1
        ax1 = f.add_subplot(141)
        if x_ticks is None:
            ax1.plot(t, R_0, 'b--', alpha=0.7, linewidth=2, label='R_0')
        else:
            ax1.plot(x_ticks, R_0, 'b--', alpha=0.7, linewidth=2, label='R_0')
            ax1.xaxis.set_major_locator(mdates.YearLocator())
            ax1.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax1.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()


        ax1.title.set_text('R_0 over time')
        ax1.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax1.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # sp2
        sigma = 1.0/get_default_params()['parameters']['dm_incub']

        ax2 = f.add_subplot(142)
        total_CFR = [0] + [100 * D[i] / (sum(sigma*E[:i])) if sum(sigma*E[:i])>0 else 0 for i in range(1, len(t))]
        daily_CFR = [0] + [100 * ((D[i]-D[i-1]) / ((R[i]-R[i-1]) + (D[i]-D[i-1]))) if max((R[i]-R[i-1]), (D[i]-D[i-1]))>10 else 0 for i in range(1, len(t))]
        if x_ticks is None:
            ax2.plot(t, total_CFR, 'r--', alpha=0.7, linewidth=2, label='total')
            ax2.plot(t, daily_CFR, 'b--', alpha=0.7, linewidth=2, label='daily')
        else:
            ax2.plot(x_ticks, total_CFR, 'r--', alpha=0.7, linewidth=2, label='total')
            ax2.plot(x_ticks, daily_CFR, 'b--', alpha=0.7, linewidth=2, label='daily')
            ax2.xaxis.set_major_locator(mdates.YearLocator())
            ax2.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax2.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()

        ax2.title.set_text('Fatality Rate (%)')
        ax2.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax2.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # sp3
        ax3 = f.add_subplot(143)
        newDs = [0] + [D[i]-D[i-1] for i in range(1, len(t))]
        if x_ticks is None:
            ax3.plot(t, newDs, 'r--', alpha=0.7, linewidth=2, label='total')
        else:
            ax3.plot(x_ticks, newDs, 'r--', alpha=0.7, linewidth=2, label='total')
            ax3.xaxis.set_major_locator(mdates.YearLocator())
            ax3.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax3.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()

        ax3.title.set_text('Deaths per day')
        ax3.yaxis.set_tick_params(length=0)
        ax3.xaxis.set_tick_params(length=0)
        ax3.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax3.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # sp4
        ax4 = f.add_subplot(144)

        if x_ticks is None:

            ax4.plot(t, M, 'b', alpha=0.7, linewidth=2, label='Medical')
            ax4.plot(t, C, 'r--', alpha=0.7, linewidth=2, label='Critical')

            # ax42 = ax4.twinx()  # instantiate a second axes that shares the same x-axis
            # ax42.plot(t, R_0, 'g--', alpha=0.7, linewidth=2, label='R_0')

        else:
            ax4.plot(x_ticks, M, 'b', alpha=0.7, linewidth=2, label='Medical')
            ax4.plot(x_ticks, C, 'r--', alpha=0.7, linewidth=2, label='Critical')
            # ax42.plot(x_ticks, R_0, 'g--', alpha=0.7, linewidth=2, label='R_0')
            ax4.xaxis.set_major_locator(mdates.YearLocator())
            ax4.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax4.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()


        ax4.title.set_text('Hospital over time')
        ax4.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax4.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # f.tight_layout()  # otherwise the right y-label is slightly clipped

        plt.show()

    #plotter(*Model(parameters=model_parameters))
    if model == 'diff' :
        Model = lambda p, **kwargs : model_diff(p, **kwargs)
    elif model == 'disc' :
        Model = lambda p, **kwargs : model_disc({'parameters': p, 'rules': model_rules}, **kwargs)
    else :
        Model = None

    plotter(*Model(model_parameters))

    # parameters
    # data = sortie SM (=SM+SI+SS) de notre modele

    ''' the labels of the following dictionary will appear with the same name in **kwargs
        passed to Model() '''
    '''
    params_init_min_max = {"R0_start": (3.0, 2.0, 5.0),
                           "R0_confinement": (0.6, 0.3, 2.0),
                           "R0_end": (0.9, 0.3, 3.5)
                           }  # form: {parameter: (initial guess, minimum value, max value)}
    '''
    params_init_min_max = {"beta": (3.31/9, 2.0/9, 5.0/9),
                           "beta_post": (0.4/9, 0.1/9, 2.0/9),
                           "patient0": (40, 1, 100),
                           "dm_h" : (6, 3, 8)
                           }  # form: {parameter: (initial guess, minimum value, max value)}

    days = len(data)
    model_parameters['lim_time'] = days
    y_data = np.array(data)
    x_data = np.linspace(0, days - 1, days, dtype=int)  # x_data is just [0, 1, ..., max_days] array

    def optimize(x_data, y_data, fitter_function) :
        mod = lmfit.Model(fitter_function)
        for kwarg, (init, mini, maxi) in params_init_min_max.items():
            mod.set_param_hint(str(kwarg), value=init, min=mini, max=maxi, vary=True)

        params = mod.make_params()
        result = mod.fit(y_data, params, method="least_squares", x=x_data)
        #result = mod.fit(y_data, params, method='trust-constr', x=x_data)
        print(result.fit_report())

        result.plot_fit(datafmt="-")

        print(result.best_values)

        return result


    ''' fitter for differential model '''
    def fitter(x, **kwargs):
        ret = Model(model_parameters, **kwargs)
        return ret[4][x]

    ''' fitter for discrete model '''
    def fitter2(x, **kwargs):
        ret = model_disc(model_params={ 'parameters': model_parameters, 'rules' : model_rules}, **kwargs)
        return ret[4][x]

    #result2 = optimize(x_data, y_data, fitter2)
    result = optimize(x_data, y_data, fitter)

    full_days = model_parameters['lim_time']
    #first_date = np.datetime64(covid_data.Date.min()) - np.timedelta64(outbreak_shift,'D')
    first_date=np.datetime64('2020-01-06')
    x_ticks = pd.date_range(start=first_date, periods=full_days, freq="D")

    plotter(*Model(model_parameters, **result.best_values), x_ticks=x_ticks)
    #plotter(*model_disc({'parameters':model_parameters, 'rules':model_rules}, **result2.best_values), x_ticks=x_ticks)


if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python model_fitter.py", description='Fit MODSIR-19 simulator parameters on provided measured data.')
    parser.add_argument('-p', '--params', metavar='parameters', type=str, nargs=1,
                   help='pathname to initial parameter set (JSON)')
    parser.add_argument('-i', '--input', metavar='input', type=str, nargs=1,
                   help='input file containing measured parameters (CSV format)')
    parser.add_argument('-d', '--data', metavar='data', choices=['SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC'], nargs=1,
                   help="identification of measured data used for optimization ('data' value in 'SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC')")
    parser.add_argument('-m', '--model', metavar='model', choices=['diff', 'disc_int', 'disc'], nargs=1, default='disc',
                   help="Simulator model to use : differential, discrete state with integer flux, discrete state with continuous flux ('model' value in 'diff', 'disc', 'disc_int')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs=1,
                   help='filename prefix to output obtained curve points in .csv file format')

    ''' @TODO take into account current passed arguments.
        Current behaviour is to take default parameters and to optimise for 'SI'
    '''

    args = parser.parse_args()

    default_model_params = get_default_params()
    day0 = default_model_params['data']['day0']

    read_target = None
    if args.input :
        read_target = pd.read_csv(args.input[0],sep=';').to_numpy()
        target = read_target
    else :
        default_data = default_model_params['data']['data_chu_rea']
        target = np.array([ [x-day0,y]  for (x,y) in default_data.items() if y  ]).reshape([-1,2])

    if args.params :
        model_parameters, model_rules, other = import_json(args.params[0])
    else :
        model_parameters = default_model_params['parameters']
        model_rules = default_model_params['rules']

    if args.model[0] == 'disc_int' :
        model_parameters['integer_flux'] = True

    initial_code(target[:,1], args.model[0], model_parameters, model_rules)
