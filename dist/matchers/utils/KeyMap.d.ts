export interface KeyMapOptions {
    caseSensitive?: boolean;
}
export interface KeyMapCompareFunction {
    (key1: any, key2: any): boolean;
}
export declare type KeyMapObject = Record<string, any>;
export declare class KeyMap {
    private options;
    private obj;
    private included;
    private excluded;
    constructor(obj: KeyMapObject, options?: KeyMapOptions);
    compareIncluded(rawObj: KeyMapObject, compare: KeyMapCompareFunction): boolean;
    isIncluded(key: string): boolean;
    isExcluded(key: string): boolean;
    get(key: string): any;
    filterExcluded(obj: KeyMapObject): KeyMapObject;
    private fixObjectCase;
    private fixCase;
    private extractFilters;
}
