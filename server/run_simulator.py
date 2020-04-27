import numpy as np
import matplotlib.pyplot as plt

from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField, RuleEvacuation
from defaults import get_default_params


if __name__ == "__main__":

    all_params = get_default_params()

    # number of days since day0 -> number of residents in SI
    data_day0 = {date-all_params['day0']: all_params['data_chu'][date]
                 for date in all_params['data_chu'] if date % 1 == 0}
    print(list(data_day0.keys()))

    series = run_sir_h(all_params['parameters'], all_params['rules'])
    # corrected_series = run_sir_h(parameters, rules, data_day0)

    SI = series['SI']
    # corrected_SI = corrected_series['SI']

    x = np.linspace(0, len(SI), len(SI))
    plt.plot(x, SI)
    # plt.plot(x, corrected_SI)
    plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x')
    plt.savefig('filename')
