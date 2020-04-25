import math
from collections import deque
from models.components.box import Box


class BoxQueue(Box):
    """
    BoxQueue(duration=n) is a n-delay box
    the output at t+n corresponds to the input at t
    methods input(d), output(d), size(d) correspond to resp. input, output, size at t-d
    so we have output(0) == input(n)

    duration of a BoxQueue can be updated
    when duration is decreased, extra elements are moved to output
    when duration is increased, elements in the queue stay a bit longer
    """

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
            new_output = 0
            # remove all elements from current queue
            while len(current_queue) > 0:
                new_output += current_queue.pop()
            self.set_output(previous_output + previous_input + new_output)
            return

        new_size = previous_size + previous_input
        current_queue.appendleft(previous_input)

        # remove extra elements
        new_output = 0
        while len(current_queue) >= self._duration:
            new_output += current_queue.pop()
        new_size -= new_output
        self.set_output(previous_output + new_output)
        self.set_size(new_size)
