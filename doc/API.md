## Classes

<dl>
<dt><a href="#Route">Route</a></dt>
<dd></dd>
<dt><a href="#Stubborn">Stubborn</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#RouteDefinition">RouteDefinition</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#HeadersDefinition">HeadersDefinition</a> : <code>object.&lt;string, (string|Regexp|function()|null)&gt;</code></dt>
<dd><p>key/value object. Key is the header name, value is the header definition
The header definition can be a <code>string</code>, a <code>Regexp</code>, a <code>function</code> or <code>null</code></p>
<ul>
<li><code>string</code>: Match using string equality against the request header value</li>
<li><code>Regexp</code>: Match using Regexp.test against the request header value</li>
<li><code>function</code>: Request header value will be passed to the function. The function Should return a boolean</li>
<li><code>null</code>: act as a wildcard, header will not be processed</li>
</ul>
</dd>
<dt><a href="#QueryParametersDefinition">QueryParametersDefinition</a> : <code>Object.&lt;string, (string|Regexp|function()|null)&gt;</code></dt>
<dd><p>key/value object. Key is the query parameter name, value is the parameter definition
The parameter definition can be a <code>string</code>, a <code>Regexp</code>, a <code>function</code> or <code>null</code></p>
<ul>
<li><code>string</code>: Match using string equality against the request parameter value</li>
<li><code>Regexp</code>: Match using Regexp.test against the request parameter value</li>
<li><code>function</code>: Request parameter value will be passed to the function. The function Should return a boolean</li>
<li><code>null</code>: act as a wildcard, parameter will not be processed</li>
</ul>
</dd>
<dt><a href="#BodyDefinition">BodyDefinition</a> : <code>string</code> | <code>Array</code> | <code>Object.&lt;string, (string|Regexp|Body|function()|null)&gt;</code></dt>
<dd><p>Body can be a string, an array or a key/mixed object where values can be a <code>string</code>, a <code>Regexp</code>, a <code>function</code>, object, Array or <code>null</code></p>
<ul>
<li><code>string</code>: Match using string equality against the request parameter value</li>
<li><code>Regexp</code>: Match using Regexp.test against the request parameter value</li>
<li><code>function</code>: Request parameter value will be passed to the function. The function Should return a boolean</li>
<li><code>Object</code>: Object will be recursively processed.</li>
<li><code>Array</code>: Each array items will be recursively processed</li>
<li><code>null</code>: act as a wildcard, parameter will not be processed</li>
</ul>
</dd>
</dl>

<a name="Route"></a>

## Route
**Kind**: global class  

