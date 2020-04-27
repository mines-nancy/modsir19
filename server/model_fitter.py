# -*- coding: utf-8 -*-

from models.sir_h.simulator import run_sir_h
from scipy.optimize import minimize
from scipy.optimize import Bounds
import numpy as np
from models.rule import RuleChangeField

"""
Objectif: Coller au jour et a la hauteur du pic de rea

Parametres ajustables:
 - beta pre-confinement
 - beta post-confinement
 - patient0
 - Parametres hospitaliers
    - pc_ih
    - pc_si
    - pc_sm_si
"""


def run_model(params: [float]):

    beta_pre, beta_post, patient0, pc_ih, pc_si, pc_sm_si = params
    #print(f'beta_pre={beta_pre} beta_post={beta_post}')
    parameters = {'population': 1000000,
                  'patient0': patient0,
                  'lim_time': 200,
                  'r': 1,
                  'beta': beta_pre,
                  'kpe': 1.0,
                  'dm_incub': 4,
                  'dm_r': 9, 'dm_h': 6,
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

    # return ((pred_date-target_date)/200)**2
    return (1-date_weight) * (pred_height/target_height - 1)**2 + date_weight * ((pred_date-target_date)/200)**2
    # return (1-date_weight) * (pred_height/target_height - 1)**2 + date_weight * (pred_date/target_date-1)**2


if __name__ == "__main__":
    target_height = 174
    target_date = 92 - 5
    targets = np.array([target_height, target_date])

    # parameters: beta_pre, beta_post, patient0, pc_ih, pc_si, pc_sm_si
    parameters = np.array([3.31/9, 0.4/9, 80, 0.02, 0.16, 0.21])
    bounds = Bounds([2/9, 0.1/9, 45, 0.01, 0.1, 0.15],
                    [6/9, 2/9, 100, 0.10, 0.2, 0.26], True)
    print(run_model(parameters))

    res = minimize(fun=(lambda model_parameters: obj_func(model_parameters, targets)), x0=parameters,
                   method='trust-constr', bounds=bounds,
                   options={"disp": True})

    print(res)

    spike_height, spike_date, full = run_model(res.x)

    beta_pre, beta_post, patient0, pc_ih, pc_si, pc_sm_si = res.x
    r0_pre = beta_pre*9
    r0_post = beta_post*9

    print(res.x)
    print("Optimal parameters: ")
    print(f" - beta_pre: {beta_pre}")
    print(f" - beta_post:{beta_post}")
    print(f" - r0_pre:   {round(r0_pre, 3)}")
    print(f" - r0_post:  {round(r0_post, 3)}")
    print(f" - patient0: {round(patient0, 3)}")
    print(f" - pc_ih:    {round(pc_ih, 3)}")
    print(f" - pc_si:    {round(pc_si, 3)}")
    print(f" - pc_sm_si: {round(pc_sm_si, 3)}")
    print(" ### ### ### ###")
    print(
        f" - spike_height: {round(spike_height, 3)} (target: {round(target_height, 3)})")
    print(f" - spike_date:   {spike_date} (target: {target_date})")

    print(full[spike_date-10:spike_date+10])
