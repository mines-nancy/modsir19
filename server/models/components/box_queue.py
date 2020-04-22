import math
from collections import deque
from models.components.box import Box


class BoxQueue(Box):
    def __init__(self, name, duration=math.inf):
        Box.__init__(self, name)
        self._duration = duration
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
        self._queue.append(deque(previous_queue))  # copy of previous_queue
        current_queue = self.queue()

        if self._duration == 0:
            self.set_output(previous_output + previous_input)
            return

        new_size = previous_size + previous_input

        if len(current_queue) == self._duration:
            new_output = current_queue.pop()
            self.set_output(previous_output + new_output)
            new_size -= new_output
        current_queue.appendleft(previous_input)
        self.set_size(new_size)
