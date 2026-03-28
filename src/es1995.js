import {
  cond,
  constant,
  filter,
  includes,
  intersection,
  zip,
  range,
  inRange,
  partition,
  shuffle,
  clone,
  cloneDeep,
  ceil,
  round,
  floor,
  clamp,
  random,
  groupBy,
  partial,
  deburr,
  identity,
  noop,
  memoize,
  once,
  compact,
  throttle,
  debounce,
  chunk,
  drop,
  head,
  tail,
  isFunction,
  camelCase,
  capitalize,
  kebabCase,
  snakeCase,
  truncate as lodashTruncate,
  words as lodashWords,
  escape as lodashEscape,
  unescape as lodashUnescape,
  flattenDeep,
  uniqBy,
  countBy,
  last as lodashLast,
  difference,
  union,
  pick,
  omit,
  mergeWith,
  defaultsDeep,
  mapKeys,
  mapValues,
  curry,
  flip as lodashFlip,
  flow,
  flowRight,
  times as lodashTimes,
  isEqual,
  sumBy,
  meanBy,
  minBy,
  maxBy,
  sortBy
} from "lodash-es";
import dedent from "dedent";
import mdlog from "mdlog";
import colorScheme from "mdlog/color/solarized-dark.json";
import { compareTwoStrings } from "string-similarity";

const log = mdlog(colorScheme);

const Documentation = Symbol.for("documentation");

function pipe(func) {
  return func(this);
}

pipe[Documentation] = `
    # Object.prototype.pipe
    
    Usage:
    
        "hello world".pipe(s => s.toUpperCase())
    
`;

/*

    Object

*/

const deepMergeCustomizer = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

const ObjectPrototype = {
  pipe,
  tap(func) {
    func(this);
    return this;
  },
  equals(other) {
    return isEqual(this, other);
  }
};

const ObjectObject = {
  clone,
  cloneDeep,
  pick(obj, keys) {
    return pick(obj, keys);
  },
  omit(obj, keys) {
    return omit(obj, keys);
  },
  deepMerge(...objects) {
    return mergeWith({}, ...objects, deepMergeCustomizer);
  },
  deepFreeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const val = obj[prop];
      if (val !== null && typeof val === "object" && !Object.isFrozen(val)) {
        Object.deepFreeze(val);
      }
    });
    return obj;
  },
  defaults: defaultsDeep,
  mapKeys(obj, fn) {
    return mapKeys(obj, fn);
  },
  mapValues(obj, fn) {
    return mapValues(obj, fn);
  }
};

/*

    Array

*/

const ArrayPrototype = {
  at(n) {
    if (Array.isArray(n)) {
      return n.map((i) => this.at(i));
    }
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) {
      return undefined;
    }
    return this[n];
  },
  chunk(size) {
    return chunk(this, size);
  },
  compact() {
    return compact(this);
  },
  count(predicate) {
    if (!predicate) return this.length;
    return this.filter(predicate).length;
  },
  distinct() {
    return [...new Set(this)];
  },
  drop(n) {
    return drop(this, n);
  },
  duplicates() {
    return filter(this, (val, i, iteratee) => includes(iteratee, val, i + 1));
  },
  empty() {
    return this.length === 0;
  },
  except(toRemove) {
    return this.filter((el) => !toRemove.includes(el));
  },
  first(predicate) {
    if (!predicate) return head(this);
    return this.find(predicate);
  },
  flattenDeep() {
    return flattenDeep(this);
  },
  frequencies() {
    return countBy(this, identity);
  },
  groupBy(iteratee) {
    return groupBy(this, iteratee);
  },
  head() {
    return head(this);
  },
  intersect(other) {
    return intersection(this, other);
  },
  last(predicate) {
    if (!predicate) return lodashLast(this);
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) return this[i];
    }
    return undefined;
  },
  max(fn) {
    if (!fn) return Math.max(...this);
    return maxBy(this, fn);
  },
  min(fn) {
    if (!fn) return Math.min(...this);
    return minBy(this, fn);
  },
  average(fn) {
    if (this.length === 0) return NaN;
    if (!fn) return this.sum() / this.length;
    return meanBy(this, fn);
  },
  partition(predicate) {
    return partition(this, predicate);
  },
  reject(predicate) {
    return this.filter((el, i, arr) => !predicate(el, i, arr));
  },
  reversed() {
    return [...this].reverse();
  },
  rotate(n) {
    return this.slice(n, this.length).concat(this.slice(0, n));
  },
  scan(fn, initial) {
    const results = [];
    let acc = initial;
    for (const item of this) {
      acc = fn(acc, item);
      results.push(acc);
    }
    return results;
  },
  shuffle() {
    return shuffle(this);
  },
  sortBy(fn) {
    return sortBy(this, fn);
  },
  sorted(comparator) {
    return this.slice(0).sort(comparator);
  },
  splitAt(n) {
    const i = Math.trunc(n) || 0;
    return [this.slice(0, i), this.slice(i)];
  },
  sum(fn) {
    if (!fn) return this.reduce((a, b) => a + b, 0);
    return sumBy(this, fn);
  },
  tail() {
    return tail(this);
  },
  take(count) {
    return this.slice(0, count);
  },
  tap(func) {
    this.forEach(func);
    return this;
  },
  toObject(keyFn, valueFn) {
    return Object.fromEntries(
      this.map((item, i) => [
        keyFn(item, i),
        valueFn ? valueFn(item, i) : item
      ])
    );
  },
  uniqueBy(fn) {
    return uniqBy(this, fn);
  },
  union(other) {
    return union(this, other);
  },
  window(size) {
    if (size > this.length) return [];
    const result = [];
    for (let i = 0; i <= this.length - size; i++) {
      result.push(this.slice(i, i + size));
    }
    return result;
  },
  zip(...arrays) {
    return zip(this, ...arrays);
  }
};

