'use strict';

describe('index', () => {
    const got = require('got');
    const diff = require('jest-diff');

    const { STATUS_CODES } = require('./constants');
    const { Stubborn } = require('./index');

    let ws;
    let wsUrl;

    expect.extend({
        toReplyWith: async function toReplyWith(req, statusCode, body, headers) {
            const response = await req;

            const fail = (message, { expected, received } = {}) => {
                const extra = expected ? diff(expected, received, { expand: this.expand }) : '';
                return {
                    pass: false,
                    message: () => `${message}\n${extra}\nRequest received:\n${JSON.stringify(response.body, null, 2)}`
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

    beforeAll(async() => {
        ws = new Stubborn({ port: 0 });
        await ws.start();
        wsUrl = ws.getOrigin();
    });

    afterEach(() => {
        return ws.clear();
    });

    afterAll(async() => {
        await ws.stop();
    });

    it('should return NOT_IMPLEMENTED if no routes are configured', async() => {
        await expect(request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
    });

    describe('Request matching', () => {
        describe('Method', () => {
            it('should return NOT_IMPLEMENTED if method does not match', async() => {
                ws.get('/');

                await expect(request('/', { method: 'POST' })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if method is GET', async() => {
                ws.get('/');

                await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is POST', async() => {
                ws.post('/');

                await expect(request('/', { method: 'POST' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is POST with empty body', async() => {
                ws.post('/', '');

                await expect(request('/', { method: 'POST', json: false, body: '' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is POST with string body', async() => {
                ws.post('/', 'body');

                await expect(request('/', { method: 'POST', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PUT', async() => {
                ws.put('/');

                await expect(request('/', { method: 'PUT' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PUT with string body', async() => {
                ws.put('/', 'body');

                await expect(request('/', { method: 'PUT', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PATCH', async() => {
                ws.patch('/');

                await expect(request('/', { method: 'PATCH' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is PATCH with string body', async() => {
                ws.patch('/', 'body');

                await expect(request('/', { method: 'PATCH', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is DELETE', async() => {
                ws.delete('/');

                await expect(request('/', { method: 'DELETE' })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if method is DELETE with string body', async() => {
                ws.delete('/', 'body');

                await expect(request('/', { method: 'DELETE', json: false, body: 'body' })).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Path', () => {
            it('should return NOT_IMPLEMENTED if path does not strictly match', async() => {
                ws.get('/test');

                await expect(request('/test2')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if path strictly match', async() => {
                ws.get('/test');

                await expect(request('/test')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return NOT_IMPLEMENTED if path does not match a regex', async() => {
                ws.get(/\/test\/[0-9]{1}/);

                await expect(request('/test2', { method: 'GET' })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if path match regexp', async() => {
                ws.get(/\/test\/[0-9]{1}/);

                await expect(request('/test/2')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if path match custom function', async() => {
                ws.get((path) => path === '/test/2');

                await expect(request('/test/2')).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Headers', () => {
            it('should return NOT_IMPLEMENTED if header is not in definition', async() => {
                ws.get('/');

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if header in definition is not provided', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: 'token' });

                await expect(request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if headers name are different', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: 'token' });

                await expect(request('/', { headers: { 'x-api-key': 'api-key' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if headers values are different', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: 'token' });

                await expect(request('/', { headers: { Authorization: 'not-token' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if header is null and in request', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: null });

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header is null and not in request', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: null });

                await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header is strictly equal to the definition', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: 'token' });

                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return NOT_IMPLEMENTED if header does not match the definition', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

                await expect(request('/', { headers: { Authorization: 'Bearer 11' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if header match a regexp', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header match a custom function', async() => {
                ws
                    .get('/')
                    .addHeaders({ Authorization: (header) => header === 'Bearer 9' });

                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Query', () => {
            it('should return NOT_IMPLEMENTED if query parameters is not in definition', async() => {
                ws.get('/');

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if query parameter in definition is not provided', async() => {
                ws
                    .get('/')
                    .addQuery({ page: 10 });

                await expect(request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if query parameters are different', async() => {
                ws
                    .get('/')
                    .addQuery({ page: 10 });

                await expect(request('/?limit=5')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if query parameter value is not strictly equal to definition', async() => {
                ws
                    .get('/')
                    .addQuery({ page: 10 });

                await expect(request('/?page=11')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if query parameter is strictly equal to the definition', async() => {
                ws
                    .get('/')
                    .addQuery({ page: '10' });

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter is null and in query', async() => {
                ws
                    .get('/')
                    .addQuery({ page: null });

                await expect(request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter is null and not in query', async() => {
                ws
                    .get('/')
                    .addQuery({ page: null });

                await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter matches multiple values', async() => {
                ws
                    .get('/')
                    .addQuery({ image: ['id1', 'id2'] });

                await expect(request('/?image=id1&image=id2')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if query parameter does not match multiple values', async() => {
                ws
                    .get('/')
                    .addQuery({ image: ['id1', 'id2'] });

                await expect(request('/?image=id1&image=id3')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return NOT_IMPLEMENTED if header does not match the definition', async() => {
                ws
                    .get('/')
                    .addQuery({ page: /^\d+$/ });

                await expect(request('/?page=two')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            it('should return SUCCESS if header match a regexp', async() => {
                ws
                    .get('/')
                    .addQuery({ page: /^\d+$/ });

                await expect(request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
            });

            it('should return SUCCESS if header match a custom function', async() => {
                ws
                    .get('/')
                    .addQuery({ page: (param) => param === '100' });

                await expect(request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
            });
        });

        describe('Body', () => {
            it('should return NOT_IMPLEMENTED if body is not in definition', async() => {
                ws.post('/');

                await expect(request('/', { method: 'POST', body: 'test', json: false })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
            });

            describe('Text body', async() => {
                it('should return NOT_IMPLEMENTED if no body in request but in definition', async() => {
                    ws
                        .post('/', 'test')
                        .addHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return NOT_IMPLEMENTED if body in request but not in definition', async() => {
                    ws
                        .post('/')
                        .addHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', body: 'test', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return SUCCESS if definition is strictly equal to body', async() => {
                    ws
                        .post('/', 'test')
                        .addHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', body: 'test', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return NOT_IMPLEMENTED if string body does not equal definition body', async() => {
                    ws
                        .post('/', 'test')
                        .addHeaders({ 'Content-Type': 'text/plain' });

                    await expect(request('/', { method: 'POST', body: 'test2', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });
            });

            describe('Object body', () => {
                it('should return SUCCESS if json body is equal to definition', async() => {
                    ws
                        .post('/', { key: 'value' })
                        .addHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return NOT_IMPLEMENTED if values are different in object body', async() => {
                    ws
                        .post('/', { key: 'value2' })
                        .addHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return NOT_IMPLEMENTED if keys are different in object body', async() => {
                    ws
                        .post('/', { key2: 'value' })
                        .addHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return NOT_IMPLEMENTED if count keys are different in object definition', async() => {
                    ws
                        .post('/', { key: 'value', key2: 'value' })
                        .addHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
                });

                it('should return SUCCESS if json body is equal to definition with complex object', async() => {
                    ws
                        .post('/', { subObject: { subArray: [{ key: 'value' }] } })
                        .addHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { subObject: { subArray: [{ key: 'value' }] } }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return SUCCESS if body equals definition with regex', async() => {
                    ws
                        .post('/', { key: /\d+/, key2: [{ subkey: /\d+/ }] })
                        .addHeaders({ 'Content-Type': 'application/json' });

                    await expect(request('/', { method: 'POST', body: { key: 11, key2: [{ subkey: 13 }] }, json: true })).toReplyWith(STATUS_CODES.SUCCESS);
                });

                it('should return SUCCESS if body equals definition with custom function', async() => {
                    ws
                        .post('/', {
                            key: (val) => val === 'test',
                            key2: [
                                { subkey: (val) => val === 'toto' }
                            ]
                        })
                        .addHeaders({ 'Content-Type': 'application/json' });

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
            ws
                .get('/')
                .setResponseStatusCode(STATUS_CODE);

            await expect(request('/')).toReplyWith(STATUS_CODE);
        });

        it('should respond with provided headers', async() => {
            ws
                .get('/')
                .setResponseHeaders({ custom: 'header' });

            await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS, '', expect.objectContaining({ custom: 'header' }));
        });

        it('should respond with provided string body', async() => {
            ws
                .get('/')
                .setResponseBody('toto');

            await expect(request('/')).toReplyWith(STATUS_CODES.SUCCESS, 'toto');
        });

        it('should respond with provided object body', async() => {
            ws
                .get('/')
                .setResponseBody({ custom: 'body' });

            await expect(request('/', { json: true })).toReplyWith(STATUS_CODES.SUCCESS, { custom: 'body' });
        });

        it('should respond with dynamic body', async() => {
            ws
                .get('/')
                .addQuery({ page: '10' })
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

    describe('Doc examples', () => {
        it('should handle basic usage', async() => {
            const body = { some: 'body' };
            ws.get('/resource')
                .addQuery({ page: '2' })
                .addHeaders({ 'X-Api-Key': 'api_key' })
                .setResponseBody(body);

            await expect(request(
                '/resource?page=2',
                {
                    headers: { 'X-Api-Key': 'api_key' },
                    json: true,
                    throwHttpErrors: false
                }
            )).toReplyWith(STATUS_CODES.SUCCESS, body);
        });
    });

    function request(path = '/', options = {}) {
        return got(`${wsUrl}${path}`, Object.assign({
            method: 'GET',
            json: true,
            throwHttpErrors: false
        }, options));
    }
});

