from models.components.box import BoxSource, BoxTarget
from models.components.box_dms import BoxDms
from models.components.box_queue import BoxQueue
from operator import add


class State:
    def __init__(self, parameters):

        self._parameters = parameters

        self._boxes = {
            'SE': BoxSource('SE'),
            'INCUB': BoxQueue('INCUB', self.delay('dm_incub')),
            'IR': BoxDms('IR', self.delay('dm_r')),
            'IH': BoxDms('IH', self.delay('dm_h')),
            'SM': BoxDms('SM', self.delay('dm_sm')),
            'SI': BoxDms('SI', self.delay('dm_si')),
            'SS': BoxDms('SS', self.delay('dm_ss')),
            'R': BoxTarget('R'),
            'DC': BoxTarget('DC')
        }

        # src -> [targets]
        def coefficient(a, b=None):
            if type(a) == 'int':
                return lambda: a
            elif b == None:
                return lambda: self.coefficient(a)
            else:
                return lambda: self.coefficient(a)*self.coefficient(b)

        self._moves = {
            'INCUB': [('IR', coefficient('pc_ir')),
                      ('IH', coefficient('pc_ih'))],
            'IR': [('R', coefficient(1))],
            'IH': [('SM', coefficient('pc_sm')),
                   ('SI', coefficient('pc_si'))],
            'SM': [('SI', coefficient('pc_sm_si')),
                   ('DC', coefficient('pc_sm_dc')),
                   ('SS', coefficient('pc_sm_out', 'pc_h_ss')),
                   ('R', coefficient('pc_sm_out', 'pc_h_r'))],
            'SI': [('DC', coefficient('pc_si_dc')),
                   ('SS', coefficient('pc_si_out', 'pc_h_ss')),
                   ('R', coefficient('pc_si_out', 'pc_h_r'))],
            'SS': [('R', coefficient(1))]
        }

        self.time = 0
        self.e0 = self.coefficient('kpe') * self.constant('population')
        self.box('SE').add(self.e0 - self.constant('patient0'))
        self.box('INCUB').add(self.constant('patient0'))

    def constant(self, name):
        return int(self.parameter(name))

    def delay(self, name):
        return int(self.parameter(name))

    def coefficient(self, name):
        return float(self.parameter(name))

    def parameter(self, name):
        if name in self._parameters:
            return self._parameters[name]
        return 0

    def change_value(self, field_name, value):
        self._parameters[field_name] = value
        box_to_update = {'dm_incub': 'INCUB',
                         'dm_r': 'IR',
                         'dm_h': 'IH',
                         'dm_sm': 'SM',
                         'dm_si': 'SI',
                         'dm_ss': 'SS'}
        if field_name in box_to_update.keys():
            self.box(box_to_update[field_name]).set_duration(
                self.delay(field_name))

        print(
            f'time = {self.time} new coeff {field_name} = {value} type={type(value)}')

    def boxes(self):
        return self._boxes.values()

    def box(self, name):
        return self._boxes[name]

    def output(self, name, past=0):
        return self.box(name).output(past)

    def __str__(self):
        pop = sum([box.full_size() for box in self.boxes()])
        return f'{self.box("SE")} {self.box("INCUB")} {self.box("IR")} {self.box("IH")} {self.box("SM")} {self.box("SI")} {self.box("SS")} {self.box("R")} {self.box("DC")} POP={round(pop,2)}'

    def move(self, src_name, dest_name, delta):
        max_delta = min(self.box(src_name).output(), delta)
        self.box(src_name).remove(max_delta)
        self.box(dest_name).add(max_delta)

    def step(self):
        self.time += 1
        for box in self.boxes():
            box.step()
        # print('***', self)
        self.step_exposed()
        self.generic_steps(self._moves)

    def generic_steps(self, moves):
        for src_name in moves.keys():
            output = self.output(src_name)
            for dest_name, lambda_coefficient in moves[src_name]:
                self.move(src_name, dest_name, lambda_coefficient() * output)

    def step_exposed(self):
        se = self.box('SE').output(1)
        incub = self.box('INCUB').full_size(1)
        ir = self.box('IR').full_size(1)
        ih = self.box('IH').full_size(1)
        r = self.box('R').full_size(1)
        n = se + incub + ir + ih + r
        delta = self.coefficient(
            'r') * self.coefficient('beta') * se * (ir+ih) / n
        assert delta >= 0
        self.move('SE', 'INCUB', delta)

    def extract_series(self):
        sizes = {'SE': ['SE'], 'R': ['R'], 'INCUB': ['INCUB'], 'I': ['IR', 'IH'],
                 'SM': ['SM'],  'SI': ['SI'], 'SS': ['SS'], 'DC': ['DC'], }
        inputs = {'R': ['R'], 'INCUB': ['INCUB'], 'I': ['IR', 'IH'],
                  'SM': ['SM'],  'SI': ['SI'], 'SS': ['SS'], 'DC': ['DC'], }
        outputs = {'SE': ['SE'],  'INCUB': ['INCUB'], 'I': ['IR', 'IH'],
                   'SM': ['SM'],  'SI': ['SI'], 'SS': ['SS'], }

        def sum_lists(lists):
            res = [0] * len(lists[0])
            for serie in lists:
                res = list(map(add, serie, res))
            return res

        lists = dict()
        for key in sizes.keys():
            lists[key] = sum_lists(
                [self.box(name).get_size_history()[1:] for name in sizes[key]])
        for key in inputs.keys():
            lists['input_' + key] = sum_lists(
                [self.box(name).get_input_history()[1:] for name in inputs[key]])
        for key in outputs.keys():
            lists['output_' + key] = sum_lists(
                [self.box(name).get_removed_history()[1:] for name in outputs[key]])
        return lists
