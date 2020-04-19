import math
from models.components.box import Box


class BoxQueue(Box):
    def __init__(self, name, duration=math.inf):
        Box.__init__(self, name)
        self._duration = duration

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()

        super().step()
        if self._duration == 0:
            self.set_output(previous_output + previous_input)
            return

        duration = int(self._duration)
        new_size = previous_size + previous_input
        if self._t >= duration:
            new_output = self.input(1+duration)
            self.set_output(previous_output + new_output)
            new_size -= new_output
        self.set_size(new_size)
