class History:
    def __init__(self):
        self.sorted_history = []

    def sorted_list(self):
        return self.sorted_history

    def store(self, state):
        self.sorted_history.append(state)

    def get_states(self, time):
        if time < 0:
            return []

        # res1 = [state for state in self.sorted_history if state.time == time]
        # return a single element in a more efficient way
        if len(self.sorted_history) > time:
            res = [self.sorted_history[time]]
        else:
            res = []
        return res

    def get_last_state(self, time):
        states = self.get_states(time)
        if len(states) > 1:
            print(f'Warning: {len(states)} states for time {time}')
        if len(states) > 0:
            return states[-1]
        return None
