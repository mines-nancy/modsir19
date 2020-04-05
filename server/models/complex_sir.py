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
    :param lim_time: Number of simulated days

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
        
        recovered.append(day["recovered"])
        exposed.append(day["exposed"])
        infected.append(day["infected"])
        hospitalized.append(day["hospitalized"])
        intensive_care.append(day["intensive_care"])
        exit_intensive.append(day["exit_intensive"])
        dead.append(day["dead"])

        new_infected.append(day["new_infected"])
        new_hospitalized.append(day["new_hospitalized"])
        new_intensive_care.append(day["new_intensive_care"])
        new_exit_intensive.append(day["new_exit_intensive"])

    return {"recovered": recovered, "exposed": exposed, "infected": infected, "dead": dead, "hospitalized": dead,
            "intensive_care": intensive_care, "exit_intensive": exit_intensive, "exit_intensive": exit_intensive}


def model_day(recovered: [float], exposed: [float], infected: [float], hospitalized: [float], intensive_care: [float],
              exit_intensive: [float], dead: [float],
              new_infected: [float], new_hospitalized: [float], new_intensive_care: [float], new_exit_intensive: [float],
              Kei: float, Kir: float, Kih: float, Khic: float, Khr: float, Ked: float, Ker: float,
              Tei: int, Tir: int, Tih: int, Thr: int, Thic: int, Tice: int,
              time: int) -> {str: [float]}:
    """
    Models a day of simulation
    :param recovered: Time series of the number of people who recovered so far (one day time step)
    :param exposed: Time series of the number of people who are exposed each day (one day time step)
    :param infected: Time series of the number of people who were infected each day so far (one day time step)
    :param hospitalized: Time series of the number of people who were hospitalized each day so far (one day time step)
    :param intensive_care: Time series of the number of people who were in intensive care unit each day so far (one day time step)
    :param exit_intensive: Time series of the number of people who were in their last day of intensive care each day so far (one day time step)
    :param dead: Time series of the number of people who died each day so far (one day time step)
    :param new_infected: Time series of the number of new people infected 
    :param new_hospitalized: Time series of the number of new people hospitalized
    :param new_intensive_care: Time series of the number of new people in the intensive care unit
    :param new_exit_intensive: Time series of the number of people who go out of intensive care
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
    :param time: Day after start day the simulation is currently at
    
    :return:
    """
    
    # On commence par calculer les nouveaux arrivant de chaque service
    new_infect = exposed_to_infected(time, Kei, Tei, exposed, infected)
    new_hospitalize = infected_to_hospitalized(time, Kih, Tih, new_infected)
    new_intensive = hospitalized_to_intensive(time, Khic, Thic, new_hospitalized)
    new_exi = intensive_to_exi(time, Tice, new_intensive_care)

    # On calcule le nombre de personnes dans chaque service
    recover = recover_day(Tir, Thr, Kir, Khr, Ker, time, recovered, new_infected, new_hospitalized, exit_intensive)
    expose = expose_day(time, Kei, Tei, exposed, infected)
    infect = infect_day(time, Kei, Kir, Kih, Tei, Tir, Tih, exposed, infected, new_infected)
    hospitalize = hospitalize_day(time, Kih, Khic, Khr, Tih, Thic, Thr, hospitalized, new_infected, new_hospitalized)
    intensive = intensive_day(time, Khic, Thic, Tice, new_intensive_care, new_hospitalized)
    exi = exi_day(time, Ker, Ked, Tice, new_intensive_care, new_exit_intensive)
    # print(new_exit_intensive)
    death  = death_day(dead, new_exit_intensive, Ked))

    return {"recovered": recover, "exposed": expose, "infected": infect, "hospitalized": hospitalize,
            "intensive": intensive, "exit": exi, "dead": death, "new_infected": new_infect,
            "new_hospitalized": new_hospitalize, "new_intensive": new_intensive_care, "new_exit": new_exi}


