# -*- coding: utf-8 -*-


from flask import Flask, jsonify, json, request
from flask_cors import CORS, cross_origin

from models.sir_h.simulator import cached_run_sir_h
from models.rule import RuleChangeField, RuleForceMove
from models.components.utils import compute_residuals, compute_area_and_expectation
from functools import lru_cache
from frozendict import frozendict


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


def min_max(value, min_value, max_value):
    return max(min_value, min(value, max_value))


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

    filtered_parameters = {key: parameters[key] for key in parameters_name}
    filtered_parameters['population'] = min_max(
        parameters['population'], 1000, 100000000)
    filtered_parameters['lim_time'] = min_max(parameters['lim_time'], 0, 1000)
    filtered_parameters['dm_incub'] = min_max(parameters['dm_incub'], 1, 100)
    filtered_parameters['dm_r'] = min_max(parameters['dm_r'], 1, 100)
    filtered_parameters['dm_h'] = min_max(parameters['dm_h'], 1, 100)
    filtered_parameters['dm_sm'] = min_max(parameters['dm_sm'], 1, 100)
    filtered_parameters['dm_si'] = min_max(parameters['dm_si'], 1, 100)
    filtered_parameters['dm_ss'] = min_max(parameters['dm_ss'], 1, 100)

    filtered_parameters['integer_flux'] = False
    return start_time, frozendict(filtered_parameters)


@lru_cache(maxsize=128)
def extract_from_rules(request_rules):
    rules = []
    if len(request_rules) > 1000:
        return tuple(rules)

    for rule in request_rules:
        date = rule['date']
        ruletype = rule['type']
        if ruletype == 'change_field':
            field = rule['field']
            value = rule['value']
            rules.append(RuleChangeField(date, field, value))
        elif ruletype == 'force_move':
            src = rule['src']
            dest = rule['dest']
            value = rule['value']
            rules.append(RuleForceMove(date, src, dest, value))
    return tuple(rules)


@lru_cache(maxsize=128)
def build_rules_from_parameters(parameters_list):
    rules = []

    if len(parameters_list) > 100:
        return tuple(rules)

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

# SIR+H model with rules
# parameters = { start_time:xxx, population:xxx, patient0:xxx, ...}
# rules = { list: [{type: 'change_field', date:70, field: 'beta', value: 0.5 },...] }
@app.route('/get_sir_h_rules', methods=["GET"])
def get_sir_h_rules():
    request_parameters = json.loads(request.args.get('parameters'))
    request_rules = json.loads(request.args.get('rules'))
    print(
        f'request_parameters={request_parameters} request_rules={request_rules}')

    start_time, parameters = extract_from_parameters(
        frozendict(request_parameters))
    rules = extract_from_rules(
        tuple([frozendict(rule) for rule in request_rules['list']]))

    print(f'parameters={parameters} rules={rules}')

    lists = cached_run_sir_h(parameters, rules)
    return jsonify(lists)


# parameters = { coefficients: [] }
@app.route('/get_ki_analysis', methods=["GET"])
def get_ki_analysis():
    request_parameters = json.loads(request.args.get('parameters'))
    print(f'request_parameters={request_parameters}')

    ki = request_parameters['coefficients']
    residuals = compute_residuals(ki)
    area, expectation, sum_khi = compute_area_and_expectation(ki, residuals)
    res = {'area': area}
    return jsonify(res)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
