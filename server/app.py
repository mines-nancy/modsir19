# -*- coding: utf-8 -*-
"""
Created on 04/04/2020

"""

from flask import Flask, jsonify, json, request
from flask_cors import CORS, cross_origin

from models.simulator import run_sir_h

# Test master update to deploy 2

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


def extract_from_parameters(parameters):
    start_time = int(parameters['start_time'])

    constants_name = ["population", "patient0", "lim_time"]
    delays_name = ['dm_incub', 'dm_r', 'dm_h', 'dm_sm', 'dm_si', 'dm_ss']

    coefficients_name = ['kpe', 'r', 'beta', 'pc_ir', 'pc_ih', 'pc_sm',
                         'pc_si', 'pc_sm_si', 'pc_sm_out', 'pc_si_dc', 'pc_si_out', 'pc_h_ss', 'pc_h_r']

    constants = {key: int(parameters[key]) for key in constants_name}
    delays = {key: int(parameters[key]) for key in delays_name}
    coefficients = {key: parameters[key] for key in coefficients_name}
    return start_time, constants, delays, coefficients

# SIR+H model with timeframe
# parameters= {list:[{start_time:xxx, population:xxx, patient0:xxx, ...}]}
# start_time in (0, 1, 2, 3, ...)
@app.route('/get_sir_h_timeframe', methods=["GET"])
def get_sir_h_timeframe():
    parameters = json.loads(request.args.get('parameters'))
    # print('get_sir_h_timeframe parameters', parameters)
    parameters_list = parameters['list']

    rules = []
    for index, parameters in enumerate(parameters_list):
        if index > 0:
            start_time, constants, delays, coefficients = extract_from_parameters(
                parameters)
            d = {**constants, **delays, **coefficients}
            for key in d:
                rules.append(
                    {'field': key, 'value': d[key], 'date': start_time})

    start_time, constants, delays, coefficients = extract_from_parameters(
        parameters_list[0])
    lists = run_sir_h(constants, delays, coefficients, rules)
    return jsonify(lists)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
