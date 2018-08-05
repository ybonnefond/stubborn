'use strict';

describe('index', () => {
    const got = require('got');
    const diff = require('jest-diff');

    const { STATUS_CODES } = require('./constants');
    const { Stubborn } = require('./index');

    const sb = new Stubborn({ port: 0 });

    expect.extend({
        toReplyWith: async function toReplyWith(req, statusCode, body, headers) {
            const response = await req;

            const fail = (message, { expected, received } = {}) => {
                const extra = expected ? diff(expected, received, { expand: this.expand }) : '';
                return {
                    pass: false,
                    message: () => `${message}\n${extra}\nRequest received:\n${JSON.stringify(response.body, null, 2)}` // eslint-disable-line no-magic-numbers
                };
            };

            if (statusCode !== response.statusCode) {
                return fail(`expects ${statusCode} status code, got ${response.statusCode}`);
            }

            if (body && !this.equals(body, response.body)) {
                return fail('Body does not match', body, response.body);
            }

            if (headers && !this.equals(headers, response.headers)) {
                return fail('Headers does not match', headers, response.headers);
            }

            return {
                message: () => 'response ok',
                pass: true
            };
        }
    });

    beforeAll(async() => await sb.start());
    afterAll(async() => await sb.stop());
    afterEach(() => sb.clear());

    it('should return NOT_IMPLEMENTED if no routes are configured', async() => {
        await expect(request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
    });

    describe('Request matching', () => {
        describe('Method', () => {
            it('should return NOT_IMPLEMENTED if method does not match', async() => {
                sb.get('/');

                await expect(request('/', { method: 'POST' })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if method is GET', async() => {
                sb.get('/');

                await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is POST', async() => {
                sb.post('/');

                await expect(request('/', { method: 'POST' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is POST with empty body', async() => {
                sb.post('/', '');

                await expect(request('/', { method: 'POST', json: false, body: '' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is POST with string body', async() => {
                sb.post('/', 'body');

                await expect(request('/', { method: 'POST', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PUT', async() => {
                sb.put('/');

                await expect(request('/', { method: 'PUT' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PUT with string body', async() => {
                sb.put('/', 'body');

                await expect(request('/', { method: 'PUT', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PATCH', async() => {
                sb.patch('/');

                await expect(request('/', { method: 'PATCH' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PATCH with string body', async() => {
                sb.patch('/', 'body');

                await expect(request('/', { method: 'PATCH', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is DELETE', async() => {
                sb.delete('/');

                await expect(request('/', { method: 'DELETE' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is DELETE with string body', async() => {
                sb.delete('/', 'body');

                await expect(request('/', { method: 'DELETE', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Path', () => {
            it('should return NOT_IMPLEMENTED if path does not strictly match', async() => {
                sb.get('/test');

                await expect(request('/test2')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if path strictly match', async() => {
                sb.get('/test');

                await expect(request('/test')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return NOT_IMPLEMENTED if path does not match a regex', async() => {
                sb.get(/\/test\/[0-9]{1}/);

                await expect(request('/test2', { method: 'GET' })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if path match regexp', async() => {
                sb.get(/\/test\/[0-9]{1}/);

                await expect(request('/test/2')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if path match custom function', async() => {
                sb.get((path) => path === '/test/2');

                await expect(request('/test/2')).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Headers', () => {
            it('should return NOT_IMPLEMENTED if header is not in definition', async() => {
                sb.get('/');

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if header in definition is not provided', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });

                await expect(request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if headers name are different', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });

                await expect(request('/', { headers: { 'x-api-key': 'api-key' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if headers values are different', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });

                await expect(request('/', { headers: { Authorization: 'not-token' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if header is wildcarded', async() => {
                sb
                    .get('/')
                    .setHeaders(null);

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header is null and in request', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: null });

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header is null and not in request', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: null });

                await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header is strictly equal to the definition', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return NOT_IMPLEMENTED if header does not match the definition', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

                await expect(request('/', { headers: { Authorization: 'Bearer 11' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if header match a regexp', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header match a custom function', async() => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: (header) => header === 'Bearer 9' });

                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Query', () => {
            it('should return NOT_IMPLEMENTED if query parameters is not in definition', async() => {
                sb.get('/');

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if query parameter in definition is not provided', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: 10 });

                await expect(request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if query parameters are different', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: 10 });

                await expect(request('/?limit=5')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if query parameter value is not strictly equal to definition', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: 10 });

                await expect(request('/?page=11')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if query parameter is strictly equal to the definition', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: '10' });

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameters are wildcarded', async() => {
                sb
                    .get('/')
                    .setQueryParameters(null);

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter is null and in query', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: null });

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter is null and not in query', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: null });

                await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter matches multiple values', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ image: ['id1', 'id2'] });

                await expect(request('/?image=id1&image=id2')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter does not match multiple values', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ image: ['id1', 'id2'] });

                await expect(request('/?image=id1&image=id3')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if header does not match the definition', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: /^\d+$/ });

                await expect(request('/?page=two')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if header match a regexp', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: /^\d+$/ });

                await expect(request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header match a custom function', async() => {
                sb
                    .get('/')
                    .setQueryParameters({ page: (param) => param === '100' });

                await expect(request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Body', () => {
            it('should return NOT_IMPLEMENTED if body is not in definition', async() => {
                sb.post('/');

                await expect(request('/', { method: 'POST', body: 'test', json: false })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            describe('Text body', async() => {
                it('should return NOT_IMPLEMENTED if no body in request but in definition', async() => {
                    sb
                        .post('/', 'test')
                        .setHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return NOT_IMPLEMENTED if body in request but not in definition', async() => {
                    sb
                        .post('/')
                        .setHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', body: 'test', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return SUCCESS if definition is strictly equal to body', async() => {
                    sb
                        .post('/', 'test')
                        .setHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', body: 'test', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return NOT_IMPLEMENTED if string body does not equal definition body', async() => {
                    sb
                        .post('/', 'test')
                        .setHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', body: 'test2', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });
            });

            describe('Object body', () => {
                it('should return SUCCESS if json body is equal to definition', async() => {
                    sb
                        .post('/', { key: 'value' })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return NOT_IMPLEMENTED if values are different in object body', async() => {
                    sb
                        .post('/', { key: 'value2' })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return NOT_IMPLEMENTED if keys are different in object body', async() => {
                    sb
                        .post('/', { key2: 'value' })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return NOT_IMPLEMENTED if count keys are different in object definition', async() => {
                    sb
                        .post('/', { key: 'value', key2: 'value' })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return SUCCESS if json body is equal to definition with complex object', async() => {
                    sb
                        .post('/', { subObject: { subArray: [{ key: 'value' }] } })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { subObject: { subArray: [{ key: 'value' }] } }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return SUCCESS if body equals definition with regex', async() => {
                    sb
                        .post('/', { key: /\d+/, key2: [{ subkey: /\d+/ }] })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 11, key2: [{ subkey: 13 }] }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return SUCCESS if body equals definition with custom function', async() => {
                    sb
                        .post('/', {
                            key: (val) => val === 'test',
                            key2: [
                                { subkey: (val) => val === 'toto' }
                            ]
                        })
                        .setHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'test', key2: [{ subkey: 'toto' }] }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });
            });
        });
    });

    describe('Response', () => {
        it('should respond with NOT_IMPLEMENTED status code and request information', async() => {
            const options = {
                method: 'POST',
                headers: {
                    'x-api-key': 'API_KEY'
                },
                body: { key: 'value' },
                json: true
            };
            await expect(request('/?page=10&limit=100', options)).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED, {
                message: expect.any(String),
                request: {
                    method: 'POST',
                    path: '/',
                    headers: expect.objectContaining(options.headers),
                    query: { page: '10', limit: '100' },
                    body: options.body
                }
            });
        });

        it('should respond with provided status code', async() => {
            const STATUS_CODE = 201;
            sb
                .get('/')
                .setResponseStatusCode(STATUS_CODE);

            await expect(request('/')).toReplyWith(STATUS_CODE);
        });

        it('should respond with provided headers', async() => {
            sb
                .get('/')
                .setResponseHeaders({ custom: 'header' });

            await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS, '', expect.objectContaining({ custom: 'header' }));
        });

        it('should respond with provided string body', async() => {
            sb
                .get('/')
                .setResponseBody('toto');

            await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS, 'toto');
        });

        it('should respond with provided object body', async() => {
            sb
                .get('/')
                .setResponseBody({ custom: 'body' });

            await expect(request('/', { json: true })).toReplyWith(STATUS_CODES.SUCCESS, { custom: 'body' });
        });

        it('should respond with dynamic body', async() => {
            sb
                .get('/')
                .setQueryParameters({ page: '10' })
                .setResponseBody({
                    custom: (req) => req.query.page,
                    arr: ['1', '2', () => '3', { one: () => 'un' }],
                    sym: Symbol('bol')
                });

            await expect(request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS, {
                custom: '10',
                arr: ['1', '2', '3', { one: 'un' }],
                sym: 'bol'
            });
        });
    });

    describe('Doc ehandle basic usage', () => {
        it('should respond to query', async() => {
            const body = { some: 'body' };
            sb.get('/').setResponseBody({ some: 'body' });

            const res = await got(`${sb.getOrigin()}`, { json: true });

            expect(res.body).toEqual(body);
        });

        it('should respond 501 if a parameter is missing', async() => {
            sb.get('/').setQueryParameters({ page: '1' });

            const res = await got(`${sb.getOrigin()}`, { throwHttpErrors: false });

            expect(res.statusCode).toEqual(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should respond 501 if a parameter is added', async() => {
            sb.get('/').setQueryParameters({ page: '1' });

            const res = await got(`${sb.getOrigin()}?page=1&limit=10`, { throwHttpErrors: false });

            expect(res.statusCode).toEqual(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should respond 501 if a parameter is added', async() => {
            sb.get('/').setQueryParameters({ page: '1' });

            const res = await got(`${sb.getOrigin()}?page=2`, { throwHttpErrors: false });

            expect(res.statusCode).toEqual(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should respond using wildcard for paramter and headers', async() => {
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

            expect(res.statusCode).toEqual(STATUS_CODES.SUCCESS);
        });
    });

    function request(path = '/', options = {}) {
        return got(`${sb.getOrigin()}${path}`, Object.assign({
            method: 'GET',
            json: true,
            throwHttpErrors: false
        }, options));
    }
});

