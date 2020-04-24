import unittest
from models.components.box_fixed_delay import BoxFixedDelay


class TestBoxFixedDelay(unittest.TestCase):

    def test_box_delay_elementary(self):
        box = BoxFixedDelay('DELAY-1', 1)
        box.add(1)
        self.assertEqual(box.input(), 1)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 1)

    def check_input_output(self, box, inputs, r, outputs):
        for i in range(len(inputs)):
            box.add(inputs[i])
            self.assertEqual(box.input(), inputs[i])
            box.step()
            self.assertEqual(box.size(), r[i])
            self.assertEqual(box.output(), outputs[i])
            box.remove(box.output())

    def test_box_delay1(self):
        box = BoxFixedDelay('DELAY-1', 1)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        r = [0 for x in inputs]
        outputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_delay2(self):
        box = BoxFixedDelay('DELAY-2', 2)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        r = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        outputs = [0, 1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_delay10(self):
        box = BoxFixedDelay('DELAY-10', 10)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7,
                  6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        r = [1, 3, 7, 15, 25, 37, 47, 56, 64, 70, 74,
             75, 71, 64, 54, 45, 36, 28, 21, 15, 10, 6, 3, 1, 0, 0]
        outputs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4,
                   8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        self.check_input_output(box, inputs, r, outputs)


if __name__ == '__main__':
    unittest.main()
