from models.sir_h.state import State
from models.rule import apply_rules


def run_sir_h(parameters, rules):
    state = State(parameters)
    lim_time = state.parameter('lim_time')
    # print(state)

    for i in range(lim_time):
        apply_rules(state, state.time, rules)
        state.step()
        # print(state)

    return state.extract_series()
