import math


class Box:
    """
    Box has a clock and 3 compartments:
    input -- defined at time t, will be added to size at t+1 and re-initialized to 0
    size -- defined at time t, a part will be added to output at t+1
    output -- can be used by other Box using remove method
    A Box has an history all all its internal values
    """

    def __init__(self, name):
        self._name = name

        self._t = 0
        self._size = [0]
        self._input = [0]  # number of inputs before step
        self._output = [0]  # number of possible outputs
        self._removed = [0]  # number of removed elements

    def __str__(self):
        input = round(self.input(), 2)
        output = round(self.output(), 2)
        removed = round(self.removed(), 2)
        size = round(self.size(), 2)
        return f'Box {self._name} [{input}]\{size}/[{output}->{removed}]'

    def step(self):
        self._input.append(0)
        self._output.append(0)
        self._size.append(0)
        self._removed.append(0)
        self._t += 1

    def size(self, past=0):
        if self._t-past >= 0:
            return self._size[self._t-past]
        return 0

    def input(self, past=0):
        if self._t-past >= 0:
            return self._input[self._t-past]
        return 0

    def output(self, past=0):
        if self._t-past >= 0:
            return self._output[self._t-past]
        return 0

    def removed(self, past=0):
        if self._t-past >= 0:
            return self._removed[self._t-past]
        return 0

    def full_size(self, past=0):
        if self._t-past >= 0:
            return self.size(past) + self.input(past)
        return 0

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
    """BoxSource is a 1-delay box, where output and size are always equal"""

    def __init__(self, name):
        Box.__init__(self, name)

    def remove(self, size):
        self._output[self._t] -= size
        self._size[self._t] -= size
        self._removed[self._t] += size

    def step(self):
        super().step()
        assert self.output(1) == self.size(1)
        new_output = self.output(1) + self.input(1)
        self.set_output(new_output)
        self.set_size(new_output)


class BoxTarget(Box):
    """BoxTarget is a 1-delay box wiht no output"""

    def __init__(self, name):
        Box.__init__(self, name)

    def step(self):
        super().step()
        self.set_size(self.size(1) + self.input(1))

    def remove(self, size):
        raise Exception('should not be called on BoxTarget')

    def set_output(self, value):
        raise Exception('should not be called on BoxTarget')
