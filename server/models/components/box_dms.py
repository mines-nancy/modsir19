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
    e-mail: Pierre-Etienne.Moreau@univ-lorraine.fr
"""

import math
from models.components.box import Box


class BoxDms(Box):
    """
    BoxDms(duration=n) is a 1-delay box
    output at t+1 corresponds to the (size+input)/duration at t
    size at t+1 corresponds to size at t minus output at t+1

    duration of a BoxDms can be updated
    """

    def __init__(self, name, duration=math.inf):
        Box.__init__(self, name)
        self._duration = duration

    def set_duration(self, value):
        self._duration = value

    def __str__(self):
        input = round(self.input(), 2)
        size = round(self.size(), 2)
        removed = round(self.removed(), 2)
        return f'BoxDms {self._name} [{input}]\{size}/[{removed}]'

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()

        super().step()

        if self._duration == 0:
            new_output = previous_input + previous_size
            self.set_output(previous_output + new_output)
            self.set_size(previous_size + previous_input - new_output)
            assert self.size() == 0
            return

        new_output = (previous_size + previous_input) / self._duration
        # print( f'previous size = {previous_size} previous input={previous_input} new output: {new_output}')
        self.set_size(previous_size + previous_input - new_output)
        self.set_output(previous_output + new_output)
        # print(f'output: {self._output}')

    def force_output(self, value):
        current_size = self.size()
        current_output = self.output()
        if current_size <= value:
            self.set_size(0)
            self.set_output(current_output + current_size)
        else:
            self.set_size(current_size - value)
            self.set_output(current_output + value)
