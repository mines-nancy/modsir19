def run_model(variables: [float], parameters, rules, **kwargs):

    parameters = model_parameters

    beta_pre, beta_post, patient0, dm_h = variables
    #print(f'beta_pre={beta_pre} beta_post={beta_post}')
    parameters.update({'patient0': patient0,
                       'beta': beta_pre,
                       'dm_h': dm_h})

    # Changement par rapport à la version de PEM en reprenant l'ensemble des règles du confinement
    confinement = get_default_params()['other']['confinement']

    rules = [RuleChangeField(confinement,  'beta',  beta_post),
             RuleChangeField(confinement,  'r',  1.0)]

    lists = run_sir_h(parameters, rules)

    spike_height = max(lists["SI"])
    spike_date = lists["SI"].index(spike_height)

    return spike_height, spike_date, lists["SI"]


def Model(parameters, **kwargs):

    return t, SE, INCUB, I, SM, SI, R, DC, R0_over_time