class Box:
    def __init__(self, name):
        self._name = name
        self._size = 0

    def __str__(self):
        return f'{self._name}: {self._size}'

    def size(self):
        return self._size

    def add(self, size):
        self._size += size

    def remove(self, size):
        self._size -= size
