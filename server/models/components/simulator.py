from models.components.history import History
import copy


class Simulator:
    def __init__(self, state):
        self._state = state
        self._history = History()

    def step(self):
        current_state = self._state
        self._history.store(current_state)

        next_state = copy.deepcopy(current_state)
        next_state.step(self._history)

        self._state = next_state

    def get_state(self):
        return self._state

    def extract_series(self):
        return self._state.extract_series(self._history)

    def apply_rules(self, date, rules):
        applicable_rules = [rule for rule in rules if date == rule['date']]
        for rule in applicable_rules:
            self._state.change_value(rule['field'], float(rule['value']))
