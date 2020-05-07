import math
from collections import deque
from models.components.box import Box
from typing import List


def remove_values_from_array(array: List[int], remove: List[float]) -> List[int]:
    """
    array =  [a1,...,an]
    remove = [r1,...rn] such that ri <= ai
    returns [v1,...,vn]
    such that   floor(sum(remove)) <= sum([v1,...,vn]) <= 1+floor(sum(remove))
                vi <= ri+1
    """
    assert len(array) == len(remove)
    assert all([0 <= r <= a for a, r in zip(array, remove)])

    values_to_remove = []
    to_remove = 0
    for i in range(len(array)):
        to_remove += remove[i]
        round_to_remove = round(to_remove)
        if round_to_remove <= array[i]:
            values_to_remove.append(round_to_remove)
            to_remove -= round_to_remove
        else:
            # since all(remove[i] <= array[i])
            # this case occurs only when to_remove accumulates deltas
            values_to_remove.append(array[i])
            to_remove -= array[i]
    assert to_remove < 1
    assert all([v < r+1 for v, r in zip(values_to_remove, remove)])
    assert math.floor(sum(remove)) <= sum(
        values_to_remove) <= 1+math.floor(sum(remove))
    return values_to_remove


def compute_remove_delta(array: List[int], value: float) -> List[int]:
    """
    given an array of integers, remove value in a uniform way
    we assume 0 <= value <= sum(array)
    return an array of values to remove to each element of array
    """
    assert(0 <= value <= sum(array))
    ratio = value/sum(array)
    values_to_remove = [ratio * element for element in array]
    return remove_values_from_array(array, values_to_remove)


class BoxConvolution(Box):
    """
    BoxConvolution([Ki,...])

    with [K0, K1, K2, K4, K5] we have
    output(t) = K4*input(t-5) + K3*input(t-4) + K2*input(t-3) + K1*input(t-2) + K0*input(t-1)

    duration of a BoxConvolution can be updated
    """

    def __init__(self, name, output_coefficients, int_output=False):
        Box.__init__(self, name)
        self._integer = int_output  # when True, the output is an integer
        self._output_coefficients = output_coefficients  # sum should be equal to 1
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

        # insert new element
        current_queue.appendleft((previous_input, previous_input))

        # remove extra elements
        new_output = 0
        while len(current_queue) > len(self._output_coefficients):
            new_output += current_queue.pop()[1]

        # transition step for all elements
        #   (v,r) -> (v, r-ki*v)
        #   output += ki*v
        float_values_to_remove = [
            min(v*c, r) for (v, r), c in zip(current_queue, self._output_coefficients)]

        if self._integer:
            array = [r for (_, r) in current_queue]
            values_to_remove = remove_values_from_array(
                array, float_values_to_remove)
        else:
            values_to_remove = float_values_to_remove

        new_list = [(v, r - remove)
                    for (v, r), remove in zip(current_queue, values_to_remove)]

        new_output += sum(values_to_remove)
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
            return

        # default case: remove value in a uniform way
        if self._integer:
            values_to_remove = compute_remove_delta(
                [r for v, r in current_queue], value)
        else:
            ratio_to_remove = value / current_size
            values_to_remove = [r * ratio_to_remove for v, r in current_queue]

        new_output = 0
        for i in range(len(current_queue)):
            v, r = current_queue[i]
            current_queue[i] = (v, r - values_to_remove[i])
            new_output += values_to_remove[i]

        self.set_size(current_size - new_output)
        self.set_output(current_output + new_output)

        if self._integer:
            assert math.fabs(self.size() + value - current_size) == 0
            assert math.fabs(new_output - value) == 0
        else:
            assert math.fabs(self.size() + value - current_size) < 0.1
            assert math.fabs(new_output - value) < 0.1
