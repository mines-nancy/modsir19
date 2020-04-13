import math


class BoxDms:
    def __init__(self, name, duration=math.inf, capacity=math.inf):
        self._name = name
        self._duration = duration
        self._capacity = capacity

        self._size = 0  # dms model
        self._input = 0  # number of inputs
        self._output = 0  # number of outputs

    def __str__(self):
        input = round(self._input, 2)
        output = round(self._output, 2)
        size = round(self._size, 2)
        return f'{self._name}[{input}]\{size}/[{output}]'

    def step(self):
        if self._duration == 0:
            input = min(self._input, self._capacity)
            self._input -= input
            self._output += input
            return

        output = self._size / self._duration
        # print(f'pop: {output}')
        self._size -= output
        self._output += output
        # print(f'output: {self._output}')

        input = min(self._input, self._capacity-self._size)
        self._input -= input
        self._size += input

    def size(self):
        return self._size

    def full_size(self):
        return self.size() + self.input() + self.output()

    def input(self):
        return self._input

    def output(self):
        return self._output

    def add(self, size):
        self._input += size

    def remove(self, size):
        self._output -= size
