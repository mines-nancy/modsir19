import unittest
from models.components.box import Box, BoxSource, BoxTarget


class TestBoxSource(unittest.TestCase):

    def test_box_source(self):
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

        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 100)
        self.assertEqual(box.output(), 100)

        box.add(10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 110)
        self.assertEqual(box.output(), 110)

        box.remove(10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 100)
        self.assertEqual(box.output(), 100)


if __name__ == '__main__':
    unittest.main()
