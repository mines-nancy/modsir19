''' This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters
    python -m labs.run_simulator [file] tu run the simulator
'''
import numpy as np
import matplotlib.pyplot as plt
from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField, RuleEvacuation
from labs.defaults import get_default_params, import_json, export_json
import argparse

import csv
import os.path

''' This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters or with provided file of stored parameters


                'SE': BoxSource('SE'),
                # 'INCUB': BoxQueue('INCUB', self.delay('dm_incub')),
                'INCUB': BoxConvolution('INCUB', compute_delay_ki(self.delay('dm_incub'))),

                'IR': BoxConvolution('IR', compute_exp_ki(self.delay('dm_r'))),
                'IH': BoxConvolution('IH', compute_exp_ki(self.delay('dm_h'))),
                'SM': BoxConvolution('SM', compute_exp_ki(self.delay('dm_sm'))),
                'SI': BoxConvolution('SI', [0, 0.03, 0.03, 0.04, 0.05, 0.05, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.03, 0.02]),
                'SS': BoxConvolution('SS', compute_exp_ki(self.delay('dm_ss'))),

                'R': BoxTarget('R'),
                'DC': BoxTarget('DC')
'''
if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python run_simulator.py", description='Run MODSIR-19 simulator on provided parameter sets.')
    parser.add_argument('-p', '--params', metavar='file', type=str, nargs='*',
                   help='pathname to parameter set (JSON)')
    parser.add_argument('-o', metavar='curve', type=str, nargs='+',
                   help="list of curve identifiers to output (in 'SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs=1,
                   help='filename prefix to output obtained curve points in .csv file format')

    args = parser.parse_args()

    ''' default parameters are stored in three distinct groups '''
    default_params = get_default_params()
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
                 for date in data_chu}

    if args.o :
        curve_list = args.o
    else :
        curve_list = ['SI']

    x = np.linspace(0, parameters['lim_time'], parameters['lim_time'])

    if not args.noplot :
        for curve in curve_list :
            c = series[curve]
            plt.plot(x, c, label="Baseline "+curve)
        ''' @TODO allow for other reference data to be plotted '''
        plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x',  label="Data CHU SI")

    if args.params :
        for f in args.params :
            parameters, rules, other = defaults.import_json(f)
            f_base = os.path.splitext(os.path.basename(f))[0]
            series = run_sir_h(parameters, rules)

            for curve in curve_list :
                c = series[curve]
                if not args.noplot :
                    min_size = min(len(x),len(c))
                    plt.plot(x[:min_size], c[:min_size], label=curve + " " + f_base)
                if args.save :
                    with open(args.save[0]+curve+"_"+f_base+".csv", mode='w') as output_file:
                        output_writer = csv.writer(output_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

                        '''  @TODO check if numbering starts from 1 or from 0 '''
                        for item in zip(range(len(c)),c) :
                            output_writer.writerow(item)

    if not args.noplot :
        plt.legend(loc='upper right')
        plt.show()

    ''' examples for exporting/importing parameters
    export_json("mytest.json", parameters, rules, other)

    '''
