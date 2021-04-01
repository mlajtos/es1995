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
  isFunction
} from "lodash-es";
import dedent from "dedent";
import mdlog from "mdlog";
import colorScheme from "mdlog/color/solarized-dark.json";
import { compareTwoStrings } from "string-similarity";

const log = mdlog(colorScheme);

// console.log(mdlog.convert("aloha **bold** mu", colorScheme));

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

const ObjectPrototype = {
  pipe
};

const ObjectObject = {
  clone,
  cloneDeep
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
  groupBy(iteratee) {
    return groupBy(this, iteratee);
  },
  head() {
    return head(this);
  },
  intersect(other) {
    return intersection(this, other);
  },
  partition(predicate) {
    return partition(this, predicate);
  },
  reversed() {
    return [...this].reverse();
  },
  rotate(n) {
    return this.slice(n, this.length).concat(this.slice(0, n));
  },
  shuffle() {
    return shuffle(this);
  },
  sorted(comparator) {
    return this.slice(0).sort(comparator);
  },
  splitAt(n) {
    const i = Math.trunc(n) || 0;
    return [this.slice(0, i), this.slice(i)];
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
  removeDiacritics() {
    return deburr(this);
  },
  dedent() {
    return dedent(this);
  },
  similarityTo(string) {
    return compareTwoStrings(this, string);
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
  multipleOf(k) {
    return Number.isInteger(this / k);
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
  round(precision) {
    return round(this, precision);
  },
  sign() {
    return Math.sign(this);
  }
};

const NumberObject = {
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
  debounce(wait, options) {
    return debounce(this, wait, options);
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
  throttle(wait, options) {
    throttle(this, wait, options);
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
  constant,
  conditional: cond,
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
  IPv4: /^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$/
  //url
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
  [RegExp, RegexObject]
];

const toPropertyDescriptorMap = (propertyObject) =>
  Object.fromEntries(
    Object.entries(propertyObject).map(([key, value]) => [key, { value }])
  );
enrichMap.forEach(([o, po]) =>
  Object.defineProperties(o, toPropertyDescriptorMap(po))
);
