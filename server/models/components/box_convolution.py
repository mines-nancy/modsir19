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

    def __init__(self, name, output_coefficients, int_output=False):
        Box.__init__(self, name)
        self._integer = int_output
        self._output_coefficients = output_coefficients
        self._queue = [deque()]  # items in the box

    def set_output_coefficients(self, output_coefficients):
        self._output_coefficients = output_coefficients

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

        if len(self._output_coefficients) == 0:
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
        while len(current_queue) > len(self._output_coefficients):
            new_output += current_queue.pop()[1]

        # transition step for all elements
        # (v,r) -> (v, r-ki*v)
        # output += ki*v
        new_list = []
        for i in range(len(current_queue)):
            v, r = current_queue[i]
            if self._output_coefficients[i] * v > r:
                delta = r
            elif self._integer:
                delta = math.floor(self._output_coefficients[i] * v)
            else:
                delta = self._output_coefficients[i] * v
            new_list.append((v, r - delta))
            new_output += delta

        self._queue.append(deque(new_list))
        new_size -= new_output
        self.set_output(previous_output + new_output)
        self.set_size(new_size)

    def compute_size(self):
        return sum([r for v, r in self.queue()])

    def force_output(self, value):
        current_size = self.size()
        current_output = self.output()
        current_queue = self.queue()

        if value <= 0:
            print(f'cannot force negative output {value}')
            return

        if current_size <= value:
            self.set_size(0)
            self.set_output(current_output + current_size)
            current_queue.clear()
        else:
            to_remove = value
            new_output = 0
            for i in range(len(current_queue)-1, -1, -1):
                if to_remove > 0:
                    v, r = current_queue[i]
                    delta = min(r, to_remove)
                    current_queue[i] = (v, r - delta)
                    to_remove -= delta
                    new_output += delta

            self.set_size(current_size - new_output)
            self.set_output(current_output + new_output)

            if self._integer:
                assert math.fabs(self.size() + value - current_size) == 0
                assert math.fabs(new_output - value) == 0
            else:
                assert math.fabs(self.size() + value - current_size) < 0.1
                assert math.fabs(new_output - value) < 0.1
