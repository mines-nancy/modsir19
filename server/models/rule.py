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


class Rule:
    def __init__(self, date):
        self._date = date

    def date(self):
        return self._date


class RuleChangeField(Rule):
    def __init__(self, date, field, value):
        Rule.__init__(self, date)
        self._field = field
        self._value = value

    def __repr__(self):
        return f'ChangeField at t={self._date} {self._field}={self._value}'

    def apply(self, state):
        state.change_value(self._field, self._value)


class RuleForceMove(Rule):
    def __init__(self, date, src, dest, value):
        Rule.__init__(self, date)
        self._src = src
        self._dest = dest
        self._value = value

    def __repr__(self):
        return f'ForceMove at t={self._date} {self._src}->{self._dest}={self._value}'

    def apply(self, state):
        state.force_move(self._src, self._dest, self._value)


def apply_rules(state, rules):
    applicable_rules = [rule for rule in rules if state.time == rule.date()]
    for rule in applicable_rules:
        rule.apply(state)


def apply_force_move(state, src, dest, data_chu):
    date = state.time
    if date in data_chu and data_chu[date] != None:
        delta = state.box(src).size() - data_chu[date]
        if delta > 0:
            rule = RuleForceMove(date, src, dest, delta)
            rule.apply(state)
        elif delta < 0:
            rule = RuleForceMove(date, dest, src, 0-delta)
            rule.apply(state)
