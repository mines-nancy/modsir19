import React from 'react';
import { Grid, Card, makeStyles } from '@material-ui/core';

import { GraphProvider } from '../../components/Graph/GraphProvider';
import { Node } from '../../components/Graph/Node';
import { Edges } from '../../components/Graph/Edges';
import { SwitchPercentField } from '../../components/fields/SwitchPercentField';

const sirEdgesColorCode = '#00688B';
const hEdgesColorCode = 'red';

const useStyles = makeStyles({
    card: {
        maxWidth: (props) => props.width || 350,
        backgroundColor: (props) => props.color,
    },
});

const BlockContainer = ({ children, ...props }) => {
    const classes = useStyles(props);

    return (
        <Card className={classes.card} elevation={3}>
            {children}
        </Card>
    );
};

const NodeWithPercentContainer = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const GridWithLeftGutter = ({ children, ...props }) => (
    <Grid container item xs={12}>
        <Grid item xs={2} />
        <Grid container item xs={10}>
            <Grid {...props}>{children}</Grid>
        </Grid>
    </Grid>
);

const colors = {
    incubation: {
        main: 'rgb(164, 18, 179)',
        bg: 'rgba(164, 18, 179, 0.6)',
    },
    normal_care: {
        main: 'rgb(255, 88, 132)',
        bg: 'rgba(255, 88, 132, 0.6)',
    },
    intensive_care: {
        main: 'rgb(54, 162, 235)',
        bg: 'rgba(54, 162, 235, 0.6)',
    },
    following_care: {
        main: 'rgb(54, 54, 255)',
        bg: 'rgba(54, 54, 255, 0.6)',
    },
    death: {
        main: 'rgb(88, 88, 88)',
        bg: 'rgba(88, 88, 88, 0.6)',
    },
    recovered: {
        main: 'rgb(88, 235, 88)',
        bg: 'rgba(88, 235, 88, 0.6)',
    },
};