def expose_day(time: int, Kei: float, Tei: int, exposed: [float], infected: [float]) -> float:
    """
    Computes the volume of people who are exposed at day time
    :param time: Day after start day the simulation is currently at
    :param Kei: Coefficient from exposed to infected
    :param Tei: Delay between being infected and infecting others
    :param exposed: Time series of the number of people who are exposed each day (one day time step)
    :param infected: Time series of the number of people who were infected each day so far (one day time step)
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
    :param time: Day after start day the simulation is currently at
    :param Kei: Coefficient from exposed to infected
    :param Kir: Coefficient from infected to recovered
    :param Kih: Coefficient from infected to hospitalized
    :param Tei: Delay between being infected and infecting others
    :param Tir: Delay between being infected and recovering
    :param Tih: Delay between being infected and being sent to gospital
    :param exposed: Time series of the number of people who are exposed each day (one day time step)
    :param infected: Time series of the number of people who were infected each day so far (one day time step)
    :param new_infected: Time series of the number of new people infected
    :return: Volume of the infected population
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
    :param time: Day after start day the simulation is currently at
    :param Kir: Coefficient from infected to recovered
    :param Khr: Coefficient from hospitalized to recovered
    :param Ker: Coefficient from exit intensive to recovered
    :param Tir: Delay between being infected and recovering
    :param Thr: Delay between being sent to gospital and recovering
    :param recovered: Time series of the number of people who recovered so far (one day time step)
    :param new_infected: Time series of the number of new people infected 
    :param new_hospitalized: Time series of the number of new people hospitalized
    :param new_exit_intensive: Time series of the number of people who go out of intensive care
    :return: Volume of the recovered population
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
    :param time: Day after start day the simulation is currently at
    :param Kih: Coefficient from infected to hospitalized
    :param Khic: Coefficient from hospitalized to intensive care
    :param Khr: Coefficient from hospitalized to recovered
    :param Tih: Delay between being infected and being sent to gospital
    :param Thic: Delay between being sent to gospital and then sent to intensive care
    :param Thr: Delay between being sent to gospital and recovering
    :param hospitalized: Time series of the number of people who were hospitalized each day so far (one day time step)
    :param new_infected: Time series of the number of new people infected 
    :param new_hospitalized: Time series of the number of new people hospitalized
    :return: Volume of the hospitalized population
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
    :param time: Day after start day the simulation is currently at
    :param Khic: Coefficient from hospitalized to intensive care
    :param Thic: Delay between being sent to gospital and then sent to intensive care
    :param Tice: Delay between entering and exiting intensive care services
    :param new_intensive_care: Time series of the number of new people in the intensive care unit
    :param new_hospitalized: Time series of the number of new people hospitalized
    :return: Volume of the people in intensive care
    """
    i1 = hospitalized_to_intensive(time, Khic, Thic, new_hospitalized)
    i2 = intensive_to_exi(time, Tice, new_intensive_care)

    return new_intensive_care[-1] + i1 - i2


def exi_day(time: int, Ker: float, Ked: float,
            Tice: int,
            new_intensive_care: [float], exit_intensive: [float]) -> float:
    """
    Computes the number of people who exit intensive care during day time
    :param time: Day after start day the simulation is currently at
    :param Ker: Coefficient from exit intensive to recovered
    :param Ked: Coefficient from exit intensive to dead
    :param Tice: Delay between entering and exiting intensive care services
    :param new_intensive_care: Time series of the number of new people in the intensive care unit
    :param exit_intensive: Time series of the number of people who were in their last day of intensive care each day so far (one day time step)
    :return: Volume of people in exit
    """
    e1 = intensive_to_exi(time, Tice, new_intensive_care)
    e2 = recover_3(Ker, exit_intensive)
    e3 = exi_to_death(Ked, exit_intensive)

    return exit_intensive[-1] + e1 - e2 - e3


