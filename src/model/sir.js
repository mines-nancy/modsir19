export const simpleSir = (params) => {
    const { s, i, r } = params;

    const result = s * i * r;
    return result;
};

export const dummyModel = (s0, lambda, beta) => {
    const maxTime = 30;
    const i0 = 1 - s0;
    const r0 = 0;

    var saints = [];
    var infectes = [];
    var retires = [];

    saints[0] = s0;
    infectes[0] = i0;
    retires[0] = r0;

    for (let time = 1; time < maxTime; time++) {
        saints[time] = saints[time - 1] * (1 - beta);
        infectes[time] = infectes[time - 1] * (1 - 1 / lambda) + saints[time - 1] * beta;
        retires[time] = infectes[time - 1] * (1 / lambda) + retires[time - 1];
    }

    return { saints, infectes, retires };
};
