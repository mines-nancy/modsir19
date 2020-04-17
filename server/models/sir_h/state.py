from models.components.box_dms import BoxDms, BoxDmsSource, BoxDmsTarget
from models.components.history import History


class State:
    def __init__(self, delays, coefficients, time, population, patient0):

        self._delays = delays
        self._coefficients = coefficients

        self._boxes = {
            'SE': BoxDmsSource('SE'),
            'INCUB': BoxDms('INCUB', delays['dm_incub']),
            'IR': BoxDms('IR', delays['dm_r']),
            'IH': BoxDms('IH', delays['dm_h']),
            'SM': BoxDms('SM', delays['dm_sm']),
            'SI': BoxDms('SI', delays['dm_si']),
            'SS': BoxDms('SS', delays['dm_ss']),
            'R': BoxDmsTarget('R'),
            'DC': BoxDmsTarget('DC')
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
        self.box('SE').add(self.e0 - patient0)
        self.box('INCUB').add(patient0)

    def change_coefficient(self, name, value):
        self._coefficients[name] = value
        print(
            f'time = {self.time} new coeff {name} = {value} type={type(value)}')

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
        n = self.box('SE').output() + self.box('INCUB').size() + \
            self.box('IR').size() + self.box('IH').size() + \
            self.box('R').size()
        ir = previous_state.box('IR').size()
        ih = previous_state.box('IH').size()
        delta = self.coefficient('r') * self.coefficient('beta') * \
            previous_state.box('SE').output() * (ir+ih) / n
        # print(f'IR={ir} IH={ih} n={n} delta={delta}')
        self.move('SE', 'INCUB', delta)

    def extract_series(self, history):
        series = {'SE': ['SE'], 'R': ['R'], 'INCUB': ['INCUB'], 'I': ['IR', 'IH'],
                  'SM': ['SM'],  'SI': ['SI'], 'SS': ['SS'], 'DC': ['DC'], }
        # sum the sizes of boxes
        lists = {name: [] for name in series.keys()}
        input_lists = {name: [] for name in series.keys()}
        output_lists = {name: [] for name in series.keys()}
        for state in history.sorted_list():
            sizes = {name: state.box(name).size()
                     for name in self.boxnames()}
            inputs = {name: state.box(name).input()
                      for name in self.boxnames()}
            outputs = {name: state.box(name).removed()
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
        return lists
