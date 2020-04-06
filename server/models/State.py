from Box import Box
from History import History


class State:
    def __init__(self,
                 kpe: float,
                 kem: float,
                 kmg: float,
                 kih: float,
                 khic: float,
                 khr: float,
                 ked: float,
                 ker: float,
                 tem: int,
                 tmg: int,
                 tih: int,
                 thr: int,
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
        self.kih = kih
        self.khic = khic
        self.khr = khr
        self.ked = ked
        self.ker = ker
        self.tem = tem
        self.tmg = tmg
        self.tih = tih
        self.thr = thr
        self.thic = thic
        self.tice = tice

    def __str__(self):
        pop = self.exposed.size() + self.infected.size() + self.recovered.size()
        return f'{self.exposed} {self.infected} {self.recovered} POP={pop}'

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
