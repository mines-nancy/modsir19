from Box import Box
from History import History


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
                 tice: int,
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
        self.tem = tem
        self.tmg = tmg
        self.tmh = tmh
        self.thg = thg
        self.thr = thr
        self.tice = tice

    def __str__(self):
        pop = self.exposed.size() + self.infected.size() + \
            self.hospitalized.size() + self.intensive_care.size() + \
            self.exit_intensive_care.size() + self.recovered.size() + self.dead.size()
        return f'{self.exposed} {self.infected} {self.hospitalized} {self.intensive_care} {self.exit_intensive_care} {self.recovered} {self.dead} POP={pop}'

    def increment_time(self):
        self.time += 1

    def get_time0(self):
        return 0

    # compute Delta Box(t - tDelay)
    def delta(self, history, boxname, delay):
        past_state = history.get_last_state(self.time - delay)
        previous_past_state = history.get_last_state(self.time - delay - 1)
        if past_state == None or previous_past_state == None:
            return 0
        return getattr(past_state, boxname).size() - getattr(previous_past_state, boxname).size()

    def exposed_to_infected(self, history, next_state):
        state0 = history.get_last_state(self.get_time0())
        state_tem = history.get_last_state(self.time - self.tem)
        if state0 == None or state_tem == None:
            return

        exposed0 = state0.exposed
        # print(f'exposed0: {exposed0}')
        infected_tem = state_tem.infected
        # print(f'infected_tem: {infected_tem}')
        delta = self.kem * (self.exposed.size() *
                            infected_tem.size()) / exposed0.size()
        # print(f'new_infected: {new_infected}')
        next_state.exposed.remove(delta)
        next_state.infected.add(delta)

    def infected_to_recovered(self, history, next_state):
        delta = self.kmg * self.delta(history, 'infected', self.tmg)
        # print(f'infected_to_recovered: {delta}')
        next_state.infected.remove(delta)
        next_state.recovered.add(delta)

    def infected_to_hospitalized(self, history, next_state):
        delta = self.kmh * self.delta(history, 'infected', self.tmh)
        # print(f'infected_to_hospitalized: {delta}')
        next_state.infected.remove(delta)
        next_state.hospitalized.add(delta)

    def hospitalized_to_recovered(self, history, next_state):
        delta = self.khg * self.delta(history, 'hospitalized', self.thg)
        next_state.hospitalized.remove(delta)
        next_state.recovered.add(delta)

    def hospitalized_to_intensive_care(self, history, next_state):
        delta = self.khr * self.delta(history, 'hospitalized', self.thr)
        next_state.hospitalized.remove(delta)
        next_state.intensive_care.add(delta)

    def intensive_care_to_exit_intensive_care(self, history, next_state):
        delta = 0.7 * self.delta(history, 'intensive_care', 1)
        next_state.intensive_care.remove(delta)
        next_state.exit_intensive_care.add(delta)

    def exit_intensive_care_to_recovered(self, history, next_state):
        delta = self.krg * self.exit_intensive_care.size()
        next_state.exit_intensive_care.remove(delta)
        next_state.recovered.add(delta)

    def exit_intensive_care_to_dead(self, history, next_state):
        delta = self.krd * self.exit_intensive_care.size()
        next_state.exit_intensive_care.remove(delta)
        next_state.dead.add(delta)
