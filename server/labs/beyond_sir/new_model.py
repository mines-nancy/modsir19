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
import os.path

import matplotlib.dates as mdates

import lmfit
from lmfit.lineshapes import gaussian, lorentzian
from .ModelDiff import Model
from .ModelDiscr import Model2

import warnings
warnings.filterwarnings('ignore')

def initial_code(data, model_parameters, model_rules) :

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
        total_CFR = [0] + [100 * D[i] / (sigma*sum(E[:i])) if sum(E[:i])>0 else 0 for i in range(1, len(t))]
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


    plotter(*Model(parameters=model_parameters))
    plotter(*Model2(parameters=model_parameters, rules=model_rules))


    # parameters
    # data = sortie SM (=SM+SI+SS) de notre modele

    ''' the labels of the following dictionary will appear with the same name in **kwargs
        passed to Model() '''
    params_init_min_max = {"R0_start": (3.0, 2.0, 5.0),
                           "R0_confinement": (0.6, 0.3, 2.0),
                           "R0_end": (0.9, 0.3, 3.5)
                           }  # form: {parameter: (initial guess, minimum value, max value)}

    days = len(data)
    model_parameters['lim_time'] = days
    y_data = np.array(data)

    x_data = np.linspace(0, days - 1, days, dtype=int)  # x_data is just [0, 1, ..., max_days] array
    #print(list(x_data))
    #print(len(x_data), len(y_data))

    #def fitter(x, R0_start, R0_confinement, R0_end):
    def fitter(x, **kwargs):
        ret = Model(parameters=model_parameters, **kwargs)
        return ret[4][x]

    mod = lmfit.Model(fitter)

    for kwarg, (init, mini, maxi) in params_init_min_max.items():
        mod.set_param_hint(str(kwarg), value=init, min=mini, max=maxi, vary=True)

    params = mod.make_params()
    fit_method = "leastsq"

    result = mod.fit(y_data, params, method="least_squares", x=x_data)

    result.plot_fit(datafmt="-")

    print(result.best_values)

    full_days = model_parameters['lim_time']
    #first_date = np.datetime64(covid_data.Date.min()) - np.timedelta64(outbreak_shift,'D')
    first_date=np.datetime64('2020-01-06')
    x_ticks = pd.date_range(start=first_date, periods=full_days, freq="D")
    print("Prediction for France")

    plotter(*Model(parameters=model_parameters, **result.best_values), x_ticks=x_ticks)

"""
Objectif: ajuster la courbe prédite par SIR+H pour coller au mieux aux données observées en réa

Parametres ajustables: @TODO compléter la descritpion obsolète
 - beta pre-confinement
 - beta post-confinement
 - patient0
 - Parametres hospitaliers
    - pc_ih
"""

def run_model(variables: [float], model_parameters, model_rules):

    parameters = model_parameters

    beta_pre, beta_post, patient0, dm_h = variables
    #print(f'beta_pre={beta_pre} beta_post={beta_post}')
    parameters.update({'patient0': patient0,
                       'beta': beta_pre,
                       'dm_h': dm_h})

    # Changement par rapport à la version de PEM en reprenant l'ensemble des règles du confinement
    confinement = get_default_params()['other']['confinement']

    rules = [RuleChangeField(confinement,  'beta',  beta_post),
             RuleChangeField(confinement,  'r',  1.0)]

    lists = run_sir_h(parameters, rules)

    spike_height = max(lists["SI"])
    spike_date = lists["SI"].index(spike_height)

    return spike_height, spike_date, lists["SI"]

''' objective function minimising weighted distance between peak and height of peak '''
def obj_func(model_variables, targets, model_parameters, model_rules):
    pred_height, pred_date, full = run_model(model_variables, model_parameters, model_rules)
    target_height, target_date = targets

    date_weight = 0.999

    assert(date_weight >= 0)
    assert(date_weight <= 1)

    return (1-date_weight) * (pred_height/target_height - 1)**2 + date_weight * ((pred_date-target_date)/200)**2

''' objective function minimising SSD between sample points '''
def obj_func2(model_variables, targets, model_parameters, model_rules):
    pred_height, pred_date, full = run_model(model_variables, model_parameters, model_rules)

    value = 0.0
    day0 = get_default_params()['data']['day0']

    def f( row ):
        return abs(row[1]-full[math.floor(row[0]-day0)])

    value = np.sum(np.apply_along_axis(f, axis=1, arr=targets ))

    return value

def optimize(init_variables, variable_bounds, target, model_parameters, model_rules) :

    res = minimize(fun=(lambda model_variables: obj_func(model_variables, target, model_parameters, model_rules)), x0=init_variables,
                       method='trust-constr', bounds=variable_bounds,
                       options={})

    spike_height, spike_date, full = run_model(res.x, model_parameters, model_rules)
    return res, spike_height, spike_date, full

def optimize2(init_variables, variable_bounds, target, model_parameters, model_rules) :

    res = minimize(fun=(lambda model_variables: obj_func2(model_variables, target, model_parameters, model_rules)), x0=init_variables,
                       method='trust-constr', bounds=variable_bounds,
                       options={})

    spike_height, spike_date, full = run_model(res.x, model_parameters, model_rules)
    return res, spike_height, spike_date, full

