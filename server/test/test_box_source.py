import unittest
from models.components.box import Box, BoxSource, BoxTarget


class TestBoxSource(unittest.TestCase):

    # elementary behavior
    def test_box_source1(self):
        box = BoxSource('SOURCE')
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)

        box.add(100)
        self.assertEqual(box.input(), 100)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)

        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 100)
        self.assertEqual(box.output(), 100)

        box.remove(10)
        self.assertEqual(box.removed(), 10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 90)
        self.assertEqual(box.output(), 90)

    # multiple outputs are cumulated
    def test_box_source2(self):
        box = BoxSource('SOURCE')
        box.add(100)
        self.assertEqual(box.input(), 100)
        box.step()
        self.assertEqual(box.output(), 100)
        box.step()
        self.assertEqual(box.output(), 100)
        box.add(10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 110)
        self.assertEqual(box.output(), 110)

     # multiple removed are cumulated
    def test_box_source3(self):
        box = BoxSource('SOURCE')
        box.add(100)
        self.assertEqual(box.input(), 100)
        box.step()
        self.assertEqual(box.output(), 100)
        box.remove(10)
        self.assertEqual(box.removed(), 10)
        box.step()
        self.assertEqual(box.removed(1), 10)
        self.assertEqual(box.removed(), 0)
        self.assertEqual(box.output(), 90)

        box.remove(10)
        box.remove(10)
        self.assertEqual(box.removed(), 20)
        box.step()
        self.assertEqual(box.removed(1), 20)
        self.assertEqual(box.removed(), 0)
        self.assertEqual(box.output(), 70)

    # size and output are equal
    def test_box_source4(self):
        box = BoxSource('SOURCE')
        box.add(100)
        box.step()
        self.assertEqual(box.size(), 100)
        self.assertEqual(box.output(), 100)
        box.step()
        self.assertEqual(box.size(), 100)
        self.assertEqual(box.output(), 100)
        box.remove(10)
        box.step()
        self.assertEqual(box.size(), 90)
        self.assertEqual(box.output(), 90)

    # output can be negative
    def test_box_source5(self):
        box = BoxSource('SOURCE')
        box.add(100)
        box.step()
        box.remove(110)
        box.step()
        self.assertEqual(box.size(), -10)
        self.assertEqual(box.output(), -10)

    # check history
    def test_box_source6(self):
        box = BoxSource('SOURCE')
        box.add(100)
        box.step()
        for i in range(1, 10):
            box.remove(i)
            box.step()

        self.assertEqual(box.get_input_history(), [100]+[0]*10)
        self.assertEqual(box.get_removed_history(), [
                         0]+list(range(1, 10)) + [0])
        self.assertEqual(box.get_output_history(), [0]+[
                         100-int(n*(n+1)/2) for n in range(1, 10)] + [100-45])
        self.assertEqual(box.get_output_history(), box.get_size_history())


if __name__ == '__main__':
    unittest.main()
