from models.sir_h.state import State
from models.rule import apply_rules, apply_evacuations
from functools import lru_cache
from frozendict import frozendict

def get_default_parameters() :
    # r0 = 3.31
    # pc_ih = 0.02
    # pc_si = 0.16
    # pc_sm_si = 0.21

    dm_r = 9
    r0 = 2.85
    r0_confinement = 0.532
    pc_ih = 0.03
    pc_si = 0.154
    pc_sm_si = 0.207
    parameters = dict({'population': 1000000,
                  'patient0': 40,
                  'lim_time': 250,
                  'r': 1.0,
                  'beta': r0 / dm_r,
                  'kpe': 1.0,
                  'dm_incub': 4,
                  'dm_r': dm_r, 'dm_h': 6,
                  'dm_sm': 6, 'dm_si': 9, 'dm_ss': 14,
                  'pc_ir': 1 - pc_ih, 'pc_ih': pc_ih,
                  'pc_sm': 1 - pc_si, 'pc_si': pc_si,
                  'pc_sm_si': pc_sm_si, 'pc_sm_dc': (1-pc_sm_si) * 0.25, 'pc_sm_out': (1-pc_sm_si) * 0.75,
                  'pc_si_dc': 0.4, 'pc_si_out': 0.6,
                  'pc_h_ss': 0.2, 'pc_h_r': 0.8,
                  'integer_flux': False})

    return parameters



    dm_r = 9
    r0 = 2.85
    r0_confinement = 0.532
    pc_ih = 0.03
    pc_si = 0.154
    pc_sm_si = 0.207
    parameters = dict({'population': 1000000,
                  'patient0': 40,
                  'lim_time': 250,
                  'r': 1.0,
                  'beta': r0 / dm_r,
                  'kpe': 1.0,
                  'dm_incub': 4,
                  'dm_r': dm_r, 'dm_h': 6,
                  'dm_sm': 6, 'dm_si': 9, 'dm_ss': 14,
                  'pc_ir': 1 - pc_ih, 'pc_ih': pc_ih,
                  'pc_sm': 1 - pc_si, 'pc_si': pc_si,
                  'pc_sm_si': pc_sm_si, 'pc_sm_dc': (1-pc_sm_si) * 0.25, 'pc_sm_out': (1-pc_sm_si) * 0.75,
                  'pc_si_dc': 0.4, 'pc_si_out': 0.6,
                  'pc_h_ss': 0.2, 'pc_h_r': 0.8})

    return parameters



def run_sir_h(parameters, rules, data_chu=frozendict()):
    """ can be called with mutable parameters"""
    return cached_run_sir_h(frozendict(parameters), tuple(rules), frozendict(data_chu))


@lru_cache(maxsize=128)
def cached_run_sir_h(parameters, rules, data_chu=frozendict()):
    """ should be called with hashable parameters, such as frozeidict and tuple"""
    print(parameters)
    state = State(parameters)
    lim_time = state.parameter('lim_time')
    # print(state)

    for i in range(lim_time):
        apply_rules(state, rules)
        apply_evacuations(state, 'SI', 'R', data_chu)

        state.step()
        # print(state)

    return state.extract_series()