const ArrayObject = {
  cartesianProduct(...a) {
    return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  },
  zip
};

/*

    String

*/

const StringPrototype = {
  camelCase() {
    return camelCase(this);
  },
  capitalize() {
    return capitalize(this);
  },
  chars() {
    return [...this];
  },
  dedent() {
    return dedent(this);
  },
  escapeHtml() {
    return lodashEscape(this);
  },
  isBlank() {
    return this.trim().length === 0;
  },
  kebabCase() {
    return kebabCase(this);
  },
  lines() {
    return this.split("\n");
  },
  removeDiacritics() {
    return deburr(this);
  },
  reverse() {
    return [...this].reverse().join("");
  },
  similarityTo(string) {
    return compareTwoStrings(this, string);
  },
  snakeCase() {
    return snakeCase(this);
  },
  toNumber() {
    return Number(this);
  },
  truncate(length, omission = "...") {
    return lodashTruncate(this, { length, omission });
  },
  unescapeHtml() {
    return lodashUnescape(this);
  },
  words() {
    return lodashWords(this);
  }
};

const StringObject = {};

/*

    Number

*/

const NumberPrototype = {
  absoluteValue() {
    return Math.abs(this);
  },
  ceil(precision) {
    return ceil(this, precision);
  },
  clamp(lower, upper) {
    return clamp(this, lower, upper);
  },
  duration() {
    const ms = Math.abs(this);
    const units = [
      [86400000, "d"],
      [3600000, "h"],
      [60000, "m"],
      [1000, "s"],
      [1, "ms"]
    ];
    let remaining = ms;
    const parts = [];
    for (const [divisor, label] of units) {
      if (remaining >= divisor) {
        const count = Math.floor(remaining / divisor);
        remaining %= divisor;
        parts.push(`${count}${label}`);
      }
    }
    return parts.join(" ") || "0ms";
  },
  floor(precision) {
    return floor(this, precision);
  },
  fractionalPart() {
    return parseFloat("0." + (this + "").split(".")[1]);
  },
  integerPart() {
    return Math.abs(Math.trunc(this));
  },
  inRange(start, end) {
    return inRange(this, start, end);
  },
  isEven() {
    return this % 2 === 0;
  },
  isOdd() {
    return Math.abs(this % 2) === 1;
  },
  isPrime() {
    if (this < 2 || !Number.isInteger(this.valueOf())) return false;
    if (this === 2) return true;
    if (this % 2 === 0) return false;
    for (let i = 3, s = Math.sqrt(this); i <= s; i += 2) {
      if (this % i === 0) return false;
    }
    return true;
  },
  multipleOf(k) {
    return Number.isInteger(this / k);
  },
  ordinal() {
    const n = Math.abs(this);
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },
  pad(length) {
    return String(this).padStart(length, "0");
  },
  round(precision) {
    return round(this, precision);
  },
  sign() {
    return Math.sign(this);
  },
  times(fn) {
    return lodashTimes(this, fn);
  },
  to(end, step) {
    return range(this, end, step);
  },
  toBinary() {
    return (this >>> 0).toString(2);
  },
  toHex() {
    return this.toString(16);
  },
  toOctal() {
    return this.toString(8);
  }
};

