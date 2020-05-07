const round = (x) => Math.round(x * 100) / 100;

const mapObject = (obj, keys, fn) =>
    obj
        ? keys.reduce((acc, key) => {
              acc[key] = fn(obj[key]);
              return acc;
          }, {})
        : {};

export const defaultParameters = {
    population: 1000000,
    patient0: 40,
    kpe: 100,
    r0: 3.31,
    dm_incub: 4,
    dm_r: 9,
    dm_h: 6,
    dm_sm: 6,
    dm_si: 9,
    dm_ss: 14,
    pc_ir: 98,
    pc_ih: round(100 - 98),
    pc_sm: 84,
    pc_si: round(100 - 84),
    pc_sm_si: 21,
    pc_sm_other: round(100 - 21), // This field is not sent to the API
    pc_sm_dc: 25,
    pc_sm_out: round(100 - 25),
    pc_si_dc: 40,
    pc_si_out: 60,
    pc_h_ss: 20,
    pc_h_r: round(100 - 20),
    lim_time: 250,
    start_date: new Date(2020, 0, 6),
};

export const formatParametersForModel = ({ start_date, ...parameters }) =>
    removeMedicalCareSplit({
        ...parameters,
        ...computeRBetaFromR0(parameters),
        ...mapObject(parameters, percentFields, (x) => round(x / 100)),
        start_time: 0,
    });

export const percentFields = [
    'kpe',
    'pc_ir',
    'pc_ih',
    'pc_sm',
    'pc_si',
    'pc_sm_si',
    'pc_sm_out',
    'pc_sm_dc',
    'pc_sm_other',
    'pc_si_dc',
    'pc_si_out',
    'pc_h_ss',
    'pc_h_r',
];

export const defaultTimeframes = [
    { ...defaultParameters, start_time: 0, name: 'Période initiale', enabled: true },
    {
        ...defaultParameters,
        r0: 0.4,
        start_date: new Date(2020, 2, 16),
        name: 'Confinement',
        enabled: true,
    },
    {
        ...defaultParameters,
        r0: 1.1,
        start_date: new Date(2020, 4, 11),
        name: 'Déconfinement',
        enabled: true,
    },
];

export const removeMedicalCareSplit = ({ pc_sm_other, ...parameters }) => ({
    ...parameters,
    pc_sm_dc: parameters.pc_sm_dc * pc_sm_other,
    pc_sm_out: parameters.pc_sm_out * pc_sm_other,
});

export const computeRBetaFromR0 = ({ r0, dm_r }) => ({
    r: 1.0,
    beta: r0 / dm_r,
});

export const extractGraphTimeframes = (timeframes) =>
    timeframes
        .slice(1)
        .filter((t) => t.enabled)
        .map((timeframe) => ({
            date: timeframe.start_date,
            label: timeframe.name,
        }));
