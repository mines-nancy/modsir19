import unittest
from models.components.box_convolution import compute_remove_delta


class testRemoveDelta(unittest.TestCase):

    def test_remove_delta1(self):
        self.assertEqual(compute_remove_delta([1], 0), [0])
        self.assertEqual(compute_remove_delta([1], 1), [1])

        self.assertEqual(compute_remove_delta([2], 0), [0])
        self.assertEqual(compute_remove_delta([2], 1), [1])
        self.assertEqual(compute_remove_delta([2], 2), [2])

    def test_remove_delta2(self):
        self.assertEqual(compute_remove_delta([1, 1], 0), [0, 0])
        self.assertEqual(compute_remove_delta([1, 1], 1), [0, 1])
        self.assertEqual(compute_remove_delta([1, 1], 2), [1, 1])

    def test_remove_delta3(self):
        self.assertEqual(compute_remove_delta([1, 1, 1], 0), [0, 0, 0])
        self.assertEqual(compute_remove_delta([1, 1, 1], 1), [0, 1, 0])
        self.assertEqual(compute_remove_delta([1, 1, 1], 2), [1, 0, 1])
        self.assertEqual(compute_remove_delta([1, 1, 1], 3), [1, 1, 1])

    def test_remove_delta5(self):
        self.assertEqual(compute_remove_delta([5, 5, 5], 5), [2, 1, 2])
        self.assertEqual(compute_remove_delta([5, 5, 5], 10), [3, 4, 3])
        self.assertEqual(compute_remove_delta([5, 0, 5], 5), [2, 0, 3])
        self.assertEqual(compute_remove_delta([5, 1, 5], 9), [4, 1, 4])


if __name__ == '__main__':
    unittest.main()
