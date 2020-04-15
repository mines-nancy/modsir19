from models.components.box_dms import BoxDms
from models.components.history import History


class State:
    def __init__(self,
                 delays,
                 coefficients,
                 time,
                 population
                 ):

        self._delays = delays
        self._coefficients = coefficients

        self._boxes = {
            'SE': BoxDms('SE', 0),
            'INCUB': BoxDms('INCUB', delays['dm_incub']),
            'IR': BoxDms('IR', delays['dm_r']),
            'IH': BoxDms('IH', delays['dm_h']),
            'SM': BoxDms('SM', delays['dm_sm']),
            'SI': BoxDms('SI', delays['dm_si']),
            'SS': BoxDms('SS', delays['dm_ss']),
            'R': BoxDms('R'),
            'DC': BoxDms('DC'),
        }

        # src -> [targets]
        self._moves = {
            'INCUB': [('IR', coefficients['pc_ir']), ('IH', coefficients['pc_ih'])],
            'IR': [('R', 1)],
            'IH': [('SM', coefficients['pc_sm']), ('SI', coefficients['pc_si'])],
            'SM': [('SI', coefficients['pc_sm_si']),
                   ('SS', coefficients['pc_sm_out'] * coefficients['pc_h_ss']),
                   ('R', coefficients['pc_sm_out'] * coefficients['pc_h_r'])],
            'SI': [('DC', coefficients['pc_si_dc']),
                   ('SS', coefficients['pc_si_out']
                    * coefficients['pc_h_ss']),
                   ('R', coefficients['pc_si_out'] * coefficients['pc_h_r'])],
            'SS': [('R', 1)],
        }

        self.time = time

        self.e0 = coefficients['kpe'] * population
        self.box('SE').add(self.e0 - 1)
        self.box('INCUB').add(1)

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
        return f'{self.box("SE")} {self.box("INCUB")} {self.box("IR")} {self.box("IH")} {self.box("SM")} {self.box("SI")} {self.box("SS")} {self.box("R")} {self.box("DC")} POP={round(pop,2)}'

    def get_time0(self):
        return 0

    def move(self, src_name, dest_name, delta):
        self.box(src_name).remove(delta)
        self.box(dest_name).add(delta)

    def step(self, history):
        self.time += 1
        for box in self.boxes():
            box.step()
        # print('***', self)
        self.step_exposed(history)
        self.generic_steps(self._moves)

    def generic_steps(self, moves):
        for src_name in moves.keys():
            output = self.output(src_name)
            for dest_name, coefficient in moves[src_name]:
                self.move(src_name, dest_name, coefficient * output)

    def step_exposed(self, history):
        previous_state = history.get_last_state(self.time - 1)
        n = self.box('SE').size() + self.box('INCUB').size() + \
            self.box('IR').size() + self.box('IH').size() + \
            self.box('R').size()
        delta = self.coefficient('r') * self.coefficient('beta') * \
            previous_state.box('SE').output() * \
            (previous_state.box('IR').size() + previous_state.box('IH').size()) / n
        self.move('SE', 'INCUB', delta)

    def extract_series(self, history):
        series = {'SE': ['SE'], 'R': ['R'], 'INCUB': ['INCUB'], 'I': ['IR', 'IH'],
                  'SM': ['SM'],  'SI': ['SI'], 'SS': ['SS'], 'DC': ['DC']}
        # sum the sizes of boxes
        lists = {name: [] for name in series.keys()}
        input_lists = {name: [] for name in series.keys()}
        output_lists = {name: [] for name in series.keys()}
        for state in history.sorted_list():
            sizes = {name: state.box(name).full_size()
                     for name in self.boxnames()}
            inputs = {name: state.box(name).input()
                      for name in self.boxnames()}
            outputs = {name: state.box(name).outputs()
                      for name in self.boxnames()}
            for name in lists.keys():
                lists[name].append(sum([sizes[n] for n in series[name]]))
                input_lists[name].append(sum([inputs[n] for n in series[name]]))
                output_lists[name].append(sum([outputs[n] for n in series[name]]))
        cumulated_hospitalized = round(sum(input_lists['SM']) + sum(input_lists['SI']), 2)
        cumulated_intensive_care = round(sum(input_lists['SI']), 2)
        lists['cumulated_hospitalized'] = cumulated_hospitalized
        lists['cumulated_intensive_care'] = cumulated_intensive_care
        return lists
