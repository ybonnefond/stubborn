> **[stubborn-ws](../README.md)**

[Globals](../globals.md) / ["Router"](../modules/_router_.md) / [Router](_router_.router.md) /

# Class: Router

## Hierarchy

* **Router**

### Index

#### Constructors

* [constructor](_router_.router.md#constructor)

#### Methods

* [clear](_router_.router.md#clear)
* [createRoute](_router_.router.md#createroute)
* [getHost](_router_.router.md#gethost)
* [getPort](_router_.router.md#getport)
* [getRoutes](_router_.router.md#getroutes)
* [handle](_router_.router.md#handle)

## Constructors

###  constructor

\+ **new Router**(`options`: [RouterOptions](../modules/_router_.md#routeroptions)): *[Router](_router_.router.md)*

*Defined in [Router.ts:40](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [RouterOptions](../modules/_router_.md#routeroptions) |

**Returns:** *[Router](_router_.router.md)*

## Methods

###  clear

▸ **clear**(): *void*

*Defined in [Router.ts:59](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L59)*

**Returns:** *void*

___

###  createRoute

▸ **createRoute**(`method`: [METHODS](../enums/_constants_.methods.md), `path`: [PathDefinition](../modules/__types_index_.md#pathdefinition)): *[Route](_route_.route.md)*

*Defined in [Router.ts:51](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`method` | [METHODS](../enums/_constants_.methods.md) |
`path` | [PathDefinition](../modules/__types_index_.md#pathdefinition) |

**Returns:** *[Route](_route_.route.md)*

___

###  getHost

▸ **getHost**(): *undefined | string*

*Defined in [Router.ts:76](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L76)*

**Returns:** *undefined | string*

___

###  getPort

▸ **getPort**(): *null | number*

*Defined in [Router.ts:80](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L80)*

**Returns:** *null | number*

___

###  getRoutes

▸ **getRoutes**(): *`Set<object>`*

*Defined in [Router.ts:72](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L72)*

**Returns:** *`Set<object>`*

___

###  handle

▸ **handle**(`server`: `Server`): *void*

*Defined in [Router.ts:63](https://github.com/ybonnefond/stubborn/blob/dd66099/src/Router.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`server` | `Server` |

**Returns:** *void*