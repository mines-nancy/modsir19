class Box:
    def __init__(self, name):
        self._name = name
        self._value = 0  # value without input nor output
        self._input = 0  # number of inputs
        self._output = 0  # number of outputs

    def __str__(self):
        return f'{self._name}: {round(self.size(),2)}'

    def size(self):
        return self._value + self._input - self._output

    def reinit(self):
        self._value = self._value + self._input - self._output
        self._input = 0
        self._output = 0

    def input(self):
        return self._input

    def output(self):
        return self._output

    def add(self, size):
        self._input += size

    def remove(self, size):
        self._output += size
