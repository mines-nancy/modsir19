# -*- coding: utf-8 -*-
# The code on gaussian processes gas been adapted from Imperial College's CO493
# "Probabilistic Inferrence" lead by Dr. Mark Van der Wilk

import numpy as np

from .abstract_kernel import Kernel


class GaussianKernel(Kernel):
    def __init__(self,
                 log_amplitude: float,
                 log_length_scale: float,
                 log_noise_scale: float,
                 ):
        super(GaussianKernel, self).__init__(log_amplitude,
                                             log_length_scale,
                                             log_noise_scale,
                                             )

    def get_covariance_matrix(self,
                              X: np.ndarray,
                              Y: np.ndarray,
                              ) -> np.ndarray:
        """
        :param X: numpy array of size n_1 x m for which each row (x_i) is a data point at which the objective function can be evaluated
        :param Y: numpy array of size n_2 x m for which each row (y_j) is a data point at which the objective function can be evaluated
        :return: numpy array of size n_1 x n_2 for which the value at position (i, j) corresponds to the value of
        k(x_i, y_j), where k represents the kernel used.
        """

        distances_array = np.array([[np.linalg.norm(x_p - x_q) for x_q in Y] for x_p in X])
        covariance_matrix = (
                self.amplitude_squared
                * np.exp((-1 / (2 * self.length_scale ** 2))
                         * (distances_array ** 2))
        )

        return covariance_matrix

    def __call__(self,
                 X: np.ndarray,
                 Y: np.ndarray,
                 ) -> np.ndarray:
        return self.get_covariance_matrix(X, Y)

