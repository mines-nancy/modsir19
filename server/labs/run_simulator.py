""" This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters
    python -m labs.run_simulator [options] from the server directory to run the simulator
"""
import numpy as np
import matplotlib.pyplot as plt

import csv
import os.path
import argparse
import datetime

from models.sir_h.simulator import run_sir_h
from .defaults import get_default_params, import_json

''' This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters or with provided file of stored parameters
'''
if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python run_simulator.py", description='Run MODSIR-19 simulator on provided '
                                                                                 'parameter sets.')
    parser.add_argument('-p', '--params', metavar='file', type=str, nargs='*',
                        help='pathname to parameter set (JSON)')
    parser.add_argument('-o', metavar='curve', choices=['SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC'],
                        nargs='+',
                        help="list of curve identifiers to output (in 'SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', "
                             "'R', 'DC')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs='?',
                        help='filename prefix to output obtained curve points in .csv file format')
    parser.add_argument('--path', metavar='pathname', type=str, nargs=1,
                        help='to be used with -s, --save parameter. Saves output files to provided path')

    args = parser.parse_args()

    basename = None
    if args.path:
        outputdir = args.path[0] + '/'
    else:
        outputdir = "./outputs/"

    if 'save' in vars(args).keys():
        save_output = True
    else:
        save_output = False

    if save_output:
        if not os.path.exists(outputdir):
            os.mkdir(outputdir)

        # timestamp = datetime.datetime.now().strftime("%y%m%d_%H%M%S_")
        timestamp = ''

        if args.save:
            basename = ''.join([outputdir, timestamp, args.save])
        else:
            basename = ''.join([outputdir, timestamp, 'commando_covid_run'])

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
    data_day0 = np.array([[date - day0, data_chu[date]] for date in data_chu])

    if args.o:
        curve_list = args.o
    else:
        curve_list = ['SI']

    if save_output:
        basename = '_'.join([basename, '+'.join(curve_list)])

    x = np.linspace(day0, day0 + parameters['lim_time'] - 1, parameters['lim_time'])

    if not args.noplot:
        for curve in curve_list:
            c = series[curve]
            plt.plot(x, c, label="Baseline " + curve)
        ''' @TODO allow for other reference data to be plotted '''
        plt.plot(data_day0[:, 0], data_day0[:, 1], 'x', label="Data CHU SI")

    if args.params:
        for f in args.params:
            parameters, rules, other = import_json(f)
            f_base = os.path.splitext(os.path.basename(f))[0]
            series = run_sir_h(parameters, rules)

            for curve in curve_list:
                c = series[curve]
                if not args.noplot:
                    min_size = min(len(x), len(c))
                    plt.plot(x[:min_size], c[:min_size], label=curve + " " + f_base)
                if save_output:
                    with open(basename + "_" + f_base + ".csv", mode='w') as output_file:
                        output_writer = csv.writer(output_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

                        '''  @TODO check if numbering starts from 1 or from 0 '''
                        for item in zip(range(len(c)), c):
                            output_writer.writerow(item)

    if not args.noplot:
        plt.legend(loc='upper right')
        plt.show()

    ''' examples for exporting/importing parameters
    export_json("mytest.json", parameters, rules, other)

    '''
