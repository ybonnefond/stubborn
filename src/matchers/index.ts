import { bodyMatcher } from './BodyMatcher';
import { headerMatcher } from './HeaderMatcher';
import { methodMatcher } from './MethodMatcher';
import { pathMatcher } from './PathMatcher';
import { queryMatcher } from './QueryMatcher';

export const matchers = {
  headerMatcher,
  methodMatcher,
  pathMatcher,
  queryMatcher,
  bodyMatcher,
};
