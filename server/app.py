# -*- coding: utf-8 -*-


from flask import Flask, jsonify, json, request
from flask_cors import CORS, cross_origin
import numpy as np

from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField, RuleForceMove
from models.components.utils import compute_residuals, compute_area_and_expectation, compute_khi_delay, compute_khi_exp, compute_khi_binom
from functools import lru_cache


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


def min_max(value, min_value, max_value):
    return max(min_value, min(value, max_value))


def normalize_field(field_name, value):
    pc_name = ['pc_ir', 'pc_ih',
               'pc_sm', 'pc_si',
               'pc_sm_si', 'pc_sm_dc', 'pc_sm_out',
               'pc_si_dc', 'pc_si_out',
               'pc_h_ss', 'pc_h_r']

    dm_name = ['dm_incub', 'dm_r', 'dm_h', 'dm_sm', 'dm_si', 'dm_ss']

    if isinstance(value, list):
        return value

    if isinstance(value, str):
        value = float(value)

    if field_name == 'population':
        return int(min_max(value, 1000, 10000000))
    elif field_name == 'patient0':
        return int(min_max(value, 1, 1000))
    elif field_name == 'lim_time':
        return int(min_max(value, 1, 1000))
    elif field_name == 'kpe':
        return float(min_max(value, 0, 1))
    elif field_name == 'beta':
        return float(min_max(value, 0, 5))
    elif field_name == 'r':
        return float(min_max(value, 0, 5))
    elif field_name in dm_name:
        return float(min_max(value, 1, 40))
    elif field_name in pc_name:
        return float(min_max(value, 0, 1))


def extract_from_parameters(parameters):
    start_time = int(parameters['start_time'])

    pc_name = ['pc_ir', 'pc_ih',
               'pc_sm', 'pc_si',
               'pc_sm_si', 'pc_sm_dc', 'pc_sm_out',
               'pc_si_dc', 'pc_si_out',
               'pc_h_ss', 'pc_h_r']

    dm_name = ['dm_incub', 'dm_r', 'dm_h', 'dm_sm', 'dm_si', 'dm_ss']
    parameters_name = ['population', 'patient0', 'lim_time',
                       'kpe', 'r', 'beta'] + dm_name + pc_name

    filtered_parameters = {key: normalize_field(
        key, parameters[key]) for key in parameters_name}

    filtered_parameters['integer_flux'] = False

    print(f'filtered parameters={filtered_parameters}')
    return start_time, filtered_parameters


def extract_from_rules(request_rules):
    rules = []
    if len(request_rules) > 1000:
        return rules

    for rule in request_rules:
        date = rule['date']
        ruletype = rule['type']
        value = rule['value']
        if ruletype == 'change_field':
            field = rule['field']
            value = normalize_field(field, value)
            rules.append(RuleChangeField(date, field, value))
        elif ruletype == 'force_move':
            src = rule['src']
            dest = rule['dest']
            value = int(value) if isinstance(value, str) else value
            rules.append(RuleForceMove(date, src, dest, value))
    print(f'rules={rules}')
    return rules


def build_rules_from_parameters(parameters_list):
    rules = []

    if len(parameters_list) > 100:
        return rules

    for index, parameters_timeframe in enumerate(parameters_list):
        if index > 0:
            start_time, parameters = extract_from_parameters(
                parameters_timeframe)
            for key in parameters:
                rules.append(RuleChangeField(start_time, key, parameters[key]))
    return rules

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

# SIR+H model with rules
# parameters = { start_time:xxx, population:xxx, patient0:xxx, ...}
# rules = { list: [{type: 'change_field', date:70, field: 'beta', value: 0.5 },...] }
@app.route('/get_sir_h_rules', methods=["GET"])
def get_sir_h_rules():
    request_parameters = json.loads(request.args.get('parameters'))
    request_rules = json.loads(request.args.get('rules'))
    print(
        f'request_parameters={request_parameters} request_rules={request_rules}')

    start_time, parameters = extract_from_parameters(request_parameters)
    rules = extract_from_rules(request_rules['list'])

    lists = run_sir_h(parameters, rules)
    return jsonify(lists)


# parameters = { ki: [] }
@app.route('/get_ki_analysis', methods=["GET"])
def get_ki_analysis():
    request_parameters = json.loads(request.args.get('parameters'))

    ki = request_parameters['ki']
    residuals = compute_residuals(ki)
    area, expectation, sum_khi = compute_area_and_expectation(ki, residuals)
    res = {'area': area, 'expectation': expectation}
    return jsonify(res)

# parameters = { schema:'Retard', duration, max_days }
@app.route('/get_ki_from_schema', methods=["GET"])
def get_ki_from_schema():
    request_parameters = json.loads(request.args.get('parameters'))
    # print(f'request_parameters={request_parameters}')

    schema = request_parameters['schema']
    duration = request_parameters['duration']
    max_days = request_parameters['max_days']

    # print(f'duration={duration} max={max_days}')
    if schema == 'Retard':
        ki = compute_khi_delay(int(duration))
    elif schema == 'Exponentiel':
        ki = compute_khi_exp(duration, max_days)
    elif schema == 'Binomial':
        ki = compute_khi_binom(duration, max_days)
    else:
        ki = max_days*[0]

    residuals = compute_residuals(ki)
    area, expectation, sum_khi = compute_area_and_expectation(ki, residuals)
    res = {'ki': ki, 'area': area, 'expectation': expectation}
    return jsonify(res)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
