from models.components.simulator import Simulator
from models.sir_h.state import State
import copy


def run_sir_h(constants, delays, coefficients, rules):
    initial_state = State(constants=constants, delays=delays,
                          coefficients=coefficients, time=0)
    lim_time = constants['lim_time']
    simulator = Simulator(initial_state)
    # print(simulator.get_state())

    for i in range(lim_time):
        simulator.apply_rules(i, rules)
        simulator.step()
        # print(simulator.get_state())

    return simulator.extract_series()
