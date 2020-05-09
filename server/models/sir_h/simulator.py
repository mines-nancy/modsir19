from models.sir_h.state import State
from models.rule import apply_rules, apply_force_move
from functools import lru_cache
from frozendict import frozendict


def run_sir_h(parameters, rules, data_chu=dict(), specific_series=None):
    """
        called by labs
        can be called with mutable parameters
        do not use cache
        specific_series sublist of ['SE', 'R', 'INCUB', 'I', 'IH', 'SM',  'SI', 'SS', 'DC']
    """
    state = State(parameters)
    lim_time = state.parameter('lim_time')

    for i in range(lim_time):
        apply_rules(state, rules)
        apply_force_move(state, 'SI', 'SE', data_chu)
        state.step()

    if specific_series == None:
        return state.extract_series()
    else:
        return state.extract_series(specific_series)


@lru_cache(maxsize=128)
def cached_run_sir_h(parameters, rules, data_chu=frozendict()):
    """ should be called with hashable parameters, such as frozeidict and tuple"""
    print(f'parameters={parameters} rules={rules}')
    state = State(parameters)
    lim_time = state.parameter('lim_time')

    for i in range(lim_time):
        apply_rules(state, rules)
        apply_force_move(state, 'SI', 'SE', data_chu)
        state.step()

    return state.extract_series()
