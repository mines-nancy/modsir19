import unittest
from models.components.box_dms import BoxDms


class TestBasicFunction(unittest.TestCase):
    def setUp(self):
        self.box = BoxDms('DMS-10', 10)

    def test_1(self):
        box = BoxDms('DMS-10', 10)
        box.add(1)
        self.assertEqual(box.input(), 1)
        box.step()
        self.assertEqual(box.size(), 1)
        self.assertEqual(box.output(), 0)

    def test_2(self):
        box = BoxDms('DMS-10', 10)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        r = [1, 3, 7, 14, 23, 32, 39, 44, 48, 50, 51, 51, 50, 48, 45, 42, 37, 34, 30, 27, 25, 22, 20, 18, 16, 14, 13, 12,
             11, 9, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
        outputs = [0.000, 0.100, 0.290, 0.661, 1.395, 2.255, 3.230, 3.907, 4.416, 4.775, 4.997, 5.097, 5.088, 4.979, 4.781, 4.503, 4.153, 3.737, 3.364, 3.027, 2.725, 2.452, 2.207, 1.986, 1.788, 1.609, 1.448, 1.303, 1.173, 1.056, 0.950,
                   0.855, 0.769, 0.693, 0.623, 0.561, 0.505, 0.454, 0.409, 0.368, 0.331, 0.298, 0.268, 0.241, 0.217, 0.196, 0.176, 0.158, 0.143, 0.128, 0.115, 0.104, 0.094, 0.084, 0.076, 0.068, 0.061, 0.055, 0.050, 0.045, 0.040, 0.036, 0.033, 0.029]
        for i in range(len(inputs)):
            box.add(inputs[i])
            self.assertEqual(box.input(), inputs[i])
            box.step()
            self.assertEqual(box.size(), r[i])


if __name__ == '__main__':
    unittest.main()
