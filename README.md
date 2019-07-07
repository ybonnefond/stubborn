# Stubborn

[![Build Status](https://travis-ci.org/ybonnefond/stubborn.svg?branch=master)](https://travis-ci.org/ybonnefond/stubborn) [![Coverage Status](https://coveralls.io/repos/github/ybonnefond/stubborn/badge.svg?branch=master)](https://coveralls.io/github/ybonnefond/stubborn?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![node](https://img.shields.io/node/v/stubborn-ws.svg)

**Stubborn** web server to mock external api responses. It is basically [nock](https://github.com/nock/nock) meets [Dyson](https://github.com/webpro/dyson). **Stubborn** will **strictly** match the requests based on the definition like [nock](https://github.com/nock/nock) but in a separate web server like [Dyson](https://github.com/webpro/dyson).

<hr />

- [Installation](#installation)
- [Usage](#usage)
- [API](#public-api)
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
import got from 'got';
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

    const res = await got(`${sb.getOrigin()}`, { json: true });

    expect(res.body).toEqual(body);
  });
});
```

Stubborn **strictly** matches the request against the route definition.

If a query parameter or a header is missing, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter is missing', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await got(`${sb.getOrigin()}`, { throwHttpErrors: false });

  expect(res.statusCode).toEqual(501);
});
```

If a query parameter or a header is added, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter is added', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await got(`${sb.getOrigin()}?page=1&limit=10`, {
    throwHttpErrors: false,
  });

  expect(res.statusCode).toEqual(501);
});
```

If a query parameter or a header does not match the route definition, stubborn will return a 501 (not implemented)

```typescript
it('should respond 501 if a parameter does not match the definition', async () => {
  sb.get('/').setQueryParameters({ page: '1' });

  const res = await got(`${sb.getOrigin()}?page=2`, { throwHttpErrors: false });

  expect(res.statusCode).toEqual(501);
});
```

You can use `null` as wildcard

```typescript
it('should respond using wildcard', async () => {
  sb.get('/')
    .setQueryParameters({ page: null })
    .setHeaders(null);

  const res = await got(`${sb.getOrigin()}?page=2`, {
    headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' },
    throwHttpErrors: false,
  });

  expect(res.statusCode).toEqual(200);
});
```

## Public API

See the [API documentation](https://ybonnefond.github.io/stubborn/)

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
