> **[stubborn-ws](../README.md)**

[Globals](../globals.md) / ["@types/index"](__types_index_.md) /

# External module: "@types/index"

### Index

#### Interfaces

* [ResponseHeaders](../interfaces/__types_index_.responseheaders.md)
* [TemplateArray](../interfaces/__types_index_.templatearray.md)
* [TemplateObject](../interfaces/__types_index_.templateobject.md)

#### Type aliases

* [HeaderDefinitions](__types_index_.md#headerdefinitions)
* [JsonValue](__types_index_.md#jsonvalue)
* [MatchFunction](__types_index_.md#matchfunction)
* [Middleware](__types_index_.md#middleware)
* [NextFunction](__types_index_.md#nextfunction)
* [PathDefinition](__types_index_.md#pathdefinition)
* [QueryDefinitions](__types_index_.md#querydefinitions)
* [Request](__types_index_.md#request)
* [RequestBodyDefinition](__types_index_.md#requestbodydefinition)
* [RequestDefinition](__types_index_.md#requestdefinition)
* [RequestInfo](__types_index_.md#requestinfo)
* [RequestMatcher](__types_index_.md#requestmatcher)
* [Response](__types_index_.md#response)
* [ResponseBody](__types_index_.md#responsebody)
* [ResponseBodyDefinition](__types_index_.md#responsebodydefinition)
* [ResponseDefinition](__types_index_.md#responsedefinition)
* [Template](__types_index_.md#template)
* [TemplateFunction](__types_index_.md#templatefunction)

## Type aliases

###  HeaderDefinitions

Ƭ **HeaderDefinitions**: *`Record<string, RequestDefinition>` | null*

*Defined in [@types/index.ts:10](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L10)*

___

###  JsonValue

Ƭ **JsonValue**: *null | string | number | boolean | object*

*Defined in [@types/index.ts:5](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L5)*

___

###  MatchFunction

Ƭ **MatchFunction**: *function*

*Defined in [@types/index.ts:3](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L3)*

#### Type declaration:

▸ (`value`: [JsonValue](__types_index_.md#jsonvalue)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [JsonValue](__types_index_.md#jsonvalue) |

___

###  Middleware

Ƭ **Middleware**: *function*

*Defined in [@types/index.ts:57](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L57)*

#### Type declaration:

▸ (`req`: [Request](__types_index_.md#request), `res`: [Response](__types_index_.md#response), `next`: [NextFunction](__types_index_.md#nextfunction)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](__types_index_.md#request) |
`res` | [Response](__types_index_.md#response) |
`next` | [NextFunction](__types_index_.md#nextfunction) |

___

###  NextFunction

Ƭ **NextFunction**: *function*

*Defined in [@types/index.ts:55](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L55)*

#### Type declaration:

▸ (`err?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err?` | any |

___

###  PathDefinition

Ƭ **PathDefinition**: *null | string | `RegExp` | [MatchFunction](__types_index_.md#matchfunction)*

*Defined in [@types/index.ts:8](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L8)*

___

###  QueryDefinitions

Ƭ **QueryDefinitions**: *`Record<string, RequestDefinition>` | null*

*Defined in [@types/index.ts:11](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L11)*

___

###  Request

Ƭ **Request**: *`IncomingMessage` & [RequestInfo](__types_index_.md#requestinfo) & object*

*Defined in [@types/index.ts:49](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L49)*

___

###  RequestBodyDefinition

Ƭ **RequestBodyDefinition**: *[RequestDefinition](__types_index_.md#requestdefinition)*

*Defined in [@types/index.ts:9](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L9)*

___

###  RequestDefinition

Ƭ **RequestDefinition**: *null | `RegExp` | [MatchFunction](__types_index_.md#matchfunction) | [JsonValue](__types_index_.md#jsonvalue)*

*Defined in [@types/index.ts:6](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L6)*

___

###  RequestInfo

Ƭ **RequestInfo**: *object*

*Defined in [@types/index.ts:40](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L40)*

#### Type declaration:

___

###  RequestMatcher

Ƭ **RequestMatcher**: *function*

*Defined in [@types/index.ts:59](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L59)*

#### Type declaration:

▸ (`req`: [Request](__types_index_.md#request)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`req` | [Request](__types_index_.md#request) |

___

###  Response

Ƭ **Response**: *`ServerResponse`*

*Defined in [@types/index.ts:54](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L54)*

___

###  ResponseBody

Ƭ **ResponseBody**: *[JsonValue](__types_index_.md#jsonvalue)*

*Defined in [@types/index.ts:65](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L65)*

___

###  ResponseBodyDefinition

Ƭ **ResponseBodyDefinition**: *[JsonValue](__types_index_.md#jsonvalue) | [TemplateFunction](__types_index_.md#templatefunction) | [TemplateObject](../interfaces/__types_index_.templateobject.md)*

*Defined in [@types/index.ts:29](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L29)*

___

###  ResponseDefinition

Ƭ **ResponseDefinition**: *object*

*Defined in [@types/index.ts:34](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L34)*

#### Type declaration:

___

###  Template

Ƭ **Template**: *[JsonValue](__types_index_.md#jsonvalue) | [TemplateFunction](__types_index_.md#templatefunction) | [TemplateObject](../interfaces/__types_index_.templateobject.md) | [TemplateArray](../interfaces/__types_index_.templatearray.md)*

*Defined in [@types/index.ts:23](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L23)*

___

###  TemplateFunction

Ƭ **TemplateFunction**: *function*

*Defined in [@types/index.ts:13](https://github.com/ybonnefond/stubborn/blob/dd66099/src/@types/index.ts#L13)*

#### Type declaration:

▸ (`request`: [Request](__types_index_.md#request), `scope`: any): *[JsonValue](__types_index_.md#jsonvalue)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | [Request](__types_index_.md#request) |
`scope` | any |