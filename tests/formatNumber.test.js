const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatNumber } = require('../dist/lib/formatNumber.js');

test('formats number with locale and digits', () => {
  assert.equal(formatNumber(1234.5, 1), '1\u00a0234,5');
});

test('returns 0 when number is 0', () => {
  assert.equal(formatNumber(0), 0);
});

test('returns undefined for undefined input', () => {
  assert.equal(formatNumber(undefined), undefined);
});
