> **[stubborn-ws](../README.md)**

[Globals](../globals.md) / ["Stubborn"](../modules/_stubborn_.md) / [Stubborn](_stubborn_.stubborn.md) /

# Class: Stubborn

## Hierarchy

* **Stubborn**

### Index

#### Constructors

* [constructor](_stubborn_.stubborn.md#constructor)

#### Methods

* [clear](_stubborn_.stubborn.md#clear)
* [delete](_stubborn_.stubborn.md#delete)
* [get](_stubborn_.stubborn.md#get)
* [getOrigin](_stubborn_.stubborn.md#getorigin)
* [getPort](_stubborn_.stubborn.md#getport)
* [patch](_stubborn_.stubborn.md#patch)
* [post](_stubborn_.stubborn.md#post)
* [put](_stubborn_.stubborn.md#put)
* [start](_stubborn_.stubborn.md#start)
* [stop](_stubborn_.stubborn.md#stop)

## Constructors

###  constructor

\+ **new Stubborn**(`options`: [StubbornOptions](../modules/_stubborn_.md#stubbornoptions)): *[Stubborn](_stubborn_.stubborn.md)*

*Defined in [Stubborn.ts:21](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L21)*

**`class`** Stubborn

**`example`** 
```js
const { Stubborn } = require('stubborn-ws');
const stb = new Stubborn();
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [StubbornOptions](../modules/_stubborn_.md#stubbornoptions) |  {} |

**Returns:** *[Stubborn](_stubborn_.stubborn.md)*

## Methods

###  clear

▸ **clear**(): *`this`*

*Defined in [Stubborn.ts:69](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L69)*

Remove all routes from the server

**Returns:** *`this`*

___

###  delete

▸ **delete**(`path`: [PathDefinition](../modules/__types_index_.md#pathdefinition)): *[Route](_route_.route.md)*

*Defined in [Stubborn.ts:81](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L81)*

Create and Register a new DELETE route

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) | Stubbed resource path |

**Returns:** *[Route](_route_.route.md)*

___

###  get

▸ **get**(`path`: [PathDefinition](../modules/__types_index_.md#pathdefinition)): *[Route](_route_.route.md)*

*Defined in [Stubborn.ts:91](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L91)*

Create and Register a new GET route

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) | Stubbed resource path |

**Returns:** *[Route](_route_.route.md)*

___

###  getOrigin

▸ **getOrigin**(): *string*

*Defined in [Stubborn.ts:60](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L60)*

Returns the server origin (http://<options.host>:<port>)

**Returns:** *string*

___

###  getPort

▸ **getPort**(): *number | null*

*Defined in [Stubborn.ts:52](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L52)*

Returns the server port.

If the server is initialized with options.port set to 0 this method
will return the randomly affected port only after the server is started

**Returns:** *number | null*

Listening port or null if the server is not started

___

###  patch

▸ **patch**(`path`: [PathDefinition](../modules/__types_index_.md#pathdefinition), `body`: [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition)): *[Route](_route_.route.md)*

*Defined in [Stubborn.ts:102](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L102)*

Create and Register a new PACH route

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) | - | Stubbed resource path |
`body` | [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition) | "" | Expected request body |

**Returns:** *[Route](_route_.route.md)*

___

###  post

▸ **post**(`path`: [PathDefinition](../modules/__types_index_.md#pathdefinition), `body`: [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition)): *[Route](_route_.route.md)*

*Defined in [Stubborn.ts:113](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L113)*

Create and Register a new POST route

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) | - | Stubbed resource path |
`body` | [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition) | "" | Expected request body |

**Returns:** *[Route](_route_.route.md)*

___

###  put

▸ **put**(`path`: [PathDefinition](../modules/__types_index_.md#pathdefinition), `body`: [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition)): *[Route](_route_.route.md)*

*Defined in [Stubborn.ts:124](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L124)*

Create and Register a new PUT route

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) | - | Stubbed resource path |
`body` | [RequestBodyDefinition](../modules/__types_index_.md#requestbodydefinition) | "" | Expected request body |

**Returns:** *[Route](_route_.route.md)*

___

###  start

▸ **start**(`port`: number): *`Promise<Object>`*

*Defined in [Stubborn.ts:133](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L133)*

Start the Stubborn server

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`port` | number | 0 |

**Returns:** *`Promise<Object>`*

Promise object resolved when server is started

___

###  stop

▸ **stop**(): *`Promise<Object>`*

*Defined in [Stubborn.ts:148](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Stubborn.ts#L148)*

Stop the Stubborn server

**Returns:** *`Promise<Object>`*

Promise object resolved when server is stopped