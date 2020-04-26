from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField


if __name__ == "__main__":
    parameters = {'population': 1000000,
                  'patient0': 100,
                  'lim_time': 15,
                  'r': 1,
                  'beta': 0.25555,
                  'kpe': 1.0,
                  'dm_incub': 3,
                  'dm_r': 9, 'dm_h': 6,
                  'dm_sm': 6, 'dm_si': 8, 'dm_ss': 14,
                  'pc_ir': 0.84, 'pc_ih': 0.16,
                  'pc_sm': 0.8, 'pc_si': 0.2,
                  'pc_sm_si': 0.2, 'pc_sm_dc': 0.16, 'pc_sm_out': 0.64,
                  'pc_si_dc': 0.5, 'pc_si_out': 0.5,
                  'pc_h_ss': 0.2, 'pc_h_r': 0.8}
    print(f'parameters={parameters}')

    # run_sir_h(parameters, [])
    run_sir_h(parameters, [RuleChangeField(53,  'dm_incub',  0),
                           RuleChangeField(53,  'dm_sm',  0),
                           RuleChangeField(53,  'r',  1.0),
                           RuleChangeField(53,  'beta', 0.08888),
                           RuleChangeField(108,  'dm_incub',  1),
                           RuleChangeField(108,  'r',  1.0),
                           RuleChangeField(108,  'beta', 0.1222),
                           ])
