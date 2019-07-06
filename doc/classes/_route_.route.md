> **[stubborn-ws](../README.md)**

[Globals](../globals.md) / ["Route"](../modules/_route_.md) / [Route](_route_.route.md) /

# Class: Route

## Hierarchy

* **Route**

### Index

#### Constructors

* [constructor](_route_.route.md#constructor)

#### Methods

* [addCall](_route_.route.md#addcall)
* [countCalls](_route_.route.md#countcalls)
* [getBody](_route_.route.md#getbody)
* [getCall](_route_.route.md#getcall)
* [getDefinition](_route_.route.md#getdefinition)
* [getHeaders](_route_.route.md#getheaders)
* [getMethod](_route_.route.md#getmethod)
* [getPath](_route_.route.md#getpath)
* [getQueryParameters](_route_.route.md#getqueryparameters)
* [getResponseBody](_route_.route.md#getresponsebody)
* [getResponseHeaders](_route_.route.md#getresponseheaders)
* [getResponseStatusCode](_route_.route.md#getresponsestatuscode)
* [setBody](_route_.route.md#setbody)
* [setHeader](_route_.route.md#setheader)
* [setHeaders](_route_.route.md#setheaders)
* [setQueryParameter](_route_.route.md#setqueryparameter)
* [setQueryParameters](_route_.route.md#setqueryparameters)
* [setResponseBody](_route_.route.md#setresponsebody)
* [setResponseHeader](_route_.route.md#setresponseheader)
* [setResponseHeaders](_route_.route.md#setresponseheaders)
* [setResponseStatusCode](_route_.route.md#setresponsestatuscode)

## Constructors

###  constructor

\+ **new Route**(`method`: [METHODS](../enums/_constants_.methods.md), `path`: [PathDefinition](../modules/__types_index_.md#pathdefinition)): *[Route](_route_.route.md)*

*Defined in [Route.ts:21](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L21)*

**`class`** Route

**Parameters:**

Name | Type |
------ | ------ |
`method` | [METHODS](../enums/_constants_.methods.md) |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) |

**Returns:** *[Route](_route_.route.md)*

## Methods

###  addCall

▸ **addCall**(`req`: [RequestInfo](../modules/__types_index_.md#requestinfo)): *void*

*Defined in [Route.ts:356](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L356)*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [RequestInfo](../modules/__types_index_.md#requestinfo) |

**Returns:** *void*

___

###  countCalls

▸ **countCalls**(): *number*

*Defined in [Route.ts:335](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L335)*

Return the number of times the route has been called

```js
const route = ws.get('/resource');
expect(route.countCalls()).toBe(0);
await got(`${ws.getOrigin()}/resource`);
expect(route.countCalls()).toBe(1);
```

**Returns:** *number*

___

###  getBody

▸ **getBody**(): *null | string | number | false | true | object | `RegExp` | function*

*Defined in [Route.ts:238](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L238)*

**Returns:** *null | string | number | false | true | object | `RegExp` | function*

Request body definition

___

###  getCall

▸ **getCall**(`index`: number): *object*

*Defined in [Route.ts:352](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L352)*

Return the number of times the route has been called

```js
const route = ws.get('/resource');
expect(route.countCalls()).toBe(0);
await got(`${ws.getOrigin()}/resource`);
expect(route.getCall(0)).toBe(1);
```

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *object*

___

###  getDefinition

▸ **getDefinition**(): *object*

*Defined in [Route.ts:50](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L50)*

Return the route definition, helpful to find why the route didn't match the request

**Returns:** *object*

___

###  getHeaders

▸ **getHeaders**(): *null | object*

*Defined in [Route.ts:108](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L108)*

**Returns:** *null | object*

Route headers definition

___

###  getMethod

▸ **getMethod**(): *[METHODS](../enums/_constants_.methods.md)*

*Defined in [Route.ts:63](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L63)*

**Returns:** *[METHODS](../enums/_constants_.methods.md)*

Route method

___

###  getPath

▸ **getPath**(): *null | string | `RegExp` | function*

*Defined in [Route.ts:70](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L70)*

**Returns:** *null | string | `RegExp` | function*

___

###  getQueryParameters

▸ **getQueryParameters**(): *null | object*

*Defined in [Route.ts:169](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L169)*

**Returns:** *null | object*

Query parameters definitions

___

###  getResponseBody

▸ **getResponseBody**(): *null | string | number | false | true | object | function | [TemplateObject](../interfaces/__types_index_.templateobject.md)*

*Defined in [Route.ts:279](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L279)*

**Returns:** *null | string | number | false | true | object | function | [TemplateObject](../interfaces/__types_index_.templateobject.md)*

___

###  getResponseHeaders

▸ **getResponseHeaders**(): *object*

*Defined in [Route.ts:302](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L302)*

**Returns:** *object*

___

###  getResponseStatusCode

▸ **getResponseStatusCode**(): *number*

*Defined in [Route.ts:253](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L253)*

**Returns:** *number*

___

###  setBody

▸ **setBody**(`body`: [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition)): *`this`*

*Defined in [Route.ts:229](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L229)*

Set the body definition. Body can be a string or a complex object mixing

**`example`** 
```js
// Bypass all query parameters
stubborn
  .get('/bypass')
  .setBody(null);

stubborn
  .get('/simple')
  .setBody('text body');

stubborn
  .get('/object')
  .setBody({
    // Match using `===`
    exact: 'match',
    // Match using `/^match/.test(value)`
    regexp: /^match/,
    // Match using `func(value);`
    func: (value) => 'match' === value,
    object: { reg: /\d+/, bypass: null },
    arr: [{ item: '1' }, { item: /2/ }]
  });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`body` | [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition) | Body definition |

**Returns:** *`this`*

___

###  setHeader

▸ **setHeader**(`header`: string, `definition`: [RequestDefinition](../modules/__types_index_.md#requestdefinition)): *`this`*

*Defined in [Route.ts:126](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L126)*

Set a specific header definition.

**`example`** 
```js

stubborn
  .get('/match')
  .setHeader('Authorization', 'BEARER');
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`header` | string | Header name |
`definition` | [RequestDefinition](../modules/__types_index_.md#requestdefinition) | Header definition |

**Returns:** *`this`*

___

###  setHeaders

▸ **setHeaders**(`headers`: [HeaderDefinitions](../modules/__types_index_.md#headerdefinitions)): *`this`*

*Defined in [Route.ts:98](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L98)*

Set the headers definition.

**`example`** 
```js
// Bypass all headers
stubborn
  .get('/bypass')
  .setHeaders(null);

stubborn
  .get('/match')
  .setHeaders({
    // Match using `===`
    exact: 'match',
    // Match using `/^match/.test(value)`
    regexp: /^match/,
    // Match using `func(value);`
    func: (value) => 'match' === value
  });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`headers` | [HeaderDefinitions](../modules/__types_index_.md#headerdefinitions) | Headers definition |

**Returns:** *`this`*

___

###  setQueryParameter

▸ **setQueryParameter**(`queryParameter`: string, `definition`: [RequestDefinition](../modules/__types_index_.md#requestdefinition)): *`this`*

*Defined in [Route.ts:186](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L186)*

Set a specific query parameter

**`example`** 
```js
stubborn
  .get('/match')
  .setQueryParameter('page', '100');
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`queryParameter` | string | Query parameters name |
`definition` | [RequestDefinition](../modules/__types_index_.md#requestdefinition) | Query parameter definition |

**Returns:** *`this`*

___

###  setQueryParameters

▸ **setQueryParameters**(`query`: [QueryDefinitions](../modules/__types_index_.md#querydefinitions)): *`this`*

*Defined in [Route.ts:160](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L160)*

Set the headers definition.

**`example`** 
```js
// Bypass all query parameters
stubborn
  .get('/bypass')
  .setQueryParameters(null);

stubborn
  .get('/match')
  .setQueryParameters({
    // Match using `===`
    exact: 'match',
    // Match using `/^match/.test(value)`
    regexp: /^match/,
    // Match using `func(value);`
    func: (value) => 'match' === value
  });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | [QueryDefinitions](../modules/__types_index_.md#querydefinitions) | Query parameters definition |

**Returns:** *`this`*

___

###  setResponseBody

▸ **setResponseBody**(`body`: [JsonValue](../modules/__types_index_.md#jsonvalue)): *`this`*

*Defined in [Route.ts:273](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L273)*

Set the response body

If response is an Object, values can be a function which will receive the request as parameter

**`example`** 
```js
ws.get('/resource')
  .setResponseBody({
    key: 'value',
    funKey: (req) => `${req.query.param}-param`
  });
```

**Parameters:**

Name | Type |
------ | ------ |
`body` | [JsonValue](../modules/__types_index_.md#jsonvalue) |

**Returns:** *`this`*

___

###  setResponseHeader

▸ **setResponseHeader**(`header`: string, `value`: string): *`this`*

*Defined in [Route.ts:317](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L317)*

Set a response header

```js
ws.get('/resource')
  .setResponseHeader('Content-type', 'application/json');
```

**Parameters:**

Name | Type |
------ | ------ |
`header` | string |
`value` | string |

**Returns:** *`this`*

___

###  setResponseHeaders

▸ **setResponseHeaders**(`headers`: `Record<string, string>`): *`this`*

*Defined in [Route.ts:296](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L296)*

Set the response headers
key/value object. If value is a function it will receive the request as parameter
```js
ws.get('/resource')
  .setResponseHeaders({
    'Content-type': 'application/json',
    'Custom-Header': (req) => `${req.header.custom}-response`
  });
```

**Parameters:**

Name | Type |
------ | ------ |
`headers` | `Record<string, string>` |

**Returns:** *`this`*

___

###  setResponseStatusCode

▸ **setResponseStatusCode**(`statusCode`: number): *`this`*

*Defined in [Route.ts:247](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Route.ts#L247)*

Set the response status code

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`statusCode` | number | HTTP status code |

**Returns:** *`this`*