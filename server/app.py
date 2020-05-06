# -*- coding: utf-8 -*-


from flask import Flask, jsonify, json, request
from flask_cors import CORS, cross_origin

from models.sir_h.simulator import cached_run_sir_h
from models.rule import RuleChangeField
from functools import lru_cache
from frozendict import frozendict


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@lru_cache(maxsize=128)
def extract_from_parameters(parameters):
    start_time = int(parameters['start_time'])

    parameters_name = ["population", "patient0", "lim_time",
                       'dm_incub', 'dm_r', 'dm_h', 'dm_sm', 'dm_si', 'dm_ss',
                       'kpe', 'r', 'beta',
                       'pc_ir', 'pc_ih',
                       'pc_sm', 'pc_si',
                       'pc_sm_si', 'pc_sm_dc', 'pc_sm_out',
                       'pc_si_dc', 'pc_si_out',
                       'pc_h_ss', 'pc_h_r']

    parameters = {key: parameters[key] for key in parameters_name}
    parameters['integer_flux'] = False
    return start_time, frozendict(parameters)


@lru_cache(maxsize=128)
def build_rules_from_parameters(parameters_list):
    rules = []
    for index, parameters_timeframe in enumerate(parameters_list):
        if index > 0:
            start_time, parameters = extract_from_parameters(
                parameters_timeframe)
            for key in parameters:
                rules.append(RuleChangeField(start_time, key, parameters[key]))
    return tuple(rules)

# SIR+H model with timeframe
# parameters= {list:[{start_time:xxx, population:xxx, patient0:xxx, ...}]}
# start_time in (0, 1, 2, 3, ...)
@app.route('/get_sir_h_timeframe', methods=["GET"])
def get_sir_h_timeframe():
    request_parameters = json.loads(request.args.get('parameters'))
    # print('get_sir_h_timeframe parameters', request_parameters)
    parameters_list = tuple([frozendict(d)
                             for d in request_parameters['list']])

    rules = build_rules_from_parameters(parameters_list)
    start_time, parameters = extract_from_parameters(parameters_list[0])

    lists = cached_run_sir_h(parameters, rules)
    return jsonify(lists)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
