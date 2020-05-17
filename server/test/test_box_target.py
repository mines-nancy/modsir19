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
from models.components.box import Box, BoxSource, BoxTarget


class TestBoxTarget(unittest.TestCase):

    # elementary behavior
    def test_box_target1(self):
        box = BoxTarget('TARGET')
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.add(100)
        self.assertEqual(box.input(), 100)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 100)
        self.assertEqual(box.output(), 0)

        box.add(10)
        box.step()
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 110)
        self.assertEqual(box.output(), 0)

    # multiple inputs are added
    def test_box_target2(self):
        box = BoxTarget('TARGET')
        self.assertEqual(box.input(), 0)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)
        box.add(100)
        box.add(100)
        self.assertEqual(box.input(), 200)
        self.assertEqual(box.size(), 0)
        self.assertEqual(box.output(), 0)

    # can't remove from a target
    def test_box_target3(self):
        box = BoxTarget('TARGET')
        with self.assertRaises(Exception):
            box.remove(100)
        with self.assertRaises(Exception):
            box.set_output(100)
        box.add(100)
        box.step()
        box.step()
        self.assertEqual(box.output(), 0)
        self.assertEqual(box.removed(), 0)

    # check history
    def test_box_target4(self):
        box = BoxTarget('TARGET')
        for i in range(1, 10):
            box.add(i)
            box.step()
        self.assertEqual(box.get_input_history(), list(range(1, 10)) + [0])
        self.assertEqual(box.get_size_history(), [
                         int(n*(n+1)/2) for n in range(10)])
        self.assertEqual(box.get_output_history(), [0]*10)
        self.assertEqual(box.get_removed_history(), [0]*10)


if __name__ == '__main__':
    unittest.main()
