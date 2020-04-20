# -*- coding: utf-8 -*-

from models.simulator import run_sir_h
from scipy.optimize import minimize
from scipy.optimize import Bounds
import numpy as np

"""
Objectif: Coller au jour et a la hauteur du pic de rea

Parametres ajustables:
 - beta pre-coninement
 - beta post-confinement
 - patient0
 - Parametres hospitaliers
    - pc_ih
    - pc_si
    - pc_sm_si
"""


def run_model(params: [float]):

    beta_pre, beta_post, patient0, pc_ih, pc_si, pc_sm_si = params

    constants = {'population': 1000000, 'patient0': patient0, 'lim_time': 150}
    delays = {'dm_incub': 3, 'dm_r': 9, 'dm_h': 6, 'dm_sm': 6, 'dm_si': 8, 'dm_ss': 14}
    coefficients = {'kpe': 1, 'r': 1, 'beta': beta_pre, 'pc_ir': 1 - pc_ih, 'pc_ih': pc_ih, 'pc_sm': 1 - pc_si,
                    'pc_si': pc_si,  'pc_sm_si': pc_sm_si, 'pc_sm_out': 1 - pc_sm_si, 'pc_si_dc': 0.5, 'pc_si_out': 0.5,
                    'pc_h_ss': 0.2, 'pc_h_r': 0.8}
    rules = [{'field': 'beta', 'value': beta_post, 'date': 53}]

    lists = run_sir_h(constants, delays, coefficients, rules)

    spike_height = max(lists["SI"])
    spike_date = lists["SI"].index(spike_height)

    return [spike_height, spike_date]


def obj_func(x, goal):
    pred_height, pred_date = run_model(x)
    goal_height, goal_date = goal

    date_weight = 100

    return (pred_height - goal_height)**2 + date_weight*(pred_date - goal_date)**2


if __name__ == "__main__":
    target_height = 180
    target_date = 78
    # -> 11/04

    target = np.array([target_height, target_date])
    x0 = np.array([2.3/9, 2.3/9, 100, 0.16, 0.2, 0.2])
    bounds = Bounds([2/9, 0.5/9,   1, 0.05, 0.05, 0.05],
                    [3/9, 1.5/9, 500, 0.25, 0.25, 0.25])
    print(run_model(x0))

    res = minimize(fun=(lambda x: obj_func(x, target)), x0=x0,
                   method='trust-constr', bounds=bounds,
                   options={"disp": True})

    print(res)

    spike_height, spike_date = run_model(res.x)

    beta_pre, beta_post, patient0, pc_ih, pc_si, pc_sm_si = res.x
    r0_pre = beta_pre*9
    r0_post = beta_post*9

    print(res.x)
    print("Optimal parameters: ")
    print(f" - beta_ore: {beta_pre}")
    print(f" - beta_post:{beta_post}")
    print(f" - r0_pre:   {round(r0_pre, 3)}")
    print(f" - r0_post:  {round(r0_post, 3)}")
    print(f" - patient0: {round(patient0, 3)}")
    print(f" - pc_ih:    {round(pc_ih, 3)}")
    print(f" - pc_si:    {round(pc_si, 3)}")
    print(f" - pc_sm_si: {round(pc_sm_si, 3)}")
    print(" ### ### ### ###")
    print(f" - spike_height: {round(spike_height, 3)} (targer: {round(target_height, 3)})")
    print(f" - spike_date:   {spike_date} (targer: {target_date})")

    constants = {'population': 1000000, 'patient0': 100, 'lim_time': 150}
    delays = {'dm_incub': 3, 'dm_r': 9, 'dm_h': 6, 'dm_sm': 6, 'dm_si': 8, 'dm_ss': 14}
    coefficients = {'kpe': 1, 'r': 1, 'beta': 0.2920, 'pc_ir': 1 - 0.066, 'pc_ih': 0.066, 'pc_sm': 1 - 0.186,
                    'pc_si': 0.186,  'pc_sm_si': 0.199, 'pc_sm_out': 1 - 0.199, 'pc_si_dc': 0.5, 'pc_si_out': 0.5,
                    'pc_h_ss': 0.2, 'pc_h_r': 0.8}
    rules = [{'field': 'beta', 'value': 0.0996, 'date': 53}]
