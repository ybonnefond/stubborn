import { DefinitionValue, JsonValue, MatchFunction } from '../../@types';
/**
 * @internal
 */
const { isEqualWith: isEqual } = require('lodash');
/**
 * @internal
 */
export function match(def: DefinitionValue, value: JsonValue | undefined) {
  return isEqual(def, value, customizer);
}
/**
 * @internal
 */
function customizer(
  def: DefinitionValue,
  value: JsonValue,
  _key: any,
  _other: any,
  _object: any,
  _stack: any,
) {
  // eslint-disable-line consistent-return
  if (def instanceof RegExp) {
    return def.test(String(value));
  }

  if ('function' === typeof def) {
    return (def as MatchFunction)(value);
  }
}
