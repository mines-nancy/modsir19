from copy import deepcopy


def complex_sir_v1(population: int,
                   Kpe: float, Kei: float, Kir: float, Kih: float, Khic: float, Khr: float, Ked: float, Ker: float,
                   Tei: int, Tir: int, Tih: int, Thr: int, Thic: int, Tice: int,
                   lim_time: int) -> {str: [float]}:
    """
    This function computes the predictions according to a complex SIR model
    :param population: Total population size
    :param Kpe: Coefficient from population to exposed
    :param Kei: Coefficient from exposed to infected
    :param Kir: Coefficient from infected to recovered
    :param Kih: Coefficient from infected to hospitalized
    :param Khic: Coefficient from hospitalized to intensive care
    :param Khr: Coefficient from hospitalized to recovered
    :param Ked: Coefficient from exit intensive to dead
    :param Ker: Coefficient from exit intensive to recovered
    :param Tei: Delay between being infected and infecting others
    :param Tir: Delay between being infected and recovering
    :param Tih: Delay between being infected and being sent to gospital
    :param Thr: Delay between being sent to gospital and recovering
    :param Thic: Delay between being sent to gospital and then sent to intensive care
    :param Tice: Delay between entering and exiting intensive care services
    :param lim_time: Nimber of simulated days

    :return: Tuple of the list of all variables of interest of the model
    """

    recovered = [0]
    exposed = [Kpe * (population - 1)]
    infected = [1]
    hospitalized = [0]
    intensive_care = [0]
    exit_intensive = [0]
    dead = [0]

    new_infected = [1]
    new_hospitalized = [0]
    new_intensive_care = [0]
    new_exit_intensive = [0]

    for time in range(1, lim_time):
        # effet confinement :
        #   if time == 200 :
        #   Kei = 0.1
        # *****************************
        day = model_day(recovered, exposed, infected, hospitalized, intensive_care, exit_intensive, dead, population,
                        new_infected, new_hospitalized, new_intensive_care, new_exit_intensive, Kpe, Kei, Kir, Kih,
                        Khic, Khr, Ked, Ker, Tei, Tir, Tih, Thr, Thic, Tice, time)

        recovered = day["recovered"]
        exposed = day["exposed"]
        infected = day["infected"]
        hospitalized = day["hospitalized"]
        intensive_care = day["intensive_care"]
        exit_intensive = day["exit"]
        dead = day["dead"]

        new_infected = day["new_infected"]
        new_hospitalized = day["new_hospitalized"]
        new_intensive_care = day["new_intensive"]
        new_exit_intensive = day["new_exit"]

    return {"recovered": recovered, "exposed": exposed, "infected": infected, "dead": dead, "hospitalized": dead,
            "intensive_care": intensive_care, "exit_intensive": exit_intensive, "exit_intensive": exit_intensive}


