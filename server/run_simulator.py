from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h

if __name__ == "__main__":
    constants = {'population': 500000, 'patient0': 1, 'lim_time': 10}
    delays = {'dm_incub': 3, 'dm_r': 9, 'dm_h': 6,
              'dm_sm': 6, 'dm_si': 8, 'dm_ss': 14}
    coefficients = {'kpe': 0.6, 'r': 2.3, 'beta': 0.73,
                    'pc_ir': 0.84, 'pc_ih': 0.16,
                    'pc_sm': 0.8, 'pc_si': 0.2,
                    'pc_sm_si': 0.2, 'pc_sm_dc': 0.16, 'pc_sm_out': 0.64,
                    'pc_si_dc': 0.5, 'pc_si_out': 0.5,
                    'pc_h_ss': 0.2, 'pc_h_r': 0.8}
    print(
        f'constants={constants} delays={delays} coefficients={coefficients}')

    run_sir_h(constants, delays, coefficients, [])
