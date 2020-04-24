

class Rule:
    def __init__(self, date):
        self._date = date

    def date(self):
        return self._date


class RuleChangeField(Rule):
    def __init__(self, date, field, value):
        Rule.__init__(self, date)
        self._field = field
        self._value = value

    def apply(self, state):
        state.change_value(self._field, self._value)


class RuleEvacuation(Rule):
    def __init__(self, date, src, dest, value):
        Rule.__init__(self, date)
        self._src = src
        self._dest = dest
        self._value = value

    def apply(self, state):
        state.evacuation(self._src, self._dest, self._value)


def apply_rules(state, date, rules):
    applicable_rules = [rule for rule in rules if date == rule.date()]
    for rule in applicable_rules:
        rule.apply(state)


def extract_from_parameters(parameters):
    start_time = int(parameters['start_time'])

    parameters_name = ["population", "patient0", "lim_time",
                       'dm_incub', 'dm_r', 'dm_h', 'dm_sm', 'dm_si', 'dm_ss',
                       'kpe', 'r', 'beta',
                       'pc_ir', 'pc_ih',
                       'pc_sm', 'pc_si',
                       'pc_sm_si', 'pc_sm_dc', 'pc_sm_out',
                       'pc_si_dc', 'pc_si_out',
                       'pc_h_ss', 'pc_h_r']

    parameters = {key: parameters[key] for key in parameters_name}
    return start_time, parameters


def build_rules_from_parameters(parameters_list):
    rules = []
    for index, parameters_timeframe in enumerate(parameters_list):
        if index > 0:
            start_time, parameters = extract_from_parameters(
                parameters_timeframe)
            for key in parameters:
                rules.append(RuleChangeField(start_time, key, parameters[key]))
    return rules
