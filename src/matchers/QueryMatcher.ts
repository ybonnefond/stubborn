import { Request, RequestDefinition } from '../@types';
import { Route } from '../Route';

import { KeyMap, match } from './utils';
/**
 * @internal
 */
export function queryMatcher(route: Route) {
  return (req: Request) => {
    const definition = route.getQueryParameters();
    if (null === definition) {
      return true;
    }

    const def = formatDef(definition);

    const { query: rawQuery } = req;
    const formatedQuery = formatDef(rawQuery);

    const keyMap = new KeyMap(def);
    const query = keyMap.filterExcluded(formatedQuery);

    function compare(
      defValues: RequestDefinition[],
      reqValues: Array<string | number | null>,
    ) {
      if (!Array.isArray(reqValues)) {
        return false;
      }

      return reqValues.every(reqValue => {
        return defValues.some((defValue: RequestDefinition) => {
          return match(defValue, reqValue);
        });
      });
    }

    return keyMap.compareIncluded(query, compare);
  };
}
/**
 * @internal
 */
function formatDef(rawDef: any) {
  return Object.keys(rawDef).reduce(
    (def, key) => {
      const rawValue = rawDef[key];
      const value =
        null === rawValue || Array.isArray(rawValue) ? rawValue : [rawValue];
      def[key] = value;
      return def;
    },
    {} as Record<string, RequestDefinition>,
  );
}
