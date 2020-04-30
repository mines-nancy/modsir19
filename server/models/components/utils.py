from scipy.optimize import fsolve
from scipy.special import binom

def compute_param(dms, max_days, prob_type):
    
    assert prob_type in ['exponential', 'binomial'], "Choose a valid name for the type of residuals"
    
    if prob_type == 'exponential':
        def f(x):
            return (1 - x ** (max_days)) / (1 - x) - dms
        solutions = fsolve(f, 5)
        param = solutions[0]
    elif prob_type == 'binomial':
        param = (dms - 1) / (max_days - 1)
        
    return param

def compute_khi_binom(dms, max_days = 21) :
    
    khi_tab = []
    param = compute_param(dms, max_days, 'binomial')
    
    for k in range(max_days):
        khi = binom(max_days - 1, k) * param ** k * (1 - param) ** (max_days - 1 - k)
        khi_tab.append(khi)
    
    return khi_tab

def compute_khi_exp(dms, max_days = 21):
    
    khi_tab = []
    param = compute_param(dms, max_days, 'exponential')
    
    for k in range(max_days - 1):
        khi = param ** k * (1 - param)
        khi_tab.append(khi)
    khi_tab.append(param ** (max_days - 1))
    
    return khi_tab

def compute_residuals(khi_tab):
    
    residuals = [1]
    
    for k in range(len(khi_tab)) :
        residuals.append(residuals[k] - khi_tab[k])
    
    return residuals

def compute_delay_ki(duration):
    if duration <= 1:
        return [1]
    else:
        return [0]*(duration-2) + [0.5, 0.5]