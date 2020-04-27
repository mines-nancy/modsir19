# -*- coding: utf-8 -*-
# The code on gaussian processes gas been adapted from Imperial College's CO493
# "Probabilistic Inferrence" lead by Dr. Mark Van der Wilk

import matplotlib.pyplot as plt
import numpy as np

from gaussian_process import GaussianProcess
from kernels.gaussian_kernel import GaussianKernel


def continuous_from_array(xs: np.ndarray, array: [float]) -> np.ndarray:

    interpolation = list()

    for x in list(xs.flatten()):
        x_idx = int(x)
        if x_idx >= len(array)-1:
            interpolation.append(array[-1] + (array[-1] - array[-2]) * (x - len(array) + 1))
        elif x_idx < 0:
            interpolation.append(array[0] + (array[1] - array[0]) * x)
        else:
            lhs = array[x_idx]
            rhs = array[x_idx + 1]
            interpolation.append(lhs + (rhs - lhs)*(x - x_idx))

    return np.array(interpolation).reshape(-1, 1)


if __name__ == '__main__':

    kernel = GaussianKernel(10, 1, 1)
    initial_dataset = np.arange(0, 10).reshape([-1, 1])
    evaluations = 3*initial_dataset
    gp = GaussianProcess(kernel, initial_dataset, evaluations)

    target = [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3, 4.5, 3, 6, 9, 9, 12, 10.5, 12, 12, 13.5, 12, 12, 13.5, 18,
              30, 33, 42, 51, 63, 76.5, 82.5, 91.5, 105, 111, 121.5, 144, 142.5, 153, 148.5, 156, 169.5, 172.5, 174,
              171, 168, 168, 162, 156, 153, 145.5, 141, 138, 139.5, 138, 124.5, 109.5, 105, 100.5, 99, 99, 93, 87]

    target_y = np.array(target)
    target_x = np.arange(len(target))

    target = target[:50]
    target_y_train = np.array(target)
    target_x_train = np.arange(len(target))

    prior_values = [4.384111622443432, 4.899085274608397, 5.474291047003429, 6.116708882883491, 6.833931204693223,
                    7.634518709361278, 8.52824228405142, 9.526120152948556, 10.64039878809136, 11.884619945765644,
                    13.273804084051704, 14.824702321405983, 16.556037715697617, 18.488710600262863, 20.645997234605222,
                    23.05378251293296, 25.740848051372865, 28.739206692744098, 32.08446400456186, 35.81619769044761,
                    39.97836058021257, 44.61971985542958, 49.794340645004894, 55.5621134402942, 61.98931984299011,
                    69.1492316545944, 77.12274118406474, 85.9990215395019, 95.87621298814591, 106.86212662755499,
                    119.07495166729782, 132.64394844791386, 143.12513104051484, 151.51338059880248, 158.13007758587335,
                    163.31930515577238, 167.42872402255276, 170.4766828263645, 172.52525055584857, 173.66437749436298,
                    173.9999659984032, 173.64907275927604, 172.71354169303672, 171.2808800621445, 169.42749730676223,
                    167.22105614564794, 164.72243635566969, 161.98582417820387, 159.05878729814492, 155.98265793944518,
                    152.79310353072083, 149.52079933343614, 146.19203813547034, 142.82925462148987, 139.4514863496153,
                    136.0747885821544, 132.712614060573, 129.3761574889298, 126.07466307459195, 122.81569592779188]

    prior_mean = lambda x: continuous_from_array(x, prior_values)

    gp = GaussianProcess(kernel, target_x_train, target_y_train, prior_mean=(lambda x: x))
    gp.prior_mean = lambda x: continuous_from_array(x, prior_values)
    opt_params = gp.optimise_parameters().x
    gp.set_kernel_parameters(*opt_params)

    plot_range = np.arange(0, 70, 0.1)
    gp_mean = gp.mean(plot_range).flatten()
    gp_std = gp.std(plot_range).flatten()

    interpolation = continuous_from_array(plot_range, target)

    plt.plot(plot_range, prior_mean(plot_range), "r--", label="GP prior mean")
    plt.plot(plot_range, gp_mean, "r", label="GP posterior mean")
    plt.fill_between(plot_range, gp_mean - gp_std, gp_mean + gp_std, alpha=0.4, color="b", label="$m ± \sigma$")
    plt.fill_between(plot_range, gp_mean - 3*gp_std, gp_mean - gp_std, alpha=0.1, color="b", label="$m ± 3\sigma$")
    plt.fill_between(plot_range, gp_mean + gp_std, gp_mean + 3*gp_std, alpha=0.1, color="b")
    plt.scatter(target_x,
                target_y,
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
    plt.ylim(-1, 200)
    plt.xlabel("Jours")
    plt.ylabel("Nombre de patients")
    plt.title("Prediction avec processus gaussien")
    plt.legend()
    plt.show()
