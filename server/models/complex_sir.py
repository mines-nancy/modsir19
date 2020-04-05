from copy import deepcopy


def complex_sir_v1(population: int,
                   Kpe: float, Kei: float, Kir: float, Kih: float, Khic: float, Khr: float, Ked: float, Ker: float,
                   Tei: int, Tir: int, Tih: int, Thr: int, Thic: int, Tice: int,
                   lim_time: int):
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

        recovered = day[0]
        exposed = day[1]
        infected = day[2]
        hospitalized = day[3]
        intensive_care = day[4]
        exit_intensive = day[5]
        dead = day[6]

        new_infected = day[7]
        new_hospitalized = day[8]
        new_intensive_care = day[9]
        new_exit_intensive = day[10]

    return recovered, exposed, infected, dead, hospitalized, intensive_care, exit_intensive


def model_day(recovered, exposed, infected, hospitalized, intensive_care, exit_intensive, dead,
              new_infected, new_hospitalized, new_intensive_care, new_exit_intensive, Kei, Kir, Kih, Khic, Khr,
              Ked, Ker, Tei, Tir, Tih, Thr, Thic, Tice, time):
    """
    Fonction qui fait évoluer le modèle sur une journée
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

    return recover, expose, infect, hospitalize, intensive, exi, death, new_infect, new_hospitalize, new_intensive, new_exi


#

def expose_day(time, Kei, Tei, exposed, infected):
    """
    Calcule le volume de gens exposés
    """

    e1 = exposed_to_infected(time, Kei, Tei, exposed, infected)

    return exposed[-1] - e1


#

def infect_day(time, Kei, Kir, Kih, Tei, Tir, Tih, exposed, infected, new_infected):
    """
    Calcule le volume de gens infectés
    """

    i1 = exposed_to_infected(time, Kei, Tei, exposed, infected)
    i2 = recover_1(time, Kir, Tir, new_infected)
    i3 = infected_to_hospitalized(time, Kih, Tih, new_infected)

    return infected[-1] + i1 - i2 - i3


def recover_day(Tir, Thr, Kir, Khr, Ker, time, recovered, new_infected, new_hospitalized, new_exit_intensive):
    """
    Calcule le volume de gens guéris
    """

    r1 = recover_1(time, Kir, Tir, new_infected)
    r2 = recover_2(time, Khr, Thr, new_hospitalized)
    r3 = recover_3(Ker, new_exit_intensive)

    return recovered[-1] + r1 + r2 + r3


def hospitalize_day(time, Kih, Khic, Khr, Tih, Thic, Thr, hospitalized, new_infected, new_hospitalized):
    """
    Calcule le volume de gens hospitalisés
    """

    h1 = infected_to_hospitalized(time, Kih, Tih, new_infected)
    h2 = hospitalized_to_intensive(time, Khic, Thic, new_hospitalized)
    h3 = recover_2(time, Khr, Thr, new_hospitalized)

    return hospitalized[-1] + h1 - h2 - h3


def intensive_day(time, Khic, Thic, Tice, new_intensive_care, new_hospitalized):
    i1 = hospitalized_to_intensive(time, Khic, Thic, new_hospitalized)
    i2 = intensive_to_exi(time, Tice, new_intensive_care)

    return new_intensive_care[-1] + i1 - i2


def exi_day(time, Ker, Ked, Tice, new_intensive_care, exit_intensive):
    e1 = intensive_to_exi(time, Tice, new_intensive_care)
    e2 = recover_3(Ker, exit_intensive)
    e3 = exi_to_death(Ked, exit_intensive)

    return exit_intensive[-1] + e1 - e2 - e3


def death_day(dead, exit_intensive, Ked):
    """
    Calcule le volume de gens morts
    """
    d = exi_to_death(Ked, exit_intensive)

    return dead[-1] + d


####

def exposed_to_infected(time, Kei, Tei, exposed, infected):
    """
    Calcule la variation entre exposed et infected
    """

    if time < Tei:
        return 0
    else:
        return Kei * (exposed[-1] * infected[-Tei]) / exposed[0]


def recover_1(time, Kir, Tir, new_infected):
    """
    Calcule la variation entre infected et recovered
    """
    if time < Tir:
        return 0
    else:
        return Kir * new_infected[-Tir]


def recover_2(time, Khr, Thr, new_hospitalized):
    """
    Calcule la variation entre hospitalized et recovered
    """
    if time < Thr:
        return 0
    else:
        return Khr * new_hospitalized[-Thr]


def recover_3(Ker, new_exit_intensive):
    """
    Calcule la variation entre exit_intensive et recovered
    """
    return Ker * new_exit_intensive[-1]


def infected_to_hospitalized(time, Kih, Tih, new_infected):
    """
    Calcule la variation entre infected et hospitalized
    """

    if time < Tih:
        return 0
    else:
        return Kih * new_infected[-Tih]


def hospitalized_to_intensive(time, Khic, Thic, new_hospitalized):
    """
    Calcule la variation entre hospitalized et intensive
    """
    if time < Thic:
        return 0
    else:
        return Khic * new_hospitalized[-Thic]


def intensive_to_exi(time, Tice, new_intensive_care):
    if time < Tice:
        return 0
    else:
        return new_intensive_care[-(Tice - 1)]


def exi_to_death(Ked, new_exit_intensive):
    return Ked * new_exit_intensive[-1]
