from Box import Box
from History import History


class State:
    def __init__(self,
                 kpe: float,
                 kem: float,
                 kmg: float,
                 kmh: float,
                 khic: float,
                 khg: float,
                 ked: float,
                 ker: float,
                 tem: int,
                 tmg: int,
                 tmh: int,
                 thg: int,
                 thic: int,
                 tice: int,
                 time,
                 population,
                 recovered,
                 exposed,
                 infected,
                 hospitalized,
                 intensive_care,
                 exit_intensive,
                 dead,
                 ):

        self.population = population
        self.recovered = recovered
        self.exposed = exposed
        self.infected = infected
        self.hospitalized = hospitalized
        self.intensive_care = intensive_care
        self.exit_intensive = exit_intensive
        self.dead = dead
        self.time = time

        self.kpe = kpe
        self.kem = kem
        self.kmg = kmg
        self.kmh = kmh
        self.khic = khic
        self.khg = khg
        self.ked = ked
        self.ker = ker
        self.tem = tem
        self.tmg = tmg
        self.tmh = tmh
        self.thg = thg
        self.thic = thic
        self.tice = tice

    def __str__(self):
        pop = self.exposed.size() + self.infected.size() + \
            self.hospitalized.size() + self.recovered.size()
        return f'{self.exposed} {self.infected} {self.hospitalized} {self.recovered} POP={pop}'

    def increment_time(self):
        self.time += 1

    def get_time0(self):
        return 0

    def exposed_to_infected(self, history, next_state):
        state0 = history.get_last_state(self.get_time0())
        state_tem = history.get_last_state(self.time - self.tem)
        if state0 == None or state_tem == None:
            return

        exposed0 = state0.exposed
        # print(f'exposed0: {exposed0}')
        infected_tem = state_tem.infected
        # print(f'infected_tem: {infected_tem}')
        new_infected = self.kem * \
            (self.exposed.size() * infected_tem.size()) / exposed0.size()
        # print(f'new_infected: {new_infected}')
        next_state.exposed.remove(new_infected)
        next_state.infected.add(new_infected)

    def infected_to_recovered(self, history, next_state):
        state_tmg = history.get_last_state(self.time - self.tmg)
        if state_tmg == None:
            return

        new_recovered = self.kmg * state_tmg.infected.size()
        next_state.infected.remove(new_recovered)
        next_state.recovered.add(new_recovered)

    def infected_to_hospitalized(self, history, next_state):
        state_tmh = history.get_last_state(self.time - self.tmh)
        if state_tmh == None:
            return

        new_hospitalized = self.kmh * state_tmh.infected.size()
        next_state.infected.remove(new_hospitalized)
        next_state.hospitalized.add(new_hospitalized)

    def hospitalized_to_recovered(self, history, next_state):
        state_thg = history.get_last_state(self.time - self.thg)
        if state_thg == None:
            return

        new_recovered = self.khg * state_thg.hospitalized.size()
        next_state.hospitalized.remove(new_recovered)
        next_state.recovered.add(new_recovered)
