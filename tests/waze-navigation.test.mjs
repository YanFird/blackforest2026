import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const functionMatch = html.match(/function buildWazeUrl\(destination\)\{([\s\S]*?)\n    \}/);
assert.ok(functionMatch, 'buildWazeUrl must exist in index.html');

const buildWazeUrl = new Function('destination', functionMatch[1]);
const anchorMatches = [...html.matchAll(/<a\b[^>]*class="[^"]*nav-link[^"]*"[^>]*href="([^"]+)"/g)];
assert.ok(anchorMatches.length > 0, 'site should have driving nav-link anchors');
for (const match of anchorMatches) {
  const href = match[1].replaceAll('&amp;', '&');
  const url = new URL(href);
  assert.equal(url.searchParams.get('travelmode'), 'driving',
    `nav-link should only be used for driving links, got ${href}`);
}

const day1 = html.match(/id="day-2026-09-22"[\s\S]*?id="day-2026-09-23"/)[0];
assert.match(day1, /origin=Parkhaus\+Kornhaus%2C\+Poststra%C3%9Fe\+2%2C\+79761\+Waldshut-Tiengen%2C\+Germany[^>]*travelmode=walking/,
  'Day 1 must include Google walking route from primary Parkhaus Kornhaus to Kaiserstraße');
assert.match(day1, /origin=Kornhausplatz\+Nord%2C\+Bismarckstra%C3%9Fe\+14%2C\+79761\+Waldshut-Tiengen%2C\+Germany[^>]*travelmode=walking/,
  'Day 1 must include Google walking route from fallback Kornhausplatz Nord to Kaiserstraße');

const address = 'Parkhaus Kornhaus, Poststraße 2, Waldshut-Tiengen, Germany';
const addressUrl = new URL(buildWazeUrl(address));
assert.equal(addressUrl.hostname, 'waze.com');
assert.equal(addressUrl.searchParams.get('q'), address);
assert.equal(addressUrl.searchParams.has('navigate'), false,
  'Waze must not calculate a Germany route from the traveler’s current pre-trip location');

const coordinates = '47.8446681,7.9371273';
const coordinateUrl = new URL(buildWazeUrl(coordinates));
assert.equal(coordinateUrl.searchParams.get('ll'), coordinates);
assert.equal(coordinateUrl.searchParams.has('navigate'), false,
  'coordinate links must open the destination without forcing a remote route');

console.log(JSON.stringify({
  addressLinkOpensDestination: true,
  coordinateLinkOpensDestination: true,
  automaticRemoteRouteDisabled: true
}));
