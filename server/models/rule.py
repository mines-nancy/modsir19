

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


def apply_rules(state, rules):
    applicable_rules = [rule for rule in rules if state.time == rule.date()]
    for rule in applicable_rules:
        rule.apply(state)


def apply_evacuations(state, src, dest, data_chu):
    date = state.time
    if date in data_chu and data_chu[date] != None:
        delta = state.box(src).size() - data_chu[date]
        rule = RuleEvacuation(date, src, dest, delta)
        rule.apply(state)
