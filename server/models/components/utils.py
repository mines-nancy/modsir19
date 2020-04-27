from scipy.optimize import fsolve


def compute_ratio(dms, max_days):
    def f(q):
        return (1 / 2) * (1 - q ** max_days) * (1 + q) / (1 - q) - dms

    solutions = fsolve(f, 5)
    ratio = solutions[0]
    return ratio


def compute_residuals(dms, max_days):
    ratio = compute_ratio(dms, max_days)
    residuals = [ratio ** i for i in range(max_days + 1)]
    return residuals


def compute_khi(residuals):
    max_days = len(residuals) - 1
    khi = [residuals[i] - residuals[i + 1] for i in range(max_days)]
    proba_tot = sum(khi)

    for i in range(max_days):
        khi[i] /= proba_tot

    return khi


def compute_area(dms, max_days):

    residuals = compute_residuals(dms, max_days)
    khi = compute_khi(residuals)

    area = 0
    for k in range(max_days):
        area += (residuals[k] + residuals[k + 1]) / 2

    sum_khi = sum(khi)

    return area, sum_khi


# area, sum_khi = compute_area(5, 10)

# print('khi = ' + str(compute_khi(compute_residuals(5, 21))))
# print('area = ' + str(area))
# print('sum(khi) = ' + str(sum_khi))
