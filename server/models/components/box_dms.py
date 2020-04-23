import math
from models.components.box import Box


class BoxDms(Box):
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

        new_output = previous_size / self._duration
        # print(f'pop: {output}')
        self.set_size(previous_size + previous_input - new_output)
        self.set_output(previous_output + new_output)
        # print(f'output: {self._output}')
