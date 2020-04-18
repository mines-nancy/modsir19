import unittest
from models.components.box import Box


class TestBox(unittest.TestCase):
    # def setUp(self):
    # self.box = BoxDms('DMS-10', 10)

    def test_box1(self):
        box = Box('BOX')
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.add(1)
        box.remove(2)
        self.assertEqual(box.input(), 1)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), -2)

        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)

        self.assertEqual(box.input(0), 0)
        self.assertEqual(box.size(0), 0)
        self.assertEqual(box.output(0), 0)

        self.assertEqual(box.input(1), 1)
        self.assertEqual(box.size(1), 0)
        self.assertEqual(box.output(1), -2)

    def test_box2(self):
        box = Box('BOX')
        for i in range(10):
            box.add(i)
            box.remove(i)
            box.step()

        for i in range(10):
            n = (9-i)
            self.assertEqual(box.input(1+i), n)
            self.assertEqual(box.size(1+i), 0)
            self.assertEqual(box.output(1+i), -n)


if __name__ == '__main__':
    unittest.main()
