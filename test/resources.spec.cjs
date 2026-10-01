const assert = require('node:assert/strict');

const baseUrl = (process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com').replace(/\/$/, '');

describe('Resource APIs', function () {
  const resources = ['posts', 'comments', 'albums', 'photos', 'todos', 'users'];

  for (const resource of resources) {
    it(`GET /${resource} returns a non-empty list`, async function () {
      // 1. Build the resource URL and send the GET request.
      const response = await fetch(`${baseUrl}/${resource}`, {
        signal: AbortSignal.timeout(10000),
      });

      // 2. Check that the request succeeds with HTTP 200.
      assert.equal(response.status, 200, 'Expected HTTP 200');

      // 3. Parse the JSON and confirm that the result is a non-empty array.
      const responseArray = await response.json();
      assert.ok(Array.isArray(responseArray), 'Expected the response body to be an array');
      assert.ok(responseArray.length > 0, 'Expected a non-empty array');

      // 4. Check that every record has an integer ID.
      for (const element of responseArray) {
        assert.ok(Number.isInteger(element.id), 'Expected each resource ID to be an integer');
      }

      // 5. Check that IDs are unique across the collection.
      const responseIds = responseArray.map(element => element.id);
      const uniqueIds = new Set(responseIds);
      assert.equal(responseIds.length, uniqueIds.size, 'Expected resource IDs to be unique');
    });

    it(`GET /${resource}/1 returns valid resource data`, async function () {
      // 1. Request one resource and check that the response is HTTP 200.
      const response = await fetch(`${baseUrl}/${resource}/1`, {
        signal: AbortSignal.timeout(10000),
      });
      assert.equal(response.status, 200, 'Expected HTTP 200');

      // 2. Confirm that the response is a non-empty object, not an array.
      const data = await response.json();
      assert.notEqual(data, null, 'Expected a non-null object');
      assert.equal(typeof data, 'object', 'Expected the response body to be an object');
      assert.ok(!Array.isArray(data), 'Expected one resource instead of an array');
      assert.ok(Object.keys(data).length > 0, 'Expected a non-empty object');
      assert.equal(data.id, 1, 'Expected the returned ID to match the requested ID');
    });
  }
});
