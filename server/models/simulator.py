from models.components.history import History
from models.components.simulator import Simulator
from models.queue.state import State as QueueState
from models.sir_h.state import State as SirHState
from models.past_input.state import State as PastInputState
import copy


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


def run_sir_h(constants, delays, coefficients, rules):
    initial_state = SirHState(constants, delays, coefficients, 0)
    lim_time = constants['lim_time']
    simulator = Simulator(initial_state)
    # print(simulator.get_state())

    for i in range(lim_time):
        simulator.apply_rules(i, rules)
        simulator.step()
        # print(simulator.get_state())

    return simulator.extract_series()
