const assert = require('node:assert/strict');
const baseUrl = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

describe('Posts write APIs', function () {
  it('POST /posts creates a new post', async function () {
    // 1. Define the post data to send in the request.
    const payload = {
      userId: 1,
      title: 'new post title',
      body: 'new post body',
    };

    // 2. Send the POST request with the payload as JSON.
    const response = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(payload),
      // Stop waiting if the API does not respond within 10 seconds.
      signal: AbortSignal.timeout(10000),
    });

    // 3. Check the status and parse the JSON response.
    assert.equal(response.status, 201, 'Expected HTTP 201');
    const createdPost = await response.json();

    // 4. Check that an ID was returned with the submitted data.
    assert.ok(Number.isInteger(createdPost.id), 'Expected a new post ID');
    assert.equal(createdPost.title, payload.title, 'Expected the title to match');
    assert.equal(createdPost.body, payload.body, 'Expected the body to match');
    assert.equal(createdPost.userId, payload.userId, 'Expected the user ID to match');
  });

  it('PUT /posts/1 returns the updated post', async function () {
    // 1. Define the complete post data to send in the request.
    const payload = {
      userId: 1,
      id: 1,
      title: 'updated title',
      body: 'updated body',
    };
    // 2. Send the PUT request with the payload as JSON.
    const response = await fetch(`${baseUrl}/posts/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    // 3. Check that the request succeeds with HTTP 200.
    assert.equal(response.status, 200, 'Expected HTTP 200');
    // 4. Parse the JSON response.
    const returnedData = await response.json();

    // 5. Check that the response contains the submitted data.
    assert.equal(returnedData.id, payload.id, 'Expected the ID to match');
    assert.equal(returnedData.title, payload.title, 'Expected the title to match');
    assert.equal(returnedData.body, payload.body, 'Expected the body to match');
    assert.equal(returnedData.userId, payload.userId, 'Expected the user ID to match');
    // JSONPlaceholder simulates the update but does not save it permanently.
  });

  it('PATCH /posts/1 updates only the title', async function () {
    // 1. Get the original post so unchanged fields can be compared later.
    const originalResponse = await fetch(`${baseUrl}/posts/1`, {
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(originalResponse.status, 200, 'Expected HTTP 200');
    const originalPost = await originalResponse.json();
    const payload = {
      title: 'patch a new title',
    };
    // 2. Send a PATCH request containing only the field to update.
    const patchResponse = await fetch(`${baseUrl}/posts/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(patchResponse.status, 200, 'Expected HTTP 200');
    const updatedPost = await patchResponse.json();
    // 3. Check that the title changed and the other fields stayed the same.
    assert.equal(updatedPost.id, originalPost.id, 'Expected the ID to stay the same');
    assert.equal(updatedPost.userId, originalPost.userId, 'Expected the user ID to stay the same');
    assert.equal(updatedPost.body, originalPost.body, 'Expected the body to stay the same');
    assert.equal(updatedPost.title, payload.title, 'Expected the title to be updated');
  });

  it('DELETE /posts/1 returns an empty object', async function () {
    // 1. Send the DELETE request for an existing post.
    const deleteResponse = await fetch(`${baseUrl}/posts/1`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(10000),
    });
    // 2. Check the status and confirm that the response body is empty.
    assert.equal(deleteResponse.status, 200, 'Expected HTTP 200');
    const deletedData = await deleteResponse.json();
    assert.deepEqual(deletedData, {}, 'Expected an empty object');
  });
});
