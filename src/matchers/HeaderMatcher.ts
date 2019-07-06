import { Request, RequestDefinition } from '../@types';
import { Route } from '../Route';

import { KeyMap, match } from './utils';

export function headerMatcher(route: Route) {
  return (req: Request) => {
    const headersDefinition = route.getHeaders();
    if (null === headersDefinition) {
      return true;
    }

    const { headers: rawHeaders } = req;
    const keyMap = new KeyMap(headersDefinition, { caseSensitive: false });

    // Filter headers where def has null for value
    const headers = keyMap.filterExcluded(rawHeaders);

    function compare(
      defValue: RequestDefinition,
      reqValue: string | undefined,
    ) {
      if ('string' !== typeof reqValue) {
        return false;
      }

      return match(defValue, reqValue);
    }

    return keyMap.compareIncluded(headers, compare);
  };
}
