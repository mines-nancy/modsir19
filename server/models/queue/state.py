from models.components.box_queue import BoxQueue
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
                 population
                 ):

        self._delays = {
            'tem': tem,
            'tmg': tmg,
            'tmh': tmh,
            'thg': thg,
            'thr': thr
        }

        self._coefficients = {
            'kpe': kpe,
            'kem': kem,
            'kmg': kmg,
            'kmh': kmh,
            'khr': khr,
            'khg': khg,
            'krd': krd,
            'krg': krg,
        }

        self._boxes = {
            'E': BoxQueue('E', 0),
            'MG': BoxQueue('MG', tmg),
            'MH': BoxQueue('MH', tmh),
            'MHC': BoxQueue('MHC', tmh),
            'G': BoxQueue('G'),
            'HG': BoxQueue('HG', thg),
            'HR': BoxQueue('HR', thr),
            'R': BoxQueue('R', 8),
            'RC': BoxQueue('RC'),
            'D': BoxQueue('D')
        }

        # src -> [targets]
        self._moves = {
            'MG': [('G', 1)],
            'MH': [('HG', khg), ('HR', khr)],
            'HG': [('G', 1)],
            'HR': [('R', 1)],
            'R': [('G', krg), ('D', krd)],
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

    def delay(self, name):
        return self._delays[name]

    def coefficient(self, name):
        return self._coefficients[name]

    def __str__(self):
        pop = sum([box.full_size() for box in self.boxes()])
        return f'{self.box("E")} {self.box("MG")} {self.box("MH")} {self.box("HG")} {self.box("HR")} {self.box("R")} {self.box("G")} {self.box("D")} POP={round(pop,2)}'

    def get_time0(self):
        return 0

    def move(self, src_name, dest_name, delta):
        self.box(src_name).remove(delta)
        self.box(dest_name).add(delta)

    def step(self, history):
        self.time += 1
        for box in self.boxes():
            box.step()

        self.step_exposed(history)
        self.generic_steps(self._moves)

    def generic_steps(self, moves):
        for src_name in moves.keys():
            output = self.output(src_name)
            for dest_name, coefficient in moves[src_name]:
                self.move(src_name, dest_name, coefficient * output)

    def step_exposed(self, history):
        previous_state = history.get_last_state(self.time - 1)
        state_tem = history.get_last_state(self.time - (1+self.delay('tem')))
        if state_tem == None or previous_state == None:
            return

        infected_size = state_tem.box('MG').size() + state_tem.box('MH').size()
        delta = self.coefficient('kem') * \
            (previous_state.box('E').output() * infected_size) / self.e0
        self.move('E', 'MG', self.coefficient('kmg') * delta)
        self.move('E', 'MH', self.coefficient('kmh') * delta)
        self.move('E', 'MHC', self.coefficient('kmh') * delta)

    def extract_series(self, history):
        series = {'E': ['E'], 'G': ['G'], 'M': ['MG', 'MH'],
                  'H': ['HG', 'HR'], 'D': ['D'], 'R': ['R'], 'MHC': ['MHC'], 'RC': ['RC']}
        # sum the sizes of boxes
        lists = {name: [] for name in series.keys()}
        for state in history.sorted_list():
            sizes = {name: state.box(name).full_size()
                     for name in self.boxnames()}
            for name in lists.keys():
                lists[name].append(sum([sizes[n] for n in series[name]]))
        return lists['G'], lists['E'], lists['M'], lists['D'], lists['H'], lists['R'], lists['MHC'], lists['RC']
