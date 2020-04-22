from models.sir_h.state import State


def apply_rules(state, date, rules):
    applicable_rules = [rule for rule in rules if date == rule['date']]
    has_applied_rule = False

    for rule in applicable_rules:
        has_applied_rule = True
        state.change_value(rule['field'], rule['value'])

    if has_applied_rule:
        state.update_moves()


def run_sir_h(parameters, rules):
    state = State(parameters)
    lim_time = state.parameter('lim_time')

    for i in range(lim_time):
        apply_rules(state, i, rules)
        state.step()
        # print(state)

    return state.extract_series()