export default ({
    blocks: {
        totalPopulation,
        exposedPopulation,
        incubation,
        infected,
        spontaneousRecovery,
        hospitalisation,
        medicalCare,
        intensiveCare,
        followUpCare,
        death,
        recovery,
    },
    disabled,
    hideSwitchers,
    linesMargin = '4rem 0',
}) => (
    <GraphProvider>
        <Grid container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Node
                name="population_totale"
                targets={[
                    {
                        name: 'population_saine_exposee',
                        options: {
                            color: sirEdgesColorCode,
                            path: 'straight',
                        },
                    },
                ]}
            >
                <BlockContainer color="white">{totalPopulation}</BlockContainer>
            </Node>
        </Grid>
        <Grid container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Node
                name="population_saine_exposee"
                targets={[
                    {
                        name: 'incubation',
                        options: {
                            color: sirEdgesColorCode,
                            path: 'straight',
                        },
                    },
                ]}
            >
                <BlockContainer color="rgba(255, 206, 86, 0.6)">{exposedPopulation}</BlockContainer>
            </Node>
        </Grid>
        <Grid container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <NodeWithPercentContainer>
                <Node name="incubation" targets={[]}>
                    <BlockContainer color={colors.incubation.bg}>{incubation}</BlockContainer>
                </Node>
                <Node
                    name="percent_incubation"
                    targets={
                        infected
                            ? [
                                  {
                                      name: 'infected',
                                      options: {
                                          color: sirEdgesColorCode,
                                          path: 'grid',
                                      },
                                  },
                              ]
                            : [
                                  {
                                      name: 'retablissement_spontane',
                                      options: {
                                          color: sirEdgesColorCode,
                                          path: 'grid',
                                      },
                                  },
                                  {
                                      name: 'hospitalisation',
                                      options: {
                                          color: sirEdgesColorCode,
                                          path: 'grid',
                                      },
                                  },
                              ]
                    }
                >
                    {!hideSwitchers && (
                        <SwitchPercentField
                            leftName="pc_ir"
                            rightName="pc_ih"
                            leftLabel="Rétablissements"
                            rightLabel="Hospitalisations"
                            leftColor={colors.recovered.main}
                            rightColor={colors.normal_care.main}
                            disabled={disabled}
                        />
                    )}
                </Node>
            </NodeWithPercentContainer>
        </Grid>
        {infected ? (
            <Grid container item xs={12} justify="center" style={{ margin: linesMargin }}>
                <NodeWithPercentContainer>
                    <Node name="infected" targets={[]}>
                        <BlockContainer>{infected}</BlockContainer>
                    </Node>
                    <Node
                        name="percent_infected"
                        targets={[
                            {
                                name: 'guerison',
                                options: {
                                    color: sirEdgesColorCode,
                                    path: 'grid',
                                    anchorStart: { y: -25, x: 0 },
                                    anchorEnd: { x: 25 },
                                    startSocket: 'left',
                                },
                            },
                            {
                                name: 'soins_medicaux',
                                options: {
                                    color: hEdgesColorCode,
                                    path: 'grid',
                                },
                            },
                            {
                                name: 'soins_intensifs',
                                options: {
                                    color: hEdgesColorCode,
                                    path: 'grid',
                                },
                            },
                        ]}
                    />
                </NodeWithPercentContainer>
            </Grid>
        ) : (
            <>
                <Grid container item xs={12} justify="center" style={{ margin: linesMargin }}>
                    <Grid item xs={1} />
                    <Grid container item xs={5} justify="flex-start">
                        <Node
                            name="retablissement_spontane"
                            alignmentBase="left"
                            targets={[
                                {
                                    name: 'guerison',
                                    options: {
                                        color: sirEdgesColorCode,
                                        path: 'straight',
                                        anchorStart: { x: 25 },
                                        anchorEnd: { x: 25 },
                                    },
                                },
                            ]}
                        >
                            <BlockContainer>{spontaneousRecovery}</BlockContainer>
                        </Node>
                    </Grid>

                    <Grid container item xs={5} justify="flex-end">
                        <NodeWithPercentContainer>
                            <Node name="hospitalisation" targets={[]}>
                                <BlockContainer>{hospitalisation}</BlockContainer>
                            </Node>
                            <Node
                                name="percent_hospital"
                                targets={[
                                    {
                                        name: 'soins_medicaux',
                                        options: {
                                            color: hEdgesColorCode,
                                            path: 'grid',
                                        },
                                    },
                                    {
                                        name: 'soins_intensifs',
                                        options: {
                                            color: hEdgesColorCode,
                                            path: 'grid',
                                        },
                                    },
                                ]}
                            >
                                {!hideSwitchers && (
                                    <SwitchPercentField
                                        leftName="pc_sm"
                                        rightName="pc_si"
                                        leftLabel="Soins médicaux"
                                        rightLabel="Soins intensifs"
                                        leftColor={colors.normal_care.main}
                                        rightColor={colors.intensive_care.main}
                                        disabled={disabled}
                                    />
                                )}
                            </Node>
                        </NodeWithPercentContainer>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            </>
        )}

        <GridWithLeftGutter container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Grid container item xs={5} justify="center">
                <NodeWithPercentContainer>
                    <Node name="soins_medicaux" targets={[]}>
                        <BlockContainer color={colors.normal_care.bg}>{medicalCare}</BlockContainer>
                    </Node>
                    <Node
                        name="percent_soins_medicaux"
                        targets={[
                            {
                                name: 'post_soins_medicaux',
                                options: {
                                    color: hEdgesColorCode,
                                    path: 'straight',
                                },
                            },
                            {
                                name: 'soins_intensifs',
                                options: {
                                    color: hEdgesColorCode,
                                },
                            },
                        ]}
                    >
                        {!hideSwitchers && (
                            <SwitchPercentField
                                leftName="pc_sm_other"
                                rightName="pc_sm_si"
                                leftLabel="Sortie ou Décès"
                                rightLabel="Soins intensifs"
                                leftColor="grey"
                                rightColor={colors.intensive_care.main}
                                disabled={disabled}
                            />
                        )}
                    </Node>
                </NodeWithPercentContainer>
            </Grid>
            <Grid item xs={2} />
            <Grid container item xs={5} justify="center">
                <Node
                    name="soins_intensifs"
                    targets={[
                        {
                            name: 'percent_si',
                            options: {
                                color: hEdgesColorCode,
                                path: 'straight',
                            },
                        },
                    ]}
                >
                    <BlockContainer color={colors.intensive_care.bg}>
                        {intensiveCare}
                    </BlockContainer>
                </Node>
            </Grid>
        </GridWithLeftGutter>

        <GridWithLeftGutter container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Grid container item xs={5} justify="center" alignItems="center">
                <Node
                    name="post_soins_medicaux"
                    targets={[
                        {
                            name: 'deces',
                            options: {
                                path: 'straight',
                                color: hEdgesColorCode,
                                anchorStart: { x: '100%', y: '50%' },
                                anchorEnd: { x: '0%', y: '50%' },
                            },
                        },
                        {
                            name: 'gueris_ou_soins_suite',
                            options: {
                                color: hEdgesColorCode,
                                path: 'grid',
                            },
                        },
                    ]}
                >
                    {!hideSwitchers && (
                        <SwitchPercentField
                            leftName="pc_sm_out"
                            rightName="pc_sm_dc"
                            leftLabel="Sortie"
                            rightLabel="Décès"
                            leftColor={colors.recovered.main}
                            rightColor={colors.death.main}
                            disabled={disabled}
                        />
                    )}
                </Node>
            </Grid>
            <Grid container item xs={2} justify="center">
                <Node name="deces">
                    <BlockContainer color={colors.death.bg}>{death}</BlockContainer>
                </Node>
            </Grid>
            <Grid container item xs={5} justify="center" alignItems="center">
                <Node
                    name="percent_si"
                    targets={[
                        {
                            name: 'gueris_ou_soins_suite',
                            options: {
                                color: hEdgesColorCode,
                                path: 'grid',
                            },
                        },
                        {
                            name: 'deces',
                            options: {
                                path: 'straight',
                                color: hEdgesColorCode,
                                anchorStart: { x: '0%', y: '50%' },
                                anchorEnd: { x: '100%', y: '50%' },
                            },
                        },
                    ]}
                >
                    {!hideSwitchers && (
                        <SwitchPercentField
                            leftName="pc_si_dc"
                            rightName="pc_si_out"
                            leftLabel="Décès"
                            rightLabel="Sortie"
                            leftColor={colors.death.main}
                            rightColor={colors.recovered.main}
                            disabled={disabled}
                        />
                    )}
                </Node>
            </Grid>
        </GridWithLeftGutter>

        <GridWithLeftGutter container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Node
                name="gueris_ou_soins_suite"
                targets={[
                    {
                        name: 'soins_suite',
                        options: {
                            color: hEdgesColorCode,
                            path: 'grid',
                        },
                    },
                    {
                        name: 'after_soins_suite',
                        options: {
                            color: hEdgesColorCode,
                            path: 'grid',
                        },
                    },
                ]}
            >
                {!hideSwitchers && (
                    <SwitchPercentField
                        leftName="pc_h_r"
                        rightName="pc_h_ss"
                        leftLabel="Guérison"
                        rightLabel="Soins de suite"
                        leftColor={colors.recovered.main}
                        rightColor={colors.following_care.main}
                        disabled={disabled}
                    />
                )}
            </Node>
        </GridWithLeftGutter>

        <GridWithLeftGutter container item xs={12} justify="center">
            <Grid item xs={7} />
            <Grid container item xs={5}>
                <Node
                    name="soins_suite"
                    targets={[
                        {
                            name: 'after_soins_suite',
                            options: {
                                color: hEdgesColorCode,
                                path: 'grid',
                            },
                        },
                    ]}
                >
                    <BlockContainer color={colors.following_care.bg}>{followUpCare}</BlockContainer>
                </Node>
            </Grid>
        </GridWithLeftGutter>

        <GridWithLeftGutter container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Node
                name="after_soins_suite"
                targets={[
                    {
                        name: 'guerison',
                        options: {
                            color: hEdgesColorCode,
                            path: 'grid',
                        },
                    },
                ]}
            ></Node>
        </GridWithLeftGutter>

        <Grid container item xs={12} justify="center" style={{ margin: linesMargin }}>
            <Grid item xs={1} />
            <Grid container item xs={11} justify="flex-start">
                <Node name="guerison">
                    <BlockContainer color={colors.recovered.bg}>{recovery}</BlockContainer>
                </Node>
            </Grid>
            <Grid container item xs={6} justify="center" />
        </Grid>
        <Edges />
    </GraphProvider>
);
