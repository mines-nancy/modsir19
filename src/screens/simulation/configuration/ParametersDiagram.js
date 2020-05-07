import React from 'react';
import { CardContent } from '@material-ui/core';

import { TotalPopulationBlock, ExposedPopulationBlock, AverageDurationBlock } from '../blocks';
import Diagram from '../Diagram';

const ParametersDiagram = ({ expanded, setExpanded }) => (
    <Diagram
        blocks={{
            totalPopulation: <TotalPopulationBlock expanded={expanded} setExpanded={setExpanded} />,
            exposedPopulation: <ExposedPopulationBlock />,
            incubation: <AverageDurationBlock name="dm_incub" label="Incubation" />,
            spontaneousRecovery: (
                <AverageDurationBlock name="dm_r" label="Rétablissement spontané" />
            ),
            hospitalisation: <AverageDurationBlock name="dm_h" label="Hospitalisation" />,
            medicalCare: <AverageDurationBlock name="dm_sm" label="Soins médicaux" />,
            intensiveCare: <AverageDurationBlock name="dm_si" label="Soins intensifs" />,
            followUpCare: <AverageDurationBlock name="dm_ss" label="Soins de suite" />,
            death: <CardContent>Décès</CardContent>,
            recovery: <CardContent>Guérison</CardContent>,
        }}
    />
);

export default ParametersDiagram;
