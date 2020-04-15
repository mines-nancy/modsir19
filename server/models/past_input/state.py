from models.components.box_past_input import BoxPastInput
from models.components.history import History


class State:
    def __init__(self,
                 kpe: float,
                 kem: float,
                 kmg: float,
                 kmh: float,
                 khr: float,
                 khg: float,
                 krd: float,
                 krg: float,
                 tem: int,
                 tmg: int,
                 tmh: int,
                 thg: int,
                 thr: int,
                 trsr: int,
                 time,
                 population,
                 ):
        self.kpe = kpe
        self.kem = kem
        self.kmg = kmg
        self.kmh = kmh
        self.khr = khr
        self.khg = khg
        self.krd = krd
        self.krg = krg
        self.tem = tem
        self.tmg = tmg
        self.tmh = tmh
        self.thg = thg
        self.thr = thr
        self.trsr = trsr

        self.exposed = BoxPastInput('E')
        self.infected = BoxPastInput('M')
        self.recovered = BoxPastInput('G')
        self.hospitalized = BoxPastInput('H')
        self.intensive_care = BoxPastInput('R')
        self.exit_intensive_care = BoxPastInput('SR')
        self.dead = BoxPastInput('D')

        self.time = time
        self.e0 = kpe * population
        self.exposed.add(self.e0)
        self.infected.add(1)

    def reinit_boxes(self):
        self.recovered.reinit()
        self.exposed.reinit()
        self.infected.reinit()
        self.hospitalized.reinit()
        self.intensive_care.reinit()
        self.exit_intensive_care.reinit()
        self.dead.reinit()

    def __str__(self):
        pop = self.exposed.size() + self.infected.size() + \
            self.hospitalized.size() + self.intensive_care.size() + \
            self.exit_intensive_care.size() + self.recovered.size() + self.dead.size()
        return f'{self.exposed} {self.infected} {self.hospitalized} {self.intensive_care} {self.exit_intensive_care} {self.recovered} {self.dead} POP={round(pop,2)}'

    def extract_series(self, history):
        exposed = []
        recovered = []
        infected = []
        hospitalized = []
        intensive_care = []
        exit_intensive_care = []
        dead = []
        input_exposed = []
        input_recovered = []
        input_infected = []
        input_hospitalized = []
        input_intensive_care = []
        input_exit_intensive_care = []
        input_dead = []
        output_exposed = []
        output_recovered = []
        output_infected = []
        output_hospitalized = []
        output_intensive_care = []
        output_exit_intensive_care = []
        output_dead = []
        for state in history.sorted_list():
            exposed.append(state.exposed.full_size())
            recovered.append(state.recovered.full_size())
            infected.append(state.infected.full_size())
            hospitalized.append(state.hospitalized.full_size())
            dead.append(state.dead.full_size())
            intensive_care.append(state.intensive_care.full_size())
            exit_intensive_care.append(
                state.exit_intensive_care.full_size())
            input_exposed.append(state.exposed.input())
            input_recovered.append(state.recovered.input())
            input_infected.append(state.infected.input())
            input_hospitalized.append(state.hospitalized.input())
            input_intensive_care.append(state.intensive_care.input())
            input_exit_intensive_care.append(state.exit_intensive_care.input())
            input_dead.append(state.dead.input())
        return recovered, exposed, infected, dead, hospitalized, intensive_care, exit_intensive_care, input_recovered, input_exposed, input_infected, input_dead, input_hospitalized, input_intensive_care, input_exit_intensive_care, output_recovered, output_exposed, output_infected, output_dead, output_hospitalized, output_intensive_care, output_exit_intensive_care

    def increment_time(self):
        self.time += 1

    def step(self, history):
        self.time += 1
        self.reinit_boxes()
        self.exposed_to_infected(history)
        self.infected_to_recovered(history)
        self.infected_to_hospitalized(history)
        self.hospitalized_to_recovered(history)
        self.hospitalized_to_intensive_care(history)
        self.intensive_care_to_exit_intensive_care(history)
        self.exit_intensive_care_to_recovered(history)
        self.exit_intensive_care_to_dead(history)

    def get_time0(self):
        return 0

    def get_past_size(self, history, boxname, delay):
        if delay == 1:  # current value correspond to previous size
            return getattr(self, boxname).value()

        past_state = history.get_last_state(self.time - delay)
        if past_state == None:
            return 0
        return getattr(past_state, boxname).size()

    def get_past_input(self, history, boxname, delay):
        past_state = history.get_last_state(self.time - delay)
        if past_state == None:
            return 0
        return getattr(past_state, boxname).input()

    def exposed_to_infected(self, history):
        state0 = history.get_last_state(self.get_time0())
        if state0 == None:
            return

        state0_exposed_size = state0.exposed.size()
        previous_exposed_size = self.get_past_size(history, 'exposed', 1)
        infected_tem_size = self.get_past_size(history, 'infected', 1+self.tem)
        delta = self.kem * previous_exposed_size * \
            infected_tem_size / state0_exposed_size
        self.exposed.remove(delta)
        self.infected.add(delta)

    def infected_to_recovered(self, history):
        delta = self.kmg * self.get_past_input(history, 'infected', 1+self.tmg)
        # print(f'infected_to_recovered: {delta}')
        self.infected.remove(delta)
        self.recovered.add(delta)

    def infected_to_hospitalized(self, history):
        delta = self.kmh * self.get_past_input(history, 'infected', 1+self.tmh)
        # print(f'infected_to_hospitalized: {delta}')
        self.infected.remove(delta)
        self.hospitalized.add(delta)

    def hospitalized_to_recovered(self, history):
        delta = self.khg * \
            self.get_past_input(history, 'hospitalized', 1+self.thg)
        self.hospitalized.remove(delta)
        self.recovered.add(delta)

    def hospitalized_to_intensive_care(self, history):
        delta = self.khr * \
            self.get_past_input(history, 'hospitalized', 1+self.thr)
        self.hospitalized.remove(delta)
        self.intensive_care.add(delta)

    def intensive_care_to_exit_intensive_care(self, history):
        delta = 1 * \
            self.get_past_input(history, 'intensive_care', 1+self.trsr)
        self.intensive_care.remove(delta)
        self.exit_intensive_care.add(delta)

    def exit_intensive_care_to_recovered(self, history):
        delta = self.krg * \
            self.get_past_size(history, 'exit_intensive_care', 1)
        self.exit_intensive_care.remove(delta)
        self.recovered.add(delta)

    def exit_intensive_care_to_dead(self, history):
        delta = self.krd * \
            self.get_past_size(history, 'exit_intensive_care', 1)
        self.exit_intensive_care.remove(delta)
        self.dead.add(delta)
