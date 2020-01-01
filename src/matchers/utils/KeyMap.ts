/**
 * @internal
 */
import { WILDCARD } from '../../constants';

export interface KeyMapOptions {
  caseSensitive?: boolean;
}
/**
 * @internal
 */
export type KeyMapCompareFunction = (key1: any, key2: any) => boolean;
/**
 * @internal
 */
export type KeyMapObject = Record<string, any>;
/**
 * @internal
 */
export class KeyMap {
  private options: KeyMapOptions;
  private obj: KeyMapObject;
  private included: string[] = [];
  private excluded: string[] = [];

  constructor(obj: KeyMapObject, options: KeyMapOptions = {}) {
    this.options = Object.assign(
      {
        caseSensitive: true,
      },
      options,
    );

    this.obj = this.fixObjectCase(obj);

    this.extractFilters();
  }

  public compareIncluded(rawObj: KeyMapObject, compare: KeyMapCompareFunction) {
    if (this.included.length !== Object.keys(rawObj).length) {
      return false;
    }

    const obj = this.fixObjectCase(rawObj);

    return this.included.every(key => {
      return compare(this.obj[key], obj[key]);
    });
  }

  public isIncluded(key: string) {
    return this.included.includes(this.fixCase(key));
  }

  public isExcluded(key: string) {
    return this.excluded.includes(this.fixCase(key));
  }

  public get(key: string) {
    return this.obj[key];
  }

  public filterExcluded(obj: KeyMapObject): KeyMapObject {
    return Object.keys(obj).reduce((values, key) => {
      if (!this.isExcluded(key)) {
        values[key] = obj[key];
      }

      return values;
    }, {} as KeyMapObject);
  }

  private fixObjectCase(obj: KeyMapObject): KeyMapObject {
    return Object.keys(obj).reduce((clone, key) => {
      clone[this.fixCase(key)] = obj[key];
      return clone;
    }, {} as KeyMapObject);
  }

  private fixCase(str: string) {
    return true === this.options.caseSensitive ? str : str.toLocaleLowerCase();
  }

  private extractFilters() {
    return Object.keys(this.obj).forEach(rawKey => {
      const key = this.fixCase(rawKey);

      if (WILDCARD === this.obj[key]) {
        this.excluded.push(key);
      } else {
        this.included.push(key);
      }
    });
  }
}
