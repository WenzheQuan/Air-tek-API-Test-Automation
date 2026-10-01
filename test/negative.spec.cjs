const assert = require('node:assert/strict');

const baseUrl = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

describe('Negative and edge cases', function () {
  it('GET /posts?userId=999999 returns an empty array', async function () {
    // A valid filter with no matches should return an empty collection.
    const response = await fetch(`${baseUrl}/posts?userId=999999`, {
      signal: AbortSignal.timeout(10000),
    });

    assert.equal(response.status, 200, 'Expected HTTP 200');

    const posts = await response.json();
    assert.ok(Array.isArray(posts), 'Expected an array');
    assert.equal(posts.length, 0, 'Expected an empty array');
  });

  it('GET /posts/999999 returns HTTP 404', async function () {
    // Request a single post that does not exist.
    const response = await fetch(`${baseUrl}/posts/999999`, {
      signal: AbortSignal.timeout(10000),
    });

    assert.equal(response.status, 404, 'Expected HTTP 404');

    // JSONPlaceholder represents a missing resource as an empty object.
    const post = await response.json();
    assert.equal(typeof post, 'object', 'Expected an object');
    assert.ok(!Array.isArray(post), 'Expected an object instead of an array');
    assert.equal(Object.keys(post).length, 0, 'Expected an empty object');
  });
});
