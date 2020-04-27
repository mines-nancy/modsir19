import numpy as np

from kernels.abstract_kernel import Kernel


class MaternKernel(Kernel):
    def get_covariance_matrix(self, X: np.ndarray, Y: np.ndarray):
        """
        :param X: numpy array of size n_1 x m for which each row (x_i) is a data point at which the objective function can be evaluated
        :param Y: numpy array of size n_2 x m for which each row (y_j) is a data point at which the objective function can be evaluated
        :return: numpy array of size n_1 x n_2 for which the value at position (i, j) corresponds to the value of
        k(x_i, y_j), where k represents the kernel used.
        """

        distances_array = np.array([[np.linalg.norm(x_p - x_q) for x_q in Y] for x_p in X])

        return self.amplitude_squared * (1 + np.sqrt(3) * distances_array / self.length_scale) * np.exp(-1. * np.sqrt(3) * distances_array / self.length_scale)
