from models.components.box import BoxSource, BoxTarget
from models.components.box_dms import BoxDms
from models.components.box_queue import BoxQueue
from operator import add


class State:
    def __init__(self, constants, delays, coefficients, time):

        self._constants = constants
        self._delays = delays
        self._coefficients = coefficients

        self._boxes = {
            'SE': BoxSource('SE'),
            'INCUB': BoxQueue('INCUB', delays['dm_incub']),
            'IR': BoxDms('IR', delays['dm_r']),
            'IH': BoxDms('IH', delays['dm_h']),
            'SM': BoxDms('SM', delays['dm_sm']),
            'SI': BoxDms('SI', delays['dm_si']),
            'SS': BoxDms('SS', delays['dm_ss']),
            'R': BoxTarget('R'),
            'DC': BoxTarget('DC')
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

        self.e0 = coefficients['kpe'] * constants['population']
        self.box('SE').add(self.e0 - constants['patient0'])
        self.box('INCUB').add(constants['patient0'])

    def change_value(self, name, value):
        constants_name = ["population", "patient0", "lim_time"]
        delays_name = ['dm_incub', 'dm_r', 'dm_h', 'dm_sm', 'dm_si', 'dm_ss']

        coefficients_name = ['kpe', 'r', 'beta', 'pc_ir', 'pc_ih', 'pc_sm',
                             'pc_si', 'pc_sm_si', 'pc_sm_out', 'pc_si_dc', 'pc_si_out', 'pc_h_ss', 'pc_h_r']

        if name in constants_name:
            self._constants[name] = value
        elif name in delays_name:
            self._delays[name] = value
        elif name in coefficients_name:
            self._coefficients[name] = value
        print(
            f'time = {self.time} new coeff {name} = {value} type={type(value)}')

    def boxes(self):
        return self._boxes.values()

    def box(self, name):
        return self._boxes[name]

    def output(self, name, past=0):
        return self.box(name).output(past)

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
        self.step_exposed()
        self.generic_steps(self._moves)

    def generic_steps(self, moves):
        for src_name in moves.keys():
            output = self.output(src_name)
            for dest_name, coefficient in moves[src_name]:
                self.move(src_name, dest_name, coefficient * output)

    def step_exposed(self):
        se = self.box('SE').output(1)
        incub = self.box('INCUB').full_size(1)
        ir = self.box('IR').full_size(1)
        ih = self.box('IH').full_size(1)
        r = self.box('R').full_size(1)
        n = se + incub + ir + ih + r
        delta = self.coefficient(
            'r') * self.coefficient('beta') * se * (ir+ih) / n
        self.move('SE', 'INCUB', delta)

    def extract_series(self, history):
        series = {'SE': ['SE'], 'R': ['R'], 'INCUB': ['INCUB'], 'I': ['IR', 'IH'],
                  'SM': ['SM'],  'SI': ['SI'], 'SS': ['SS'], 'DC': ['DC'], }

        def sum_lists(lists):
            res = [0] * len(lists[0])
            for serie in lists:
                res = list(map(add, serie, res))
            return res

        lists = dict()
        for key in series.keys():
            lists[key] = sum_lists(
                [self.box(name).get_size_history() for name in series[key]])
            lists['input_' + key] = sum_lists(
                [self.box(name).get_input_history() for name in series[key]])
            lists['output_' + key] = sum_lists(
                [self.box(name).get_output_history() for name in series[key]])
        return lists
