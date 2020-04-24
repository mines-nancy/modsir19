# -*- coding: utf-8 -*-
"""
Created on 04/04/2020

"""

from flask import Flask, jsonify, json, request
from flask_cors import CORS, cross_origin

from models.sir_h.simulator import run_sir_h
from models.rule import extract_from_parameters, build_rules_from_parameters
# Test master update to deploy 2

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


# SIR+H model with timeframe
# parameters= {list:[{start_time:xxx, population:xxx, patient0:xxx, ...}]}
# start_time in (0, 1, 2, 3, ...)
@app.route('/get_sir_h_timeframe', methods=["GET"])
def get_sir_h_timeframe():
    request_parameters = json.loads(request.args.get('parameters'))
    # print('get_sir_h_timeframe parameters', request_parameters)
    parameters_list = request_parameters['list']

    rules = build_rules_from_parameters(parameters_list)
    start_time, parameters = extract_from_parameters(parameters_list[0])

    lists = run_sir_h(parameters, rules)
    return jsonify(lists)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
