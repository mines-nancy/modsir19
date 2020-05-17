# -*- coding: utf-8 -*-
"""
    This file is part of MODSIR19.

    MODSIR19 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MODSIR19 is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with MODSIR19.  If not, see <https://www.gnu.org/licenses/>.

    Copyright (c) 2020 Bart Lamiroy
    e-mail: Bart.Lamiroy@univ-lorraine.fr
"""

""" SIR+H model based on discrete transitional states """




from typing import Dict, List
import numpy as np
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField
from labs.defaults import get_default_params
def model_disc(model_params: Dict[str, any], series: List[str] = None, **kwargs: Dict[str, any]) -> Dict[str, any]:
    parameters = dict(model_params['parameters'])
    other_arguments = dict(kwargs)
    parameters.update(other_arguments)

    if not 't_confinement' in parameters.keys():
        t_confinement = get_default_params()['other']['confinement']
    else:
        t_confinement = parameters['t_confinement']

    if not 't_end' in parameters.keys():
        t_end = get_default_params()['other']['deconfinement']
    else:
        t_end = parameters['t_end']

    if not 'beta_post' in parameters.keys():
        parameters['beta_post'] = get_default_params(
        )['other']['r0_confinement'] / parameters['dm_r']
    if not 'beta_end' in parameters.keys():
        parameters['beta_end'] = 1.2 / parameters['dm_r']

    R0_start = parameters['beta'] * parameters['dm_r']
    R0_confinement = parameters['beta_post'] * parameters['dm_r']
    R0_end = parameters['beta_end'] * parameters['dm_r']

    '''
    beta_0 = parameters['beta'] if not 'R0_start' in parameters.keys() else parameters['R0_start']/parameters['dm_r']
    beta_post = R0_confinement/parameters['dm_r']
    beta_end = R0_end/parameters['dm_r']

    parameters['beta'] = beta_0
    if not 'beta_post' in parameters.keys() :
        parameters['beta_post'] = R0_confinement/parameters['dm_r']
    if not 'beta_end' in parameters.keys() :
        parameters['beta_end'] = R0_end/parameters['dm_r']
    '''

    rules = [RuleChangeField(t_confinement, 'beta', parameters['beta_post']),
             RuleChangeField(t_end, 'beta', parameters['beta_end']), ]

    lists = run_sir_h(parameters, rules, specific_series=series)
    t = np.linspace(0, parameters['lim_time'] - 1, parameters['lim_time'])

    def R0(t, k=1.0, R0_start=R0_start,
           t_confinement=t_confinement, R0_confinement=R0_confinement,
           t_end=parameters['lim_time'], R0_end=R0_end):
        # return 3.31
        # return R0_start if t < t_confinement else R0_confinement
        # if t<(t_confinement + t_end)/2:
        return (R0_start - R0_confinement) / (1 + np.exp(-k * (-t + t_confinement))) + R0_confinement
        # else:
        # return (R0_confinement-R0_end) / (1 + np.exp(-k*(-t + t_end))) + R0_end

    #  R0_over_time = [R0(i) for i in range(len(t))]

    return {'time': t,
            'series': {k: np.array(v) for k, v in lists.items()},
            # 'series' = {SE': np.array(lists['SE']), 'INCUB': np.array(lists['INCUB']), 'I': np.array(lists['I']),
            #           'SM': np.array(lists['SM']), 'SI': np.array(lists['SI']), 'R': np.array(lists['R']),
            #           'DC': np.array(lists['DC'])},
            # 'R0': R0_over_time
            }
