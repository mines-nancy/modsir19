#!/bin/bash
#
# batch_run_alt will run consider a file of measured data points and iteratively take the first $i of those points
# to sequentially execute the following treatments :
#
# 1. Estimate the SIR+H parameters best fitting these $i points
# 2. Generate the full model output using these fitted parameters
# 3. Predict (and measure the confidence) of points beyond the $i
# 4. Generate an animated gif of the set of curves obtained in 3.
#

out_path="newrun_bis"
series="SI"
measures="labs/data/Occupation_Rea_avril.csv "

for i in 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55;
do
  python3 -m labs.beyond_sir.new_model -d ${series} -i ${measures} -m disc --noplot --path ${out_path} -s datanum_$i -n $i;
done

shopt -s extglob
python3 -m labs.run_simulator -o ${series} -p ${out_path}/*datanum_*([0-9]).json -s datarun --noplot --path ${out_path}

do
  python3 -m labs.gaussian_processes.gp_in_practice -i ${measures} -n $i -p ${out_path}/datarun_${series}_*_datanum_$i.csv --silentplot --beautify --path ${out_path} -s prediction_$i
  process_id=$!
  sleep 1
done

wait $process_id
convert -delay 200,1000 ${out_path}/*png ${out_path}/demo.gif