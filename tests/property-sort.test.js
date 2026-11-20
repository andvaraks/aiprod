import test from 'node:test';
import assert from 'node:assert/strict';
import { sortProperties } from '../public/property-sort.js';

test('sorts by descending area without changing the original order', () => {
  const properties = [{id:'A', area:36}, {id:'B', area:84}, {id:'C', area:84}];
  assert.deepEqual(sortProperties(properties, 'area-desc').map(p => p.id), ['A','B','C']);
  assert.deepEqual(sortProperties(properties, 'original').map(p => p.id), ['A','B','C']);
  assert.deepEqual(properties.map(p => p.id), ['A','B','C']);
});
