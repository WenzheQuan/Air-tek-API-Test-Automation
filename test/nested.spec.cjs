const assert = require('node:assert/strict');

const baseUrl = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

describe('Nested APIs', function () {
  const cases = [
    { path: '/posts/1/comments', relationKey: 'postId' },
    { path: '/albums/1/photos', relationKey: 'albumId' },
    { path: '/users/1/albums', relationKey: 'userId' },
    { path: '/users/1/todos', relationKey: 'userId' },
    { path: '/users/1/posts', relationKey: 'userId' },
  ];

  for (const testCase of cases) {
    it(`GET ${testCase.path} returns related records`, async function () {
      // 1. Send a GET request to the nested resource endpoint.
      const response = await fetch(`${baseUrl}${testCase.path}`, {
        signal: AbortSignal.timeout(10000),
      });
      // 2. Check that the request succeeds with HTTP 200.
      assert.equal(response.status, 200, 'Expected HTTP 200');
      // 3. Parse the JSON response.
      const data = await response.json();
      // 4. Confirm that the response is a non-empty array.
      assert.ok(Array.isArray(data), 'Expected an array');
      assert.ok(data.length > 0, 'Expected a non-empty array');
      // 5. Check that every record belongs to the requested parent resource.
      const allRecordsMatch = data.every(element => element[testCase.relationKey] === 1);
      assert.ok(allRecordsMatch, `Expected every ${testCase.relationKey} to equal 1`);
      // Each record has its own ID, while the relation key identifies its parent.
    });
  }

  it('GET /posts/999999/comments returns an empty array', async function () {
    // 1. Request comments for a post that does not exist.
    const response = await fetch(`${baseUrl}/posts/999999/comments`, {
      signal: AbortSignal.timeout(10000),
    });

    // 2. Check that the API handles the request successfully.
    assert.equal(response.status, 200, 'Expected HTTP 200');

    // 3. Confirm that no related comments are returned.
    const data = await response.json();
    assert.ok(Array.isArray(data), 'Expected an array');
    assert.equal(data.length, 0, 'Expected an empty array');
  });
});
