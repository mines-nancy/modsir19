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

    Copyright (c) 2020 Pierre-Etienne Moreau
    e-mail: Pierre-Etienne.Moreau@loria.fr
"""

from models.components.utils import compute_residuals, compute_area_and_expectation, compute_khi_exp, compute_khi_binom, compute_khi_linear, compute_khi_delay
import matplotlib.pyplot as plt


dms = 6
max_days = 21

# khi_tab = compute_khi_binom(dms, max_days)
# khi_tab = compute_khi_exp(dms, max_days)
khi_tab = compute_khi_delay(dms)
residuals = compute_residuals(khi_tab)

area, expectation, sum_khi = compute_area_and_expectation(khi_tab, residuals)

delta_area = abs(dms - area)
delta_khi = abs(1 - sum_khi)
delta_expectation = abs(dms - expectation)

print('area = ' + str(area))
print('delta_area = ' + str(delta_area) + '\n')
print('expectation = ' + str(expectation))
print('delta_expectation = ' + str(delta_expectation) + '\n')
print('sum(khi) = ' + str(sum_khi))
print('delta_khi = ' + str(delta_khi) + '\n')

plt.plot([k for k in range(len(residuals))], residuals)
plt.bar([k for k in range(1, len(khi_tab) + 1)], khi_tab, color='red')
plt.show()
