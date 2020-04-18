import unittest
from models.components.box import BoxSource, BoxTarget
from models.components.box_queue import BoxQueue


class TestBoxQueue(unittest.TestCase):

    def test_box_queue1(self):
        box = BoxQueue('QUEUE-1', 1)
        box.add(1)
        self.assertEqual(box.input(), 1)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 1)
        self.assertEqual(box.output(), 0)

        box.step()
        # when BoxQueue implements Box
        # self.assertEqual(box.input(1), 0)
        # self.assertEqual(box.size(1), 1)
        # self.assertEqual(box.output(1), 0)

        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 1)

    def test_box_queue2(self):
        box = BoxQueue('QUEUE-10', 10)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        r = [1, 3, 7, 15, 25, 37, 47, 56, 64, 71, 76, 79, 79, 74, 66, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        outputs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0,
                   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for i in range(len(inputs)):
            box.add(inputs[i])
            self.assertEqual(box.input(), inputs[i])
            box.step()
            self.assertEqual(box.size(), r[i])
            self.assertEqual(box.output(), outputs[i])
            box.remove(box.output())


if __name__ == '__main__':
    unittest.main()
