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
                 tem: int,
                 tmg: int,
                 tmh: int,
                 thg: int,
                 thr: int,
                 time,
                 population
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

        self.exposed = Box('E', 0)
        self.infected_g = Box('MG', tmg)
        self.infected_h = Box('MH', tmh)
        self.recovered = Box('G')
        self.hospitalized_g = Box('HG', thg)
        self.hospitalized_r = Box('HR', thr)
        self.intensive_care = Box('R', 8)
        self.dead = Box('D')
        self.time = time

        self.e0 = kpe*population
        self.exposed.add(self.e0)
        self.infected_h.add(1)

    def __str__(self):
        pop = self.exposed.full_size() + \
            self.infected_g.full_size() + \
            self.infected_h.full_size() + \
            self.hospitalized_g.full_size() + \
            self.hospitalized_r.full_size() + \
            self.intensive_care.full_size() + \
            self.recovered.full_size() + \
            self.dead.full_size()
        return f'{self.exposed} {self.infected_g} {self.infected_h} {self.hospitalized_g} {self.hospitalized_r} {self.intensive_care} {self.recovered} {self.dead} POP={round(pop,2)}'

    def extract_series(self, history):
        exposed = []
        recovered = []
        infected = []
        hospitalized = []
        intensive_care = []
        exit_intensive_care = []
        dead = []
        for state in history.sorted_list():
            exposed.append(state.exposed.full_size())
            recovered.append(state.recovered.full_size())
            infected.append(state.infected_g.full_size() +
                            state.infected_h.full_size())
            hospitalized.append(state.hospitalized_g.full_size() +
                                state.infected_h.full_size())
            dead.append(state.dead.full_size())
            intensive_care.append(state.intensive_care.full_size())

        return recovered, exposed, infected, dead, hospitalized, intensive_care, exit_intensive_care

    def step(self, history, previous_state):
        self.time += 1
        self.exposed.step()
        self.infected_g.step()
        self.infected_h.step()
        self.hospitalized_g.step()
        self.hospitalized_r.step()
        self.intensive_care.step()
        self.step_exposed(history, previous_state)
        self.step_infected(history, previous_state)
        self.step_hospitalized(history, previous_state)
        self.step_intensive_care(history, previous_state)

    def get_time0(self):
        return 0

    def move(self, src, dest, delta):
        src.remove(delta)
        dest.add(delta)

    def step_exposed(self, history, previous_state):
        state_tem = history.get_last_state(self.time - (1+self.tem))
        if state_tem == None:
            return

        infected_size = state_tem.infected_g.size()+state_tem.infected_h.size()
        # print(f'infected_input {infected_input}')
        delta = self.kem * self.exposed.output() * \
            (infected_size) / self.e0
        # print(f'delta kmg {self.kmg*delta} delta kmh {self.kmh*delta}')
        self.move(self.exposed, self.infected_g, self.kmg*delta)
        self.move(self.exposed, self.infected_h, self.kmh*delta)

    def step_infected(self, history, previous_state):
        self.move(self.infected_g, self.recovered, self.infected_g.output())
        self.move(self.infected_h, self.hospitalized_g,
                  self.khg * self.infected_h.output())
        self.move(self.infected_h, self.hospitalized_r,
                  self.khr * self.infected_h.output())

    def step_hospitalized(self, history, previous_state):
        self.move(self.hospitalized_g, self.recovered,
                  self.hospitalized_g.output())
        self.move(self.hospitalized_r, self.intensive_care,
                  self.hospitalized_r.output())

    def step_intensive_care(self, history, previous_state):
        self.move(self.intensive_care, self.recovered,
                  self.krg * self.intensive_care.output())
        self.move(self.intensive_care, self.dead,
                  self.krd * self.intensive_care.output())
