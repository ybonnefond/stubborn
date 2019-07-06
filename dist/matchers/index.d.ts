import { headerMatcher } from './HeaderMatcher';
import { methodMatcher } from './MethodMatcher';
import { pathMatcher } from './PathMatcher';
import { queryMatcher } from './QueryMatcher';
import { bodyMatcher } from './BodyMatcher';
export declare const matchers: {
    headerMatcher: typeof headerMatcher;
    methodMatcher: typeof methodMatcher;
    pathMatcher: typeof pathMatcher;
    queryMatcher: typeof queryMatcher;
    bodyMatcher: typeof bodyMatcher;
};
