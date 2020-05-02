# -*- coding: utf-8 -*-
''' Invoke as python -m labs.model_fitter [options] from the server directory to run the simulator
'''
''' this is an ugly hack to be removed and integrated in proper Python package management if ever needed
if __name__ == '__main__' and __package__ is None:
    import sys
    from os import path
    sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
end ugly hack '''

from models.sir_h.simulator import run_sir_h
from scipy.optimize import minimize
from scipy.optimize import Bounds
import numpy as np
import csv

import os.path
from os import mkdir

from models.rule import RuleChangeField
import matplotlib.pyplot as plt

from .defaults import get_default_params, import_json, export_json
import datetime
import argparse
import csv
import math
import pandas as pd
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