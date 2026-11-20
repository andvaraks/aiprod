export function sortProperties(properties, order) {
  const sorted = [...properties];
  if (order === 'area-desc') sorted.sort((left, right) => right.area - left.area);
  return sorted;
}
