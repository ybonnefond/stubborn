> **[stubborn-ws](../README.md)**

[Globals](../globals.md) / ["matchers/utils/KeyMap"](../modules/_matchers_utils_keymap_.md) / [KeyMap](_matchers_utils_keymap_.keymap.md) /

# Class: KeyMap

## Hierarchy

* **KeyMap**

### Index

#### Constructors

* [constructor](_matchers_utils_keymap_.keymap.md#constructor)

#### Methods

* [compareIncluded](_matchers_utils_keymap_.keymap.md#compareincluded)
* [filterExcluded](_matchers_utils_keymap_.keymap.md#filterexcluded)
* [get](_matchers_utils_keymap_.keymap.md#get)
* [isExcluded](_matchers_utils_keymap_.keymap.md#isexcluded)
* [isIncluded](_matchers_utils_keymap_.keymap.md#isincluded)

## Constructors

###  constructor

\+ **new KeyMap**(`obj`: [KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject), `options`: [KeyMapOptions](../interfaces/_matchers_utils_keymap_.keymapoptions.md)): *[KeyMap](_matchers_utils_keymap_.keymap.md)*

*Defined in [matchers/utils/KeyMap.ts:13](https://github.com/ybonnefond/stubborn/blob/dd66099/src/matchers/utils/KeyMap.ts#L13)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`obj` | [KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject) | - |
`options` | [KeyMapOptions](../interfaces/_matchers_utils_keymap_.keymapoptions.md) |  {} |

**Returns:** *[KeyMap](_matchers_utils_keymap_.keymap.md)*

## Methods

###  compareIncluded

▸ **compareIncluded**(`rawObj`: [KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject), `compare`: [KeyMapCompareFunction](../modules/_matchers_utils_keymap_.md#keymapcomparefunction)): *boolean*

*Defined in [matchers/utils/KeyMap.ts:28](https://github.com/ybonnefond/stubborn/blob/dd66099/src/matchers/utils/KeyMap.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`rawObj` | [KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject) |
`compare` | [KeyMapCompareFunction](../modules/_matchers_utils_keymap_.md#keymapcomparefunction) |

**Returns:** *boolean*

___

###  filterExcluded

▸ **filterExcluded**(`obj`: [KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject)): *[KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject)*

*Defined in [matchers/utils/KeyMap.ts:52](https://github.com/ybonnefond/stubborn/blob/dd66099/src/matchers/utils/KeyMap.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | [KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject) |

**Returns:** *[KeyMapObject](../modules/_matchers_utils_keymap_.md#keymapobject)*

___

###  get

▸ **get**(`key`: string): *any*

*Defined in [matchers/utils/KeyMap.ts:48](https://github.com/ybonnefond/stubborn/blob/dd66099/src/matchers/utils/KeyMap.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any*

___

###  isExcluded

▸ **isExcluded**(`key`: string): *boolean*

*Defined in [matchers/utils/KeyMap.ts:44](https://github.com/ybonnefond/stubborn/blob/dd66099/src/matchers/utils/KeyMap.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *boolean*

___

###  isIncluded

▸ **isIncluded**(`key`: string): *boolean*

*Defined in [matchers/utils/KeyMap.ts:40](https://github.com/ybonnefond/stubborn/blob/dd66099/src/matchers/utils/KeyMap.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *boolean*