from scipy.optimize import fsolve
from scipy.special import binom


def compute_khi_binom(dms, max_days=21):
    param = (dms - 1) / (max_days - 1) if max_days > 1 else 1
    return [binom(max_days - 1, k) * param ** k * (1 - param) ** (max_days - 1 - k) for k in range(max_days)]


def compute_khi_exp(dms, max_days=21):
    def f(x):
        return (1 - x ** (max_days)) / (1 - x) - dms
    solutions = fsolve(f, 5)
    param = solutions[0]
    return [param ** k * (1 - param) for k in range(max_days-1)] + [param ** (max_days - 1)]


def compute_khi_delay(duration):
    if duration <= 1:
        return [1]
    else:
        return [0]*(duration-2) + [0.5, 0.5]


def compute_residuals(khi_tab):
    residuals = [1]
    for k in range(len(khi_tab)):
        residuals.append(residuals[k] - khi_tab[k])
    return residuals
