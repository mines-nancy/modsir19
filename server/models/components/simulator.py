class Simulator:
    def __init__(self, state):
        self._state = state

    def step(self):
        self._state.step()

    def get_state(self):
        return self._state

    def extract_series(self):
        return self._state.extract_series()

    def apply_rules(self, date, rules):
        applicable_rules = [rule for rule in rules if date == rule['date']]
        for rule in applicable_rules:
            self._state.change_value(rule['field'], float(rule['value']))