* [Route](#Route)
    * [.getDefinition()](#Route+getDefinition) ⇒ [<code>RouteDefinition</code>](#RouteDefinition)
    * [.setHeaders(headers)](#Route+setHeaders) ⇒ <code>this</code>
    * [.setQueryParameters(query)](#Route+setQueryParameters) ⇒ <code>this</code>
    * [.setBody(body)](#Route+setBody) ⇒ <code>this</code>
    * [.setResponseStatusCode(statusCode)](#Route+setResponseStatusCode) ⇒ <code>this</code>
    * [.setResponseBody(body)](#Route+setResponseBody) ⇒ <code>this</code>
    * [.setResponseHeaders(body)](#Route+setResponseHeaders) ⇒ <code>this</code>

<a name="Route+getDefinition"></a>

### route.getDefinition() ⇒ [<code>RouteDefinition</code>](#RouteDefinition)
Return the route definition, helpful to find why the route didn't match the request

**Kind**: instance method of [<code>Route</code>](#Route)  
<a name="Route+setHeaders"></a>

### route.setHeaders(headers) ⇒ <code>this</code>
Set the headers definition.

**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type | Description |
| --- | --- | --- |
| headers | [<code>HeadersDefinition</code>](#HeadersDefinition) \| <code>null</code> | Headers definition |

**Example**  
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
<a name="Route+setQueryParameters"></a>

### route.setQueryParameters(query) ⇒ <code>this</code>
Set the headers definition.

**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type | Description |
| --- | --- | --- |
| query | [<code>QueryParametersDefinition</code>](#QueryParametersDefinition) \| <code>null</code> | Query parameters definition |

**Example**  
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
<a name="Route+setBody"></a>

### route.setBody(body) ⇒ <code>this</code>
Set the body definition. Body can be a string or a complex object mixing

**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type | Description |
| --- | --- | --- |
| body | [<code>BodyDefinition</code>](#BodyDefinition) | Body definition |

**Example**  
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
<a name="Route+setResponseStatusCode"></a>

### route.setResponseStatusCode(statusCode) ⇒ <code>this</code>
Set the response status code

**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>Number</code> | HTTP status code |

<a name="Route+setResponseBody"></a>

### route.setResponseBody(body) ⇒ <code>this</code>
Set the response body

If response is an Object, values can be a function which will receive the request as parameter

**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type |
| --- | --- |
| body | <code>string</code> \| <code>Object.&lt;string, mixed&gt;</code> | 

**Example**  
```js
ws.get('/resource')
  .setResponseBody({
    key: 'value',
    funKey: (req) => `${req.query.param}-param`
  });
```
<a name="Route+setResponseHeaders"></a>

### route.setResponseHeaders(body) ⇒ <code>this</code>
Set the response header
key/value object. If value is a function it will receive the request as parameter
```js
ws.get('/resource')
  .setResponseHeaders({
    'Content-type': 'application/json',
    'Custom-Header': (req) => `${req.header.custom}-response`
  });
```

**Kind**: instance method of [<code>Route</code>](#Route)  

| Param | Type |
| --- | --- |
| body | <code>Object.&lt;mixed&gt;</code> | 

<a name="Stubborn"></a>

## Stubborn
**Kind**: global class  

* [Stubborn](#Stubborn)
    * [.getPort()](#Stubborn+getPort) ⇒ <code>number</code>
    * [.clear()](#Stubborn+clear) ⇒ <code>this</code>
    * [.delete(path)](#Stubborn+delete) ⇒ [<code>Route</code>](#Route)
    * [.get(path)](#Stubborn+get) ⇒ [<code>Route</code>](#Route)
    * [.getOrigin()](#Stubborn+getOrigin) ⇒ <code>string</code>
    * [.patch(path, body)](#Stubborn+patch) ⇒ [<code>Route</code>](#Route)
    * [.post(path, body)](#Stubborn+post) ⇒ [<code>Route</code>](#Route)
    * [.put(path, body)](#Stubborn+put) ⇒ [<code>Route</code>](#Route)
    * [.start()](#Stubborn+start) ⇒ <code>Promise</code>
    * [.stop()](#Stubborn+stop) ⇒ <code>Promise</code>

<a name="Stubborn+getPort"></a>

### stubborn.getPort() ⇒ <code>number</code>
Returns the server port.

If the server is initialized with options.port set to 0 this method
will return the randomly affected port only after the server is started

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  
**Returns**: <code>number</code> - Listening port  
<a name="Stubborn+clear"></a>

### stubborn.clear() ⇒ <code>this</code>
Remove all routes from the server

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  
<a name="Stubborn+delete"></a>

### stubborn.delete(path) ⇒ [<code>Route</code>](#Route)
Create and Register a new DELETE route

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Stubbed resource path |

<a name="Stubborn+get"></a>

### stubborn.get(path) ⇒ [<code>Route</code>](#Route)
Create and Register a new GET route

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Stubbed resource path |

<a name="Stubborn+getOrigin"></a>

### stubborn.getOrigin() ⇒ <code>string</code>
Returns the server origin (http://<options.host>:<port>)

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  
<a name="Stubborn+patch"></a>

### stubborn.patch(path, body) ⇒ [<code>Route</code>](#Route)
Create and Register a new PACH route

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Stubbed resource path |
| body | <code>string</code> \| <code>object</code> | Expected request body |

<a name="Stubborn+post"></a>

### stubborn.post(path, body) ⇒ [<code>Route</code>](#Route)
Create and Register a new POST route

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Stubbed resource path |
| body | <code>string</code> \| <code>object</code> | Expected request body |

<a name="Stubborn+put"></a>

### stubborn.put(path, body) ⇒ [<code>Route</code>](#Route)
Create and Register a new PUT route

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Stubbed resource path |
| body | <code>string</code> \| <code>object</code> | Expected request body |

<a name="Stubborn+start"></a>

### stubborn.start() ⇒ <code>Promise</code>
Start the Stubborn server

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  
**Returns**: <code>Promise</code> - Promise object resolved when server is started  
<a name="Stubborn+stop"></a>

### stubborn.stop() ⇒ <code>Promise</code>
Stop the Stubborn server

**Kind**: instance method of [<code>Stubborn</code>](#Stubborn)  
**Returns**: <code>Promise</code> - Promise object resolved when server is stopped  
<a name="RouteDefinition"></a>

## RouteDefinition : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The route method, one of [GET, POST, PATCH, PUT, DELETE] |
| path | <code>string</code> | The stubbed resource path (ex: /users) |
| headers | [<code>HeadersDefinition</code>](#HeadersDefinition) |  |
| query | [<code>QueryParametersDefinition</code>](#QueryParametersDefinition) |  |
| body | [<code>BodyDefinition</code>](#BodyDefinition) |  |

<a name="HeadersDefinition"></a>

## HeadersDefinition : <code>object.&lt;string, (string\|Regexp\|function()\|null)&gt;</code>
key/value object. Key is the header name, value is the header definition
The header definition can be a `string`, a `Regexp`, a `function` or `null`
- `string`: Match using string equality against the request header value
- `Regexp`: Match using Regexp.test against the request header value
- `function`: Request header value will be passed to the function. The function Should return a boolean
- `null`: act as a wildcard, header will not be processed

**Kind**: global typedef  
<a name="QueryParametersDefinition"></a>

## QueryParametersDefinition : <code>Object.&lt;string, (string\|Regexp\|function()\|null)&gt;</code>
key/value object. Key is the query parameter name, value is the parameter definition
The parameter definition can be a `string`, a `Regexp`, a `function` or `null`
- `string`: Match using string equality against the request parameter value
- `Regexp`: Match using Regexp.test against the request parameter value
- `function`: Request parameter value will be passed to the function. The function Should return a boolean
- `null`: act as a wildcard, parameter will not be processed

**Kind**: global typedef  
<a name="BodyDefinition"></a>

## BodyDefinition : <code>string</code> \| <code>Array</code> \| <code>Object.&lt;string, (string\|Regexp\|Body\|function()\|null)&gt;</code>
Body can be a string, an array or a key/mixed object where values can be a `string`, a `Regexp`, a `function`, object, Array or `null`
- `string`: Match using string equality against the request parameter value
- `Regexp`: Match using Regexp.test against the request parameter value
- `function`: Request parameter value will be passed to the function. The function Should return a boolean
- `Object`: Object will be recursively processed.
- `Array`: Each array items will be recursively processed
- `null`: act as a wildcard, parameter will not be processed

**Kind**: global typedef  
