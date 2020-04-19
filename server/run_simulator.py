from models.queue.state import State as QueueState
from models.past_input.state import State as PastInputState
from models.sir_h.state import State as SirHState
from models.simulator import Simulator

if __name__ == "__main__":
    constants = {'population': 500000, 'patient0':  1}
    delays = {'dm_incub': 3, 'dm_r': 9, 'dm_h': 6,
              'dm_sm': 6, 'dm_si': 8, 'dm_ss': 14}
    coefficients = {'kpe': 0.6, 'r': 2.3, 'beta': 0.15, 'pc_ir': 0.84, 'pc_ih': 0.16,
                    'pc_sm': 0.8, 'pc_si': 0.2, 'pc_sm_si': 0.2,
                    'pc_sm_out': 0.8, 'pc_si_dc': 0.5, 'pc_si_out': 0.5, 'pc_h_ss': 0.2, 'pc_h_r': 0.8}
    population = 100
    initial_state = SirHState(
        constants=constants, delays=delays, coefficients=coefficients, time=0)
    simulator = Simulator(initial_state)
    print(simulator.get_state())

    for i in range(10):
        simulator.step()
        print(simulator.get_state())

    # print(simulator.extract_series())
