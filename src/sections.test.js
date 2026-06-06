// Run with: node --test
// Validates the canonical section map against the face manifest. No test framework
// dependency — uses the built-in node:test runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { SECTIONS, ALL_MEMBERS, TOTAL } from './sections.js';

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(here, 'images.json'), 'utf8'));
const manifestNames = Object.keys(manifest);

test('there are exactly 8 scansheet sections', () => {
  assert.equal(SECTIONS.length, 8);
});

test('section member counts match the scansheet (12/12/12/13/12/4/5/1)', () => {
  assert.deepEqual(
    SECTIONS.map((s) => s.members.length),
    [12, 12, 12, 13, 12, 4, 5, 1],
  );
});

test('TOTAL is 71 and matches the flattened member list', () => {
  assert.equal(TOTAL, 71);
  assert.equal(ALL_MEMBERS.length, 71);
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

test('every member exists in images.json (no typos)', () => {
  const missing = ALL_MEMBERS.filter((n) => !manifestNames.includes(n));
  assert.deepEqual(missing, []);
});

test('every image in images.json is placed in exactly one section (no orphans)', () => {
  const orphans = manifestNames.filter((n) => !ALL_MEMBERS.includes(n));
  assert.deepEqual(orphans, []);
});
