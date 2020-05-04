import unittest
from models.components.utils import *


def compute_expectation(khi_tab):
    expectations = [(k + 1) * khi for k, khi in enumerate(khi_tab)]
    return sum(expectations)


class testKhiGeneration(unittest.TestCase):

    def test_khi_binom(self):
        for dms in range(1, 25):
            for max_duration in range(dms, 40):
                khi_tab = compute_khi_binom(dms, max_duration)
                self.assertAlmostEqual(sum(khi_tab), 1)
                self.assertAlmostEqual(compute_expectation(khi_tab), dms)

    def test_khi_exp(self):
        for dms in range(1, 25):
            for max_duration in range(dms, 40):
                khi_tab = compute_khi_exp(dms, max_duration)
                self.assertAlmostEqual(sum(khi_tab), 1)
                self.assertAlmostEqual(compute_expectation(khi_tab), dms, 5)

    def test_khi_delay1(self):
        khi_tab = compute_khi_delay(1)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 1)

    def test_khi_delay(self):
        for dms in range(3, 25):
            khi_tab = compute_khi_delay(dms)
            self.assertAlmostEqual(sum(khi_tab), 1)
            self.assertAlmostEqual(compute_expectation(khi_tab), dms-0.5)

    def test_khi_linear(self):
        for dms in range(3, 25):
            khi_tab = compute_khi_linear(dms)
            self.assertAlmostEqual(sum(khi_tab), 1)
            self.assertAlmostEqual(compute_expectation(khi_tab), dms)


if __name__ == '__main__':
    unittest.main()
