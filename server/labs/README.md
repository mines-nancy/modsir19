# MODSIR-19 LABS Readme File

## Introduction

The labs directory (and consequently Python module) contains a series of scripts 
allowing to conveniently interact with the simulator.py code.


## Scripts

All scripts are supposed to be auto-documented and may have corresponding `README.md` files. 

Every script can be invoked with the `--help` command-line parameter. Please note scripts should be run using the `-m` flag, like this:
```
python3 -m labs.script
```
 
Also, most scripts will run without any command-line parameters and instead use default values to execute.

A continuous effort is made to maintain command-line parameter options as coherent and similar 
across all scripts.

### Generic parameters for all scripts

All scripts accept the following command-line parameter flags :

* `--noplot`: does not plot any curve
* `-s`, `--save`: saves output to various files (takes optional filename prefix)

### Provided scripts

* `batch_run.sh` and `batch_run_alt.sh`: operational example `bash` scripts allowing to run large batch jobs and parameter passing between provided python scripts. 
Both scripts run the following tasks in sequence :
    * for a series of predetermined values `n`, estimate the optimal SIR+H model parameters given `n` observations if IC admissions;
    * generate model output for these parameters;
    * run gaussian process prediction using this output as *prior* and compare with remaining observations of IC admissions;
    * generate animated `.gif` of computed curves.
    
    These scripts take no parameters, but can be edited to adapt to specific configurations.

* `run_simulator.py`: runs the simulator using the provided simulator parameters and plots the curves specified at run-time.
When provided, the `-s` option saves the list of curve points to `.csv`
* `gaussian_process` (directory): contains `gp_in_practice.py` allowing to predict unseen (future) values given real observed data and an approximate (theoretical) prior (refer to `README.md` in directory).

* `model_fit` (directory): contains `optimise.py` allowing to estimate model parameters from observed data points using global minimisation (refer to `README.md` in directory)

* `compute_khy.py`
* `model_fitter` (**obsolete**): this code is obsolete and superseded by `optimise.py` in the `model_fit` directory.