from models.history import History
from models.state import State
from models.box import Box
import copy


class Simulator:
    def __init__(self, state):
        self._state = state
        self._history = History()

    def step(self):
        current_state = self._state
        self._history.store(current_state)

        next_state = copy.deepcopy(current_state)
        next_state.reinit_boxes()
        next_state.increment_time()

        next_state.exposed_to_infected(self._history)
        next_state.infected_to_recovered(self._history)
        next_state.infected_to_hospitalized(self._history)
        next_state.hospitalized_to_recovered(self._history)
        next_state.hospitalized_to_intensive_care(self._history)
        next_state.intensive_care_to_exit_intensive_care(self._history)
        next_state.exit_intensive_care_to_recovered(self._history)
        next_state.exit_intensive_care_to_dead(self._history)

        self._state = next_state

    def get_state(self):
        return self._state

    def extract_series(self):
        recovered = self._history.extract_serie('recovered')
        exposed = self._history.extract_serie('exposed')
        infected = self._history.extract_serie('infected')
        hospitalized = self._history.extract_serie('hospitalized')
        intensive_care = self._history.extract_serie('intensive_care')
        exit_intensive_care = self._history.extract_serie(
            'exit_intensive_care')
        dead = self._history.extract_serie('dead')

        return recovered, exposed, infected, dead, hospitalized, intensive_care, exit_intensive_care


def run_simulator(population,
                  kpe, kem, kmg, kmh, khr, khg, krd, krg,
                  tem, tmg, tmh, thg, thr, trsr, lim_time):
    initial_state = State(kpe, kem, kmg, kmh, khr, khg, krd, krg, tem, tmg, tmh, thg, thr, time=0,
                          population=Box('P'),
                          recovered=Box('G'),
                          exposed=Box('E'),
                          infected=Box('M'),
                          hospitalized=Box('H'),
                          intensive_care=Box('R'),
                          exit_intensive_care=Box('SR'),
                          dead=Box('D')
                          )
    initial_state.exposed.add(kpe*population)
    initial_state.exposed.remove(1)
    initial_state.infected.add(1)

    simulator = Simulator(initial_state)
    # print(simulator.get_state())
    # print(f'Step - time = {current_state.time}')

    for i in range(lim_time):
        simulator.step()
        # print(simulator.get_state())

    return simulator.extract_series()


if __name__ == "__main__":
    initial_state = State(kpe=0.6,
                          kem=0.24,
                          kmg=0.81,
                          kmh=0.19,
                          khr=0.26,
                          khg=0.74,
                          krd=0.5,
                          krg=0.5,
                          tem=6,
                          tmg=9,
                          tmh=6,
                          thg=6,
                          thr=1,
                          time=0,
                          population=Box('P'),
                          recovered=Box('G'),
                          exposed=Box('E'),
                          infected=Box('M'),
                          hospitalized=Box('H'),
                          intensive_care=Box('R'),
                          exit_intensive_care=Box('SR'),
                          dead=Box('D')
                          )

    population = 300000
    initial_state.exposed.add(initial_state.kpe*population)
    initial_state.exposed.remove(1)
    initial_state.infected.add(1)

    simulator = Simulator(initial_state)
    print(simulator.get_state())

    for i in range(6*30):
        simulator.step()
        print(simulator.get_state())
