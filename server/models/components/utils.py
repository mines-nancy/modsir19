# -*- coding: utf-8 -*-
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

    Copyright (c) 2020 Pierre-Etienne Moreau, Romain Pajda
    e-mail: Pierre-Etienne.Moreau@loria.fr, romainpajda@gmail.com
"""

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
        return [0]*(int(duration)-2) + [0.5, 0.5]


def compute_khi_linear(duration):
    n = 2*duration-1
    delta = 1/n
    res = (n-1)*[delta]
    res = res + [1-sum(res)]
    return res


def compute_residuals(khi_tab):
    residuals = [1]
    for k in range(len(khi_tab)):
        residuals.append(residuals[k] - khi_tab[k])
    return residuals


def compute_area_and_expectation(khi_tab, residuals):
    area = 0
    expectations = []
    for k in range(len(khi_tab)):
        area += (residuals[k] + residuals[k + 1]) / 2
        expectations.append((k + 1) * khi_tab[k])

    return area, sum(expectations), sum(khi_tab)
