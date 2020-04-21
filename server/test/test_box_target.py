import unittest
from models.components.box import Box, BoxSource, BoxTarget


class TestBoxTarget(unittest.TestCase):

    def test_box_target1(self):
        box = BoxTarget('TARGET')
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
        self.assertEqual(box.output(), 0)

        box.add(10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 110)
        self.assertEqual(box.output(), 0)

    def test_box_target2(self):
        box = BoxTarget('TARGET')
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.add(100)
        box.add(100)
        self.assertEqual(box.input(), 200)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)

    def test_box_target3(self):
        box = BoxTarget('TARGET')
        with self.assertRaises(Exception):
            box.remove(100)
        with self.assertRaises(Exception):
            box.set_output(100)
        box.add(100)
        box.step()
        box.step()
        self.assertEqual(box.output(), 0)
        self.assertEqual(box.removed(), 0)


if __name__ == '__main__':
    unittest.main()
