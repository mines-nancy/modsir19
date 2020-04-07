class History:
    def __init__(self):
        self.sorted_history = []

    def store(self, state):
        self.sorted_history.append(state)

    def get_states(self, time):
        return [state for state in self.sorted_history if state.time == time]

    def get_last_state(self, time):
        states = self.get_states(time)
        if len(states) > 1:
            print(f'Warning: {len(states)} states for time {time}')
        if len(states) > 0:
            return states[-1]
        return None

    def extract_serie(self, boxname):
        res = []
        for state in self.sorted_history:
            res.append(getattr(state, boxname).size())
        return res
