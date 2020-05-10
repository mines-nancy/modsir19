# -*- coding: utf-8 -*-
# The code on gaussian processes gas been adapted from Imperial College's CO493
# "Probabilistic Inference" lead by Dr. Mark Van der Wilk

""" Invoke as python -m labs.gaussian_process.gp_in_practice [options] from the server directory to run the simulator
"""

import matplotlib.pyplot as plt
import numpy as np

from .gaussian_process import GaussianProcess
from .kernels.gaussian_kernel import GaussianKernel

import argparse
import os.path
import datetime
import pandas as pd
from bisect import bisect

from labs.defaults import get_default_params

'''
    Fonction d'interpolation linéaire.parameters

    xs : ordonnées dont on souhaite approximer la valoeur
    array : liste de points de référence
'''


def continuous_from_array(xs: np.ndarray, array: [float]) -> np.ndarray:
    interpolation = list()

    for x in list(xs.flatten()):
        x -= decalage
        x_idx = int(x)
        if x_idx >= len(array) - 1:
            interpolation.append(array[-1] + (array[-1] - array[-2]) * (x - len(array) + 1))
        elif x_idx < 0:
            interpolation.append(array[0] + (array[1] - array[0]) * x)
        else:
            lhs = array[x_idx]
            rhs = array[x_idx + 1]
            interpolation.append(lhs + (rhs - lhs) * (x - x_idx))

    return np.array(interpolation).reshape(-1, 1)


'''
    Fonction d'interpolation linéaire.parameters

    xs : ordonnées dont on souhaite approximer la valeur
    array : liste de points de référence sous forme de tuples (x,y) triée de façon croissante selon x
'''


def continuous_from_array_2D(xs: np.ndarray, data: [(float, float)]) -> np.ndarray:
    interpolation = list()

    for x in list(xs.flatten()):
        x_idx = bisect(data, (x, 0))
        # print("2D (x,x_idx) ",x,x_idx)
        if x_idx >= len(data) - 1:
            lhs = data[-2][1]
            rhs = data[-1][1]
            interpolation.append(lhs + (rhs - lhs) * (x - data[-2][0]) / (data[-1][0] - data[-2][0]))
        elif x_idx <= 0:
            lhs = data[0][1]
            rhs = data[1][1]
            interpolation.append(lhs + (rhs - lhs) * (x - data[1][0]) / (data[0][0] - data[1][0]))
        else:
            lhs = data[x_idx - 1][1]
            rhs = data[x_idx][1]
            # v = lhs + (rhs - lhs)*(x - data[x_idx][0])/(data[x_idx+1][0] - data[x_idx][0])
            # v = lhs + (rhs - lhs)*(x - data[x_idx-1][0])/(data[x_idx-1][0] - data[x_idx][0])
            # print("2D ", lhs, v, rhs)
            interpolation.append(lhs + (rhs - lhs) * (x - data[x_idx - 1][0]) / (data[x_idx][0] - data[x_idx - 1][0]))

    return np.array(interpolation).reshape(-1, 1)


