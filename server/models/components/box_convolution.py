import math
from models.components.box import Box
from collections import deque


class BoxConvolution(Box):
    """
    BoxConvolution([Ki,...])

    with [K0, K1, K2, K4, K5] we have
    output(t) = K4*input(t-5) + K3*input(t-4) + K2*input(t-3) + K1*input(t-2) + K0*input(t-1)

    duration of a BoxConvolution can be updated
    """

    def __init__(self, name, output_coefficients):
        Box.__init__(self, name)
        self._duration = len(output_coefficients)
        self._output_coefficients = output_coefficients
        self._queue = [deque()]  # items in the box

    def set_duration(self, value):
        self._duration = value

    def queue(self, past=0):
        if self._t-past >= 0:
            return self._queue[self._t-past]
        return deque()

    def get_queue_history(self):
        return list(self._queue)

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()
        previous_queue = self.queue()

        super().step()
        current_queue = deque(previous_queue)  # copy of previous_queue

        if self._duration == 0:
            new_output = 0
            # remove all elements from current queue
            while len(current_queue) > 0:
                init, current_value = current_queue.pop()
                new_output += current_value
            self.set_output(previous_output + previous_input + new_output)
            self._queue.append(current_queue)
            return

        new_size = previous_size + previous_input
        current_queue.appendleft((previous_input, previous_input))

        # remove extra elements
        new_output = 0
        while len(current_queue) > self._duration:
            new_output += current_queue.pop()[1]

        delta = [self._output_coefficients[i]*v if self._output_coefficients[i]*v <= r else r
                 for i, (v, r) in enumerate(current_queue)]
        new_queue = [(v, r - delta[i])
                     for i, (v, r) in enumerate(current_queue)]
        self._queue.append(new_queue)

        new_output += sum(delta)
        new_size -= new_output
        self.set_output(previous_output + new_output)
        self.set_size(new_size)
