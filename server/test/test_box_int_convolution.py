import unittest
from models.components.box_convolution import BoxConvolution


class TestBoxFixedDelay(unittest.TestCase):

    def test_box_int_convolution1(self):
        box = BoxConvolution('CONV-1', [1], True)
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

    def test_box_int_convolution2(self):
        box = BoxConvolution('CONV-2', [0.4, 0.6], True)
        box.add(10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), int(0.6 * 10))
        self.assertEqual(box.output(), int(0.4 * 10))
        box.remove(int(0.4*10))
        box.add(20)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), int(0.6*10) +
                         20 - int(0.6*10) - int(0.4*20))
        self.assertEqual(box.output(), int(0.6 * 10) + int(0.4 * 20))

    def check_input_output(self, box, inputs, r, outputs):
        for i in range(len(inputs)):
            box.add(inputs[i])
            self.assertEqual(box.input(), inputs[i])
            box.step()
            self.assertEqual(box.size(), r[i])
            self.assertEqual(box.output(), outputs[i])
            box.remove(box.output())

    def test_box_int_convolution_delay1(self):
        box = BoxConvolution('DELAY-1', [1], True)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        r = [0 for x in inputs]
        outputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_int_convolution_delay2(self):
        box = BoxConvolution('DELAY-1', [0, 1], True)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        r = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        outputs = [0, 1, 2, 4, 8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_int_convolution_delay10(self):
        box = BoxConvolution('DELAY-10', 9*[0]+[1], True)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7,
                  6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        r = [1, 3, 7, 15, 25, 37, 47, 56, 64, 70, 74,
             75, 71, 64, 54, 45, 36, 28, 21, 15, 10, 6, 3, 1, 0, 0]
        outputs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4,
                   8, 10, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        self.check_input_output(box, inputs, r, outputs)

    def test_box_int_force_output10(self):
        box = BoxConvolution('DELAY-10', 9*[0]+[1], True)
        inputs = [1, 2, 4, 8, 10, 12, 10, 9, 8, 7,
                  6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        r = [1, 3, 7, 15, 25, 37, 47, 56, 64, 70, 74,
             75, 71, 64, 54, 45, 36, 28, 21, 15, 10, 6, 3, 1, 0, 0]

        for i in range(4):
            box.add(inputs[i])
            box.step()
            box.remove(box.output())
        self.assertAlmostEqual(box.size(), r[3])
        self.assertAlmostEqual(box.output(), 0)

        box.force_output(10)
        self.assertAlmostEqual(box.size(), 15-10)

        box.force_output(10)
        self.assertAlmostEqual(box.size(), 0)


if __name__ == '__main__':
    unittest.main()
