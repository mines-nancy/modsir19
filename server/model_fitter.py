# -*- coding: utf-8 -*-

from models.sir_h.simulator import run_sir_h
from scipy.optimize import minimize
from scipy.optimize import Bounds
import numpy as np
import csv

from models.rule import RuleChangeField
import matplotlib.pyplot as plt

from defaults import get_default_params

import datetime


"""
Objectif: Coller au jour et a la hauteur du pic de rea

Parametres ajustables: @TODO compléter la descritpion obsolète
 - beta pre-confinement
 - beta post-confinement
 - patient0
 - Parametres hospitaliers
    - pc_ih
    - pc_si
    - pc_sm_si
"""


def run_model(params: [float]):

    default_model_params = get_default_params()

    beta_pre, beta_post, patient0, dm_incub, dm_h, pc_ih, pc_si, pc_sm_si = params
    #print(f'beta_pre={beta_pre} beta_post={beta_post}')
    parameters = {'population': 1000000,
                  'patient0': patient0,
                  'lim_time': 200,
                  'r': 1,
                  'beta': beta_pre,
                  'kpe': 1.0,
                  'dm_incub': dm_incub,
                  'dm_r': 9, 'dm_h': dm_h,
                  'dm_sm': 6, 'dm_si': 9, 'dm_ss': 14,
                  'pc_ir': 1 - pc_ih, 'pc_ih': pc_ih,
                  'pc_sm': 1 - pc_si, 'pc_si': pc_si,
                  'pc_sm_si': pc_sm_si, 'pc_sm_dc': (1-pc_sm_si)*.25, 'pc_sm_out': (1-pc_sm_si*.75),
                  'pc_si_dc': 0.4, 'pc_si_out': 0.6,
                  'pc_h_ss': 0.2, 'pc_h_r': 0.8}

    # Changement par rapport à la version de PEM en reprenant l'ensemble des règles du confinement
    confinement = 70
    deconfinement = 126

    rules = [RuleChangeField(confinement,  'beta',  beta_post),
             RuleChangeField(confinement,  'r',  1.0)]

    lists = run_sir_h(parameters, rules)

    spike_height = max(lists["SI"])
    spike_date = lists["SI"].index(spike_height)

    print([spike_height, spike_date])
    return [spike_height, spike_date, lists["SI"]]


def obj_func(model_parameters, targets):
    pred_height, pred_date, full = run_model(model_parameters)
    target_height, target_date = targets

    date_weight = 0.95

    assert(date_weight >= 0)
    assert(date_weight <= 1)

    return (1-date_weight) * (pred_height/target_height - 1)**2 + date_weight * ((pred_date-target_date)/200)**2
    # return (1-date_weight) * (pred_height/target_height - 1)**2 + date_weight * (pred_date/target_date-1)**2

def optimize(init_parameters, parameter_bounds) :

    res = minimize(fun=(lambda model_parameters: obj_func(model_parameters, targets)), x0=init_parameters,
                       method='trust-constr', bounds=parameter_bounds,
                       options={"disp": False})

    spike_height, spike_date, full = run_model(res.x)
    return res, spike_height, spike_date, full

