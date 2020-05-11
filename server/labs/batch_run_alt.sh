#!/bin/bash
#
# batch_run_alt will run consider a file of measured data points and iteratively take the first $i of those points
# to sequentially execute the following treatments :
#
# 1. Estimate the SIR+H parameters best fitting these $i points
# 2. Generate the full model output using these fitted parameters
# 3. Predict (and measure the confidence) of points beyond the $i
# 4. Generate an animated gif of the set of curves obtained in 3.
# 5. Group all prediction data into one single .csv file
# 6. Group computed optimal parameters for each run in one single .csv file
#

out_path="newrun_bis"
series="SI"
measures="labs/data/Occupation_Rea_avril.csv"
model="disc"

for i in $(seq 5 55);
do
  python3 -m labs.model_fit.optimmise -d ${series} -i "${measures}" -m $model --noplot --path "${out_path}" -s datanum_$i -n $i;
done

shopt -s extglob
python3 -m labs.run_simulator -o ${series} -p "${out_path}"/*datanum_*([0-9]).json -s datarun --noplot --path "${out_path}"

for i in $(seq 5 55);
do
  python3 -m labs.gaussian_processes.gp_in_practice -i "${measures}" -n $i -p "${out_path}/datarun_${series}"_*_datanum_"$i.csv" --silentplot --beautify --path "${out_path}" -s prediction_$i
  process_id=$!
  sleep 1
done

wait $process_id
convert -delay 200,1000 "${out_path}/"*png "${out_path}/demo.gif"

cp -- "$(find "${out_path}" -name \*_prediction_\*csv | sort | head -1)" "${out_path}/predictions.csv"

for f in $(find "${out_path}" -name \*_prediction_\*csv | sort); do
  cut "${f}" -d , -f 4,5 | paste "${out_path}/predictions.csv" - -d, > "${out_path}/tmp_predictions.csv"
  mv "${out_path}/tmp_predictions.csv" "${out_path}/predictions.csv"
done


sed 's/\("[^ .]*"\): \([0-9\.]*\)/\1/g' $(find "${out_path}" -name \*_opt.json | sort | head -1) | sed 's/[{}]//g' > "${out_path}/optimal_parameters.csv"
echo >> "${out_path}/optimal_parameters.csv"
sed 's/\("[^ .]*"\): \([0-9\.]*\)/\2/g' $(find "${out_path}" -name \*_opt.json | sort) | sed 's/[{}]//g' >> "${out_path}/optimal_parameters.csv"
