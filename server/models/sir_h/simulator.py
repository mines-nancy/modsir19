from models.sir_h.state import State


def apply_rules(state, date, rules):
    applicable_rules = [rule for rule in rules if date == rule['date']]
    for rule in applicable_rules:
        state.change_value(rule['field'], rule['value'])


def run_sir_h(parameters, rules):
    state = State(parameters)
    lim_time = state.parameter('lim_time')
    # print(state)

    for i in range(lim_time):
        apply_rules(state, state.time, rules)
        state.step()
        # print(state)

    return state.extract_series()
