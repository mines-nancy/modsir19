# -*- coding: utf-8 -*-
"""
    This file is part of MODSIR19.

    MODSIR19 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MODSIR19 is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with MODSIR19.  If not, see <https://www.gnu.org/licenses/>.

    Copyright (c) 2020 Pierre-Etienne Moreau
    e-mail: Pierre-Etienne.Moreau@loria.fr
"""

import unittest
from models.components.box_convolution import compute_remove_delta, remove_values_from_array


class testRemoveValuesFromArray(unittest.TestCase):

    def test_remove_delta1(self):
        self.assertEqual(remove_values_from_array([1], [0]), [0])
        self.assertEqual(remove_values_from_array([1], [0.4]), [0])
        self.assertEqual(remove_values_from_array([1], [0.5]), [0])
        self.assertEqual(remove_values_from_array([1], [0.6]), [1])
        self.assertEqual(remove_values_from_array([1], [1]), [1])

    def test_remove_delta2(self):
        self.assertEqual(remove_values_from_array(
            [10, 10], [2.6, 5.6]), [3, 5])
        self.assertEqual(remove_values_from_array(
            [10, 10], [2.3, 5.3]), [2, 6])
        self.assertEqual(remove_values_from_array(
            [10, 10], [2.5, 5.5]), [2, 6])

    def test_remove_delta3(self):
        self.assertEqual(remove_values_from_array(
            [10, 0, 10], [2.6, 0, 5.6]), [3, 0, 5])
        self.assertEqual(remove_values_from_array(
            [10, 10, 10], [2.3, 2.2, 2.1]), [2, 2, 3])
        self.assertEqual(remove_values_from_array(
            [10, 10, 10], [2.8, 2.8, 2]), [3, 3, 2])


class testRemoveDelta(unittest.TestCase):

    def test_remove_delta1(self):
        self.assertEqual(compute_remove_delta([1], 0), [0])
        self.assertEqual(compute_remove_delta([1], 1), [1])

        self.assertEqual(compute_remove_delta([2], 0), [0])
        self.assertEqual(compute_remove_delta([2], 1), [1])
        self.assertEqual(compute_remove_delta([2], 2), [2])

    def test_remove_delta2(self):
        self.assertEqual(compute_remove_delta([1, 1], 0), [0, 0])
        self.assertEqual(compute_remove_delta([1, 1], 1), [0, 1])
        self.assertEqual(compute_remove_delta([1, 1], 2), [1, 1])

    def test_remove_delta3(self):
        self.assertEqual(compute_remove_delta([1, 1, 1], 0), [0, 0, 0])
        self.assertEqual(compute_remove_delta([1, 1, 1], 1), [0, 1, 0])
        self.assertEqual(compute_remove_delta([1, 1, 1], 2), [1, 0, 1])
        self.assertEqual(compute_remove_delta([1, 1, 1], 3), [1, 1, 1])

    def test_remove_delta5(self):
        self.assertEqual(compute_remove_delta([5, 5, 5], 5), [2, 1, 2])
        self.assertEqual(compute_remove_delta([5, 5, 5], 10), [3, 4, 3])
        self.assertEqual(compute_remove_delta([5, 0, 5], 5), [2, 0, 3])
        self.assertEqual(compute_remove_delta([5, 1, 5], 9), [4, 1, 4])


if __name__ == '__main__':
    unittest.main()
