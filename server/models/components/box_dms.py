import math
from models.components.box import Box, BoxSource, BoxTarget


class BoxDms(Box):
    def __init__(self, name, duration=math.inf):
        Box.__init__(self, name)
        self._duration = duration

    def __str__(self):
        input = round(self.input(), 2)
        size = round(self.size(), 2)
        removed = round(self.removed(), 2)
        return f'BoxDms {self._name} t={self._t} [{input}]\{size}/[{removed}]'

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()

        super().step()

        if self._duration == 0:
            self.set_output(previous_output + previous_input)
            return

        new_output = previous_size / self._duration
        # print(f'pop: {output}')
        self.set_size(previous_size + previous_input - new_output)
        self.set_output(previous_output + new_output)
        # print(f'output: {self._output}')
