# Air-tek API Test Automation

This project contains a focused set of automated API tests for [JSONPlaceholder](https://jsonplaceholder.typicode.com/). It was created for a time-boxed SDET technical assessment, so the suite favors clear, high-value checks over a large framework.

The tests use Mocha, Node.js strict assertions, and the built-in `fetch` API. No application code or test data is hosted in this repository.

## Requirements

- Node.js 20.19.x, or Node.js 22.12 or later
- npm
- An internet connection to reach JSONPlaceholder

## Setup

Clone the repository and install the locked dependencies:

```bash
git clone https://github.com/WenzheQuan/Air-tek-API-Test-Automation.git
cd Air-tek-API-Test-Automation
npm ci
```

## Running the tests

Run the complete suite:

```bash
npm test
```

Run one spec file while investigating a failure:

```bash
npx mocha test/negative.spec.cjs --timeout 15000
```

The default base URL is `https://jsonplaceholder.typicode.com`. It can be replaced with the `API_BASE_URL` environment variable. The value should not end with a slash.

The tests use https://jsonplaceholder.typicode.com by default. Set API_BASE_URL to run them against another compatible environment.

Each request has a 10-second timeout so an unavailable external service does not leave the suite waiting indefinitely. Mocha uses a 15-second timeout for each test.

## Test coverage

The suite currently contains 25 tests covering the following behavior:

- Collection and single-resource requests for posts, comments, albums, photos, todos, and users
- Basic response structure, non-empty results, integer IDs, and unique collection IDs
- Detailed validation of a single post, including its ID, user ID, title, and body
- POST, PUT, PATCH, and DELETE behavior for posts
- Nested relationships such as post comments, album photos, and user-owned resources
- A valid filter with no matching records
- A missing single resource that returns HTTP 404
- A nested request for a missing parent that returns an empty collection

The resource checks are parameterized so the same expectations are applied consistently across the six public resource types. Write tests also confirm that the response contains the submitted data and that PATCH leaves fields outside the payload unchanged.

## Latest test result

The full suite was run locally before this README was updated:

```text
25 passing
```

Mocha returns a non-zero exit code if any test fails, so the command can also be used in a CI pipeline.

## Project structure

```text
test/
  resources.spec.cjs   Collection and single-resource checks
  posts.spec.cjs       Detailed validation of one post
  post-write.spec.cjs  POST, PUT, PATCH, and DELETE scenarios
  nested.spec.cjs      Parameterized nested-resource checks
  negative.spec.cjs    Missing and empty-result scenarios
```

## Assumptions

- JSONPlaceholder is available and its published sample data remains stable.
- Resource ID `1` exists for the resources used by the tests.
- ID `999999` does not exist and is suitable for missing-data checks.
- JSONPlaceholder simulates write operations. POST, PUT, PATCH, and DELETE responses can be validated, but the changes are not stored permanently.
- A valid collection query with no matches returns HTTP 200 and an empty array.

## Scope and tradeoffs

The assessment was limited to two hours. I used that time to cover representative read, write, relationship, and negative behaviors with code that can be explained and maintained easily.

The project does not include authentication tests because JSONPlaceholder has no authentication. It also omits load testing, retry logic, a reporting package, CI configuration, and exhaustive field-by-field schemas for every resource. With more time, I would add a small shared request helper, schema validation for each resource type, and a CI workflow that runs the suite on every pull request.
