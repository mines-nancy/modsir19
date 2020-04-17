import math


class BoxDms:
    def __init__(self, name, duration=math.inf):
        self._name = name
        self._duration = duration

        self._size = 0  # dms model
        self._input = 0  # number of inputs
        self._output = 0  # number of outputs
        self._removed = 0

    def __str__(self):
        input = round(self._input, 2)
        output = round(self._output, 2)
        size = round(self._size, 2)
        removed = round(self._removed, 2)
        return f'{self._name}[{input}]\{size}/[{removed}]'

    def step(self):
        self._removed = 0
        if self._duration == 0:
            input = self._input
            self._input = 0
            self._output += input
            return

        output = self._size / self._duration
        # print(f'pop: {output}')
        self._size -= output
        self._output += output
        # print(f'output: {self._output}')

        input = self._input
        self._input = 0
        self._size += input

    def size(self):
        return self._size

    def full_size(self):
        return self.size() + self.input() + self.output()

    def input(self):
        return self._input

    def output(self):
        return self._output

    def removed(self):
        return self._removed

    def add(self, size):
        self._input += size

    def remove(self, size):
        self._output -= size
        self._removed += size


class BoxDmsSource(BoxDms):
    def __init__(self, name):
        BoxDms.__init__(self, name, 0)

    def step(self):
        self._removed = 0
        input = self._input
        self._input = 0
        self._output += input

    def size(self):
        return self.output()


class BoxDmsTarget(BoxDms):
    def __init__(self, name):
        BoxDms.__init__(self, name)

    def step(self):
        self._removed = 0
        input = self._input
        self._input = 0
        self._size += input
