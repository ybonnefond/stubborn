import { bodyEmpty } from './bodyEmpty';
import { bodyJson } from './bodyJson';
import { bodyRaw } from './bodyRaw';
import { bodyUrlEncoded } from './bodyUrlEncoded';
import { urlParser } from './urlParser';
/**
 * @internal
 */
export const middlewares = {
  bodyEmpty,
  bodyJson,
  bodyUrlEncoded,
  bodyRaw,
  urlParser,
};
