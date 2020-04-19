import math


class Box:
    def __init__(self, name):
        self._name = name

        self._t = 0
        self._size = [0]
        self._input = [0]  # number of inputs before step
        self._output = [0]  # number of possible outputs
        self._removed = [0]  # number of removed elements

        self._input_history = [0]
        self._output_history = [0]
        self._size_history = [0]
        self._removed_history = [0]

    def __str__(self):
        input = round(self.input(), 2)
        output = round(self.output(), 2)
        removed = round(self.removed(), 2)
        size = round(self.size(), 2)
        return f'Box {self._name} t={self._t} [{input}]\{size}/[{output}->{removed}]'

    def step(self):
        self._input.append(0)
        self._output.append(0)
        self._size.append(0)
        self._removed.append(0)
        self._t += 1

    def size(self, past=0):
        return self._size[self._t-past]

    def input(self, past=0):
        return self._input[self._t-past]

    def output(self, past=0):
        return self._output[self._t-past]

    def removed(self, past=0):
        return self._removed[self._t-past]

    def full_size(self, past=0):
        return self.size(past) + self.input(past)

    def set_size(self, value):
        self._size[self._t] = value

    def set_input(self, value):
        self._input[self._t] = value

    def set_output(self, value):
        self._output[self._t] = value

    def add(self, size):
        self._input[self._t] += size

    def remove(self, size):
        self._output[self._t] -= size
        self._removed[self._t] += size

    def get_input_history(self):
        return list(self._input)

    def get_size_history(self):
        return list(self._size)

    def get_output_history(self):
        return list(self._output)

    def get_removed_history(self):
        return list(self._removed)


class BoxSource(Box):
    def __init__(self, name):
        Box.__init__(self, name)

    def step(self):
        super().step()
        self.set_output(self.output(1) + self.input(1))
        self.set_size(self.output(1) + self.input(1))


class BoxTarget(Box):
    def __init__(self, name):
        Box.__init__(self, name)

    def step(self):
        super().step()
        self.set_size(self.size(1) + self.input(1))