if __name__ == "__main__":

    default_model_params = get_default_params()
    day0 = default_model_params['day0']
    data_chu = default_model_params['data_chu']

    ''' Compute default target values (peak target_hight and target_date)
    '''
    target_height = max([ v if v else 0 for v in data_chu.values()])
    index = list(data_chu.values()).index(target_height)
    indexvalue = list(data_chu.keys())[index]
    target_date = indexvalue-day0

    targets = np.array([target_height, target_date])

    # parameters: beta_pre, beta_post, patient0, dm_incub, dm_h, pc_ih, pc_si, pc_sm_si
    manual_parameters = np.array([2.839/9, 0.4/9, 40, 4, 6, 0.027, 0.147, 0.203])
    default_parameters = np.array([default_model_params['parameters']['beta'],
        default_model_params['r0_confinement']/default_model_params['parameters']['dm_r'],
        default_model_params['parameters']['patient0'],
        default_model_params['parameters']['dm_incub'],
        default_model_params['parameters']['dm_h'],
        default_model_params['parameters']['pc_ih'],
        default_model_params['parameters']['pc_si'],
        default_model_params['parameters']['pc_sm_si']])
    #print(parameters)
    base = run_model(default_parameters)

    boundmargin = 0.3
    auto_infbounds = [ (1-boundmargin)*p for p in default_parameters]
    auto_supbounds = [ (1+boundmargin)*p for p in default_parameters]
    auto_bounds = Bounds(auto_infbounds, auto_supbounds)

    manual_infbounds = [1.0/9, 0.1/9, 35, 0, 0, 0.001, 0.01, 0.01]
    manual_supbounds = [6.0/9, 3.0/9, 100, 20, 200, 0.20, 1.0, 1.0]
    manual_bounds = Bounds(manual_infbounds, manual_supbounds)

    #res_auto, spike_height_auto, spike_date_auto, full_auto = optimize(default_parameters, auto_bounds)
    res_manual, spike_height_manual, spike_date_manual, full_manual = optimize(default_parameters, manual_bounds)

    full = full_manual
    res = res_manual
    spike_height, spike_date = spike_height_manual, spike_date_manual

    #beta_pre, beta_post, patient0, pc_ih, pc_si, pc_sm_si = res.x
    beta_pre, beta_post, patient0, dm_incub, dm_h, pc_ih, pc_si, pc_sm_si = res.x
    r0_pre = beta_pre*default_model_params['parameters']['dm_r']
    r0_post = beta_post*default_model_params['parameters']['dm_r']

    print(res.x)
    print("Optimal parameters: ")
    print(f" - beta_pre: {beta_pre} ({default_parameters[0]})")
    print(f" - beta_post:{beta_post} ({default_parameters[1]})")
    print(f" - r0_pre:   {round(r0_pre, 3)}")
    print(f" - r0_post:  {round(r0_post, 3)}")
    print(f" - patient0: {round(patient0, 3)} ({default_parameters[2]})")
    print(f" - dm_incub: {round(dm_incub, 3)} ({default_parameters[3]})")
    print(f" - dm_h: {round(dm_h, 3)} ({default_parameters[4]})")
    print(f" - pc_ih:    {round(pc_ih, 3)} ({default_parameters[5]})")
    print(f" - pc_si:    {round(pc_si, 3)} ({default_parameters[6]})")
    print(f" - pc_sm_si: {round(pc_sm_si, 3)} ({default_parameters[7]})")
    print(" ### ### ### ###")
    print(
        f" - spike_height: {round(spike_height, 3)} (target: {round(target_height, 3)})")
    print(f" - spike_date:   {spike_date} (target: {target_date})")

    ''' Plot output
    '''
    data_day0 = {date-day0: data_chu[date]
                 for date in data_chu if date % 5 == 0}

    #plt.plot(range(200),full_auto, label="Optimized (auto)")
    plt.plot(range(200),full, label="Optimized")
    plt.plot(range(200),base[2], label="Baseline")
    plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x',  label="Data CHU")
    #realdata = np.genfromtxt('courbe2.csv', delimiter=';')
    #plt.plot(realdata[...,0],realdata[...,1],'r+', label="Measured")
    plt.legend(loc='upper right')
    plt.show()

    basename = "commando-covid"
    suffix = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
    filename = "_".join([basename, suffix])
    plt.savefig(filename)

    filename = "_".join([basename, "params", suffix])+".txt"
    f = open(filename,"w")
    f.write( str(default_parameters) )
    f.write( str(manual_bounds) )
    f.write("Optimal parameters: ")
    f.write(f" - beta_pre: {beta_pre} ({default_parameters[0]})")
    f.write(f" - beta_post:{beta_post} ({default_parameters[1]})")
    f.write(f" - r0_pre:   {round(r0_pre, 3)}")
    f.write(f" - r0_post:  {round(r0_post, 3)}")
    f.write(f" - patient0: {round(patient0, 3)} ({default_parameters[2]})")
    f.write(f" - dm_incub: {round(dm_incub, 3)} ({default_parameters[3]})")
    f.write(f" - dm_h: {round(dm_h, 3)} ({default_parameters[4]})")
    f.write(f" - pc_ih:    {round(pc_ih, 3)} ({default_parameters[5]})")
    f.write(f" - pc_si:    {round(pc_si, 3)} ({default_parameters[6]})")
    f.write(f" - pc_sm_si: {round(pc_sm_si, 3)} ({default_parameters[7]})")
    f.write(" ### ### ### ###")
    f.write(
        f" - spike_height: {round(spike_height, 3)} (target: {round(target_height, 3)})")
    f.write(f" - spike_date:   {spike_date} (target: {target_date})")
    f.close()
