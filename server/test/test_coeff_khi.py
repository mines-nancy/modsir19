import unittest
from models.components.utils import compute_residuals, compute_khi_exp, compute_khi_binom

def compute_expectation(khi_tab) :
    
    N = len(khi_tab)
    expectation = 0
    for k in range(N) :
        expectation += (k + 1) * khi_tab[k]
     
    return expectation

class testKhiGeneration(unittest.TestCase) :
    
    def test_binom_khi_1(self) :
        
        khi_tab = compute_khi_binom(5, 21)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 5)
    
    def test_binom_khi_2(self) :
        
        khi_tab = compute_khi_binom(15, 21)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 15)
    
    def test_binom_khi_3(self) :
        
        khi_tab = compute_khi_binom(25, 37)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 25)
    
    def test_exp_khi_1(self) :
        
        khi_tab = compute_khi_binom(5, 21)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 5)
    
    def test_exp_khi_2(self) :
        
        khi_tab = compute_khi_binom(15, 21)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 15)
    
    def test_exp_khi_3(self) :
        
        khi_tab = compute_khi_binom(25, 37)
        self.assertAlmostEqual(sum(khi_tab), 1)
        self.assertAlmostEqual(compute_expectation(khi_tab), 25)
    
    


if __name__ == '__main__':
    unittest.main()