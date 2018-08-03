'use strict';

class KeyMap {
    constructor(obj, options = {}) {
        this.options = Object.assign({
            caseSensitive: true
        }, options);

        this.obj = fixCase(this, obj);

        const { included, excluded } = extractFilters(this);
        this.included = included;
        this.excluded = excluded;
    }

    compareIncluded(rawObj, compare) {
        if (this.included.length !== Object.keys(rawObj).length) {
            return false;
        }

        const obj = fixCase(this, rawObj);

        return this.included.every((key) => {
            return compare(this.obj[key], obj[key]);
        });
    }

    isIncluded(key) {
        return this.included.includes(fixCase(this, key));
    }

    isExcluded(key) {
        return this.excluded.includes(fixCase(this, key));
    }

    get(key) {
        return this.obj[key];
    }

    filterExcluded(obj) {
        return Object
            .keys(obj)
            .reduce((values, key) => {
                if (!this.isExcluded(key)) {
                    values[key] = obj[key];
                }

                return values;
            }, {});
    }
}

module.exports = KeyMap;

function fixCase(map, obj) {
    if (true === map.options.caseSensitive) {
        return obj;
    }

    if ('string' === typeof obj) {
        return obj.toLocaleLowerCase();
    }

    return Object
        .keys(obj)
        .reduce((clone, key) => {
            clone[key.toLocaleLowerCase()] = obj[key];
            return clone;
        }, {});
}

function extractFilters(map) {
    return Object
        .keys(map.obj)
        .reduce((o, rawKey) => {
            const key = fixCase(map, rawKey);

            if (null === map.obj[key]) {
                o.excluded.push(key);
            } else {
                o.included.push(key);
            }

            return o;
        }, { excluded: [], included: [] });
}
