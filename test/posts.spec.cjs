const assert = require('node:assert/strict');

const baseUrl = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

describe('Posts API - worked example', function () {
  it('GET /posts/1 returns the requested post', async function () {
    // 1. Send the GET request and stop waiting after 10 seconds.
    const response = await fetch(`${baseUrl}/posts/1`, {
      signal: AbortSignal.timeout(10000),
    });

    // 2. Check the HTTP status.
    assert.equal(response.status, 200, 'Expected HTTP 200');

    // 3. Parse the JSON response into a JavaScript object.
    const post = await response.json();
    assert.equal(typeof post, 'object', 'Expected the JSON response to be an object');
    assert.ok(!Array.isArray(post), 'Expected one post instead of an array');

    // 4. Validate the data because a successful request can still return incorrect content.
    assert.equal(post.id, 1, 'The returned ID should match the requested ID');
    assert.equal(typeof post.userId, 'number', 'Expect user id to be a number');
    assert.equal(typeof post.title, 'string', 'Expect title to be string');
    assert.ok(post.title.trim().length > 0, 'The title should not be blank');
    assert.equal(typeof post.body, 'string', 'Expect body to be string');
  });
});
