from copy import deepcopy


def model(population, kpe, kem, kmg, kmh, khr, khg, krd, krg, tem, tmg, tmh, thg, thr, trsr, lim_time):
    '''
    Fonction principale
    '''

    recovered = [0]
    exposed = [kpe*(population - 1)]
    infected = [1]
    hospitalized = [0]
    intensive_care = [0]
    exit_intensive_care = [0]
    dead = [0]

    new_infected = [1]
    new_hospitalized = [0]
    new_intensive_care = [0]
    new_exit_intensive = [0]

    for time in range(1, lim_time):

        day = model_day(recovered, exposed, infected, hospitalized, intensive_care, exit_intensive_care, dead, population,
                        new_infected, new_hospitalized, new_intensive_care, new_exit_intensive, kpe, kem, kmg, kmh, khr, khg, krd, krg,
                        tem, tmg, tmh, thg, thr, trsr, time)

        recovered = day[0]
        exposed = day[1]
        infected = day[2]
        hospitalized = day[3]
        intensive_care = day[4]
        exit_intensive_care = day[5]
        dead = day[6]

        new_infected = day[7]
        new_hospitalized = day[8]
        new_intensive_care = day[9]
        new_exit_intensive = day[10]

    return recovered, exposed, infected, dead, hospitalized, intensive_care, exit_intensive_care


def model_day(recovered, exposed, infected, hospitalized, intensive_care, exit_intensive_care, dead, population,
              new_infected, new_hospitalized, new_intensive_care, new_exit_intensive, kpe, kem, kmg, kmh, khr, khg,
              krd, krg, tem, tmg, tmh, thg, thr, trsr, time):
    '''
    Fonction qui fait évoluer le modèle sur une journée
    '''

    # On copie les listes pour ne pas avoir de problème
    recover = deepcopy(recovered)
    expose = deepcopy(exposed)
    infect = deepcopy(infected)
    hospitalize = deepcopy(hospitalized)
    intensive = deepcopy(intensive_care)
    exi = deepcopy(exit_intensive_care)
    death = deepcopy(dead)

    new_infect = deepcopy(new_infected)
    new_hospitalize = deepcopy(new_hospitalized)
    new_intensive = deepcopy(new_intensive_care)
    new_exi = deepcopy(new_exit_intensive)

    # On commence par calculer les nouveaux arrivant de chaque service
    new_infect.append(exposed_to_infected(time, kem, tem, exposed, infected))
    new_hospitalize.append(infected_to_hospitalized(
        time, kmh, tmh, new_infected))
    new_intensive.append(hospitalized_to_intensive(
        time, khr, thr, new_hospitalized))
    new_exi.append(intensive_to_exi(time, trsr, new_intensive_care))

    # On calcule le nombre de personnes dans chaque service
    recover.append(recover_day(tmg, thg, kmg, khg, krg, time,
                               recovered, new_infected, new_hospitalized, exit_intensive_care))
    expose.append(expose_day(time, kem, tem, exposed, infected))
    infect.append(infect_day(time, kem, kmg, kmh, tem, tmg,
                             tmh, exposed, infected, new_infected))
    hospitalize.append(hospitalize_day(time, kmh, khr, khg, tmh,
                                       thr, thg, hospitalized, new_infected, new_hospitalized))
    intensive.append(intensive_day(time, khr, thr, trsr,
                                   new_intensive_care, new_hospitalized))
    exi.append(exi_day(time, krg, krd, trsr,
                       new_intensive_care, new_exit_intensive))
    # print(new_exit_intensive)
    death.append(death_day(dead, new_exit_intensive, krd))

    return recover, expose, infect, hospitalize, intensive, exi, death, new_infect, new_hospitalize, new_intensive, new_exi


#

def expose_day(time, kem, tem, exposed, infected):
    '''
    Calcule le volume de gens exposés
    '''

    e1 = exposed_to_infected(time, kem, tem, exposed, infected)

    return exposed[-1] - e1


#

def infect_day(time, kem, kmg, kmh, tem, tmg, tmh, exposed, infected, new_infected):
    '''
    Calcule le volume de gens infectés
    '''

    i1 = exposed_to_infected(time, kem, tem, exposed, infected)
    i2 = recover_1(time, kmg, tmg, new_infected)
    i3 = infected_to_hospitalized(time, kmh, tmh, new_infected)

    return infected[-1] + i1 - i2 - i3

#


