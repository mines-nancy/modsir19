from models.history import History
from models.queue.state import State as QueueState
from models.past_input.state import State as PastInputState
import copy


class Simulator:
    def __init__(self, state):
        self._state = state
        self._history = History()

    def step(self):
        current_state = self._state
        self._history.store(current_state)

        next_state = copy.deepcopy(current_state)
        next_state.step(self._history)

        self._state = next_state

    def get_state(self):
        return self._state

    def extract_series(self):
        return self._state.extract_series(self._history)


def run_simulator(model, population,
                  kpe, kem, kmg, kmh, khr, khg, krd, krg,
                  tem, tmg, tmh, thg, thr, trsr, lim_time):
    if model == 'past_input':
        initial_state = PastInputState(kpe, kem, kmg, kmh, khr, khg, krd, krg,
                                       tem, tmg, tmh, thg, thr, trsr, time=0, population=population)
    else:
        initial_state = QueueState(kpe, kem, kmg, kmh, khr, khg, krd, krg,
                                   tem, tmg, tmh, thg, thr, trsr, time=0, population=population)

    simulator = Simulator(initial_state)
    # print(simulator.get_state())

    for i in range(lim_time):
        simulator.step()
        # print(simulator.get_state())

    return simulator.extract_series()