const NumberObject = {
  fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const seq = [0, 1];
    for (let i = 2; i < n; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq;
  },
  greatestCommonDivisor: (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (a !== b) {
      if (a > b) {
        a -= b;
      } else {
        b -= a;
      }
    }
    return a;
  },
  leastCommonMultiple: (a, b) => {
    return Math.abs(a * b) / Number.greatestCommonDivisor(a, b);
  },
  random,
  range
};

/*

    Function

*/

const originalFunctionToString = Function.prototype.toString;

const FunctionPrototype = {
  compose(fn) {
    const self = this;
    return function (...args) {
      return self(fn(...args));
    };
  },
  curry() {
    return curry(this);
  },
  debounce(wait, options) {
    return debounce(this, wait, options);
  },
  delay(ms) {
    const self = this;
    return function (...args) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(self(...args)), ms);
      });
    };
  },
  flip() {
    return lodashFlip(this);
  },
  memoize(resolver) {
    return memoize(this, resolver);
  },
  once() {
    return once(this);
  },
  partial(...partials) {
    return partial(this, ...partials);
  },
  retry(n, delayMs = 0) {
    const self = this;
    return async function (...args) {
      let lastError;
      for (let i = 0; i <= n; i++) {
        try {
          return await self(...args);
        } catch (err) {
          lastError = err;
          if (i < n && delayMs > 0) {
            await new Promise((r) => setTimeout(r, delayMs));
          }
        }
      }
      throw lastError;
    };
  },
  throttle(wait, options) {
    return throttle(this, wait, options);
  },
  toString() {
    if (this[Documentation]) {
      log(dedent(this[Documentation]));
      return originalFunctionToString.call(this);
    } else {
      return originalFunctionToString.call(this);
    }
  }
};

const createLambda = (expression) => {
  const regexp = new RegExp("[$]+", "g");

  let maxLength = 0;
  let match;

  // eslint-disable-next-line
  while ((match = regexp.exec(expression)) != null) {
    let paramNumber = match[0].length;
    if (paramNumber > maxLength) {
      maxLength = paramNumber;
    }
  }

  const argArray = [];
  for (let i = 1; i <= maxLength; i++) {
    let dollar = "";
    for (let j = 0; j < i; j++) {
      dollar += "$";
    }
    argArray.push(dollar);
  }

  const args = Array.prototype.join.call(argArray, ",");

  // eslint-disable-next-line
  return new Function(args, "return " + expression);
};

class CallableObject extends Function {
  constructor(props) {
    super();
    return Object.assign(props[Symbol.for("callable")].bind(props), props);
  }
}

const FunctionObject = {
  compose: flowRight,
  conditional: cond,
  constant,
  false: () => false,
  fixedPoint: (f) => {
    const g = (h) => (x) => f(h(h))(x);
    return g(g);
  },
  from: (arg, ...rest) => {
    if (typeof arg === "string") {
      return createLambda(arg);
    }

    if (Array.isArray(arg)) {
      return arg.zip(rest).flat().compact().join("").pipe(createLambda);
    }

    if (arg[Symbol.for("callable")]) {
      return new CallableObject(arg);
    }
  },
  identity,
  isFunction,
  noop,
  pipe: flow,
  true: () => true
};

/*

    Symbol

*/

const SymbolObject = {
  callable: Symbol.for("callable"),
  documentation: Symbol.for("documentation")
};

const RegexObject = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  hexColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  IPv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
  ISO8601: /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/,
  URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

/*

    Promise

*/

const PromisePrototype = {
  tap(fn) {
    return this.then((value) => {
      fn(value);
      return value;
    });
  },
  timeout(ms) {
    return Promise.race([
      this,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
      )
    ]);
  }
};

const PromiseObject = {
  delay(ms, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  },
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  retry(fn, { retries = 3, delay: delayMs = 0 } = {}) {
    return (async () => {
      let lastError;
      for (let i = 0; i <= retries; i++) {
        try {
          return await fn();
        } catch (err) {
          lastError = err;
          if (i < retries && delayMs > 0) {
            await new Promise((r) => setTimeout(r, delayMs));
          }
        }
      }
      throw lastError;
    })();
  }
};

/*

    Date

*/

