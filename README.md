# Stubborn

[![Build Status](https://travis-ci.org/ybonnefond/stubborn.svg?branch=master)](https://travis-ci.org/ybonnefond/stubborn) [![Coverage Status](https://coveralls.io/repos/github/ybonnefond/stubborn/badge.svg?branch=master)](https://coveralls.io/github/ybonnefond/stubborn?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![node](https://img.shields.io/node/v/stubborn-ws.svg)

**Stubborn** web server to mock external api responses. It is basically [nock](https://github.com/nock/nock) meets [Dyson](https://github.com/webpro/dyson). **Stubborn** will **strictly** match the requests based on the definition like [nock](https://github.com/nock/nock) but in a separate web server like [Dyson](https://github.com/webpro/dyson).

<hr />

- [Installation](#installation)
- [Usage](#usage)
- [API](#public-api)
- [FAQ](#faq)
- [Contributing](#contributing)
  - [Release](#release)

<hr />

## Installation

```
npm install --save-dev stubborn-ws
```

```
yarn add -D stubborn-ws
```

## Usage

Stubborn is a testing tool that let you **hot** load and unload routes into a webserver.
Requests are **strictly** matched against routes definitions based on Method, Path, Query parameters, Headers and Body.
If the request does not exactly match one route definition (ex: extra parameter, missing parameter, value does not match, etc), Stubborn will respond with a 501.

The very fact that Stubborn responds to the request validates that the parameters sent are the expected one, any change in the code that send the request will break the test. Any breaking change will be picked up by your test.

Stubborn response headers and body can be hardcoded or defined using a template.

You can find a [complete working test suite](test/specs/readme.spec.ts) of the following examples [here](test/specs/readme.spec.ts).

```typescript
import got from 'got';
import { Stubborn, STATUS_CODES, WILDCARD } from 'stubborn-ws';

describe('Test', () => {
  const sb = new Stubborn();

  beforeAll(async () => await sb.start());
  afterAll(async () => await sb.stop());

  // Clean up all routes after a test if needed
  afterEach(() => sb.clear());

  it('should respond to query', async () => {
    const body = { some: 'body' };
    sb.get('/').setResponseBody({ some: 'body' });

    const res = await request(`/`);

    expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
    expect(res.body).toEqual(body);
  });

  function request(path = '/', options = {}) {
    return got(`${sb.getOrigin()}${path}`, {
      method: 'GET',
      responseType: 'json',
      throwHttpErrors: false,
      ...options,
    });
  }
});
```

Stubborn **strictly** matches the request against the route definition.

If a query parameter or a header is missing, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter is missing', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await request(`/`);

  expect(res.statusCode).toEqual(STATUS_CODES.NOT_IMPLEMENTED);
});
```

If a query parameter or a header is added, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter is added', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await request(`/?page=1&limit=10`);

  expect(res.statusCode).toEqual(STATUS_CODES.NOT_IMPLEMENTED);
});
```

If a query parameter or a header does not match the route definition, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter does not match the definition', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await request(`/?page=2`);

  expect(res.statusCode).toEqual(STATUS_CODES.NOT_IMPLEMENTED);
});
```

You can use `null` as wildcard

```typescript
it('should match using wildcard', async () => {
  sb.get('/').setQueryParameters({ page: WILDCARD }).setHeaders(WILDCARD);

  const res = await request(`/?page=2`, {
    headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' },
  });

  expect(res.statusCode).toEqual(STATUS_CODES.SUCCESS);
});
```

You can use regex to match a parameter, header or body

```typescript
it('should match using a regexp', async () => {
  sb.post('/', {
    slug: /^[a-z\-]*$/,
  });

  const res = await request(`/?page=2`, {
    method: 'POST',
    json: { slug: 'stubborn-ws' },
  });

  expect(res.statusCode).toEqual(200);
});
```

You can use a function to match a parameter, header or body

```typescript
import { STATUS_CODES } from 'stubborn-ws';
it('should match using a function', async () => {
  sb.get('/').setQueryParameters({
    page: value => parseInt(value as string) > 0,
  });

  const res = await request(`/?page=2`);

  expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
});
```

## Public API

See the [API documentation](https://ybonnefond.github.io/stubborn/)

## FAQ

#### Q: Stubborn is not matching my route definition and always return a 501

Stubborn is STUBBORN, therefore it will return a 501 if it does not exactly match the route definition you have set up.
To help you find what missing in the route definition, you can compare it to the response body returned when receiving a 501:

```typescript
import { logDiff } from 'stubborn-ws';

const route = sb
  .get('/')
  // This header definition will miss additional header added by got, like user-agent, connexion, etc...
  .setHeaders({ 'X-Api-Key': 'test' });

// Will log in console the diff between the route and any request throwing a 501
logDiffOn501(sb, route);

const res = await request(sb.getOrigin(), {
  headers: { 'x-api-key': 'api key' },
});

expect(res.statusCode).toBe(501);
```

#### Q: How do I know if stubborn has been called and matched the route defined?

Stubborn will return a 501 (Not Implemented) if it received a request but cannot match any route.
If the request matches the route it will respond according to the route response configuration and update the `call` property of the route

```typescript
  async function call() {
    return request(sb.getOrigin());
  }

  // No route setup in Stubborn
  const res = await call();

  expect(res.statusCode).toBe(501);
  expect(res.body).toEqual({
    method: 'GET'
    path: '/',
    headers: {
      // ...
    }
    // ...
  });


  const route = sb.get('/')
    .setHeaders(null)
    .setResponseBody('content');


  const res = await call();
  expect(res.calls.length).toBe(1);
  expect(res.calls[0]).toEqual({
    method: 'GET'
    path: '/',
    headers: {
      // ...
    }
      // ...
    });
```
