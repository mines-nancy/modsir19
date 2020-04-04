import React, { useState } from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));


export const Sliders = () => {
    
    // Kpe, Kei, Kir, Kih, Khic, Khr, Ked, Ker, Tei, Tir, Tih, Thr, Thic, lim_time)


    const [ value_Kpe, setValue_Kpe ] = useState(.5)
    const [ value_Kei, setValue_Kei ] = useState(12)
    const [ value_Kir, setValue_Kir ] = useState(.5)
    const [ value_Kih, setValue_Kih ] = useState(.5)
    const [ value_Khic, setValue_Khic ] = useState(.5)
    const [ value_Khr, setValue_Khr ] = useState(.5)
    const [ value_Ked, setValue_Ked ] = useState(.5)
    const [ value_Ker, setValue_Ker ] = useState(.5)
    const [ value_Tei, setValue_Tei ] = useState(.5)
    const [ value_Tir, setValue_Tir ] = useState(.5)
    const [ value_Tih, setValue_Tih ] = useState(.5)
    const [ value_Thr, setValue_Thr ] = useState(.5)
    const [ value_Thic, setValue_Thic ] = useState(.5)
    const [ value_lim_time, setValue_lim_time ] = useState(.5)

    const classes = useStyles();

  return (
    <div style = {{width: 900}} className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>Réglage des paramètres du modèle</Paper>
            </Grid>

    
      
        <Grid item xs={2}>
            Paramètre Kpe
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Kpe}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Kei
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Kei}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Kir
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Kir}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Kih
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Kih}</Paper>
        </Grid>
        
        <Grid item xs={3}>
            <RangeSlider
                        value={value_Kpe}
                        min = {0}
                        max = {1}
                        step = {.1}
                        size = {10}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Kpe(changeEvent.target.value)}
                        variant = 'primary'
            />
        </Grid>
        
        <Grid item xs={3}>
            <RangeSlider
                        value={value_Kei}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Kei(changeEvent.target.value)}
                        variant = 'primary'
            />
        </Grid>
      
        <Grid item xs={3}>
            <RangeSlider
                        value={value_Kir}
                        min = {1}
                        max = {50}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Kir(changeEvent.target.value)}
                        variant = 'primary'
            />
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Kih}
                        min = {10}
                        max = {80}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Kih(changeEvent.target.value)}
                        variant = 'primary'
            />
        </Grid>


    

        <Grid item xs={2}>
            Paramètre Khic
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Khic}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Khr
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Khr}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Ked
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Ked}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Ker
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Ker}</Paper>
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Khic}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Khic(changeEvent.target.value)}
                        variant = 'secondary'
            />
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Khr}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Khr(changeEvent.target.value)}
                        variant = 'secondary'
            />
      </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Ked}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Ked(changeEvent.target.value)}
                        variant = 'secondary'
            />
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Ker}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Ker(changeEvent.target.value)}
                        variant = 'secondary'
            />
        </Grid>

    

        <Grid item xs={2}>
            Paramètre Tei
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Tei}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Tir
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Tir}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Tih
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Tih}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre Thr
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Thr}</Paper>
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Tei}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Tei(changeEvent.target.value)}
                        variant = 'warning'
            />
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Tir}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Tir(changeEvent.target.value)}
                        variant = 'warning'
            />
      </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Tih}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Tih(changeEvent.target.value)}
                        variant = 'warning'
            />
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Thr}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Thr(changeEvent.target.value)}
                        variant = 'warning'
            />
        </Grid>

        

        <Grid item xs={2}>
            Paramètre Thic
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_Thic}</Paper>
        </Grid>

        <Grid item xs={2}>
            Paramètre lim_time
        </Grid>
        
        <Grid item xs={1}>
            <Paper className={classes.paper}>{value_lim_time}</Paper>
        </Grid>

        <Grid item xs={2}>
            
        </Grid>
        
        <Grid item xs={1}>
            
        </Grid>

        <Grid item xs={2}>
            
        </Grid>
        
        <Grid item xs={1}>
            
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_Thic}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'top'
                        onChange={changeEvent => setValue_Thic(changeEvent.target.value)}
                        variant = 'info'
            />
        </Grid>

        <Grid item xs={3}>
            <RangeSlider
                        value={value_lim_time}
                        min = {1}
                        max = {20}
                        step = {1}
                        tooltip = 'auto'
                        tooltipPlacement = 'info'
                        onChange={changeEvent => setValue_lim_time(changeEvent.target.value)}
                        variant = 'info'
            />
      </Grid>

        <Grid item xs={3}>
        </Grid>

        <Grid item xs={3}>
        </Grid>

    </Grid>

  </div>


  );


};