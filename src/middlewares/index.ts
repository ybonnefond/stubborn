import { bodyJson } from './bodyJson';
import { bodyRaw } from './bodyRaw';
import { bodyUrlEncoded } from './bodyUrlEncoded';
import { urlParser } from './urlParser';

export const middlewares = {
  bodyJson,
  bodyUrlEncoded,
  bodyRaw,
  urlParser,
};
