import math
from models.components.box import Box


class BoxFixedConvolution(Box):
    def __init__(self, name, output_coefficients):
        Box.__init__(self, name)
        self._duration = len(output_coefficients)
        self._output_coefficients = output_coefficients

    def set_duration(self, value):
        # do nothing
        pass

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()
        super().step()

        if self._duration == 0:
            self.set_output(previous_output + previous_input)
            return

        new_size = previous_size + previous_input
        new_output = 0
        for index, coefficient in enumerate(self._output_coefficients):
            new_output += coefficient * self.input(1 + index)
        new_size -= new_output
        self.set_output(previous_output + new_output)
        self.set_size(new_size)
