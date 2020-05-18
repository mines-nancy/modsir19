# -*- coding: utf-8 -*-
# The code on gaussian processes gas been adapted from Imperial College's CO493
# "Probabilistic Inference" lead by Dr. Mark Van der Wilk

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
"""
    This is mainly transitional code preparing going from home-brewn code in abstract_kernel.py to SciKit-learn 
    compatible code and use with SciKit's Gaussian Processes.
    
    Greatly inspired by Paul Festor's code in abstract_kernel.py
"""
import abc

import numpy as np
from sklearn.gaussian_process.kernels import Kernel, Hyperparameter


class SKernel(Kernel):
    def __init__(self,
                 log_amplitude: float,
                 log_length_scale: float,
                 log_noise_scale: float
                 ):
        self._log_amplitude = log_amplitude
        self._log_length_scale = log_length_scale
        self._log_noise_scale = log_noise_scale

        # self.hyperparameter_log_noise_scale = Hyperparameter('log_noise_scale', 'float', (0.1, 0.1))

        self.theta = np.array([])

    '''
    clone_with_theta(self, theta) Returns a clone of self with given hyperparameters theta.
    theta : ndarray of shape (n_dims,)
    '''

    '''
    def: get_params(self[, deep]):
    '''

    def is_stationary(self) -> bool:
        return False

    def set_params(self, **params) -> None:
        if 'log_amplitude' in params:
            self._log_amplitude = params['log_amplitude']
        if 'log_length_scale' in params:
            self._log_length_scale = params['log_length_scale']
        if 'log_noise_scale' in params:
            self._log_noise_scale = params['log_noise_scale']

    def set_parameters(self,
                       log_amplitude: float,
                       log_length_scale: float,
                       log_noise_scale: float,
                       ) -> None:
        self._log_amplitude = log_amplitude
        self._log_length_scale = log_length_scale
        self._log_noise_scale = log_noise_scale

    @property
    def log_amplitude(self):
        return self._log_amplitude

    @property
    def log_length_scale(self):
        return self._log_length_scale

    @property
    def log_noise_scale(self):
        return self._log_noise_scale

    @log_amplitude.setter
    def log_amplitude(self, log_ampl: float):
        log_ampl = np.clip(log_ampl, -3, 3)
        self._log_amplitude = log_ampl

    @log_length_scale.setter
    def log_length_scale(self, log_lscale: float):
        log_lscale = np.clip(log_lscale, -3, 3)
        self._log_length_scale = log_lscale

    @log_noise_scale.setter
    def log_noise_scale(self, log_nscale: float):
        log_nscale = np.clip(log_nscale, -3, 3)
        self._log_noise_scale = log_nscale

    @property
    def amplitude_squared(self):
        return np.exp(self._log_amplitude * 2)

    @property
    def length_scale(self):
        return np.exp(self._log_length_scale)

    @property
    def noise_scale_squared(self):
        return np.exp(self._log_noise_scale * 2)

    @abc.abstractmethod
    def get_covariance_matrix(self,
                              X: np.ndarray,
                              Y: np.ndarray,
                              ):
        """
        :param X: numpy array of size n_1 x m for which each row (x_i) is a data point at which the objective function can be evaluated
        :param Y: numpy array of size n_2 x m for which each row (y_j) is a data point at which the objective function can be evaluated
        :return: numpy array of size n_1 x n_2 for which the value at position (i, j) corresponds to the value of
        k(x_i, y_j), where k represents the kernel used.
        """
        pass

    '''
    __call__(self, X[, Y, eval_gradient]) Evaluate the kernel.
    '''

    def __call__(self,
                 X: np.ndarray,
                 Y: np.ndarray=None,
                 eval_gradient=False
                 ):
        if Y is None:
            return self.get_covariance_matrix(X, X)
        else:
            return self.get_covariance_matrix(X, Y)

    def diag(self, x: np.ndarray) -> np.ndarray:
        return np.diagonal(self.get_covariance_matrix(x, x))
