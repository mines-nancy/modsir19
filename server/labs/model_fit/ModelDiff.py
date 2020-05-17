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

    Copyright (c) 2020 Pierre-Etienne Moreau, Bart Lamiroy
    e-mail: Pierre-Etienne.Moreau@univ-lorraine.fr, Bart.Lamiroy@univ-lorraine.fr
"""

""" SEIR model based on differential equations extended to hospitalisation """




from typing import Dict, List
import numpy as np
from scipy.integrate import odeint
from labs.defaults import get_default_params
def deriv(compartiments, t, beta, parameters: Dict[str, any]) -> tuple:
    """
        I = IR + IH - infectés
        M = IH ???
    """
    SE, INCUB, I, SM, SI, R, DC = compartiments

    gamma = 1.0 / parameters['dm_r']

    dm_incub = parameters['dm_incub']
    '''
        Le modèle semble plus fin que le SIR+H dans la mesure où il prend en compte des
        durées moyennes de transition différentes entre l'infection et l'admission en
        médecine ou réa, ou de transition médecine vers réa, etc...
    '''
    dm_IC = parameters['dm_h']  # infectés vers réa
    dm_IM = parameters['dm_h']  # infectés vers hospitalisés médicalisés

    ''' On considère ici que les temps de séjour en médecine sont indépendants
        de l'évolution du patient vers d'autres services ou vers la sortie
    '''
    dm_MC = parameters['dm_sm']  # durée de séjour moyenne en médecine avant transfert en réa
    # durée de séjour moyenne en médecine avant rétablissement
    dm_MR = parameters['dm_sm']
    #  durée de séjour moyenne en médecine avant décès
    dm_MD = parameters['dm_sm']

    ''' On considère ici que les temps de séjour en réa sont indépendants
         de l'évolution du patient vers d'autres services ou vers la sortie
    '''
    dm_CD = parameters['dm_si']  # durée moyenne en réa avant décès
    dm_CR = parameters['dm_si']  # durée moyenne en réa avant rétablissement

    pc_ir = parameters['pc_ir']
    pc_si = parameters['pc_si']
    pc_IM = (1 - pc_ir) * (1 - pc_si)
    np.testing.assert_almost_equal(
        pc_IM, parameters['pc_ih'] * parameters['pc_sm'])
    pc_IC = (1 - pc_ir) * pc_si
    np.testing.assert_almost_equal(
        pc_IC, parameters['pc_ih'] * parameters['pc_si'])
    np.testing.assert_almost_equal(pc_ir + pc_IC + pc_IM, 1.0)

    pc_sm_si = parameters['pc_sm_si']
    pc_sm_dc = parameters['pc_sm_dc']
    pc_sm_out = parameters['pc_sm_out']
    np.testing.assert_almost_equal(pc_sm_si + pc_sm_dc + pc_sm_out, 1.0)

    pc_si_dc = parameters['pc_si_dc']
    pc_si_out = parameters['pc_si_out']
    np.testing.assert_almost_equal(pc_si_dc + pc_si_out, 1.0)

    total_nb = SE + INCUB + I + R

    dSdt = -beta(t) * I * SE / total_nb

    dEdt = beta(t) * I * SE / total_nb - 1 / dm_incub * INCUB

    dIdt = 1 / dm_incub * INCUB - gamma * pc_ir * I - \
        1 / dm_IC * pc_IC * I - 1 / dm_IM * pc_IM * I

    dMdt = 1 / dm_IM * pc_IM * I - 1 / dm_MD * pc_sm_dc * SM - \
        1 / dm_MC * pc_sm_si * SM - 1 / dm_MR * pc_sm_out * SM

    dCdt = 1 / dm_IC * pc_IC * I + 1 / dm_MC * pc_sm_si * SM - \
        1 / dm_CD * pc_si_dc * SI - 1 / dm_CR * pc_si_out * SI

    dRdt = gamma * pc_ir * I + 1 / dm_CR * \
        pc_si_out * SI + 1 / dm_MR * pc_sm_out * SM

    dDdt = 1 / dm_CD * pc_si_dc * SI + 1 / dm_MD * pc_sm_dc * SM

    return dSdt, dEdt, dIdt, dMdt, dCdt, dRdt, dDdt


def model_diff(parameters: Dict[str, any], series: List[str] = None, **kwargs: Dict[str, any]) -> Dict[str, any]:

    parameters = dict(parameters)

    other_arguments = dict(kwargs)
    # del other_arguments['parameters']
    parameters.update(other_arguments)

    if 't_confinement' not in parameters.keys():
        t_confinement = get_default_params()['other']['confinement']
    else:
        t_confinement = parameters['t_confinement']

    if 't_end' not in parameters.keys():
        t_end = get_default_params()['other']['deconfinement']
    else:
        t_end = parameters['t_end']

    if 'beta_post' not in parameters.keys():
        parameters['beta_post'] = get_default_params(
        )['other']['r0_confinement'] / parameters['dm_r']
    if 'beta_end' not in parameters.keys():
        parameters['beta_end'] = 1.2 / parameters['dm_r']

    r0_start = parameters['beta'] * parameters['dm_r'] if 'R0_start' not in parameters.keys() else parameters[
        'R0_start']
    r0_confinement = parameters['beta_post'] * parameters['dm_r'] if 'R0_confinement' not in parameters.keys() else \
        parameters['R0_confinement']
    r0_end = parameters['beta_end'] * \
        parameters['dm_r'] if 'R0_end' not in parameters.keys(
    ) else parameters['R0_end']

    gamma = 1.0 / parameters['dm_r']  # dmg dm_IR

    def R0(t, k: float, r0_start: float, t_confinement: int, r0_confinement: float, t_end: int, r0_end: float):
        # return 3.31
        # return R0_start if t < t_confinement else R0_confinement
        # if t<(t_confinement + t_end)/2:
        return (r0_start - r0_confinement) / (1 + np.exp(-k * (-t + t_confinement))) + r0_confinement
        # else:
        # return (R0_confinement-R0_end) / (1 + np.exp(-k*(-t + t_end))) + R0_end

    def beta(t):
        k = 1.0
        return R0(t, k, r0_start, t_confinement, r0_confinement, t_end, r0_end) * gamma

    n_population = parameters['population']

    y0 = n_population - \
        parameters['patient0'], parameters['patient0'], 0.0, 0.0, 0.0, 0.0, 0.0
    t = np.linspace(0, parameters['lim_time'] - 1, parameters['lim_time'])

    ret = odeint(deriv, y0, t, args=(beta, parameters))
    SE, INCUB, I, SM, SI, R, DC = ret.T
    # R0_over_time = [beta(i) / gamma for i in range(len(t))]

    return {'time': t, 'series': {'SE': SE, 'INCUB': INCUB, 'I': I, 'SM': SM, 'SI': SI, 'R': R, 'DC': DC},
            # 'R0': R0_over_time
            }
