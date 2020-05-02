# -*- coding: utf-8 -*-
''' this is an ugly hack to be removed and integrated in proper Python package management if ever needed '''
if __name__ == '__main__' and __package__ is None:
    import sys
    from os import path
    sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
''' end ugly hack '''

from models.sir_h.simulator import run_sir_h
from scipy.optimize import minimize
from scipy.optimize import Bounds
import numpy as np
import csv

import os.path
from os import mkdir

from models.rule import RuleChangeField
import matplotlib.pyplot as plt

import defaults
import datetime
import argparse
import csv
import os.path

"""
Objectif: ajuster la courbe prédite par SIR+H pour coller au mieux aux données observées en réa

Parametres ajustables: @TODO compléter la descritpion obsolète
 - beta pre-confinement
 - beta post-confinement
 - patient0
 - Parametres hospitaliers
    - pc_ih
"""

def run_model(params: [float]):

    parameters = defaults.get_default_params()['parameters']

    beta_pre, beta_post, patient0, dm_h = params
    #print(f'beta_pre={beta_pre} beta_post={beta_post}')
    parameters.update({'patient0': patient0,
                       'beta': beta_pre,
                       'dm_h': dm_h})

    # Changement par rapport à la version de PEM en reprenant l'ensemble des règles du confinement
    confinement = defaults.get_default_params()['other']['confinement']

    rules = [RuleChangeField(confinement,  'beta',  beta_post),
             RuleChangeField(confinement,  'r',  1.0)]

    lists = run_sir_h(parameters, rules)

    spike_height = max(lists["SI"])
    spike_date = lists["SI"].index(spike_height)

    return spike_height, spike_date, lists["SI"]

''' objective function minimising weighted distance between peak and height of peak '''
def obj_func(model_parameters, targets):
    pred_height, pred_date, full = run_model(model_parameters)
    target_height, target_date = targets

    date_weight = 0.999

    assert(date_weight >= 0)
    assert(date_weight <= 1)

    return (1-date_weight) * (pred_height/target_height - 1)**2 + date_weight * ((pred_date-target_date)/200)**2

''' objective function minimising SSD between sample points '''
def obj_func2(model_parameters, targets):
    pred_height, pred_date, full = run_model(model_parameters)

    value = 0.0
    day0 = defaults.get_default_params()['data']['day0']

    for k,v in targets.items():
        if v :
            value += (v-full[k-day0])**2

    return value

def optimize(init_parameters, parameter_bounds, target) :

    res = minimize(fun=(lambda model_parameters: obj_func(model_parameters, target)), x0=init_parameters,
                       method='trust-constr', bounds=parameter_bounds,
                       options={})

    spike_height, spike_date, full = run_model(res.x)
    return res, spike_height, spike_date, full

def optimize2(init_parameters, parameter_bounds, target) :

    res = minimize(fun=(lambda model_parameters: obj_func2(model_parameters, target)), x0=init_parameters,
                       method='trust-constr', bounds=parameter_bounds,
                       options={})

    spike_height, spike_date, full = run_model(res.x)
    return res, spike_height, spike_date, full

if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python model_fitter.py", description='Fit MODSIR-19 simulator parameters on provided measured data.')
    parser.add_argument('-p', '--params', metavar='parameters', type=str, nargs=1,
                   help='pathname to initial parameter set (JSON)')
    parser.add_argument('-i', '--in', metavar='input', type=str, nargs=1,
                   help='input file containing measured parameters (CSV format)')
    parser.add_argument('-d', '--data', metavar='data', type=str, nargs=1,
                   help="identification of measured data used for optimization (in 'SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs=1,
                   help='filename prefix to output obtained curve points in .csv file format')

    args = parser.parse_args()

    default_model_params = defaults.get_default_params()
    day0 = default_model_params['data']['day0']
    data_chu = default_model_params['data']['data_chu_rea']

    ''' Compute default target values (peak target_height and target_date)
    '''
    target_height = max([ v if v else 0 for v in data_chu.values()])
    index = list(data_chu.values()).index(target_height)
    indexvalue = list(data_chu.keys())[index]
    target_date = indexvalue-day0

    targets = np.array([target_height, target_date])

    # parameters: beta_pre, beta_post, patient0, dm_h
    manual_parameters = np.array([3.31/9, 0.4/9, 40, 6])

    default_parameters = np.array([default_model_params['parameters']['beta'],
        default_model_params['other']['r0_confinement']/default_model_params['parameters']['dm_r'],
        default_model_params['parameters']['patient0'],
        default_model_params['parameters']['dm_h']])
    #print(parameters)
    base = run_model(default_parameters)
    plt.plot(range(len(base[2])),base[2], label="Baseline")

    boundmargin = 0.3
    auto_infbounds = [ (1-boundmargin)*p for p in default_parameters]
    auto_supbounds = [ (1+boundmargin)*p for p in default_parameters]
    auto_bounds = Bounds(auto_infbounds, auto_supbounds)

    manual_infbounds = [1.0/9, 0.1/9, 0, 0]
    manual_supbounds = [5.0/9, 2.0/9, 200, 10]
    manual_bounds = Bounds(manual_infbounds, manual_supbounds)

    results = {}

    #results['auto1'] = optimize(default_parameters, auto_bounds, targets)
    #results['auto2'] = optimize2(default_parameters, auto_bounds, data_chu)
    results['manual1'] = optimize(manual_parameters, manual_bounds, targets)
    '''@BUG following line of code produces failed assertion at runtime '''
    results['manual2'] = optimize2(manual_parameters, manual_bounds, data_chu)

    outputdir = "./outputs/"
    if not os.path.exists(outputdir) :
        os.mkdir(outputdir)
    basename = outputdir+"commando-covid"


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

        suffix = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
        filename = "_".join([basename, k, "params", suffix])+".json"
        defaults.export_json(filename, parameters, rules, other)

        print(res.x)
        print(f"Optimal parameters for run {k}")
        print(f" - beta_pre: {beta_pre} ({default_parameters[0]})")
        print(f" - beta_post:{beta_post} ({default_parameters[1]})")
        print(f" - r0_pre:   {round(r0_pre, 3)}")
        print(f" - r0_post:  {round(r0_post, 3)}")
        print(f" - patient0: {round(patient0, 3)} ({default_parameters[2]})")
        print(f" - dm_h: {round(dm_h, 3)} ({default_parameters[3]})")

        print(" ### ### ### ###")
        print(f" - spike_height: {round(spike_height, 3)} (target: {round(target_height, 3)})")
        print(f" - spike_date:   {spike_date} (target: {target_date})")

        ''' Plot output
        '''
        plt.plot(range(len(full)),full, label="Optimized "+k)


    data_day0 = {date-day0: data_chu[date] for date in data_chu }
    plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x',  label="Data CHU")
    plt.legend(loc='upper right')

    filename = "_".join([basename, suffix])
    plt.savefig(filename)
    plt.show()