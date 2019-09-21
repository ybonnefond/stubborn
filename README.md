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

Stubborn is tested on NodeJS 8.x and above.

Npm:

```
npm install --save-dev stubborn-ws
```

Yarn:

```
yarn add -D stubborn-ws
```

## Usage

Stubborn is a testing tool that let you **hot** load and unload routes into a webserver.
Requests are **strictly** matched against routes definitions based on Method, Path, Query parameters, Headers and Body.
If the request does not exactly match one route definition (ex: extra parameter, missing parameter, value does not match, etc), Stubborn will respond with a 501.

The very fact that Stubborn respond to the request validates that the parameters sent are the expected one, any change in the code that send the request will break the test. Any breaking change will be picked up by your test.

Stubborn response headers and body can be hardcoded or defined using a template.

```typescript
import request from 'got';
import { Stubborn } from 'stubborn-ws';

describe('Test', () => {
  const sb = new Stubborn();

  beforeAll(async () => await sb.start());
  afterAll(async () => await sb.stop());

  // Clean up all routes after a test if needed
  afterEach(() => sb.clear());

  it('should respond to query', async () => {
    const body = { some: 'body' };
    sb.get('/').setResponseBody({ some: 'body' });

    const res = await request(`${sb.getOrigin()}`, { json: true });

    expect(res.body).toEqual(body);
  });
});
```

Stubborn **strictly** matches the request against the route definition.

If a query parameter or a header is missing, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter is missing', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await request(`${sb.getOrigin()}`, { throwHttpErrors: false });

  expect(res.statusCode).toEqual(501);
});
```

If a query parameter or a header is added, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter is added', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await request(`${sb.getOrigin()}?page=1&limit=10`, {
    throwHttpErrors: false,
  });

  expect(res.statusCode).toEqual(501);
});
```

If a query parameter or a header does not match the route definition, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter does not match the definition', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await request(`${sb.getOrigin()}?page=2`, {
    throwHttpErrors: false,
  });

  expect(res.statusCode).toEqual(501);
});
```

You can use `null` as wildcard

```typescript
it('should match using wildcard', async () => {
  sb.get('/')
    .setQueryParameters({ page: null })
    .setHeaders(null);

  const res = await request(`${sb.getOrigin()}?page=2`, {
    headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' },
    throwHttpErrors: false,
  });

  expect(res.statusCode).toEqual(200);
});
```

You can use regex to match a parameter, header or body

```typescript
it('should match using a regexp', async () => {
  sb.post('/', {
    slug: /^[a-z\-]*$/,
  });

  const res = await request(`${sb.getOrigin()}?page=2`, {
    method: 'POST',
    body: { slug: 'stubborn-ws' },
  });

  expect(res.statusCode).toEqual(200);
});
```

You can use a function to match a parameter, header or body

```typescript
it('should match using a function', async () => {
  sb.get('/').setQueryParameters({
    page: value => parseInt(value as string) > 0,
  });

  const res = await request('/?page=2');

  expect(res).toReplyWith(STATUS_CODES.SUCCESS);
});
```

## Public API

See the [API documentation](https://ybonnefond.github.io/stubborn/)

## FAQ

#### Q: Stubborn is not matching my route definition and always return a 501

Stubborn is STUBBORN, therefore it will return a 501 if it does not exactly match the route definition you have set up.
To help you find what missing in the route definition, you can compare it to the response body returned when receiving a 501:

```typescript
const route = sb
  .get('/')
  // This header definition will miss additional header added by got, like user-agent, connexion, etc...
  .setHeaders({ 'X-Api-Key': 'test' });

const res = await request(sb.getOrigin(), {
  headers: { 'x-api-key': 'api key' },
});

expect(res.statusCode).toBe(501);

const def = route.getDefinition();

// Definition used by stubborn to match the request against
console.log('--- DEFINTION ---\n', def);
// Actual request received
console.log('--- REQUEST ---\n', res.body);

// Spot the differences or use a diff tool to find them ;)
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

## Contributing

### Release

```
git checkout master
git pull --rebase
yarn doc
git add .
git commit -m 'doc(): Update documentation'
yarn publish --<major|minor|patch>
git push --follow-tags
```

Then go to github to [draft a new release](https://github.com/ybonnefond/stubborn/releases/new)
