from models.components.utils import compute_residuals, compute_khi_exp, compute_khi_binom, compute_khi_linear, compute_khi_delay
import matplotlib.pyplot as plt


def compute_area_and_expectation(khi_tab, residuals):
    area = 0
    expectations = []
    for k in range(len(khi_tab)):
        area += (residuals[k] + residuals[k + 1]) / 2
        expectations.append((k + 1) * khi_tab[k])

    return area, sum(expectations), sum(khi_tab)


dms = 6
max_days = 21

# khi_tab = compute_khi_binom(dms, max_days)
# khi_tab = compute_khi_exp(dms, max_days)
khi_tab = compute_khi_delay(dms)
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

plt.plot([k for k in range(len(residuals))], residuals)
plt.bar([k for k in range(1, len(khi_tab) + 1)], khi_tab, color='red')
plt.show()