if __name__ == '__main__':

    parser = argparse.ArgumentParser(prog="python gp_in_practice.py", description='Display results of gaussian process')
    parser.add_argument('-p', '--prior', metavar='priorfile', type=str, nargs=1,
                        help='pathname to prior data point set (CSV format)')
    parser.add_argument('-i', '--input', metavar='datafile', type=str, nargs=1,
                        help="pathname to observed data point set (CSV format)")
    parser.add_argument('--noplot', action='store_true', help="do not compute curves")
    parser.add_argument('--silentplot', action='store_true',
                        help="do not display obtained curves (but allow to save them)")
    parser.add_argument('--beautify', action='store_true', help="display beautified version of curves")
    parser.add_argument('-n', metavar='points', type=int, nargs=1,
                        help="number of data points to consider for training")
    parser.add_argument('-t', metavar='days', type=int, nargs=1, help="number of days to predict")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs='?', default=argparse.SUPPRESS,
                        help='saves output do files, prefixing filenames with prefix if provided')
    parser.add_argument('--path', metavar='pathname', type=str, nargs=1,
                        help='to be used with -s, --save parameter. Saves output files to provided path')
    args = parser.parse_args()

    if args.path:
        outputdir = args.path[0] + '/'
    else:
        outputdir = "./outputs/"

    if 'save' in vars(args).keys():
        save_output = True
    else:
        save_output = False

    basename = None
    if save_output:
        if not os.path.exists(outputdir):
            os.mkdir(outputdir)

        timestamp = datetime.datetime.now().strftime("%y%m%d_%H%M%S_")

        if args.save:
            basename = outputdir + timestamp + args.save
        else:
            basename = outputdir + timestamp + 'commando_covid_predict'

    ''' @TODO find out what all these parameters actually mean '''
    kernel = GaussianKernel(10, 1, 1)
    initial_dataset = np.arange(0, 10).reshape([-1, 1])
    evaluations = 3 * initial_dataset
    gp = GaussianProcess(kernel, initial_dataset, evaluations)

    default_data = get_default_params()['data']['data_chu_rea']
    day0 = get_default_params()['data']['day0']
    default_target = np.array([[x - day0, y] for (x, y) in default_data.items() if y]).reshape([-1, 2])

    read_target = None
    if args.input:
        read_target = pd.read_csv(args.input[0], sep=';').to_numpy()
        target = read_target
    else:
        target = default_target

    if args.n:
        train_sample_size = args.n[0]
    else:
        train_sample_size = 50

    if args.t:
        prediction_days = args.t[0]
    else:
        prediction_days = target[-1][0] - target[0][0] - train_sample_size

    total_simulation_size = train_sample_size + prediction_days
    start_date = target[0][0]

    target_x_train = target[:train_sample_size, 0]
    target_y_train = target[:train_sample_size, 1]

    read_prior_values = None
    if args.prior:
        read_prior_values = pd.read_csv(args.prior[0], sep=',').to_numpy()
        read_prior_values = list(map(tuple, read_prior_values))
        read_prior_values.sort()
        prior_values = read_prior_values
    else:
        decalage = 47
        default_prior_values = [4.384111622443432, 4.899085274608397, 5.474291047003429, 6.116708882883491,
                                6.833931204693223,
                                7.634518709361278, 8.52824228405142, 9.526120152948556, 10.64039878809136,
                                11.884619945765644,
                                13.273804084051704, 14.824702321405983, 16.556037715697617, 18.488710600262863,
                                20.645997234605222,
                                23.05378251293296, 25.740848051372865, 28.739206692744098, 32.08446400456186,
                                35.81619769044761,
                                39.97836058021257, 44.61971985542958, 49.794340645004894, 55.5621134402942,
                                61.98931984299011,
                                69.1492316545944, 77.12274118406474, 85.9990215395019, 95.87621298814591,
                                106.86212662755499,
                                119.07495166729782, 132.64394844791386, 143.12513104051484, 151.51338059880248,
                                158.13007758587335,
                                163.31930515577238, 167.42872402255276, 170.4766828263645, 172.52525055584857,
                                173.66437749436298,
                                173.9999659984032, 173.64907275927604, 172.71354169303672, 171.2808800621445,
                                169.42749730676223,
                                167.22105614564794, 164.72243635566969, 161.98582417820387, 159.05878729814492,
                                155.98265793944518,
                                152.79310353072083, 149.52079933343614, 146.19203813547034, 142.82925462148987,
                                139.4514863496153,
                                136.0747885821544, 132.712614060573, 129.3761574889298, 126.07466307459195,
                                122.81569592779188]
        prior_values = [(x, y) for (x, y) in
                        zip(range(0 + decalage, len(default_prior_values) + decalage), default_prior_values)]

    prior_mean_2D = lambda x: continuous_from_array_2D(x, prior_values)

    gp = GaussianProcess(kernel, target_x_train, target_y_train, prior_mean=(lambda x: x))
    gp.prior_mean = lambda x: continuous_from_array_2D(x, prior_values)
    opt_params = gp.optimise_parameters().x
    gp.set_kernel_parameters(*opt_params)

    plot_range = np.arange(start_date, start_date + total_simulation_size + 10, 0.1)

    gp_mean = gp.mean(plot_range).flatten()
    gp_std = gp.std(plot_range).flatten()

    gp_predictions = gp.mean(target[train_sample_size:, 0]).flatten()
    gp_std_predictions = gp.std(target[train_sample_size:, 0]).flatten()

    if not args.noplot:

        plt.plot(plot_range, prior_mean_2D(plot_range), "r--", label="Estimation a priori")

        if args.beautify:
            plt.plot(plot_range, gp_mean, "r", label="GP posterior mean")
            plt.fill_between(plot_range, gp_mean - gp_std, gp_mean + gp_std, alpha=0.4, color="b", label="$m ± \sigma$")
            plt.fill_between(plot_range, gp_mean - 3 * gp_std, gp_mean - gp_std, alpha=0.1, color="b",
                             label="$m ± 3\sigma$")
            plt.fill_between(plot_range, gp_mean + gp_std, gp_mean + 3 * gp_std, alpha=0.1, color="b")
        else:
            plt.errorbar(target[train_sample_size:, 0], gp_predictions, gp_std_predictions, linestyle='None',
                         marker='+', capsize=3, label="Prédictions + $\sigma$")
            '''
            plt.scatter(target[train_sample_size:,0],
                        gp_predictions,
                        c='r',
                        marker="+",
                        zorder=1000,
                        s=(30,),
                        label="Prédictions")
            '''

        plt.scatter(target[train_sample_size:, 0],
                    target[train_sample_size:, 1],
                    c='m',
                    marker="+",
                    zorder=1000,
                    s=(30,),
                    label="Non observées")

        plt.scatter(gp.array_dataset,
                    gp.array_objective_function_values,
                    c='g',
                    marker="+",
                    zorder=1000,
                    s=(30,),
                    label="Observations")

        plt.ylim(-1, 1.2 * np.max(target[:, 1]))
        plt.xlabel("Jours")
        plt.ylabel("Nombre de patients")
        plt.title("Prédiction avec processus gaussien")
        plt.legend()

        if save_output:
            plt.savefig(basename)
        if not args.silentplot:
            plt.show()

    if save_output:
        results = pd.DataFrame({'date': target[:, 0], 'value': target[:, 1]})
        results.insert(2, 'predictions', [None for i in range(train_sample_size)] + [i for i in gp_predictions])
        results.insert(3, 'sigma', [None for i in range(train_sample_size)] + [i for i in gp_std_predictions])
        results.to_csv(basename + '.csv')
