import math
from models.components.box import Box


class BoxFixedDelay(Box):
    """
    BoxFixedDelay(duration=n) is a n-delay box
    the output at t+n corresponds to the input at t
    methods input(d), output(d), size(d) correspond to resp. input, output, size at t-d
    so we have output(0) == input(n)

    duration of a BoxFixedDelay cannot be updated
    """

    def __init__(self, name, duration=math.inf):
        Box.__init__(self, name)
        self._duration = duration

    def set_duration(self, value):
        self._duration = value

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()
        super().step()

        if self._duration == 0:
            self.set_output(previous_output + previous_input)
            return

        new_size = previous_size + previous_input
        if self._t >= self._duration:
            new_output = self.input(self._duration)
            self.set_output(previous_output + new_output)
            new_size -= new_output
        self.set_size(new_size)
