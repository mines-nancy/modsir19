import unittest
from tempfile import NamedTemporaryFile
from os import remove
from labs.defaults import export_json, import_json, get_default_params
from models.sir_h.simulator import run_sir_h


class TestDefault(unittest.TestCase):

    def test_get_default_params(self):
        params = get_default_params()
        self.assertIsNot(params, None)
        params_key_set = set(params.keys())
        self.assertIn('parameters', params_key_set)
        self.assertIn('rules', params_key_set)
        series = run_sir_h(params['parameters'], params['rules'])
        self.assertIsNot(series, None)

    def test_import_export_json(self):
        params = get_default_params()
        tmp_file = NamedTemporaryFile(delete=False)
        export_json(tmp_file.name, params['parameters'], params['rules'], params['other'])
        read_params = import_json(tmp_file.name)
        tmp_file.close()
        remove(tmp_file.name)

        self.assertEqual(read_params[0], params['parameters'])
        # self.assertEqual(read_params[1], params['rules'])
        self.assertEqual(set([str(x) for x in read_params[1]]), set([str(x) for x in params['rules']]))
        self.assertEqual(read_params[2], params['other'])

    def test_model_execution(self):
        params = get_default_params()
        series1 = run_sir_h(params['parameters'], params['rules'])

        tmp_file = NamedTemporaryFile()
        export_json(tmp_file.name, params['parameters'], params['rules'], params['other'])
        read_params = import_json(tmp_file.name)
        tmp_file.close()
        series2 = run_sir_h(read_params[0], read_params[1])

        self.assertEqual(series1, series2)


if __name__ == '__main__':
    unittest.main()
