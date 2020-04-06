# -*- coding: utf-8 -*-
"""
Created on 05/04/2020

@author: Paul Festor
"""


def simple_sir (s0, lambd, beta):

    maxTime = 30
    i0 = 1 - s0
    r0 = 0

    healthy = list()
    infected = list()
    removed = list()

    healthy.append(s0)
    infected.append(i0)
    removed.append(r0)

    for time in range(1, maxTime):
        healthy.append(healthy[time - 1] * (1 - beta))
        infected.append(infected[time - 1] * (1 - 1 / lambd) + healthy[time - 1] * beta)
        removed.append(infected[time - 1] * (1 / lambd) + removed[time - 1])

    return {"healthy": healthy, "infected": infected, "removed": removed}


if __name__ == "__main__":
    print(simple_sir(0.7, 12, 0.5))
