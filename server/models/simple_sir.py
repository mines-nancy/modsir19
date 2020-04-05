# -*- coding: utf-8 -*-
"""
Created on 05/04/2020

@author: Paul Festor
"""


def simple_sir (s0, lambd, beta):

    maxTime = 30
    i0 = 1 - s0
    r0 = 0

    saints = list()
    infected = list()
    removed = list()

    saints.append(s0)
    infected.append(i0)
    removed.append(r0)

    for time in range(1, maxTime):
        saints.append(saints[time - 1] * (1 - beta))
        infected.append(infected[time - 1] * (1 - 1 / lambd) + saints[time - 1] * beta)
        removed.append(infected[time - 1] * (1 / lambd) + removed[time - 1])

    return {"saints": saints, "infected": infected, "removed": removed}


if __name__ == "__main__":
    print(simple_sir(0.7, 12, 0.5))