if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python model_fitter.py", description='Fit MODSIR-19 simulator parameters on provided measured data.')
    parser.add_argument('-p', '--params', metavar='parameters', type=str, nargs=1,
                   help='pathname to initial parameter set (JSON)')
    parser.add_argument('-i', '--input', metavar='input', type=str, nargs=1,
                   help='input file containing measured parameters (CSV format)')
    parser.add_argument('-d', '--data', metavar='data', type=str, nargs=1,
                   help="identification of measured data used for optimization (in 'SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs=1,
                   help='filename prefix to output obtained curve points in .csv file format')
    parser.add_argument('--old', action='store_true', help="execute old version")

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

    ''' Compute default target values (peak target_height and target_date)
    '''
    target_height = max(target[:,1])
    index = np.argmax(target[:,1])
    target_date = target[index,0]-day0

    target_goals = np.array([target_height, target_date])

    if args.params :
        model_parameters, model_rules, other = import_json(args.params[0])
    else :
        model_parameters = default_model_params['parameters']
        model_rules = default_model_params['rules']

    if not args.old :
        initial_code(target[:,1], model_parameters, model_rules)
        os.sys.exit()

    ''' executing old version '''

    # parameters: beta_pre, beta_post, patient0, dm_h
    manual_variables = np.array([3.31/9, 0.4/9, 40, 6])

    default_variables = np.array([default_model_params['parameters']['beta'],
        default_model_params['other']['r0_confinement']/default_model_params['parameters']['dm_r'],
        default_model_params['parameters']['patient0'],
        default_model_params['parameters']['dm_h']])
    #print(parameters)
    base = run_model(default_variables, model_parameters, model_rules)
    if not args.noplot :
        plt.plot(range(len(base[2])),base[2], label="Baseline")

    boundmargin = 0.3
    auto_infbounds = [ (1-boundmargin)*p for p in default_variables]
    auto_supbounds = [ (1+boundmargin)*p for p in default_variables]
    auto_bounds = Bounds(auto_infbounds, auto_supbounds)

    manual_infbounds = [1.0/9, 0.1/9, 0, 0]
    manual_supbounds = [5.0/9, 2.0/9, 200, 10]
    manual_bounds = Bounds(manual_infbounds, manual_supbounds)

    results = {}

    #results['auto1'] = optimize(default_variables, auto_bounds, target_goals, model_parameters, model_rules)
    #results['auto2'] = optimize2(default_variables, auto_bounds, data_chu, model_parameters, model_rules)
    results['manual1'] = optimize(manual_variables, manual_bounds, target_goals, model_parameters, model_rules)
    '''@BUG following line of code produces failed assertion at runtime '''
    results['manual2'] = optimize2(manual_variables, manual_bounds, target, model_parameters, model_rules)

    outputdir = "./outputs/"
    if not os.path.exists(outputdir) :
        os.mkdir(outputdir)

    timestamp = datetime.datetime.now().strftime("%y%m%d_%H%M%S_")

    basename = outputdir+timestamp+"commando-covid"


    parameters = default_model_params['parameters']
    other = default_model_params['other']

    for k, v in results.items() :
        full = v[3]
        res = v[0]
        spike_height, spike_date = v[1], v[2]

        beta_pre, beta_post, patient0, dm_h = res.x
        r0_pre = beta_pre*default_model_params['parameters']['dm_r']
        r0_post = beta_post*default_model_params['parameters']['dm_r']

        parameters.update({'patient0': patient0,
                           'beta': beta_pre,
                           'dm_h': dm_h})

        confinement = other['confinement']

        rules = [RuleChangeField(confinement,  'beta',  beta_post),
                 RuleChangeField(confinement,  'r',  1.0)]

        other['r0'] = r0_pre
        other['r0_confinement'] = r0_post

        filename = "_".join([basename, k, "params"])+".json"
        export_json(filename, parameters, rules, other)

        print(res.x)
        print(f"Optimal parameters for run {k}")
        print(f" - beta_pre: {beta_pre} ({default_variables[0]})")
        print(f" - beta_post:{beta_post} ({default_variables[1]})")
        print(f" - r0_pre:   {round(r0_pre, 3)}")
        print(f" - r0_post:  {round(r0_post, 3)}")
        print(f" - patient0: {round(patient0, 3)} ({default_variables[2]})")
        print(f" - dm_h: {round(dm_h, 3)} ({default_variables[3]})")

        print(" ### ### ### ###")
        print(f" - spike_height: {round(spike_height, 3)} (target: {round(target_height, 3)})")
        print(f" - spike_date:   {spike_date} (target: {target_date})")

        ''' Plot output
        '''
        if not args.noplot :
            plt.plot(range(len(full)),full, label="Optimized "+k)

    if not args.noplot :
        plt.plot(target[:,0], target[:,1], 'x',  label="Data CHU")
        plt.legend(loc='upper right')

        filename = "_".join([basename])
        plt.savefig(filename)
        plt.show()