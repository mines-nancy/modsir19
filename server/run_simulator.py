from models.state import State
from models.simulator import Simulator

if __name__ == "__main__":
    initial_state = State(kpe=0.6,
                          kem=0.24,
                          kmg=0.81,
                          kmh=0.19,
                          khr=0.26,
                          khg=0.74,
                          krd=0.5,
                          krg=0.5,
                          tem=6,
                          tmg=9,
                          tmh=6,
                          thg=6,
                          thr=1,
                          time=0,
                          population=300000
                          )
    simulator = Simulator(initial_state)
    print(simulator.get_state())

    for i in range(300):
        simulator.step()
        print(simulator.get_state())