def death_day(Ked: float, dead: [float], exit_intensive: [float]) -> float:
    """
    Computes the volume of dead people
    :param Ked: Coefficient from exit intensive to dead
    :param dead: Time series of the number of people who died each day so far (one day time step)
    :param exit_intensive: Time series of the number of people who were in their last day of intensive care each day so far (one day time step)
    :return: Volume of the dead population
    """
    d = exi_to_death(Ked, exit_intensive)

    return dead[-1] + d


####

def exposed_to_infected(time: int, Kei: float, Tei: int,
                        exposed: [float], infected: [float]) -> float:
    """
    Computes the variation between exposed and infected
    :param time: Day after start day the simulation is currently at
    :param Kei: Coefficient from exposed to infected
    :param Tei: Delay between being infected and infecting others
    :param exposed: history of esposed people so far
    :param infected: history of infected people so far
    :return: number of people who go from  exposed to infected
    """
    if time < Tei:
        return 0
    else:
        return Kei * (exposed[-1] * infected[-Tei]) / exposed[0]


def recover_1(time: int, Kir: float, Tir: int, new_infected: [float]) -> float:
    """
    Computes the variation between infected and recovered
    :param time: Day after start day the simulation is currently at
    :param Kir: Coefficient from infected to recovered
    :param Tir: Delay between being infected and recovering
    :param new_infected: Time series of the number of new people infected 
    :return: number of people who go from infected to recovered
    """
    if time < Tir:
        return 0
    else:
        return Kir * new_infected[-Tir]


def recover_2(time, Khr, Thr, new_hospitalized):
    """
    Computes the variation between hospitalized and recovered
    :param time: Day after start day the simulation is currently at
    :param Khr: Coefficient from hospitalized to recovered
    :param Thr: Delay between being sent to gospital and recovering
    :param new_hospitalized: Time series of the number of new people hospitalized
    :return: number of people who go from hospitalized to recovered
    """
    if time < Thr:
        return 0
    else:
        return Khr * new_hospitalized[-Thr]


def recover_3(Ker, new_exit_intensive):
    """
    Computes the variation between exit of intensive care and recovered
    :param Ker: Coefficient from exit intensive to recovered
    :param new_exit_intensive: Time series of the number of people who go out of intensive care
    :return: number of people who go from exit to recovered
    """
    return Ker * new_exit_intensive[-1]


def infected_to_hospitalized(time, Kih, Tih, new_infected):
    """
    Computes the variation between infected and hospitalized
    :param time: Day after start day the simulation is currently at
    :param Kih: Coefficient from infected to hospitalized
    :param Tih: Delay between being infected and being sent to gospital
    :param new_infected: Time series of the number of new people infected 
    :return: number of people who go from infected to hospitalized
    """

    if time < Tih:
        return 0
    else:
        return Kih * new_infected[-Tih]


def hospitalized_to_intensive(time, Khic, Thic, new_hospitalized):
    """
    Computes the variation between hospitalized and intensive care
    :param time: Day after start day the simulation is currently at
    :param Khic: Coefficient from hospitalized to intensive care
    :param Thic: Delay between being sent to gospital and then sent to intensive care
    :param new_hospitalized: Time series of the number of new people hospitalized
    :return: number of people who go from hospitalized to intensive
    """
    if time < Thic:
        return 0
    else:
        return Khic * new_hospitalized[-Thic]



def intensive_to_exi(time, Tice, new_intensive_care):
    """
    Computes the variation between intensive care and intensive care exit
    :param time: Day after start day the simulation is currently at
    :param Tice: Delay between entering and exiting intensive care services
    :param new_intensive_care: Time series of the number of new people in the intensive care unit
    :return: number of people who go from intensive care to exit
    """
    if time < Tice:
        return 0
    else:
        return new_intensive_care[-(Tice - 1)]


def exi_to_death(Ked, new_exit_intensive):
    """
    Computes the variation between intensive care exit and daths
    :param Ked: Coefficient from exit intensive to dead
    :param new_exit_intensive: Time series of the number of people who go out of intensive care
    :return: number of people who go from exit to dead
    """
    return Ked * new_exit_intensive[-1]

