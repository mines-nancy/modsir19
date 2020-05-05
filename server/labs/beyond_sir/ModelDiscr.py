# -*- coding: utf-8 -*-
''' SIR+H model based on discrete transitional states '''

import numpy as np

from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField
from labs.defaults import get_default_params

def Model2(parameters, rules, **kwargs):
    t_confinement = get_default_params()['other']['confinement']
    t_end = 126

    parameters = dict(parameters)
    parameters.update(kwargs)

    R0_start = parameters['beta']*parameters['dm_r'] if not 'R0_start' in parameters.keys() else parameters['R0_start']
    R0_confinement = 0.6 if not 'R0_confinement' in parameters.keys() else parameters['R0_confinement']
    R0_end = 1.2 if not 'R0_end' in parameters.keys() else parameters['R0_end']

    if not 'beta_post' in parameters.keys() :
        parameters['beta_post'] = R0_confinement/parameters['dm_r']
    if not 'beta_end' in parameters.keys() :
        parameters['beta_end'] = R0_end/parameters['dm_r']

    rules = [RuleChangeField(t_confinement,  'beta',  parameters['beta_post']),
             RuleChangeField(t_end,  'beta',  parameters['beta_end']),]

    lists = run_sir_h(parameters, rules)
    t = np.linspace(0, parameters['lim_time'], parameters['lim_time'])

    def R0(t, k = 1.0, R0_start = R0_start,
        t_confinement = t_confinement, R0_confinement = R0_confinement,
        t_end = parameters['lim_time'], R0_end = R0_end):
        # return 3.31
        # return R0_start if t < t_confinement else R0_confinement
        # if t<(t_confinement + t_end)/2:
        return (R0_start-R0_confinement) / (1 + np.exp(-k*(-t + t_confinement))) + R0_confinement
        # else:
          # return (R0_confinement-R0_end) / (1 + np.exp(-k*(-t + t_end))) + R0_end

    R0_over_time = [R0(i) for i in range(len(t))]


    return t, lists['SE'], lists['INCUB'], lists['I'], lists['SM'], lists['SI'], lists['R'], lists['DC'], R0_over_time