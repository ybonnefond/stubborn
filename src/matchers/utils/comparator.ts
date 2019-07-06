import { JsonValue, MatchFunction, RequestDefinition } from '../../@types';

const { isEqualWith: isEqual } = require('lodash');

export function match(def: RequestDefinition, value: JsonValue) {
  return isEqual(def, value, customizer);
}

function customizer(def: RequestDefinition, value: JsonValue) {
  // eslint-disable-line consistent-return
  if (def instanceof RegExp) {
    return def.test(String(value));
  }

  if ('function' === typeof def) {
    return (def as MatchFunction)(value);
  }
}
