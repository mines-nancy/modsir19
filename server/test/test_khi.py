from models.components.utils import compute_residuals, compute_khi, compute_area_and_expectation
import matplotlib.pyplot as plt

dms = 5
max_days = 21
prob_type = 'binomial'
#prob_type = 'exponential'

khi_tab = compute_khi(dms, max_days, prob_type)
residuals = compute_residuals(khi_tab)

area, expectation, sum_khi = compute_area_and_expectation(khi_tab, residuals)

delta_area = abs(dms - area)
delta_khi = abs(1 - sum_khi)
delta_expectation = abs(dms - expectation)

print('area = ' + str(area))
print('delta_area = ' + str(delta_area) + '\n')
print('expectation = ' + str(expectation))
print('delta_expectation = ' + str(delta_expectation) + '\n')
print('sum(khi) = ' + str(sum_khi))
print('delta_khi = ' + str(delta_khi) + '\n')

plt.plot([k for k in range(max_days + 1)], residuals)
plt.bar([k for k in range(1, max_days + 1)], khi_tab, color = 'red')