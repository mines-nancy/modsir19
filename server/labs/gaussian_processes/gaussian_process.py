# -*- coding: utf-8 -*-
#
# Author: Paul Festor
#
# The code on gaussian processes gas been adapted from Imperial College's CO493
# "Probabilistic Inference" lead by Dr. Mark Van der Wilk

from typing import Tuple

import matplotlib.pyplot as plt
import numpy as np
import scipy.optimize
from scipy.stats import norm, multivariate_normal

from .kernels.abstract_kernel import Kernel
# from objective_functions.abstract_objective_function import ObjectiveFunction


class GaussianProcess(object):
    def __init__(self,
                 kernel: Kernel,
                 array_dataset: np.ndarray = None,
                 array_objective_function_values: np.ndarray = None,
                 sigma_prior_parameters=1.,
                 prior_mean=lambda x: x.reshape((-1, 1))):
        """
        :param kernel: Kernel which will be used by the gaussian process to calculate its covariance.
        :param array_dataset: array representing all the data points used to calculate the posterior mean and variance of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)
        :param array_objective_function_values: array of the evaluations for all the elements in array_dataset. Its shape is hence n x 1 (it's a column vector)
        :param sigma_prior_parameters: Defines the std of the prior on the parameters distribution.
        """

        '''
        print(array_dataset)
        print(array_objective_function_values)

        pass
        '''

        # prior_mean = lambda x: 1*np.ones(x.shape).reshape((-1, 1))

        self._kernel = kernel
        self.sigma_prior_parameter = sigma_prior_parameters
        self.prior_mean = prior_mean

        if array_dataset is not None:  # If dataset provided, we initialise our gaussian process with it.
            self.initialise_dataset(array_dataset, array_objective_function_values)
        else:  # If dataset not provided, we initialise with an empty dataset.
            self._array_dataset = np.asarray([])
            self._array_objective_function_values = np.asarray([]).reshape((0, 1))

            self._covariance_matrix = np.asarray([])

    @property
    def array_dataset(self) -> np.ndarray:
        """
        :return: array representing all the data points used to calculate the posterior mean and variance of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)
        """
        return self._array_dataset

    @property
    def array_objective_function_values(self) -> np.ndarray:
        """
        :return: array of the evaluations for all the elements in array_dataset
        Its shape is hence n x 1 (it's a column vector)
        """
        return self._array_objective_function_values

    def set_kernel_parameters(self,
                              *log_kernel_parameters
                              ) -> None:
        """
        This function updates the kernel parameters based on the ones provided here.
        It also updates the covariance matrix of the gaussian process.

        :param log_amplitude:
        :param log_length_scale:
        :param log_noise_scale:
        """
        self._kernel.set_parameters(*log_kernel_parameters)
        self.update_covariance_matrix()

    def update_covariance_matrix(self) -> None:
        """
        Uses the kernel to update the member self._covariance_matrix depending on:
        - self._array_dataset
        """
        self._covariance_matrix = self._kernel(self._array_dataset, self._array_dataset)

    def add_data_point(self,
                       data_point: np.ndarray,
                       objective_function_value: float,
                       ) -> None:
        """
        adds a new element and its evaluation to the members:
         - self._array_dataset
         - self._array_objective_function_values
         and update the covariance matrix accordingly

        :param data_point: row numpy array representing the new point at which the objective function has been evaluated
        :param objective_function_value: corresponding objective function value
        """
        if np.size(self._array_dataset) == 0:
            # if the dataset is empty we just need to initialise it
            self._array_dataset = np.asarray(data_point).reshape((1, -1))
            self._array_objective_function_values = np.asarray(objective_function_value).reshape((1, 1))
        else:
            assert np.size(data_point) == np.size(self._array_dataset, 1)

            self._array_dataset = np.vstack((
                self._array_dataset,
                np.asarray(data_point)
            ))

            self._array_objective_function_values = np.vstack((
                self._array_objective_function_values,
                np.asarray(objective_function_value)
            ))

        self.update_covariance_matrix()

    def initialise_dataset(self,
                           array_dataset: np.ndarray,
                           array_objective_function_values: np.ndarray,
                           ) -> None:
        """
        Initialise the members:
         - self._array_dataset
         - self._array_objective_function_values
        and update the covariance matrix accordingly
        """

        array_dataset = np.asarray(array_dataset)
        array_objective_function_values = np.asarray(array_objective_function_values)

        assert np.size(array_objective_function_values) == np.size(array_dataset, 0)

        self._array_dataset = array_dataset
        self._array_objective_function_values = array_objective_function_values.reshape((-1, 1))

        self.update_covariance_matrix()

    def optimise_parameters(self, disp=False):
        """
        Uses the BFGS algorithm to estimate the parameters of the kernel which minimise the
        :param disp: display some info regarding the optimisation performed by the BFGS algorithm
        :return: a row numpy array containing the parameters found for
        """

        # Defining intermediate functions for the optimisation algorithm after
        def get_negative_log_marginal_likelihood_from_array(params: np.ndarray):
            params = params.flatten()
            return self.get_negative_log_marginal_likelihood(*params)

        def get_gradient_negative_log_marginal_likelihood_from_array(params: np.ndarray):
            params = params.flatten()
            return self.get_gradient_negative_log_marginal_likelihood(*params)

        initial_parameters = np.asarray([
            self._kernel.log_amplitude,
            self._kernel.log_length_scale,
            self._kernel.log_noise_scale
        ])

        # Minimisation procedure
        optimized_parameters = scipy.optimize.minimize(
            fun=get_negative_log_marginal_likelihood_from_array,
            x0=initial_parameters,
            method='BFGS',
            jac=get_gradient_negative_log_marginal_likelihood_from_array,
            options={'disp': disp}
        )

        return optimized_parameters

    def get_negative_log_marginal_likelihood(self,
                                             *log_kernel_parameters
                                             ) -> float:
        """
        :return: The value of the negative log marginal likelihood depending on:
        - log_amplitude
        - log_length_scale
        - log_noise_scale
        """

        self.set_kernel_parameters(*log_kernel_parameters)

        K = self._covariance_matrix
        K_noise = K + self._kernel.noise_scale_squared * np.identity(K.shape[0])
        K_noise_inv = np.linalg.inv(K_noise)
        y = self._array_objective_function_values
        result = (
                0.5 * y.T.dot(K_noise_inv.dot(y))
                + 0.5 * np.linalg.slogdet(K_noise)[1]
                + 0.5 * K.shape[0] * np.log(2 * np.pi)
        )
        return result.item()

    def get_gradient_negative_log_marginal_likelihood(self,
                                                      log_amplitude: float,
                                                      log_length_scale: float,
                                                      log_noise_scale: float
                                                      ) -> np.ndarray:
        """
        :return: The value of gradient of the negative log marginal likelihood depending on:
        - log_amplitude
        - log_length_scale
        - log_noise_scale
        """
        self.set_kernel_parameters(log_amplitude, log_length_scale, log_noise_scale)

        K = self._covariance_matrix
        K_noise = K + self._kernel.noise_scale_squared * np.identity(K.shape[0])
        K_noise_inv = np.linalg.inv(K_noise)
        y = self._array_objective_function_values

        alpha = K_noise_inv.dot(y)

        length_scale = self._kernel.length_scale
        sigma2_n = self._kernel.noise_scale_squared

        array_squared_distances = np.asarray([
            [np.linalg.norm(x_p - x_q) ** 2 for x_q in self._array_dataset]
            for x_p in self._array_dataset
        ])

        # Computing gradients
        grad_log_length_scale = (
                (-1. / (2 * length_scale ** 2))
                * np.trace((alpha.dot(alpha.T) - K_noise_inv).dot(array_squared_distances * K))
        )
        grad_log_sigma_n = -sigma2_n * np.trace((alpha.dot(alpha.T) - K_noise_inv))
        grad_log_sigma_f = -np.trace((alpha.dot(alpha.T) - K_noise_inv).dot(K))

        array_gradients = np.asarray([
            grad_log_sigma_f,
            grad_log_length_scale,
            grad_log_sigma_n
        ])

        return array_gradients

    def mean(self, data_points: np.ndarray):
        """
        :param data_points: array representing all the data points at which we want to predict the posterior mean of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)
        :return: a column numpy array of size n x 1 with the estimation of the predicted mean of the gaussian process for
        all the points in data_points
        """
        return self.get_gp_mean_std(data_points)[0]

    def std(self, data_points: np.ndarray):
        """
        :param data_points: array representing all the data points at which we want to predict the posterior standard deviation of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)
        :return: a column numpy array of size n x 1 with the estimation of the predicted standard deviation of the gaussian process for
        all the points in data_points
        """
        return self.get_gp_mean_std(data_points)[1]

    def __call__(self,
                 new_data_points: np.ndarray
                 ) -> Tuple[np.ndarray, np.ndarray]:
        return self.get_gp_mean_std(new_data_points)

    def get_sample(self,
                   new_data_points: np.ndarray
                   ) -> np.ndarray:
        """
        :param new_data_points: array representing all the data points at which we want to predict the posterior standard deviation of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)

        :return: a flattened numpy array of size n containing a sample of the objective function values at the n points.
        it is a sample from a multivariate normal distribution with:
        - mean = array of respective means predicted at the gaussian process for each point
        - covariance matrix = k(new_data_points, new_data_points) where k refers to the kernel function.
        """
        K = self._covariance_matrix

        K_noise = K + self._kernel.noise_scale_squared * np.identity(K.shape[0])
        K_noise_inv = np.linalg.inv(K_noise)
        X_cur = self._array_dataset
        X_other = new_data_points

        array_means, _ = self.get_gp_mean_std(new_data_points)
        covariance_matrix = self._kernel(X_other, X_other) - self._kernel(X_other, X_cur).dot(K_noise_inv.dot(self._kernel(X_cur, X_other)))
        return np.random.multivariate_normal(array_means.flatten(), covariance_matrix)

    def get_gp_mean_std(self,
                        new_data_points: np.ndarray
                        ) -> Tuple[np.ndarray, np.ndarray]:
        """
        :param new_data_points: array representing all the data points at which we want to predict the posterior standard deviation of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)

        :return: a tuple (mean, std):
        - mean: a column numpy array of size n x 1 with the estimation of the predicted mean of the gaussian process for
        all the points in data_points
        - a column numpy array of size n x 1 with the estimation of the predicted standard deviation of the gaussian process for
        all the points in data_points
        """
        K = self._covariance_matrix

        K_noise = K + self._kernel.noise_scale_squared * np.identity(K.shape[0])
        K_noise_inv = np.linalg.inv(K_noise)
        X_cur = self._array_dataset
        X_other = new_data_points

        y = self._array_objective_function_values
        temp = self._kernel(X_other, X_cur).dot(K_noise_inv)

        prior_m = self.prior_mean(new_data_points).reshape((-1, 1))
        mean = prior_m + temp.dot(y - self.prior_mean(X_cur))
        std_list = []

        for x in X_other:
            x_ = x.reshape((1, -1))

            std_list.append(
                self._kernel(x_, x_) - self._kernel(x_, X_cur).dot(K_noise_inv.dot(self._kernel(X_cur, x_)))
            )
        std = np.sqrt(np.asarray(std_list))

        return mean.reshape((-1, 1)), std.reshape((-1, 1))

    def get_mse(self,
                data_points_test: np.ndarray,
                evaluations_test: np.ndarray
                ) -> float:
        """
        :param data_points_test: array representing all the data points at which we want to predict the posterior mean of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)
        :param evaluations_test: array of the evaluations for all the elements in array_dataset. Its shape is hence n x 1 (it's a column vector)
        :return: the computed mean squared error between:
        - the predictions of the gaussian process
        - the true evaluations in evaluations_test
        """
        evaluations_test = evaluations_test.reshape((-1, 1))
        mean, _ = self.get_gp_mean_std(data_points_test)
        mean = mean.reshape((-1, 1))
        return np.mean(
            np.power(mean - evaluations_test, 2)
        ).item()

    def get_log_predictive_density(self,
                                   data_points_test: np.ndarray,
                                   evaluations_test: np.ndarray
                                   ) -> float:
        """
        :param data_points_test: array representing all the data points at which we want to predict the posterior mean of the GP.
        Its dimension is n x l, there are:
        - n elements in the dataset. Each row corresponds to a data point x_i (with 1<=i<=n), at which the objective function can be evaluated
        - each one of them is of dimension l (representing the number of variables required by the objective function)
        :param evaluations_test: array of the evaluations for all the elements in array_dataset. Its shape is hence n x 1 (it's a column vector)
        :return: the computed log predictive density on the test set.
        """

        mean, std = self.get_gp_mean_std(data_points_test)
        return np.sum(
            np.log(norm.pdf(evaluations_test, mean, np.sqrt(np.power(std, 2) + self._kernel.noise_scale_squared)))
        ).item()

    '''
    def plot_with_samples(self,
                          number_samples: int,
                          objective_function: ObjectiveFunction):
        boundaries = objective_function.boundaries
        number_dimensions = len(boundaries)
        if number_dimensions != 1:
            return

        xlim, = boundaries
        xx = np.linspace(xlim[0] - 2, xlim[1] + 2, 200)

        self.plot(objective_function, show=False)

        for _ in range(number_samples):
            res = self.get_sample(xx.reshape((-1, 1)))
            plt.plot(xx, res, alpha=0.6)

        plt.title(f"Gaussian Process + {number_samples} sampled functions")
        plt.show()

    def plot(self,
             objective_function: ObjectiveFunction,
             show=True):
        boundaries = objective_function.boundaries
        number_dimensions = len(boundaries)
        if number_dimensions == 1:
            xlim, = boundaries
            x_gt = np.linspace(xlim[0], xlim[1], 100)
            xx = np.linspace(xlim[0] - 2, xlim[1] + 2, 200)
            mean, std = self.get_gp_mean_std(xx.reshape((-1, 1)))
            mean = mean.flatten()
            std = std.flatten()
            plt.plot(xx, mean, c='m')
            plt.plot(xx, mean + 3 * std, c='r')
            plt.plot(xx, mean - 3 * std, c='b')

            plt.fill_between(xx, mean - 3 * std, mean + 3 * std, alpha=0.2, color='m')
            plt.scatter(self.array_dataset,
                        self.array_objective_function_values,
                        c='g',
                        marker='+')

            plt.plot(x_gt, objective_function.evaluate_without_noise(x_gt), c='c')
            plt.title(f"Gaussian Process Regression")

            if show:
                plt.show()

        elif number_dimensions == 2:
            mesh_grid = objective_function.get_mesh_grid([100, 100])
            xx, yy = mesh_grid
            xx, yy = xx.flatten(), yy.flatten()
            data_points = np.asarray([
                [x, y]
                for y in yy
                for x in xx
            ])

            mean, std = self.get_gp_mean_std(data_points)
            mean = mean.reshape((mesh_grid[0].size,
                                 mesh_grid[1].size))

            std = std.reshape((mesh_grid[0].size,
                               mesh_grid[1].size))

            # Mean contour plot
            contour_levels = [
                np.percentile(mean.flatten(), k) for k in range(101)
            ]
            contour_levels = sorted(list(set(contour_levels)))
            if len(contour_levels) <= 1:
                contour_levels = [0, 1]
            plot_mean = plt.contourf(mesh_grid[0].flatten(),
                                     mesh_grid[1].flatten(),
                                     mean,
                                     levels=contour_levels)
            if self.array_dataset.size:
                plt.scatter(self.array_dataset[:, 0],
                            self.array_dataset[:, 1],
                            c='b',
                            marker='+')
            plt.colorbar(plot_mean)
            plt.title("Gaussian Process Posterior Mean")
            plt.show()

            # Mean contour plot
            contour_levels = [
                np.percentile(std.flatten(), k) for k in range(101)
            ]
            contour_levels = sorted(list(set(contour_levels)))
            if len(contour_levels) <= 1:
                contour_levels = [0, 1]
            plot_std = plt.contourf(mesh_grid[0].flatten(),
                                    mesh_grid[1].flatten(),
                                    std,
                                    levels=contour_levels)
            if self.array_dataset.size:
                plt.scatter(self.array_dataset[:, 0],
                            self.array_dataset[:, 1],
                            c='b',
                            marker='+')
            plt.colorbar(plot_std)
            plt.title("Gaussian Process Posterior Standard Deviation")
            plt.show()
    '''

    def get_log_marginal_likelihood(self, *log_kernel_parameters):
        return -1 * self.get_negative_log_marginal_likelihood(*log_kernel_parameters)

    def get_log_prior_at(self, *log_kernel_parameters):
        N = len(log_kernel_parameters)
        return multivariate_normal.logpdf(np.array(log_kernel_parameters).reshape(1, N),
                                          mean=np.zeros(N), cov=(self.sigma_prior_parameter ** 2) * np.identity(N))


