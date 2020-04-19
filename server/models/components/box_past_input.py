from models.components.box import Box


class BoxPastInput(Box):
    def __init__(self, name):
        Box.__init__(self, name)

    def step(self):
        previous_input = self.input()
        previous_output = self.output()
        previous_size = self.size()

        super().step()

        new_size = previous_size + previous_input - previous_output
        self.set_size(new_size)
