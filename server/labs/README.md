# MODSIR-19 LABS Readme File

## Introduction

The labs directory (and consequently Python module) contains a series of scripts 
allowing to conveniently interact with the simulator.py code.


## Scripts

All scripts are supposed to be auto-documented and may have corresponding README files.

Every script can be invoked with the ```--help``` command-line parameter. 
Also, most scripts will run without any command-line parameters and instead use default values to execute.

A continuous effort is made to maintain command-line parameter options as coherent and similar 
across all scripts.

### Generic parameters for all scripts

All scripts accept the following command-line parameter flags :

* ```--noplot```: does not plot any curve
* ```-s```, ```--save```: saves output to various files (takes optional filename prefix)

### Provided scripts

* ```run_simulator.py```: runs the simulator using the provided simulator parameters and plots the curves specified at run-time.
When provided, the ```-s``` option saves the list of curve points to ```.csv```
* ```gaussian_process``` (directory): contains ```gp_in_practice.py``` allowing to predict unseen (future) values given real observed data and an approximate (theoretical) prior (refer to README.md in directory).

* ```beyond_sir``` (directory): contains ```new_model.py``` allowing to estimate model parameters from observed data points using global minimisation (refer to README.md in directory)

* ```compute_khy.py```
* ```model_fitter``` (**obsolete**): this code is obsolete and superseded by ```new_model.py``` in the ```beyond_sir``` directory.