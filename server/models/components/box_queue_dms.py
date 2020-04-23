import math
from collections import deque
from models.components.box import Box


class BoxQueueDms(Box):
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

    # def size(self):
        # return sum([x for x in self.queue()])

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        # previous_size = self.size()
        previous_queue = self.queue()

        super().step()

        if self._duration == 0:
            self._queue.append(deque(previous_queue))  # copy of previous_queue
            self.set_output(previous_output + previous_input)
            return

        new_output = sum(x/self._duration for x in previous_queue)
        new_queue = deque(map(lambda x: x - x/self._duration, previous_queue))
        # print(f'prev:{previous_queue} new:{new_queue} new output={new_output}')

        if len(previous_queue) >= self._duration:
            lost = new_queue.pop()
            if len(new_queue) > 0:
                last = new_queue.pop()
                new_queue.append(last+lost)
            else:
                new_queue.append(lost)

        new_queue.appendleft(previous_input)
        self._queue.append(new_queue)

        # new_output = previous_size / self._duration
        # new_size = previous_size + previous_input - new_output
        new_size = sum([x for x in new_queue])

        self.set_size(new_size)
        self.set_output(previous_output + new_output)
