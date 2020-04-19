import unittest
from models.components.box import BoxSource, BoxTarget
from models.components.box_past_input import BoxPastInput


class TestBoxPastInput(unittest.TestCase):

    def test_box_past_input1(self):
        box = BoxPastInput('PAST_INPUT-1')
        box.add(1)
        self.assertEqual(box.input(), 1)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 1)
        self.assertEqual(box.output(), 0)

        box.step()

        self.assertEqual(box.input(1), 0)
        self.assertEqual(box.size(1), 1)
        self.assertEqual(box.output(1), 0)

        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 1)
        self.assertEqual(box.output(), 0)


if __name__ == '__main__':
    unittest.main()
