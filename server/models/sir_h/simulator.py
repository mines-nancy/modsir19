from models.sir_h.state import State
from models.rule import apply_rules, apply_evacuations
from functools import lru_cache
from frozendict import frozendict


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
        apply_force_move(state, 'SI', 'SE', data_chu)

        state.step()
        # print(state)

    return state.extract_series()
