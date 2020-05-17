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

from models.sir_h.state import State
from models.rule import apply_rules, apply_force_move


def run_sir_h(parameters, rules, data_chu=dict(), specific_series=None):
    """
        called by labs
        can be called with mutable parameters
        do not use cache
        specific_series sublist of ['SE', 'R', 'INCUB', 'IR', 'IH', 'SM',  'SI', 'SS', 'DC']
    """
    state = State(parameters)
    lim_time = state.parameter('lim_time')

    for i in range(lim_time):
        apply_rules(state, rules)
        apply_force_move(state, 'SI', 'SE', data_chu)
        state.step()

    if specific_series == None:
        return state.extract_series()
    else:
        return state.extract_series(specific_series)
