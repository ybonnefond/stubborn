"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyMap {
    constructor(obj, options = {}) {
        this.included = [];
        this.excluded = [];
        this.options = Object.assign({
            caseSensitive: true,
        }, options);
        this.obj = this.fixObjectCase(obj);
        this.extractFilters();
    }
    compareIncluded(rawObj, compare) {
        if (this.included.length !== Object.keys(rawObj).length) {
            return false;
        }
        const obj = this.fixObjectCase(rawObj);
        return this.included.every(key => {
            return compare(this.obj[key], obj[key]);
        });
    }
    isIncluded(key) {
        return this.included.includes(this.fixCase(key));
    }
    isExcluded(key) {
        return this.excluded.includes(this.fixCase(key));
    }
    get(key) {
        return this.obj[key];
    }
    filterExcluded(obj) {
        return Object.keys(obj).reduce((values, key) => {
            if (!this.isExcluded(key)) {
                values[key] = obj[key];
            }
            return values;
        }, {});
    }
    fixObjectCase(obj) {
        return Object.keys(obj).reduce((clone, key) => {
            clone[this.fixCase(key)] = obj[key];
            return clone;
        }, {});
    }
    fixCase(str) {
        return true === this.options.caseSensitive ? str : str.toLocaleLowerCase();
    }
    extractFilters() {
        return Object.keys(this.obj).forEach(rawKey => {
            const key = this.fixCase(rawKey);
            if (null === this.obj[key]) {
                this.excluded.push(key);
            }
            else {
                this.included.push(key);
            }
        });
    }
}
exports.KeyMap = KeyMap;
//# sourceMappingURL=KeyMap.js.map