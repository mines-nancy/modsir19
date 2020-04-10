def cum_tab(tab) :
    
    assert len(tab) > 0, "Le tableau est vide"
    
    cum_tab = [tab[0]]
    
    for i in range(1, len(tab)) :
        cum_tab.append(cum_tab[i - 1] + tab[i])
    
    return cum_tab