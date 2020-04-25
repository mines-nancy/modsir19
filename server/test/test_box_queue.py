import unittest
from models.components.box_queue import BoxQueue


class TestBoxQueue(unittest.TestCase):

    def test_box_queue_elementary(self):
        box = BoxQueue('QUEUE-1', 1)
        box.add(10)
        self.assertEqual(box.input(), 10)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 10)

        box.step()
        self.assertEqual(box.input(2), 10)
        self.assertEqual(box.size(2), 0)
        self.assertEqual(box.output(2), 0)

        self.assertEqual(box.input(1), 0)
        self.assertEqual(box.size(1), 0)
        self.assertEqual(box.output(1), 10)

        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 10)  # nothing has been removed

    def check_input_output(self, box, inputs, r, outputs):
        for i in range(len(inputs)):
            box.add(inputs[i])
            self.assertEqual(box.input(), inputs[i])
            box.step()
            self.assertEqual(box.size(), r[i])
            self.assertEqual(box.output(), outputs[i])
            box.remove(box.output())

    def test_box_queue_delay1(self):
        box = BoxQueue('QUEUE', 1)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        r = [0 for x in inputs]
        outputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_queue_delay2(self):
        box = BoxQueue('QUEUE', 2)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        r = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        outputs = [0, 1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_queue_delay10(self):
        box = BoxQueue('QUEUE', 10)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7,
                  6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        r = [1, 3, 7, 15, 25, 37, 47, 56, 64, 70, 74,
             75, 71, 64, 54, 45, 36, 28, 21, 15, 10, 6, 3, 1, 0, 0]
        outputs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4,
                   8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        self.check_input_output(box, inputs, r, outputs)

    # def test_box_queue_increase_duration(self):
    #     box = BoxQueue('QUEUE', 5)
    #     inputs = [5]*5+[0]*5
    #     r = [5, 10, 15, 20, 25, 20, 15, 10, 5, 0]
    #     outputs = [0, 0, 0, 0, 0, 5, 5, 5, 5, 5]
    #     self.check_input_output(box, inputs, r, outputs)

    #     inputs = [5]*5+[0]*5
    #     r = [5, 10, 15, 20, 25, 25, 25, 20, 15, 10]
    #     outputs = [0, 0, 0, 0, 0, 0, 0, 5, 5, 5]
    #     for i in range(len(inputs)):
    #         if i == 3:
    #             box.set_duration(7)
    #         box.add(inputs[i])
    #         self.assertEqual(box.input(), inputs[i])
    #         box.step()
    #         self.assertEqual(box.size(), r[i])
    #         self.assertEqual(box.output(), outputs[i])
    #         box.remove(box.output())

    # def test_box_queue_decrease_duration(self):
    #     box = BoxQueue('QUEUE', 5)
    #     inputs = [5]*5+[0]*5
    #     r = [5, 10, 15, 20, 25, 20, 15, 10, 5, 0]
    #     outputs = [0, 0, 0, 0, 0, 5, 5, 5, 5, 5]
    #     self.check_input_output(box, inputs, r, outputs)

    #     inputs = [5]*5+[0]*5
    #     r = [5, 10, 15, 15, 15, 10, 5, 0, 0, 0]
    #     outputs = [0, 0, 0, 5, 5, 5, 5, 5, 0, 0]
    #     for i in range(len(inputs)):
    #         if i == 2:
    #             box.set_duration(3)
    #         box.add(inputs[i])
    #         self.assertEqual(box.input(), inputs[i])
    #         box.step()
    #         self.assertEqual(box.size(), r[i])
    #         self.assertEqual(box.output(), outputs[i])
    #         box.remove(box.output())


if __name__ == '__main__':
    unittest.main()
