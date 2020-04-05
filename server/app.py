# -*- coding: utf-8 -*-
"""
Created on 04/04/2020

@author: Paul Festor
"""

from flask import Flask, jsonify, request
from models.simple_sir import simple_sir


def add(x, y):
    return x + y


app = Flask(__name__)

# Sample GET request
@app.route('/get_data_sample', methods=["GET"])
def get_data_sample():
    data = {"a": 2, "b": 3}
    return jsonify(data)

# Sample POST request
@app.route('/add_data', methods=["POST"])
def add_data():
    request_data = request.get_json()
    x = request_data["x"]
    y = request_data["y"]
    result = add(x, y)
    return jsonify({'result': result})

# Sample GET request
@app.route('/get_simple_sir', methods=["GET"])
def get_simple_sir():
    request_data = request.get_json()
    s0 = request_data["s0"]
    lambd = request_data["lambda"]
    beta = request_data["beta"]
    data = simple_sir(s0=s0, lambd=lambd, beta=beta)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
