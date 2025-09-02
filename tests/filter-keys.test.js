const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterKeys } = require('../dist/lib/filter-keys.js');

test('filters object keys', () => {
  const data = { a: 1, b: 2, c: 3 };
  const result = filterKeys(data, ['a', 'c']);
  assert.deepEqual(result, { a: 1, c: 3 });
});