def model_day(recovered: [float], exposed: [float], infected: [float], hospitalized: [float], intensive_care: [float],
              exit_intensive: [float], dead: [float],
              new_infected: [float], new_hospitalized: [float], new_intensive_care: [float], new_exit_intensive: [float],
              Kei: float, Kir: float, Kih: float, Khic: float, Khr: float, Ked: float, Ker: float,
              Tei: int, Tir: int, Tih: int, Thr: int, Thic: int, Tice: int,
              time: int) -> {str: [float]}:
    """
    Models a day od simulation
    :param recovered:
    :param exposed:
    :param infected:
    :param hospitalized:
    :param intensive_care:
    :param exit_intensive:
    :param dead:
    :param new_infected:
    :param new_hospitalized:
    :param new_intensive_care:
    :param new_exit_intensive:
    :param Kei:
    :param Kir:
    :param Kih:
    :param Khic:
    :param Khr:
    :param Ked:
    :param Ker:
    :param Tei:
    :param Tir:
    :param Tih:
    :param Thr:
    :param Thic:
    :param Tice:
    :param time:
    :return:
    """
    # On copie les listes pour ne pas avoir de problème
    recover = deepcopy(recovered)
    expose = deepcopy(exposed)
    infect = deepcopy(infected)
    hospitalize = deepcopy(hospitalized)
    intensive = deepcopy(intensive_care)
    exi = deepcopy(exit_intensive)
    death = deepcopy(dead)

    new_infect = deepcopy(new_infected)
    new_hospitalize = deepcopy(new_hospitalized)
    new_intensive = deepcopy(new_intensive_care)
    new_exi = deepcopy(new_exit_intensive)

    # On commence par calculer les nouveaux arrivant de chaque service
    new_infect.append(exposed_to_infected(time, Kei, Tei, exposed, infected))
    new_hospitalize.append(infected_to_hospitalized(time, Kih, Tih, new_infected))
    new_intensive.append(hospitalized_to_intensive(time, Khic, Thic, new_hospitalized))
    new_exi.append(intensive_to_exi(time, Tice, new_intensive_care))

    # On calcule le nombre de personnes dans chaque service
    recover.append(
        recover_day(Tir, Thr, Kir, Khr, Ker, time, recovered, new_infected, new_hospitalized, exit_intensive))
    expose.append(expose_day(time, Kei, Tei, exposed, infected))
    infect.append(infect_day(time, Kei, Kir, Kih, Tei, Tir, Tih, exposed, infected, new_infected))
    hospitalize.append(
        hospitalize_day(time, Kih, Khic, Khr, Tih, Thic, Thr, hospitalized, new_infected, new_hospitalized))
    intensive.append(intensive_day(time, Khic, Thic, Tice, new_intensive_care, new_hospitalized))
    exi.append(exi_day(time, Ker, Ked, Tice, new_intensive_care, new_exit_intensive))
    # print(new_exit_intensive)
    death.append(death_day(dead, new_exit_intensive, Ked))

    return {"recovered": recover, "exposed": expose, "infected": infect, "hospitalized": hospitalize,
            "intensive": intensive, "exit": exi, "dead": death, "new_infected": new_infect,
            "new_hospitalized": new_hospitalize, "new_intensive": new_intensive_care, "new_exit": new_exi}


def expose_day(time: int, Kei: float, Tei: int, exposed: [float], infected: [float]) -> float:
    """
    Computes the volume of people who are exposed at day time
    :param time:
    :param Kei:
    :param Tei:
    :param exposed:
    :param infected:
    :return: Volume of the exposed population
    """

    e1 = exposed_to_infected(time, Kei, Tei, exposed, infected)

    return exposed[-1] - e1


#

def infect_day(time: int, Kei: float, Kir: float, Kih: float,
               Tei: int, Tir: int, Tih: int,
               exposed: [float], infected: [float], new_infected: [float]) -> float:
    """
    Computes the volume of people who are infected at day time
    :param time:
    :param Kei:
    :param Kir:
    :param Kih:
    :param Tei:
    :param Tir:
    :param Tih:
    :param exposed:
    :param infected:
    :param new_infected:
    :return:
    """

    i1 = exposed_to_infected(time, Kei, Tei, exposed, infected)
    i2 = recover_1(time, Kir, Tir, new_infected)
    i3 = infected_to_hospitalized(time, Kih, Tih, new_infected)

    return infected[-1] + i1 - i2 - i3


def recover_day(time: int, Kir: float, Khr: float, Ker: float,
                Tir: int, Thr: int,
                recovered: [float], new_infected: [float], new_hospitalized: [float], new_exit_intensive: [float]) -> float:
    """
    Computes the volume of people who recover at day time
    :param time:
    :param Kir:
    :param Khr:
    :param Ker:
    :param Tir:
    :param Thr:
    :param recovered:
    :param new_infected:
    :param new_hospitalized:
    :param new_exit_intensive:
    :return:
    """

    r1 = recover_1(time, Kir, Tir, new_infected)
    r2 = recover_2(time, Khr, Thr, new_hospitalized)
    r3 = recover_3(Ker, new_exit_intensive)

    return recovered[-1] + r1 + r2 + r3


def hospitalize_day(time: int, Kih: float, Khic: float, Khr: float,
                    Tih: int, Thic: int, Thr: int,
                    hospitalized: [float], new_infected: [float], new_hospitalized: [float]) -> float:
    """
    Computes the volume of people who are hospitalized at day time
    :param time:
    :param Kih:
    :param Khic:
    :param Khr:
    :param Tih:
    :param Thic:
    :param Thr:
    :param hospitalized:
    :param new_infected:
    :param new_hospitalized:
    :return:
    """

    h1 = infected_to_hospitalized(time, Kih, Tih, new_infected)
    h2 = hospitalized_to_intensive(time, Khic, Thic, new_hospitalized)
    h3 = recover_2(time, Khr, Thr, new_hospitalized)

    return hospitalized[-1] + h1 - h2 - h3


