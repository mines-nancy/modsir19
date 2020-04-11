class Box:
    def __init__(self, name):
        self._name = name
        self._value = 0  # value without input nor output
        self._input = 0  # number of inputs
        self._output = 0  # number of outputs

    def __str__(self):
        input = round(self._input, 2)
        output = round(self._output, 2)
        size = round(self.size(), 2)
        return f'{self._name}[+{input},-{output}]: {size}'

    def size(self):
        return self._value + self._input - self._output

    def full_size(self):
        return self._value + self._input - self._output

    def reinit(self):
        self._value = self._value + self._input - self._output
        self._input = 0
        self._output = 0

    def value(self):
        return self._value

    def input(self):
        return self._input

    def output(self):
        return self._output

    def add(self, size):
        self._input += size

    def remove(self, size):
        self._output += size
