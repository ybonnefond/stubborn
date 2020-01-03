/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 * @license MIT (© Joyent)
 */
/* legacy: obj, showHidden, depth, colors*/

export function inspect(obj: any, opts: any) {
  // default options
  const ctx: any = {
    seen: [],
    stylize: stylizeNoColor,
  };
  // legacy...
  if (arguments.length >= 3) {
    ctx.depth = arguments[2];
  }
  if (arguments.length >= 4) {
    ctx.colors = arguments[3];
  }
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) {
    ctx.showHidden = false;
  }
  if (isUndefined(ctx.depth)) {
    ctx.depth = 2;
  }
  if (isUndefined(ctx.colors)) {
    ctx.colors = false;
  }
  if (isUndefined(ctx.customInspect)) {
    ctx.customInspect = true;
  }
  if (ctx.colors) {
    ctx.stylize = stylizeWithColor;
  }

  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  white: [37, 39],
  grey: [90, 39],
  black: [30, 39],
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39],
} as Record<string, number[]>;

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  special: 'cyan',
  number: 'yellow',
  boolean: 'yellow',
  undefined: 'grey',
  null: 'bold',
  string: 'green',
  date: 'magenta',
  // "name": intentionally not styling
  regexp: 'blue',
} as Record<string, string>;

function stylizeNoColor(str: string, _styleType: string) {
  return str;
}

function isBoolean(arg: any) {
  return typeof arg === 'boolean';
}

function isUndefined(arg: any) {
  return arg === void 0;
}

function stylizeWithColor(str: string, styleType: string) {
  const style = inspect.styles[styleType];

  if (style) {
    return (
      '\u001b[' +
      inspect.colors[style][0] +
      'm' +
      str +
      '\u001b[' +
      inspect.colors[style][1] +
      'm'
    );
  } else {
    return str;
  }
}

function isFunction(arg: any) {
  return typeof arg === 'function';
}

function isString(arg: any) {
  return typeof arg === 'string';
}

function isNumber(arg: any) {
  return typeof arg === 'number';
}

function isNull(arg: any) {
  return arg === null;
}

function hasOwn(obj: any, prop: any) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isRegExp(re: any) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg: any) {
  return typeof arg === 'object' && arg !== null;
}

function isError(e: any) {
  return (
    isObject(e) &&
    (objectToString(e) === '[object Error]' || e instanceof Error)
  );
}

function isDate(d: any) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function objectToString(o: any) {
  return Object.prototype.toString.call(o);
}

function arrayToHash(array: any) {
  const hash: Record<any, any> = {};

  array.forEach((val: any, _idx: any) => {
    hash[val] = true;
  });

  return hash;
}

function formatArray(
  ctx: any,
  value: any,
  recurseTimes: number,
  visibleKeys: any,
  keys: any,
) {
  const output = [];
  for (let i = 0, l = value.length; i < l; ++i) {
    if (hasOwn(value, String(i))) {
      output.push(
        formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true),
      );
    } else {
      output.push('');
    }
  }
  keys.forEach((key: any) => {
    if (!key.match(/^\d+$/)) {
      output.push(
        formatProperty(ctx, value, recurseTimes, visibleKeys, key, true),
      );
    }
  });
  return output;
}

function formatError(value: any) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatValue(ctx: any, value: any, recurseTimes: any): string {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (
    ctx.customInspect &&
    value &&
    isFunction(value.inspect) &&
    // Filter out the util module, it's inspect function is special
    value.inspect !== inspect &&
    // Also filter out any prototype objects using the circular check.
    !(value.constructor && value.constructor.prototype === value)
  ) {
    let ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  const primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  let keys = Object.keys(value);
  const visibleKeys = arrayToHash(keys);

  try {
    if (ctx.showHidden && Object.getOwnPropertyNames) {
      keys = Object.getOwnPropertyNames(value);
    }
  } catch (e) {
    // ignore
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (
    isError(value) &&
    (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)
  ) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      return ctx.stylize(value.toString(), 'special');
      // const name = value.name ? ': ' + value.name : '';
      // return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  let base = '';
  let array = false;
  let braces = ['{', '}'];

  // Make Array say that they are Array
  if (Array.isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    const n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length === 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  let output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(key => {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatProperty(
  ctx: any,
  value: any,
  recurseTimes: any,
  visibleKeys: any,
  key: any,
  array: any,
) {
  let name;
  let str;
  let desc;

  desc = { value: void 0 };
  try {
    // ie6 › navigator.toString
    // throws Error: Object doesn't support this property or method
    desc.value = value[key];
  } catch (e) {
    // ignore
  }
  try {
    // ie10 › Object.getOwnPropertyDescriptor(window.location, 'hash')
    // throws TypeError: Object doesn't support this action
    if (Object.getOwnPropertyDescriptor) {
      desc = Object.getOwnPropertyDescriptor(value, key) || desc;
    }
  } catch (e) {
    // ignore
  }
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwn(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str
            .split('\n')
            .map((line: string) => {
              return '  ' + line;
            })
            .join('\n')
            .substr(2);
        } else {
          str =
            '\n' +
            str
              .split('\n')
              .map((line: string) => {
                return '   ' + line;
              })
              .join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"')
        .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function formatPrimitive(ctx: any, value: any) {
  if (isUndefined(value)) {
    return ctx.stylize('undefined', 'undefined');
  }
  if (isString(value)) {
    const simple =
      "'" +
      JSON.stringify(value)
        .replace(/^"|"$/g, '')
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"') +
      "'";
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) {
    return ctx.stylize('' + value, 'number');
  }
  if (isBoolean(value)) {
    return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (isNull(value)) {
    return ctx.stylize('null', 'null');
  }
}

function reduceToSingleString(output: any, base: any, braces: any) {
  // let numLinesEst = 0;
  const length = output.reduce((prev: any, cur: any) => {
    // numLinesEst++;
    // if (cur.indexOf('\n') >= 0) {
    //   numLinesEst++;
    // }
    //
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return (
      braces[0] +
      (base === '' ? '' : base + '\n ') +
      ' ' +
      output.join(',\n  ') +
      ' ' +
      braces[1]
    );
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function _extend(origin: any, add: any) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) {
    return origin;
  }

  const keys = Object.keys(add);
  let i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
