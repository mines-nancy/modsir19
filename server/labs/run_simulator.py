''' this is an ugly hack to be removed and integrated in proper Python package management if ever needed '''
if __name__ == '__main__' and __package__ is None:
    import sys
    from os import path
    sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
''' end ugly hack '''

import numpy as np
import matplotlib.pyplot as plt

from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField, RuleEvacuation
import defaults
import argparse

''' This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters
'''
if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python run_simulator.py", description='Run MODSIR-19 simulator on provided parameter sets.')
    parser.add_argument('files', metavar='file', type=str, nargs='*',
                   help='pathname to parameter set (JSON)')

    args = parser.parse_args()

    ''' default parameters are stored in three distinct groups '''
    default_params = defaults.get_default_params()
    parameters = default_params['parameters']
    rules = default_params['rules']
    data = default_params['data']
    other = default_params['other']

    ''' the simulator takes parameters and rules and produces series of points '''
    series = run_sir_h(parameters, rules)

    ''' default parameters also contain reference data '''
    day0 = data['day0']
    data_chu = data['data_chu_rea']
    data_day0 = {date-day0: data_chu[date]
                 for date in data_chu }

    SM = series['SM']
    SI = series['SI']

    x = np.linspace(0, len(SI), len(SI))

    plt.plot(x, SM, label="Médecine")
    plt.plot(x, SI, label="Soins Intensifs")
    plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x',  label="Data CHU")
    plt.legend(loc='upper right')

    for f in vars(args)['files'] :
        parameters, rules, other = defaults.import_json(f)
        series = run_sir_h(parameters, rules)
        SI = series['SI']
        plt.plot(x, SI, label="SI " + f)

    plt.show()

    ''' examples for exporting/importing parameters
    defaults.export_json("mytest.json", parameters, rules, other)

    '''

