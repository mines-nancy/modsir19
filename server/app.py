# -*- coding: utf-8 -*-
"""
Created on 04/04/2020

@author: Paul Festor
"""

from flask import Flask, jsonify, json, request
from flask_cors import CORS, cross_origin

from models.simple_sir import simple_sir

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

def add(x, y):
    return x + y

# Sample GET request
@app.route('/get_data_sample', methods=["GET"])
def get_data_sample():
    data = {"a": 2, "b": 3}
    return jsonify(data)

# Sample GET request with parameters
@app.route('/get_add_data', methods=["GET"])
def get_add_data():
    input=json.loads(request.args.get('inputFunction'))
    return jsonify({'result': add(input['x'],input['y'])})


# Sample POST request
@app.route('/add_data', methods=["POST"])
def add_data():
    request_data = request.get_json()
    input = request_data['inputFunction']
    x = input["x"]
    y = input["y"]
    result = add(x, y)
    return jsonify({'result': result})

# Sample GET request
@app.route('/get_simple_sir', methods=["GET"])
def get_simple_sir():
    input=json.loads(request.args.get('parameters'))
    print(input)
    s0 = input["s0"]
    lambd = input["lambda"]
    beta = input["beta"]
    data = simple_sir(s0=s0, lambd=lambd, beta=beta)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
