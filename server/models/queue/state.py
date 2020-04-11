from models.queue.box import Box
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
                 trsr: int,
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

        self._boxes = {
            'E': Box('E', 0),
            'MG': Box('MG', tmg),
            'MH': Box('MH', tmh),
            'G': Box('G'),
            'HG': Box('HG', thg),
            'HR': Box('HR', thr),
            'R': Box('R', 8),
            'D': Box('D')
        }

        self.time = time

        self.e0 = kpe*population
        self.box('E').add(self.e0)
        self.box('MH').add(1)

    def boxes(self):
        return self._boxes.values()

    def boxnames(self):
        return self._boxes.keys()

    def box(self, name):
        return self._boxes[name]

    def output(self, name):
        return self.box(name).output()

    def __str__(self):
        pop = sum([box.full_size() for box in self.boxes()])
        return f'{self.box("E")} {self.box("MG")} {self.box("MH")} {self.box("HG")} {self.box("HR")} {self.box("R")} {self.box("G")} {self.box("D")} POP={round(pop,2)}'

    def extract_series(self, history):
        series = {'E': ['E'], 'G': ['G'], 'M': ['MG', 'MH'],
                  'H': ['HG', 'HR'], 'D': ['D'], 'R': ['R']}
        # sum the sizes of boxes
        lists = {name: [] for name in series.keys()}
        for state in history.sorted_list():
            sizes = {name: state.box(name).full_size()
                     for name in self.boxnames()}
            for name in lists.keys():
                lists[name].append(sum([sizes[n] for n in series[name]]))
        return lists['G'], lists['E'], lists['M'], lists['D'], lists['H'], lists['R'], []

    def step(self, history):
        self.time += 1
        for box in self.boxes():
            box.step()

        self.step_exposed(history)
        self.step_infected(history)
        self.step_hospitalized(history)
        self.step_intensive_care(history)

    def get_time0(self):
        return 0

    def move(self, src_name, dest_name, delta):
        self.box(src_name).remove(delta)
        self.box(dest_name).add(delta)

    def step_exposed(self, history):
        state_tem = history.get_last_state(self.time - (1+self.tem))
        if state_tem == None:
            return

        infected_size = state_tem.box('MG').size()+state_tem.box('MH').size()
        delta = self.kem * self.output('E') * (infected_size) / self.e0
        self.move('E', 'MG', self.kmg * delta)
        self.move('E', 'MH', self.kmh * delta)

    def step_infected(self, history):
        self.move('MG', 'G', self.output('MG'))
        self.move('MH', 'HG', self.khg * self.output('MH'))
        self.move('MH', 'HR', self.khr * self.output('MH'))

    def step_hospitalized(self, history):
        self.move('HG', 'G', self.output('HG'))
        self.move('HR', 'R', self.output('HR'))

    def step_intensive_care(self, history):
        self.move('R', 'G', self.krg * self.output('R'))
        self.move('R', 'D', self.krd * self.output('R'))
