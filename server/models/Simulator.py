from History import History
from State import State
from Box import Box
import copy


class Simulator:
    def __init__(self, state):
        self._state = state
        self._history = History()

    def step(self):
        current_state = self._state
        print(f'Step - time = {current_state.time}')
        self._history.store(current_state)

        next_state = copy.deepcopy(current_state)
        next_state.increment_time()

        current_state.exposed_to_infected(self._history, next_state)
        current_state.infected_to_recovered(self._history, next_state)

        self._state = next_state

    def get_state(self):
        return self._state


if __name__ == "__main__":
    initial_state = State(kpe=0.6,
                          kem=0.24,
                          kmg=0.81,
                          kih=0,
                          khic=0,
                          khr=0,
                          ked=0,
                          ker=0,
                          tem=6,
                          tmg=9,
                          tih=0,
                          thr=0,
                          thic=0,
                          tice=0,
                          time=0,
                          population=Box('P'),
                          recovered=Box('G'),
                          exposed=Box('E'),
                          infected=Box('M'),
                          hospitalized=Box('H'),
                          intensive_care=Box('R'),
                          exit_intensive=Box('SR'),
                          dead=Box('P')
                          )

    initial_state.exposed.add(100)
    initial_state.infected.add(1)

    simulator = Simulator(initial_state)
    print(simulator.get_state())

    for i in range(20):
        simulator.step()
        print(simulator.get_state())
