# MODSIR-19 LABS model_fit Module File

## Introduction

The `labs` directory (and consequently Python module) contains a series of scripts 
allowing to conveniently interact with the simulator.py code. 

The `labs.model_fit` module allows 
to adjust the parameters of a model to fit over actual measured data points.

## Scripts

Please note scripts should be run using the `-m` flag, like this:
```
python3 -m labs.model_fit.script
```
Running the scripts with `--help` will provide a short description of available execution parameters.

* ###`optimise.py`: 
  The script tries to find the optimal SIR+H parameters given a baseline set of 
  parameter values and a series of real-world observations. The baseline parameter set is either initialised 
  by default using the values from `labs.defaults` or can be user-provided through the `-p` execution parameter.
  
  The implemented approach consists of
  explicitly defining a subset of the baseline parameters as optimisation variables, the remaining
  parameters will remain constant. By default these parameters are chosen to be 
  * `patient0` (the number of infected individuals at the beginning of the simulation)
  * `beta` (beta value before confinement period)
  * `beta_post` (beta value after confinement period)
  * `dm_incub` (average incubation time in days)
  
  It is possible to select and use other optimisation variables and provide them through à `JSON` file 
  using the `-v` execution parameter. Please refer to `labs.defaults` to obtain a list of all parameters 
  used by the model.
  
  ... to be completed ...
  
  ####Execution Parameters for `optimise.py`
  
  * `-p`, `--params`: `JSON` file compatible with the format expected from `labs.defaults.import_json()` containing 
    the execution parameters for the model to be run.
    
    If not provided, default parameters from `labs.defaults.get_default_params()` are used.
  * `-v`, `--variables`: `JSON` file containing the set of parameters to be used as optimisation variables including 
    their initial value and min/max bounds.
    
    If not provided, hard-coded default parameters are used. The set of optimisation parameters is displayed at the 
    end of the execution process.
  * `-i`, `--input`: a `CSV` file containing a set of observed data points in time. Storage format is `time, value` 
    where `time` is expressed in days after the start of the simulation (usually January 6 2020), and `value` the 
    observed data value.
    
    These are the data points the optimisation algorithm will try to fit by finding the most appropriate values for
    the variables set with the `-v` execution parameter.
    
    If not provided, default `data_chu_rea` data points from `labs.defaults.get_default_params()` are used.
  * `-n`: number `num` of data points to use for fitting. By default all data points are used. 
    If set, only the first `num` data points will be used.
  * `-d`, `--data`: identification of the series of provided data points within those handled by the SIR+H
    simulation. Default value is `SI` (number of *Intensive Care* patients at a given time).
  * `-m`, `--model`: SIR+H simulator model to use. By default `disc` (discrete step, floating value flux) is used. 
    Alternative models are `disc_int` (discrete step, integer value flux) and `diff` (differential integration). 

  * `--opt`: numerical optimisation algorithm to use for fitting. Default value is `least_squares`.
  * `--noplot`: do not plot any curves.
  * `-s`, `--save`:
  * `--path`:
  
