export function filterKeys(result, filteredKeys) {
  const items = {};
  Object.keys(result)
    .filter((key) => filteredKeys.includes(key))
    .map((k) => (items[k] = result[k]));
  return items;
}
