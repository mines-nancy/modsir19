from models.components.box import BoxSource, BoxTarget
from models.components.box_dms import BoxDms
from models.components.box_queue import BoxQueue
from models.components.box_convolution import BoxConvolution
from operator import add
import math
from scipy.optimize import fsolve


class State:
    def __init__(self, parameters):

        self._parameters = dict(parameters)  # to not modify parameters

        def f(dms, n=21):
            ks = list()
            for itr in range(n):
                ks.append(math.exp(-itr/dms) - math.exp(-(itr+1)/dms))
            residuals = 1 - sum(ks)
            # find q such that (1-q^n)/(1-q) -1 - residuals = 0
            q = solve(residuals, n)[0]
            for itr in range(n):
                ks[itr] += q**(itr+1)
            return ks

        def solve(s, n):
            # find q such that (1-q^n)/(1-q) -1 - s = 0
            def f(q): return (1-q ** n)/(1-q) - 1 - s
            res = fsolve(f, s/n)
            return res

        self._boxes = {
            'SE': BoxSource('SE'),
            'INCUB': BoxQueue('INCUB', self.delay('dm_incub')),

            'IR': BoxConvolution('IR', f(self.delay('dm_r'))),
            'IH': BoxConvolution('IH', f(self.delay('dm_h'))),
            'SM': BoxConvolution('SM', f(self.delay('dm_sm'))),
            'SI': BoxConvolution('SI', [0, 0.03, 0.03, 0.04, 0.05, 0.05, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.03, 0.02]),
            'SS': BoxConvolution('SS', f(self.delay('dm_ss'))),

            'R': BoxTarget('R'),
            'DC': BoxTarget('DC')
        }

        # src -> [targets]
        def lambda_coefficient(a, b=None):
            if isinstance(a, int):
                return lambda: a
            elif b == None:
                return lambda: self.coefficient(a)
            else:
                return lambda: self.coefficient(a)*self.coefficient(b)

        self._moves = {
            'INCUB': [('IR', lambda_coefficient('pc_ir')),
                      ('IH', lambda_coefficient('pc_ih'))],
            'IR': [('R', lambda_coefficient(1))],
            'IH': [('SM', lambda_coefficient('pc_sm')),
                   ('SI', lambda_coefficient('pc_si'))],
            'SM': [('SI', lambda_coefficient('pc_sm_si')),
                   ('DC', lambda_coefficient('pc_sm_dc')),
                   ('SS', lambda_coefficient('pc_sm_out', 'pc_h_ss')),
                   ('R', lambda_coefficient('pc_sm_out', 'pc_h_r'))],
            'SI': [('DC', lambda_coefficient('pc_si_dc')),
                   ('SS', lambda_coefficient('pc_si_out', 'pc_h_ss')),
                   ('R', lambda_coefficient('pc_si_out', 'pc_h_r'))],
            'SS': [('R', lambda_coefficient(1))]
        }

        self.time = -1  # first step should be t=0
        self.e0 = self.coefficient('kpe') * self.constant('population')
        self.box('SE').add(self.e0 - self.constant('patient0'))
        self.box('INCUB').add(self.constant('patient0'))

    def __str__(self):
        pop = sum([box.full_size() for box in self.boxes()])
        return f't={self.time} {self.box("SE")} {self.box("INCUB")}' +\
            f'\n    {self.box("IR")} {self.box("IH")}' + \
            f'\n    {self.box("SM")} {self.box("SI")} {self.box("SS")}' +\
            f'\n    {self.box("R")} {self.box("DC")} POP={round(pop,2)}'

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

    def evacuation(self, src, dest, value):
        self.box(src).force_output(value)
        max_value = min(self.box(src).output(), value)
        self.move(src, dest, max_value)
        print(f'evacuation time = {self.time} delta {max_value}')

    def boxes(self):
        return self._boxes.values()

    def box(self, name):
        return self._boxes[name]

    def output(self, name, past=0):
        return self.box(name).output(past)

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
            'r') * self.coefficient('beta') * se * (ir+ih) / n if n > 0 else 0
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
