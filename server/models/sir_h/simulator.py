from models.sir_h.state import State


def apply_rules(state, date, rules):
    applicable_rules = [rule for rule in rules if date == rule['date']]
    for rule in applicable_rules:
        state.change_value(rule['field'], float(rule['value']))


def run_sir_h(constants, delays, coefficients, rules):
    state = State(constants=constants, delays=delays,
                  coefficients=coefficients, time=0)
    lim_time = constants['lim_time']

    for i in range(lim_time):
        apply_rules(state, i, rules)
        state.step()
        # print(state)

    return state.extract_series()
