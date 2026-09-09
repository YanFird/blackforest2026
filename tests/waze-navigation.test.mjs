import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const functionMatch = html.match(/function buildWazeUrl\(destination\)\{([\s\S]*?)\n    \}/);
assert.ok(functionMatch, 'buildWazeUrl must exist in index.html');

const buildWazeUrl = new Function('destination', functionMatch[1]);

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