def recover_day(tmg, thg, kmg, khg, krg, time, recovered, new_infected, new_hospitalized, new_exit_intensive):
    '''
    Calcule le volume de gens guéris
    '''

    r1 = recover_1(time, kmg, tmg, new_infected)
    r2 = recover_2(time, khg, thg, new_hospitalized)
    r3 = recover_3(krg, new_exit_intensive)

    return recovered[-1] + r1 + r2 + r3


#

def hospitalize_day(time, kmh, khr, khg, tmh, thr, thg, hospitalized, new_infected, new_hospitalized):
    '''
    Calcule le volume de gens hospitalisés
    '''

    h1 = infected_to_hospitalized(time, kmh, tmh, new_infected)
    h2 = hospitalized_to_intensive(time, khr, thr, new_hospitalized)
    h3 = recover_2(time, khg, thg, new_hospitalized)

    return hospitalized[-1] + h1 - h2 - h3

#


def intensive_day(time, khr, thr, trsr, new_intensive_care, new_hospitalized):

    i1 = hospitalized_to_intensive(time, khr, thr, new_hospitalized)
    i2 = intensive_to_exi(time, trsr, new_intensive_care)

    return new_intensive_care[-1] + i1 - i2

#


def exi_day(time, krg, krd, trsr, new_intensive_care, exit_intensive_care):

    e1 = intensive_to_exi(time, trsr, new_intensive_care)
    e2 = recover_3(krg, exit_intensive_care)
    e3 = exi_to_death(krd, exit_intensive_care)

    return exit_intensive_care[-1] + e1 - e2 - e3


#

def death_day(dead, exit_intensive_care, krd):
    '''
    Calcule le volume de gens morts
    '''
    d = exi_to_death(krd, exit_intensive_care)

    return dead[-1] + d


#

def exposed_to_infected(time, kem, tem, exposed, infected):
    '''
    Calcule la variation entre exposed et infected
    '''

    if time < tem:
        return 0
    else:
        return kem * (exposed[-1] * infected[-tem]) / exposed[0]


def recover_1(time, kmg, tmg, new_infected):
    '''
    Calcule la variation entre infected et recovered
    '''
    if time < tmg:
        return 0
    else:
        return kmg * new_infected[-tmg]


def recover_2(time, khg, thg, new_hospitalized):
    '''
    Calcule la variation entre hospitalized et recovered
    '''
    if time < thg:
        return 0
    else:
        return khg * new_hospitalized[-thg]


def recover_3(krg, new_exit_intensive):
    '''
    Calcule la variation entre exit_intensive_care et recovered
    '''
    return krg * new_exit_intensive[-1]


def infected_to_hospitalized(time, kmh, tmh, new_infected):
    '''
    Calcule la variation entre infected et hospitalized
    '''

    if time < tmh:
        return 0
    else:
        return kmh * new_infected[-tmh]


def hospitalized_to_intensive(time, khr, thr, new_hospitalized):
    '''
    Calcule la variation entre hospitalized et intensive
    '''
    if time < thr:
        return 0
    else:
        return khr * new_hospitalized[-thr]


def intensive_to_exi(time, trsr, new_intensive_care):

    if time < trsr:
        return 0
    else:
        return new_intensive_care[-(trsr-1)]


def exi_to_death(krd, new_exit_intensive):

    return krd * new_exit_intensive[-1]

#


if __name__ == "__main__":

    import matplotlib.pyplot as plt

    legende = ['recovered', 'exposed', 'infected', 'dead',
               'hospitalized', 'intensive_care', 'exit_intensive_care']

    population = 500000  # population

    kpe = 0.6  # part pop exposée
    kem = 0.24  # exposés infectés
    kmg = 0.81  # part d'inféctés guéris
    kmh = 1-kmg  # part d'infectés hospitalisés
    khr = 0.7  # part d'hospitalisés en réa
    khg = 1 - khr  # part d'hospitalisés guéris
    krd = 1  # part de réa mort
    krg = 1 - krd  # part de réa guéris

    tem = 6  # jours d'incubation
    tmg = 9  # jours de maladie avant guérison
    tmh = 6  # jours avant hospitalisation
    thg = 6  # jours avant sortie d'hopital
    thr = 1  # jours avant entrée en réa
    trsr = 10  # jours avant de sortir de la réa

    lim_time = 250

    a = model(population, kpe, kem, kmg, kmh, khr, khg,
              krd, krg, tem, tmg, tmh, thg, thr, lim_time)

    x = [i for i in range(len(a[0]))]
    for i in range(len(a[0:4])):
        plt.plot(x, a[i], label=legende[i])
    plt.legend()
    plt.show()

    for i in range(4, 7):
        print(legende[i])
        plt.plot(x, a[i], label=legende[i])
    plt.legend()
    plt.show()
