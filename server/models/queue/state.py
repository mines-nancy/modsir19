from models.components.box_queue import BoxQueue
from models.components.history import History
from models.components.box import BoxSource, BoxTarget


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
            'thr': thr,
            'trsr': trsr
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
            'E': BoxSource('E'),
            'MG': BoxQueue('MG', tmg),
            'MH': BoxQueue('MH', tmh),
            'G': BoxTarget('G'),
            'HG': BoxQueue('HG', thg),
            'HR': BoxQueue('HR', thr),
            'R': BoxQueue('R', trsr),
            'D': BoxTarget('D')
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

    def step(self):
        self.time += 1
        for box in self.boxes():
            box.step()

        self.step_exposed()
        self.generic_steps(self._moves)

    def generic_steps(self, moves):
        for src_name in moves.keys():
            output = self.output(src_name)
            for dest_name, coefficient in moves[src_name]:
                self.move(src_name, dest_name, coefficient * output)

    def step_exposed(self):
        tem = 1+self.delay('tem')
        previous_exposed_size = self.box('E').output(1)
        infected_tem_size = self.box(
            'MG').full_size(tem) + self.box('MH').full_size(tem)
        delta = self.coefficient(
            'kem') * (previous_exposed_size * infected_tem_size) / self.e0
        # print(self)
        # print(f'previous infected={infected_tem_size} delta={delta}')
        self.move('E', 'MG', self.coefficient('kmg') * delta)
        self.move('E', 'MH', self.coefficient('kmh') * delta)

    def extract_series(self, history):
        series = {'E': ['E'], 'G': ['G'], 'M': ['MG', 'MH'],
                  'H': ['HG', 'HR'], 'D': ['D'], 'R': ['R']}
        # sum the sizes of boxes
        lists = {name: [] for name in series.keys()}
        input_lists = {name: [] for name in series.keys()}
        output_lists = {name: [] for name in series.keys()}
        for state in history.sorted_list():
            sizes = {name: state.box(name).full_size()
                     for name in self.boxnames()}
            inputs = {name: state.box(name).input()
                      for name in self.boxnames()}
            outputs = {name: state.box(name).output()
                       for name in self.boxnames()}
            for name in lists.keys():
                lists[name].append(sum([sizes[n] for n in series[name]]))
                input_lists[name].append(
                    sum([inputs[n] for n in series[name]]))
                output_lists[name].append(
                    sum([outputs[n] for n in series[name]]))
        for name in series.keys():
            lists['input_' + name] = input_lists[name]
            lists['output_' + name] = output_lists[name]

        cumulated_hospitalized = round(sum(input_lists['H']), 2)
        cumulated_intensive_care = round(sum(input_lists['R']), 2)
        return lists['G'], lists['E'], lists['M'], lists['D'], lists['H'], lists['R'], [], lists['input_G'], lists['input_E'], lists['input_M'], lists['input_D'], lists['input_H'], lists['input_R'], [], lists['output_G'], lists['output_E'], lists['output_M'], lists['output_D'], lists['output_H'], lists['output_R'], []
