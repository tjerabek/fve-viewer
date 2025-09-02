const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseJSON } = require('../dist/lib/parse-json.js');

test('uses json method when available', async () => {
  const resp = { json: async () => ({ a: 1 }) };
  const result = await parseJSON(resp);
  assert.deepEqual(result, { a: 1 });
});

test('returns object when json method missing', () => {
  const resp = { a: 1 };
  const result = parseJSON(resp);
  assert.equal(result, resp);
});
