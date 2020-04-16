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
        r = [1.00, 2.90, 6.61, 13.95, 22.55, 32.30, 39.07, 44.16, 47.75, 49.97, 50.97, 50.88, 49.79, 47.81, 45.03, 41.53, 37.37, 33.64, 30.27, 27.25, 24.52, 22.07, 19.86, 17.88, 16.09, 14.48, 13.03, 11.73, 10.56,
             9.50, 8.55, 7.69, 6.93, 6.23, 5.61, 5.05, 4.54, 4.09, 3.68, 3.31, 2.98, 2.68, 2.41, 2.17, 1.96, 1.76, 1.58, 1.43, 1.28, 1.15, 1.04, 0.94, 0.84, 0.76, 0.68, 0.61, 0.55, 0.50, 0.45, 0.40, 0.36, 0.33, 0.29, 0.26]
        outputs = [0.000, 0.100, 0.290, 0.661, 1.395, 2.255, 3.230, 3.907, 4.416, 4.775, 4.997, 5.097, 5.088, 4.979, 4.781, 4.503, 4.153, 3.737, 3.364, 3.027, 2.725, 2.452, 2.207, 1.986, 1.788, 1.609, 1.448, 1.303, 1.173, 1.056, 0.950,
                   0.855, 0.769, 0.693, 0.623, 0.561, 0.505, 0.454, 0.409, 0.368, 0.331, 0.298, 0.268, 0.241, 0.217, 0.196, 0.176, 0.158, 0.143, 0.128, 0.115, 0.104, 0.094, 0.084, 0.076, 0.068, 0.061, 0.055, 0.050, 0.045, 0.040, 0.036, 0.033, 0.029]
        for i in range(len(inputs)):
            box.add(inputs[i])
            self.assertEqual(box.input(), inputs[i])
            box.step()
            self.assertAlmostEqual(box.size(), r[i], 2)
            self.assertAlmostEqual(box.output(), outputs[i], 2)
            box.remove(box.output())


if __name__ == '__main__':
    unittest.main()
