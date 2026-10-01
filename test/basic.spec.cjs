const assert = require('node:assert/strict');

// The environment variable makes it possible to run the same tests against another deployment.
const baseUrl = (process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com').replace(/\/$/, '');

// Keep the basic smoke coverage consistent across every public resource collection.
const resources = ['posts', 'comments', 'albums', 'photos', 'todos', 'users'];

describe('Basic resource checks', function () {
  for (const resource of resources) {
    it(`GET /${resource} returns a non-empty JSON collection`, async function () {
      // A request timeout prevents an unavailable API from hanging the test run.
      const response = await fetch(`${baseUrl}/${resource}`, {
        signal: AbortSignal.timeout(10000),
      });

      // Check the HTTP response before reading its payload.
      assert.equal(response.status, 200, 'Expected HTTP 200');

      const data = await response.json();

      // Every collection endpoint should return at least one resource.
      assert.equal(typeof data, 'object', 'Expected the JSON response to be an object');
      assert.ok(Array.isArray(data), 'Expected the response body to be an array');
      assert.ok(data.length > 0, 'Expected at least one result');
    });
  }
});
