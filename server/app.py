#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on 04/04/2020

@author: Paul Festor
"""
from flask import Flask, jsonify, request


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


if __name__ == "__main__":
    app.run(debug=True)