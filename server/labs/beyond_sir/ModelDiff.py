# -*- coding: utf-8 -*-
''' SEIR model based on differential equations extended to hospitalisation '''

import argparse
import numpy as np
import pandas as pd
pd.options.mode.chained_assignment = None  # default='warn'

from scipy.integrate import odeint

from labs.defaults import get_default_params

def deriv(compartiments, t, beta, parameters):
    '''
        I = IR + IH - infectés
        M = IH ???
    '''
    SE, INCUB, I, SM, SI, R, DC = compartiments

    gamma = 1.0/parameters['dm_r']

    dm_EI = parameters['dm_incub']
    #dm_IR = 9.0 # infectés rétablis (non utilisé ??)
    '''
        Le modèle semble plus fin que le SIR+H dans la mesure où il prend en compte des
        durées moyennes de transition différentes entre l'infection et l'admission en
        médecine ou réa, ou de transition médecine vers réa, etc...
    '''
    dm_IC = parameters['dm_h'] # infectés vers hospitalisés critiques
    dm_IM = parameters['dm_h'] # infectés vers hospitalisés médicalisés

    ''' On considère ici que les temps de séjour en médecine sont indépendants
        de l'évolution du patient vers d'autres services ou vers la sortie
    '''
    dm_MC = parameters['dm_sm']
    dm_MR = parameters['dm_sm']
    dm_MD = parameters['dm_sm']

    ''' On considère ici que les temps de séjour en réa sont indépendants
         de l'évolution du patient vers d'autres services ou vers la sortie
    '''
    dm_CD = parameters['dm_si']
    dm_CR = parameters['dm_si']

    pc_IR = parameters['pc_ir']
    pc_HC = parameters['pc_si']
    pc_IM = (1 - pc_IR) * (1 - pc_HC)
    np.testing.assert_almost_equal(pc_IM, parameters['pc_ih'] * parameters['pc_sm'])
    pc_IC = (1 - pc_IR) * pc_HC
    np.testing.assert_almost_equal(pc_IC, parameters['pc_ih'] * parameters['pc_si'])
    np.testing.assert_almost_equal(pc_IR + pc_IC + pc_IM, 1.0)

    #pc_MC = 0 #0.21
    #pc_MD = (1 - pc_MC) * 0.25
    #pc_MR = (1 - pc_MC) * 0.75
    pc_MC = parameters['pc_sm_si']
    pc_MD = parameters['pc_sm_dc']
    pc_MR = parameters['pc_sm_out']
    np.testing.assert_almost_equal(pc_MC + pc_MD + pc_MR, 1.0)
    #pc_CD = 0.40
    #pc_CR = 1 - pc_CD
    pc_CD = parameters['pc_si_dc']
    pc_CR = parameters['pc_si_out']
    np.testing.assert_almost_equal(pc_CD + pc_CR, 1.0)

    N = SE + INCUB + I + R
    # print(f'pc_IM={pc_IM} pc_IC={pc_IC} pc_MD={pc_MD} pc_MR={pc_MR}')
    # print(f't={t} M={M} R0={beta(t)/gamma}')


    dSdt = -beta(t) * I * SE / N

    dEdt =  beta(t) * I * SE / N - 1/dm_EI * INCUB

    dIdt = 1/dm_EI * INCUB - gamma * pc_IR * I - 1/dm_IC * pc_IC * I - 1/dm_IM * pc_IM * I

    dMdt = 1/dm_IM * pc_IM * I - 1/dm_MD * pc_MD * SM - 1/dm_MC * pc_MC * SM - 1/dm_MR * pc_MR * SM

    dCdt = 1/dm_IC * pc_IC * I + 1/dm_MC * pc_MC * SM - 1/dm_CD * pc_CD * SI - 1/dm_CR * pc_CR * SI

    dRdt = gamma * pc_IR * I + 1/dm_CR * pc_CR * SI + 1/dm_MR * pc_MR * SM

    dDdt = 1/dm_CD * pc_CD * SI + 1/dm_MD * pc_MD * SM

    return dSdt, dEdt, dIdt, dMdt, dCdt, dRdt, dDdt

def model_diff(parameters, **kwargs):

    model_args = argparse.Namespace(**kwargs)
    parameters = dict(parameters)

    other_arguments = dict(kwargs)
    #del other_arguments['parameters']
    parameters.update(other_arguments)

    if not 't_confinement' in parameters.keys() :
        t_confinement = get_default_params()['other']['confinement']
    else :
        t_confinement = parameters['t_confinement']

    if not 't_end' in parameters.keys() :
        t_end = get_default_params()['other']['deconfinement']
    else :
        t_end = parameters['t_end']

    if not 'beta_post' in parameters.keys() :
        parameters['beta_post'] = get_default_params()['other']['r0_confinement']/parameters['dm_r']
    if not 'beta_end' in parameters.keys() :
        parameters['beta_end'] = 1.2/parameters['dm_r']

    R0_start = parameters['beta']*parameters['dm_r'] if not 'R0_start' in parameters.keys() else parameters['R0_start']
    R0_confinement = parameters['beta_post']*parameters['dm_r']if not 'R0_confinement' in parameters.keys() else parameters['R0_confinement']
    R0_end = parameters['beta_end']*parameters['dm_r'] if not 'R0_end' in parameters.keys() else parameters['R0_end']

    gamma = 1.0/parameters['dm_r'] # dmg dm_IR

    def R0(t, k, R0_start, t_confinement, R0_confinement, t_end, R0_end):
        # return 3.31
        # return R0_start if t < t_confinement else R0_confinement
        # if t<(t_confinement + t_end)/2:
        return (R0_start-R0_confinement) / (1 + np.exp(-k*(-t + t_confinement))) + R0_confinement
        # else:
          # return (R0_confinement-R0_end) / (1 + np.exp(-k*(-t + t_end))) + R0_end

    def beta(t):
        k = 1.0
        return R0(t, k, R0_start, t_confinement, R0_confinement, t_end, R0_end) * gamma

    N = parameters['population']

    y0 = N-parameters['patient0'], parameters['patient0'], 0.0, 0.0, 0.0, 0.0, 0.0
    t = np.linspace(0, parameters['lim_time']-1, parameters['lim_time'])

    ret = odeint(deriv, y0, t, args=(beta, parameters))
    SE, INCUB, I, SM, SI, R, DC = ret.T
    R0_over_time = [beta(i)/gamma for i in range(len(t))]

    return t, SE, INCUB, I, SM, SI, R, DC, R0_over_time
