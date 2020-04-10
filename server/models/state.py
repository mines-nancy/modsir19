from models.box import Box
from models.history import History


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
                 kie: float,
                 tem: int,
                 tmg: int,
                 tmh: int,
                 thg: int,
                 thr: int,
                 tie: int,
                 time,
                 population,
                 recovered,
                 exposed,
                 infected,
                 hospitalized,
                 intensive_care,
                 exit_intensive_care,
                 dead,
                 ):

        self.population = population
        self.recovered = recovered
        self.exposed = exposed
        self.infected = infected
        self.hospitalized = hospitalized
        self.intensive_care = intensive_care
        self.exit_intensive_care = exit_intensive_care
        self.dead = dead
        self.time = time

        self.kpe = kpe
        self.kem = kem
        self.kmg = kmg
        self.kmh = kmh
        self.khr = khr
        self.khg = khg
        self.krd = krd
        self.krg = krg
        self.kie = kie
        self.tem = tem
        self.tmg = tmg
        self.tmh = tmh
        self.thg = thg
        self.thr = thr
        self.tie = tie

    def reinit_boxes(self):
        self.population.reinit()
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

    def increment_time(self):
        self.time += 1

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
        delta = self.kie * \
            self.get_past_input(history, 'intensive_care', 1+self.tie)
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
