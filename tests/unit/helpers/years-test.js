import { years } from '../../../helpers/years';
import { module, test } from 'qunit';

module('Unit | Helper | years');

test('under 1 year', function(assert) {
  let result = years([11]);
  assert.equal(result, '11 months');
});

test('1 year', function(assert) {
  let result = years([12]);
  assert.equal(result, '1 year');
});

test('1 year, some months', function(assert) {
  let result = years([13]);
  assert.equal(result, '1 year, 1 month');
});

test('over 2 years', function(assert) {
  let result = years([26]);
  assert.equal(result, '2 years, 2 months');
});