const DatePrototype = {
  addDays(n) {
    const d = new Date(this);
    d.setDate(d.getDate() + n);
    return d;
  },
  addHours(n) {
    return new Date(this.getTime() + n * 3600000);
  },
  addMinutes(n) {
    return new Date(this.getTime() + n * 60000);
  },
  addMonths(n) {
    const d = new Date(this);
    d.setMonth(d.getMonth() + n);
    return d;
  },
  addSeconds(n) {
    return new Date(this.getTime() + n * 1000);
  },
  addYears(n) {
    const d = new Date(this);
    d.setFullYear(d.getFullYear() + n);
    return d;
  },
  age() {
    const today = new Date();
    let age = today.getFullYear() - this.getFullYear();
    const m = today.getMonth() - this.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.getDate())) {
      age--;
    }
    return age;
  },
  clone() {
    return new Date(this.getTime());
  },
  daysUntil(date) {
    const ms = date.getTime() - this.getTime();
    return Math.round(ms / 86400000);
  },
  endOfDay() {
    const d = new Date(this);
    d.setHours(23, 59, 59, 999);
    return d;
  },
  endOfMonth() {
    const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  },
  format(pattern) {
    const pad = (n, len = 2) => String(n).padStart(len, "0");
    const tokens = {
      YYYY: this.getFullYear(),
      YY: String(this.getFullYear()).slice(-2),
      MM: pad(this.getMonth() + 1),
      DD: pad(this.getDate()),
      HH: pad(this.getHours()),
      mm: pad(this.getMinutes()),
      ss: pad(this.getSeconds()),
      SSS: pad(this.getMilliseconds(), 3)
    };
    let result = pattern;
    for (const [token, value] of Object.entries(tokens)) {
      result = result.replace(token, value);
    }
    return result;
  },
  isFuture() {
    return this.getTime() > Date.now();
  },
  isPast() {
    return this.getTime() < Date.now();
  },
  isSameDay(date) {
    return (
      this.getFullYear() === date.getFullYear() &&
      this.getMonth() === date.getMonth() &&
      this.getDate() === date.getDate()
    );
  },
  isToday() {
    return this.isSameDay(new Date());
  },
  isWeekday() {
    const day = this.getDay();
    return day !== 0 && day !== 6;
  },
  isWeekend() {
    const day = this.getDay();
    return day === 0 || day === 6;
  },
  relative() {
    const now = Date.now();
    const diff = now - this.getTime();
    const absDiff = Math.abs(diff);
    const past = diff > 0;

    const units = [
      [31536000000, "year"],
      [2592000000, "month"],
      [604800000, "week"],
      [86400000, "day"],
      [3600000, "hour"],
      [60000, "minute"],
      [1000, "second"]
    ];

    for (const [ms, unit] of units) {
      if (absDiff >= ms) {
        const count = Math.floor(absDiff / ms);
        const plural = count === 1 ? unit : unit + "s";
        return past ? `${count} ${plural} ago` : `in ${count} ${plural}`;
      }
    }
    return "just now";
  },
  startOfDay() {
    const d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  startOfMonth() {
    return new Date(this.getFullYear(), this.getMonth(), 1);
  }
};

const DateObject = {
  today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },
  tomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
};

/*

    Math

*/

const MathObject = {
  average(...nums) {
    if (nums.length === 0) return NaN;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  degreesToRadians(deg) {
    return (deg * Math.PI) / 180;
  },
  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  },
  fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    let a = 0;
    let b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  },
  isPrime(n) {
    if (n < 2 || !Number.isInteger(n)) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3, s = Math.sqrt(n); i <= s; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  },
  lerp(a, b, t) {
    return a + (b - a) * t;
  },
  mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },
  radiansToDegrees(rad) {
    return (rad * 180) / Math.PI;
  },
  sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
  }
};

/*

    JSON

*/

const JSONObject = {
  safeParse(str, fallback = null) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }
};

/*

    Error

*/

const ErrorPrototype = {
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }
};

/*

    Effects

*/

const enrichMap = [
  [Object.prototype, ObjectPrototype],
  [Object, ObjectObject],
  [Array.prototype, ArrayPrototype],
  [Array, ArrayObject],
  [String.prototype, StringPrototype],
  [String, StringObject],
  [Number.prototype, NumberPrototype],
  [Number, NumberObject],
  [Function.prototype, FunctionPrototype],
  [Object.getPrototypeOf(() => {}), FunctionPrototype],
  [Function, FunctionObject],
  [Symbol, SymbolObject],
  [RegExp, RegexObject],
  [Promise.prototype, PromisePrototype],
  [Promise, PromiseObject],
  [Date.prototype, DatePrototype],
  [Date, DateObject],
  [Math, MathObject],
  [JSON, JSONObject],
  [Error.prototype, ErrorPrototype]
];

const toPropertyDescriptorMap = (propertyObject) =>
  Object.fromEntries(
    Object.entries(propertyObject).map(([key, value]) => [key, { value }])
  );
enrichMap.forEach(([o, po]) =>
  Object.defineProperties(o, toPropertyDescriptorMap(po))
);
