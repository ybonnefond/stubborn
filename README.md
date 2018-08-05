# Stubborn 
[![Build Status](https://travis-ci.org/ybonnefond/stubborn.svg?branch=master)](https://travis-ci.org/ybonnefond/stubborn) [![Coverage Status](https://coveralls.io/repos/github/ybonnefond/stubborn/badge.svg?branch=master)](https://coveralls.io/github/ybonnefond/stubborn?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/ybonnefond/stubborn.svg)](https://greenkeeper.io/)

**Stubborn** web server to mock external api responses. It is basically [nock](https://github.com/nock/nock) meets [Dyson](https://github.com/webpro/dyson). **Stubborn** will **strictly** match the requests based on the definition like [nock](https://github.com/nock/nock) but in a separate web server like [Dyson](https://github.com/webpro/dyson).

<hr />

- [Installation](#installation)
  * [Node version support](#node-version-support)
- [Usage](#usage)
  * [Basic Usage](#basic-usage)

<hr />

## Installation

Stubborn is tested on NodeJS 8.x and above.

Npm:
```bash
npm install --save-dev stubborn
```

Yarn:
```bash
yarn add -D stubborn
```

## Usage


Stubborn strictly matches requests against on route definitions using rules based on:
- Method
- Path
- Query parameters
- Headers
- Body

### Basic Usage
```Javascript
describe('Test', () => {
    const got = require('got');
    const { Stubborn } = require('stubborn-ws');

    const sb = new Stubborn({ port: 8080 });

    beforeAll(async() => await sb.start());
    afterAll(async() => await sb.stop());

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

```javascript
    it('should respond 501 if a parameter is missing', async () => {
        sb.get('/').setQueryParameters({ page: '1' });

        const res = await got(`${sb.getOrigin()}`, { throwHttpErrors: false });

        expect(res.statusCode).toEqual(501);
    });
```

If a query parameter or a header is added, stubborn will return a 501 (not implemented)

```javascript
    it('should respond 501 if a parameter is added', async () => {
        sb.get('/').setQueryParameters({ page: '1' });

        const res = await got(`${sb.getOrigin()}?page=1&limit=10`, { throwHttpErrors: false });

        expect(res.statusCode).toEqual(501);
    });
```

If a query parameter or a header does not match the route definition, stubborn will return a 501 (not implemented)

```javascript
    it('should respond 501 if a parameter does not match the definition', async () => {
        sb.get('/').setQueryParameters({ page: '1' });

        const res = await got(`${sb.getOrigin()}?page=2`, { throwHttpErrors: false });

        expect(res.statusCode).toEqual(501);
    });
```

You can use `null` as wildcard

```javascript
    it('should respond using wildcard', async () => {
        sb.get('/')
            .setQueryParameters({ page: null })
            .setHeaders(null);


        const res = await got(
            `${sb.getOrigin()}?page=2`, 
            { 
                headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' }, 
                throwHttpErrors: false 
            }
        );

        expect(res.statusCode).toEqual(200);
    });
```

