'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const jest_diff_1 = __importDefault(require("jest-diff"));
const constants_1 = require("./constants");
const index_1 = require("./index");
async function toReplyWith(req, statusCode, body, headers) {
    const response = await req;
    const fail = (message, { expected, received } = {}) => {
        const extra = expected ? jest_diff_1.default(expected, received, { expand: this.expand }) : '';
        return {
            pass: false,
            message: () => `${message}\n${extra}\nRequest received:\n${JSON.stringify(response.body, null, 2)}` // eslint-disable-line no-magic-numbers
        };
    };
    if (statusCode !== response.statusCode) {
        return fail(`expects ${statusCode} status code, got ${response.statusCode}`);
    }
    if (body && !this.equals(body, response.body)) {
        return fail('Body does not match', { expected: body, received: response.body });
    }
    if (headers && !this.equals(headers, response.headers)) {
        return fail('Headers does not match', { expected: headers, received: response.headers });
    }
    return {
        message: () => 'response ok',
        pass: true
    };
}
expect.extend({
    toReplyWith
});
describe('index', () => {
    const sb = new index_1.Stubborn();
    beforeAll(async () => await sb.start());
    afterAll(async () => await sb.stop());
    afterEach(() => sb.clear());
    it('should return NOT_IMPLEMENTED if no routes are configured', async () => {
        await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
    });
    describe('Request matching', () => {
        describe('Method', () => {
            it('should return NOT_IMPLEMENTED if method does not match', async () => {
                sb.get('/');
                await expect(request('/', { method: 'POST' })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if method is GET', async () => {
                sb.get('/');
                await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is POST', async () => {
                sb.post('/');
                await expect(request('/', { method: 'POST' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is POST with empty body', async () => {
                sb.post('/', '');
                await expect(request('/', { method: 'POST', json: false, body: '' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is POST with string body', async () => {
                sb.post('/', 'body');
                await expect(request('/', { method: 'POST', json: false, body: 'body' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is PUT', async () => {
                sb.put('/');
                await expect(request('/', { method: 'PUT' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is PUT with string body', async () => {
                sb.put('/', 'body');
                await expect(request('/', { method: 'PUT', json: false, body: 'body' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is PATCH', async () => {
                sb.patch('/');
                await expect(request('/', { method: 'PATCH' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is PATCH with string body', async () => {
                sb.patch('/', 'body');
                await expect(request('/', { method: 'PATCH', json: false, body: 'body' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if method is DELETE', async () => {
                sb.delete('/');
                await expect(request('/', { method: 'DELETE' })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
        });
        describe('Path', () => {
            it('should return NOT_IMPLEMENTED if path does not strictly match', async () => {
                sb.get('/test');
                await expect(request('/test2')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if path strictly match', async () => {
                sb.get('/test');
                await expect(request('/test')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return NOT_IMPLEMENTED if path does not match a regex', async () => {
                sb.get(/\/test\/[0-9]{1}/);
                await expect(request('/test2', { method: 'GET' })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if path match regexp', async () => {
                sb.get(/\/test\/[0-9]{1}/);
                await expect(request('/test/2')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if path match custom function', async () => {
                sb.get((path) => path === '/test/2');
                await expect(request('/test/2')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
        });
        describe('Headers', () => {
            it('should return NOT_IMPLEMENTED if header is not in definition', async () => {
                sb.get('/');
                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if header in definition is not provided', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });
                await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if headers name are different', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });
                await expect(request('/', { headers: { 'x-api-key': 'api-key' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if headers values are different', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });
                await expect(request('/', { headers: { Authorization: 'not-token' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if header is wildcarded', async () => {
                sb
                    .get('/')
                    .setHeaders(null);
                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if header is null and in request', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: null });
                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if header is null and not in request', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: null });
                await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if header is strictly equal to the definition', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: 'token' });
                await expect(request('/', { headers: { Authorization: 'token' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return NOT_IMPLEMENTED if header does not match the definition', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });
                await expect(request('/', { headers: { Authorization: 'Bearer 11' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if header match a regexp', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });
                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if header match a custom function', async () => {
                sb
                    .get('/')
                    .setHeaders({ Authorization: (header) => header === 'Bearer 9' });
                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS when setting a specific header', async () => {
                sb
                    .get('/')
                    .setHeader('Authorization', 'Bearer 9');
                await expect(request('/', { headers: { Authorization: 'Bearer 9' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
        });
        describe('Query', () => {
            it('should return NOT_IMPLEMENTED if query parameters is not in definition', async () => {
                sb.get('/');
                await expect(request('/?page=10')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if query parameter in definition is not provided', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: 10 });
                await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if query parameters are different', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: 10 });
                await expect(request('/?limit=5')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if query parameter value is not strictly equal to definition', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: 10 });
                await expect(request('/?page=11')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if query parameter is strictly equal to the definition', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: '10' });
                await expect(request('/?page=10')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if query parameters are wildcarded', async () => {
                sb
                    .get('/')
                    .setQueryParameters(null);
                await expect(request('/?page=10')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if query parameter is null and in query', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: null });
                await expect(request('/?page=10')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if query parameter is null and not in query', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: null });
                await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if query parameter matches multiple values', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ image: ['id1', 'id2'] });
                await expect(request('/?image=id1&image=id2')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if query parameter does not match multiple values', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ image: ['id1', 'id2'] });
                await expect(request('/?image=id1&image=id3')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return NOT_IMPLEMENTED if header does not match the definition', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: /^\d+$/ });
                await expect(request('/?page=two')).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            it('should return SUCCESS if header match a regexp', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: /^\d+$/ });
                await expect(request('/?page=100')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS if header match a custom function', async () => {
                sb
                    .get('/')
                    .setQueryParameters({ page: (param) => param === '100' });
                await expect(request('/?page=100')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
            it('should return SUCCESS when setting a specific query parameter', async () => {
                sb
                    .get('/')
                    .setQueryParameter('page', '100');
                await expect(request('/?page=100')).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
            });
        });
        describe('Body', () => {
            it('should return NOT_IMPLEMENTED if body is not in definition', async () => {
                sb.post('/');
                await expect(request('/', { method: 'POST', body: 'test', json: false })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
            });
            describe('Text body', async () => {
                it('should return NOT_IMPLEMENTED if no body in request but in definition', async () => {
                    sb
                        .post('/', 'test')
                        .setHeaders({ 'Content-Type': 'text/plain' });
                    await expect(request('/', { method: 'POST', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
                });
                it('should return NOT_IMPLEMENTED if body in request but not in definition', async () => {
                    sb
                        .post('/')
                        .setHeaders({ 'Content-Type': 'text/plain' });
                    await expect(request('/', { method: 'POST', body: 'test', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
                });
                it('should return SUCCESS if definition is strictly equal to body', async () => {
                    sb
                        .post('/', 'test')
                        .setHeaders({ 'Content-Type': 'text/plain' });
                    await expect(request('/', { method: 'POST', body: 'test', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
                });
                it('should return NOT_IMPLEMENTED if string body does not equal definition body', async () => {
                    sb
                        .post('/', 'test')
                        .setHeaders({ 'Content-Type': 'text/plain' });
                    await expect(request('/', { method: 'POST', body: 'test2', json: false, headers: { 'Content-Type': 'text/plain' } })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
                });
            });
            describe('Object body', () => {
                it('should return SUCCESS if json body is equal to definition', async () => {
                    sb
                        .post('/', { key: 'value' })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
                });
                it('should return NOT_IMPLEMENTED if values are different in object body', async () => {
                    sb
                        .post('/', { key: 'value2' })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
                });
                it('should return NOT_IMPLEMENTED if keys are different in object body', async () => {
                    sb
                        .post('/', { key2: 'value' })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
                });
                it('should return NOT_IMPLEMENTED if count keys are different in object definition', async () => {
                    sb
                        .post('/', { key: 'value', key2: 'value' })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { key: 'value' }, json: true })).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
                });
                it('should return SUCCESS if json body is equal to definition with complex object', async () => {
                    sb
                        .post('/', { subObject: { subArray: [{ key: 'value' }] } })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { subObject: { subArray: [{ key: 'value' }] } }, json: true })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
                });
                it('should return SUCCESS if body equals definition with regex', async () => {
                    sb
                        .post('/', { key: /\d+/, key2: [{ subkey: /\d+/ }] })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { key: 11, key2: [{ subkey: 13 }] }, json: true })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
                });
                it('should return SUCCESS if body equals definition with custom function', async () => {
                    sb
                        .post('/', {
                        key: (val) => val === 'test',
                        key2: [
                            { subkey: (val) => val === 'toto' }
                        ]
                    })
                        .setHeaders({ 'Content-Type': 'application/json' });
                    await expect(request('/', { method: 'POST', body: { key: 'test', key2: [{ subkey: 'toto' }] }, json: true })).toReplyWith(constants_1.STATUS_CODES.SUCCESS);
                });
            });
        });
    });
    describe('Response', () => {
        it('should respond with NOT_IMPLEMENTED status code and request information', async () => {
            const options = {
                method: 'POST',
                headers: {
                    'x-api-key': 'API_KEY'
                },
                body: { key: 'value' },
                json: true
            };
            await expect(request('/?page=10&limit=100', options)).toReplyWith(constants_1.STATUS_CODES.NOT_IMPLEMENTED, {
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
        it('should respond with provided status code', async () => {
            const STATUS_CODE = 201;
            sb
                .get('/')
                .setResponseStatusCode(STATUS_CODE);
            await expect(request('/')).toReplyWith(STATUS_CODE);
        });
        it('should respond with provided headers', async () => {
            sb
                .get('/')
                .setResponseHeaders({ custom: 'header' });
            await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.SUCCESS, '', expect.objectContaining({ custom: 'header' }));
        });
        it('should respond with provided header', async () => {
            sb
                .get('/')
                .setResponseHeader('custom', 'header');
            await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.SUCCESS, '', expect.objectContaining({ custom: 'header' }));
        });
        it('should respond with a json encoded body if accept header is json', async () => {
            sb
                .get('/')
                .setResponseBody('toto');
            await expect(request('/')).toReplyWith(constants_1.STATUS_CODES.SUCCESS, 'toto');
        });
        it('should encode JSON is response content-type header is provided', async () => {
            sb
                .get('/')
                .setResponseBody('toto')
                .setResponseHeader('Content-Type', 'application/json; charset=utf-8');
            await expect(request('/', { json: false })).toReplyWith(constants_1.STATUS_CODES.SUCCESS, JSON.stringify('toto'));
        });
        it('should respond with no encodding if accept and content-type is not provided', async () => {
            sb
                .get('/')
                .setResponseBody('toto');
            await expect(request('/', { json: false })).toReplyWith(constants_1.STATUS_CODES.SUCCESS, 'toto');
        });
        it('should respond with provided object body', async () => {
            sb
                .get('/')
                .setResponseBody({ custom: 'body' });
            await expect(request('/', { json: true })).toReplyWith(constants_1.STATUS_CODES.SUCCESS, { custom: 'body' });
        });
        it('should respond with dynamic body', async () => {
            sb
                .get('/')
                .setQueryParameters({ page: '10' })
                .setResponseBody({
                custom: (req) => req.query.page,
                arr: ['1', '2', () => '3', { one: () => 'un' }],
                sym: Symbol('bol')
            });
            await expect(request('/?page=10')).toReplyWith(constants_1.STATUS_CODES.SUCCESS, {
                custom: '10',
                arr: ['1', '2', '3', { one: 'un' }],
                sym: 'bol'
            });
        });
        it('should pass the current scope for deep object template', async () => {
            sb
                .get('/')
                .setQueryParameters({ page: '22' })
                .setResponseBody({
                custom: {
                    val1: 'some vale',
                    val2: (req, scope) => `${scope.val1} - page: ${req.query.page}`
                }
            });
            await expect(request('/?page=22')).toReplyWith(constants_1.STATUS_CODES.SUCCESS, {
                custom: {
                    val1: 'some value',
                    val2: 'some value - page: 22'
                }
            });
        });
    });
    describe('Doc handle basic usage', () => {
        it('should respond to query', async () => {
            const body = { some: 'body' };
            sb.get('/').setResponseBody({ some: 'body' });
            const res = await got_1.default(`${sb.getOrigin()}`, { json: true });
            expect(res.body).toEqual(body);
        });
        it('should respond 501 if a parameter is missing', async () => {
            sb.get('/').setQueryParameters({ page: '1' });
            const res = await got_1.default(`${sb.getOrigin()}`, { throwHttpErrors: false });
            expect(res.statusCode).toEqual(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
        });
        it('should respond 501 if a parameter is added', async () => {
            sb.get('/').setQueryParameters({ page: '1' });
            const res = await got_1.default(`${sb.getOrigin()}?page=1&limit=10`, { throwHttpErrors: false });
            expect(res.statusCode).toEqual(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
        });
        it('should respond 501 if a parameter is added', async () => {
            sb.get('/').setQueryParameters({ page: '1' });
            const res = await got_1.default(`${sb.getOrigin()}?page=2`, { throwHttpErrors: false });
            expect(res.statusCode).toEqual(constants_1.STATUS_CODES.NOT_IMPLEMENTED);
        });
        it('should respond using wildcard for paramter and headers', async () => {
            sb.get('/')
                .setQueryParameters({ page: null })
                .setHeaders(null);
            const res = await got_1.default(`${sb.getOrigin()}?page=2`, {
                headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' },
                throwHttpErrors: false
            });
            expect(res.statusCode).toEqual(constants_1.STATUS_CODES.SUCCESS);
        });
    });
    describe('Retain Calls', () => {
        it('should have no calls when initialize the route', () => {
            const route = sb.get('/');
            expect(route.countCalls()).toBe(0);
        });
        it('should retain every calls made to the route', async () => {
            const route = sb.get('/');
            const TOTAL_CALLS = 3;
            for (let i = 1; i <= TOTAL_CALLS; i++) {
                await request();
                expect(route.countCalls()).toBe(i);
            }
        });
        it('should retain a striped version of the request', async () => {
            const route = sb.post('/', null)
                .setHeaders(null)
                .setQueryParameters(null);
            await request('/?page=100', { method: 'POST', body: { some: 'body' } });
            expect(route.countCalls()).toBe(1);
            expect(route.getCall(0)).toEqual({
                method: 'POST',
                query: { page: '100' },
                body: { some: 'body' },
                path: '/',
                hash: '',
                headers: {
                    accept: 'application/json',
                    'accept-encoding': expect.any(String),
                    connection: expect.any(String),
                    'content-length': expect.any(String),
                    'content-type': expect.any(String),
                    host: expect.any(String),
                    'user-agent': expect.any(String)
                }
            });
        });
    });
    function request(path = '/', options = {}) {
        return got_1.default(`${sb.getOrigin()}${path}`, Object.assign({
            method: 'GET',
            json: true,
            throwHttpErrors: false
        }, options));
    }
});
//# sourceMappingURL=index.test.js.map