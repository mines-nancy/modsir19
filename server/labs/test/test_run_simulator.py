#!/usr/bin/python3
# -*- coding: utf-8 -*-
"""
    Author: Bart Lamiroy (Bart.Lamiroy@univ-lorraine.fr)

"""

import filecmp
import os
import subprocess
import tempfile
import unittest
from tempfile import NamedTemporaryFile
from os import remove
from labs.defaults import export_json, import_json, get_default_params
from models.sir_h.simulator import run_sir_h


class TestRunSimulator(unittest.TestCase):

    def test_simulator_execution(self):
        param_pathname = './labs/test_data/default_parameters.json'
        series = 'SI'
        prefix = 'commando_covid_run'
        reference_file = './labs/test_data/commando_covid_run_SI_baseline.csv'

        self.assertTrue(os.path.exists(param_pathname), f'{param_pathname} does not exist')
        self.assertTrue(os.path.exists(reference_file), f'{reference_file} does not exist')

        with tempfile.TemporaryDirectory() as tmp_dirname:

            args = ['-m', 'labs.run_simulator', '--noplot', '--path', tmp_dirname, '-p', param_pathname, '-s']
            subprocess.call(['/usr/bin/python3', *args])

            param_basename = os.path.splitext(os.path.basename(param_pathname))[0]
            result_file = f'{tmp_dirname}/{"_".join([prefix, series, param_basename])}.csv'

            self.assertTrue(os.path.exists(result_file), f'{result_file} does not exist')
            self.assertTrue(filecmp.cmp(result_file, reference_file), 'Files are not equal')


if __name__ == '__main__':
    unittest.main()

