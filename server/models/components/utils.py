from scipy.optimize import fsolve
import matplotlib.pyplot as plt


def factorial(k) :
    
    fact = 1
    
    for i in range(1, k + 1) :
        fact *= i
    
    return fact

def binomial_coeff(k, n) :
    
    return factorial(n) / (factorial(k) * factorial(n - k))

def compute_param(dms, max_days, prob_type):
    
    if prob_type == 'exponential':
        def f(x):
            return (1 - x ** (max_days)) / (1 - x) - dms
        solutions = fsolve(f, 5)
        param = solutions[0]
    elif prob_type == 'binomial':
        param = (dms - 1) / max_days
        
    return param

def compute_khi(dms, max_days, prob_type = 'binomial') :
    
    khi_tab = []
    param = compute_param(dms, max_days, prob_type)
    
    if prob_type == 'exponential':
        for k in range(max_days - 1):
            khi = param ** k * (1 - param)
            khi_tab.append(khi)
        khi_tab.append(param ** (max_days - 1))
    elif prob_type == 'binomial':
        for k in range(max_days):
            khi = binomial_coeff(k, max_days) * param ** k * (1 - param) ** (max_days - k)
            khi_tab.append(khi)
    
    return khi_tab
    
def compute_residuals(khi_tab):
    
    residuals = [1]
    
    for k in range(len(khi_tab)) :
        residuals.append(residuals[k] - khi_tab[k])
    
    return residuals


#def compute_exp_ki(duration, max_days=21):
#    return compute_khi(compute_residuals(duration, max_days))


def compute_delay_ki(duration):
    if duration <= 1:
        return [1]
    else:
        return [0]*(duration-2) + [0.5, 0.5]


def compute_area_and_expectation(khi_tab, residuals):
    
    area = 0
    expectation_contribs = []
    N = len(khi_tab)
    
    for k in range(N) :
        area += (residuals[k] + residuals[k + 1]) / 2
        expectation_contribs.append((k + 1) * khi_tab[k])
    
    expectation = sum(expectation_contribs)
    
    return area, expectation, sum(khi_tab)


#dms = 5
#max_days = 21
#prob_type = 'exponential'
#
#khi_tab = compute_khi(dms, max_days, prob_type)
#residuals = compute_residuals(khi_tab)
#
#area, expectation, sum_khi = compute_area_and_expectation(khi_tab, residuals)
#
#delta_area = abs(dms - area)
#delta_khi = abs(1 - sum_khi)
#delta_expectation = abs(dms - expectation)
#
#print('area = ' + str(area))
#print('delta_area = ' + str(delta_area) + '\n')
#print('expectation = ' + str(expectation))
#print('delta_expectation = ' + str(delta_expectation) + '\n')
#print('sum(khi) = ' + str(sum_khi))
#print('delta_khi = ' + str(delta_khi) + '\n')
#
#plt.plot([k for k in range(max_days + 1)], residuals)
#plt.bar([k for k in range(1, max_days + 1)], khi_tab, color = 'red')