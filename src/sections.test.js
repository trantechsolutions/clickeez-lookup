// Run with: node --test
// Validates the canonical section map against the face manifest. No test framework
// dependency — uses the built-in node:test runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  SERIES,
  SERIES_1_SECTIONS,
  SERIES_3_SECTIONS,
  SECTIONS,
  ALL_MEMBERS,
  TOTAL,
} from './sections.js';

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(here, 'images.json'), 'utf8'));
const manifestNames = Object.keys(manifest);

const series1Members = SERIES_1_SECTIONS.flatMap((s) => s.members);
const series3Members = SERIES_3_SECTIONS.flatMap((s) => s.members);

test('two series are registered: Series 1 then Series 3', () => {
  assert.deepEqual(SERIES.map((s) => s.name), ['Series 1', 'Series 3']);
});

test('Series 1 has 8 sections with counts 12/12/12/13/12/4/5/1 (71)', () => {
  assert.equal(SERIES_1_SECTIONS.length, 8);
  assert.deepEqual(SERIES_1_SECTIONS.map((s) => s.members.length), [12, 12, 12, 13, 12, 4, 5, 1]);
  assert.equal(series1Members.length, 71);
});

test('Series 3 has 8 sections with counts 12/12/12/13/12/4/4/1 (70)', () => {
  assert.equal(SERIES_3_SECTIONS.length, 8);
  assert.deepEqual(SERIES_3_SECTIONS.map((s) => s.members.length), [12, 12, 12, 13, 12, 4, 4, 1]);
  assert.equal(series3Members.length, 70);
});

test('TOTAL is 141 and matches the flattened member list', () => {
  assert.equal(TOTAL, 141);
  assert.equal(ALL_MEMBERS.length, 141);
});

test('Series 1 keeps its exact position and order as the share-code prefix', () => {
  // The share code is a bitmask over ALL_MEMBERS; Series 1 MUST stay first and
  // unchanged so existing codes keep decoding correctly.
  assert.deepEqual(ALL_MEMBERS.slice(0, 71), series1Members);
});

test('every section has a name and a hex color', () => {
  for (const s of SECTIONS) {
    assert.ok(s.name && typeof s.name === 'string', `missing name`);
    assert.match(s.color, /^#[0-9a-f]{6}$/i, `bad color on ${s.name}`);
  }
});

test('no duplicate members across the whole map', () => {
  const seen = new Set();
  const dupes = [];
  for (const n of ALL_MEMBERS) {
    if (seen.has(n)) dupes.push(n);
    seen.add(n);
  }
  assert.deepEqual(dupes, []);
});

test('every member has an image (no typos, both series cropped)', () => {
  const missing = ALL_MEMBERS.filter((n) => !manifestNames.includes(n));
  assert.deepEqual(missing, []);
});

test('every image in images.json is placed in exactly one member (no orphans)', () => {
  const orphans = manifestNames.filter((n) => !ALL_MEMBERS.includes(n));
  assert.deepEqual(orphans, []);
});