def intensive_day(time: int, Khic: float,
                  Thic: int, Tice: int,
                  new_intensive_care: [float], new_hospitalized: [float]) -> float:
    """
    Computes the volume of people in intensive care during day time
    :param time:
    :param Khic:
    :param Thic:
    :param Tice:
    :param new_intensive_care:
    :param new_hospitalized:
    :return:
    """
    i1 = hospitalized_to_intensive(time, Khic, Thic, new_hospitalized)
    i2 = intensive_to_exi(time, Tice, new_intensive_care)

    return new_intensive_care[-1] + i1 - i2


def exi_day(time: int, Ker: float, Ked: float,
            Tice: int,
            new_intensive_care: [float], exit_intensive: [float]) -> float:
    """
    Computes the number of people who exit intensive care during day time
    :param time:
    :param Ker:
    :param Ked:
    :param Tice:
    :param new_intensive_care:
    :param exit_intensive:
    :return:
    """
    e1 = intensive_to_exi(time, Tice, new_intensive_care)
    e2 = recover_3(Ker, exit_intensive)
    e3 = exi_to_death(Ked, exit_intensive)

    return exit_intensive[-1] + e1 - e2 - e3


def death_day(Ked: float, dead: [float], exit_intensive: [float]) -> float:
    """
    Computes the volume of dead people
    :param Ked:
    :param dead:
    :param exit_intensive:
    :return:
    """
    d = exi_to_death(Ked, exit_intensive)

    return dead[-1] + d


####

def exposed_to_infected(time: int, Kei: float, Tei: int,
                        exposed: [float], infected: [float]) -> float:
    """
    Computes the variation between exposed and infected
    :param time:
    :param Kei:
    :param Tei:
    :param exposed: history of esposed people so far
    :param infected: history of infected people so far
    :return:
    """
    if time < Tei:
        return 0
    else:
        return Kei * (exposed[-1] * infected[-Tei]) / exposed[0]


def recover_1(time: int, Kir: float, Tir: int, new_infected: [float]) -> float:
    """
    Computes the variation between infected and recovered
    :param time:
    :param Kir:
    :param Tir:
    :param new_infected:
    :return:
    """
    if time < Tir:
        return 0
    else:
        return Kir * new_infected[-Tir]


def recover_2(time, Khr, Thr, new_hospitalized):
    """
    Computes the variation between hospitalized and recovered
    :param time:
    :param Khr:
    :param Thr:
    :param new_hospitalized:
    :return:
    """
    if time < Thr:
        return 0
    else:
        return Khr * new_hospitalized[-Thr]


def recover_3(Ker, new_exit_intensive):
    """
    Computes the variation between exit of intensive care and recovered
    :param Ker:
    :param new_exit_intensive:
    :return:
    """
    return Ker * new_exit_intensive[-1]


def infected_to_hospitalized(time, Kih, Tih, new_infected):
    """
    Computes the variation between infected and hospitalized
    :param time:
    :param Kih:
    :param Tih:
    :param new_infected:
    :return:
    """

    if time < Tih:
        return 0
    else:
        return Kih * new_infected[-Tih]


def hospitalized_to_intensive(time, Khic, Thic, new_hospitalized):
    """
    Computes the variation between hospitalized and intensive care
    :param time:
    :param Khic:
    :param Thic:
    :param new_hospitalized:
    :return:
    """
    if time < Thic:
        return 0
    else:
        return Khic * new_hospitalized[-Thic]


def intensive_to_exi(time, Tice, new_intensive_care):
    """
    Computes the variation between intensive care and intensive care exit
    :param time:
    :param Tice:
    :param new_intensive_care:
    :return:
    """
    if time < Tice:
        return 0
    else:
        return new_intensive_care[-(Tice - 1)]


def exi_to_death(Ked, new_exit_intensive):
    """
    Computes the variation between intensive care exit and daths
    :param Ked:
    :param new_exit_intensive:
    :return:
    """
    return Ked * new_exit_intensive[-1]
