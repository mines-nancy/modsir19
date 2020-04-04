export function generer_dates(jour_0, nombre_de_jours)

{
    const options_date = { weekday: 'long', year: 'numeric', month: 'long', day:'numeric'} ;

    // Durée d'une journée en ms
    const un_jour = 86400000 ;
    //86400000?;

    // Sans le jour de la semaine
    // const options_date = {year: 'numeric', month: 'long', day:'numeric'}

    var tab_dates = new Array(nombre_de_jours)
    tab_dates[0] = Date.parse(jour_0.toDateString()) ;

    for (var i = 1 ; i < tab_dates.length ; i++){

        tab_dates[i] = tab_dates[i - 1] + un_jour ;
        tab_dates[i - 1] = new Date(tab_dates[i - 1]).toLocaleDateString('fr-FR', options_date) ;

    }

    tab_dates[tab_dates.length - 1] = new Date(tab_dates[tab_dates.length - 1]).toLocaleDateString('fr-FR', options_date);

    return(tab_dates)
}
