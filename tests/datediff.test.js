const { test } = require('node:test');
const assert = require('node:assert/strict');
const { datediff } = require('../dist/lib/datediff.js');

test('calculates difference in days', () => {
  const first = new Date(2023, 0, 1);
  const second = new Date(2023, 0, 2);
  assert.equal(datediff(first, second), 1);
});

test('returns 0 for same dates', () => {
  const first = new Date(2023, 0, 1);
  const second = new Date(2023, 0, 1);
  assert.equal(datediff(first, second), 0);
});
