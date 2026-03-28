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
  sortBy,
} from "lodash-es";
import dedent from "dedent";
import mdlog from "mdlog";
// @ts-ignore – mdlog ships JSON color schemes without typings
import colorScheme from "mdlog/color/solarized-dark.json";
import { compareTwoStrings } from "string-similarity";

/* ──────────────────────────────────────────────────────────────────────────────
 *  Global Type Augmentations
 *
 *  These declarations are the heart of the ES1995 typing experience.
 *  Every method added at runtime is declared here so editors provide
 *  full autocompletion and type-checking for ES1995-enriched code.
 * ────────────────────────────────────────────────────────────────────────── */

declare global {
  // ── Object ────────────────────────────────────────────────────────────
  interface Object {
    /** Pass `this` into `fn` and return the result. */
    pipe<T, R>(this: T, fn: (value: T) => R): R;
    /** Call `fn` with `this` for side-effects, then return `this`. */
    tap<T>(this: T, fn: (value: T) => void): T;
    /** Deep-equality check via lodash `isEqual`. */
    equals(other: unknown): boolean;
  }

  interface ObjectConstructor {
    clone<T>(value: T): T;
    cloneDeep<T>(value: T): T;
    pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
    omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
    deepMerge<T extends object>(...objects: Partial<T>[]): T;
    deepFreeze<T extends object>(obj: T): Readonly<T>;
    defaults<T extends object>(...objects: Partial<T>[]): T;
    mapKeys<V>(obj: Record<string, V>, fn: (value: V, key: string) => string): Record<string, V>;
    mapValues<K extends string, V, R>(obj: Record<K, V>, fn: (value: V, key: K) => R): Record<K, R>;
  }

  // ── Array ─────────────────────────────────────────────────────────────
  interface Array<T> {
    at(n: number[]): T[];
    at(n: number): T | undefined;

    chunk(size: number): T[][];
    compact(): NonNullable<T>[];
    count(predicate?: (value: T, index: number, array: T[]) => boolean): number;
    distinct(): T[];
    drop(n: number): T[];
    duplicates(): T[];
    empty(): boolean;
    except(toRemove: T[]): T[];
    first(predicate?: (value: T, index: number, array: T[]) => boolean): T | undefined;
    flattenDeep(): unknown[];
    frequencies(): Record<string, number>;
    groupBy(iteratee: ((value: T) => string) | string): Record<string, T[]>;
    head(): T | undefined;
    intersect(other: T[]): T[];
    intersperse(separator: T): T[];
    last(predicate?: (value: T, index: number, array: T[]) => boolean): T | undefined;
    max(fn?: ((value: T) => number) | string): T;
    min(fn?: ((value: T) => number) | string): T;
    average(fn?: ((value: T) => number) | string): number;
    pairwise(): [T, T][];
    partition(predicate: (value: T) => boolean): [T[], T[]];
    reject(predicate: (value: T, index: number, array: T[]) => boolean): T[];
    reversed(): T[];
    rotate(n: number): T[];
    scan<R>(fn: (acc: R, item: T) => R, initial: R): R[];
    shuffle(): T[];
    sortBy(fn: ((value: T) => unknown) | string): T[];
    sorted(comparator?: (a: T, b: T) => number): T[];
    splitAt(n: number): [T[], T[]];
    sum(fn?: ((value: T) => number) | string): number;
    tail(): T[];
    take(count: number): T[];
    tap(fn: (value: T) => void): T[];
    toObject<K extends string | number | symbol, V = T>(
      keyFn: (item: T, index: number) => K,
      valueFn?: (item: T, index: number) => V,
    ): Record<K, V>;
    transpose<U>(this: U[][]): U[][];
    uniqueBy(fn: ((value: T) => unknown) | string): T[];
    union(other: T[]): T[];
    window(size: number): T[][];
    zip<U>(...arrays: U[][]): (T | U)[][];
  }

  interface ArrayConstructor {
    cartesianProduct<T>(...arrays: T[][]): T[][];
    zip<T>(...arrays: T[][]): T[][];
  }

  // ── String ────────────────────────────────────────────────────────────
  interface String {
    camelCase(): string;
    capitalize(): string;
    chars(): string[];
    count(substring: string): number;
    dedent(): string;
    escapeHtml(): string;
    isBlank(): boolean;
    isPalindrome(): boolean;
    kebabCase(): string;
    lines(): string[];
    removeDiacritics(): string;
    reverse(): string;
    similarityTo(other: string): number;
    snakeCase(): string;
    template(vars: Record<string, string | number>): string;
    toNumber(): number;
    truncate(length: number, omission?: string): string;
    unescapeHtml(): string;
    words(): string[];
  }

  // ── Number ────────────────────────────────────────────────────────────
  interface Number {
    absoluteValue(): number;
    ceil(precision?: number): number;
    clamp(lower: number, upper: number): number;
    duration(): string;
    floor(precision?: number): number;
    fractionalPart(): number;
    integerPart(): number;
    inRange(start: number, end?: number): boolean;
    isEven(): boolean;
    isOdd(): boolean;
    isPrime(): boolean;
    multipleOf(k: number): boolean;
    ordinal(): string;
    pad(length: number): string;
    round(precision?: number): number;
    sign(): number;
    times<R>(fn: (index: number) => R): R[];
    to(end: number, step?: number): number[];
    toBinary(): string;
    toHex(): string;
    toOctal(): string;
    toRoman(): string;
  }

  interface NumberConstructor {
    fibonacci(n: number): number[];
    greatestCommonDivisor(a: number, b: number): number;
    leastCommonMultiple(a: number, b: number): number;
    random(lower?: number, upper?: number, floating?: boolean): number;
    range(start: number, end?: number, step?: number): number[];
  }

  // ── Function ──────────────────────────────────────────────────────────
  interface Function {
    compose(fn: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown;
    curry(): Function;
    debounce(
      wait: number,
      options?: { leading?: boolean; trailing?: boolean; maxWait?: number },
    ): Function & { cancel(): void; flush(): void };
    delay(ms: number): (...args: unknown[]) => Promise<unknown>;
    flip(): Function;
    memoize(resolver?: (...args: unknown[]) => unknown): Function;
    once(): Function;
    partial(...partials: unknown[]): Function;
    retry(n: number, delayMs?: number): (...args: unknown[]) => Promise<unknown>;
    throttle(
      wait: number,
      options?: { leading?: boolean; trailing?: boolean },
    ): Function & { cancel(): void; flush(): void };
  }

  interface FunctionConstructor {
    compose(...fns: Function[]): Function;
    conditional(pairs: [Function, Function][]): Function;
    constant<T>(value: T): () => T;
    false(): boolean;
    fixedPoint(f: (g: Function) => Function): Function;
    from(arg: string | unknown[] | Record<string | symbol, unknown>, ...rest: unknown[]): Function;
    identity<T>(value: T): T;
    isFunction(value: unknown): value is Function;
    noop(): void;
    pipe(...fns: Function[]): Function;
    true(): boolean;
  }

  // ── Promise ───────────────────────────────────────────────────────────
  interface Promise<T> {
    tap(fn: (value: T) => void): Promise<T>;
    timeout(ms: number): Promise<T>;
  }

  interface PromiseConstructor {
    delay<T = void>(ms: number, value?: T): Promise<T>;
    sleep(ms: number): Promise<void>;
    retry<T>(fn: () => Promise<T>, options?: { retries?: number; delay?: number }): Promise<T>;
  }

  // ── Date ──────────────────────────────────────────────────────────────
  interface Date {
    addDays(n: number): Date;
    addHours(n: number): Date;
    addMinutes(n: number): Date;
    addMonths(n: number): Date;
    addSeconds(n: number): Date;
    addYears(n: number): Date;
    age(): number;
    clone(): Date;
    daysUntil(date: Date): number;
    endOfDay(): Date;
    endOfMonth(): Date;
    format(pattern: string): string;
    isFuture(): boolean;
    isPast(): boolean;
    isSameDay(date: Date): boolean;
    isToday(): boolean;
    isWeekday(): boolean;
    isWeekend(): boolean;
    relative(): string;
    startOfDay(): Date;
    startOfMonth(): Date;
  }

  interface DateConstructor {
    today(): Date;
    tomorrow(): Date;
    yesterday(): Date;
  }

  // ── Math ──────────────────────────────────────────────────────────────
  interface Math {
    average(...nums: number[]): number;
    degreesToRadians(deg: number): number;
    factorial(n: number): number;
    fibonacci(n: number): number;
    inverseLerp(a: number, b: number, value: number): number;
    isPrime(n: number): boolean;
    lerp(a: number, b: number, t: number): number;
    radiansToDegrees(rad: number): number;
    sum(...nums: number[]): number;
  }

  // ── JSON ──────────────────────────────────────────────────────────────
  interface JSON {
    safeParse<T = unknown>(str: string, fallback?: T): T;
  }

  // ── Error ─────────────────────────────────────────────────────────────
  interface Error {
    toJSON(): { name: string; message: string; stack?: string };
  }

  // ── Symbol ────────────────────────────────────────────────────────────
  interface SymbolConstructor {
    readonly callable: symbol;
    readonly documentation: symbol;
  }

  // ── RegExp ────────────────────────────────────────────────────────────
  interface RegExpConstructor {
    readonly email: RegExp;
    readonly hexColor: RegExp;
    readonly IPv4: RegExp;
    readonly ISO8601: RegExp;
    readonly URL: RegExp;
    readonly UUID: RegExp;
  }
}

/* ──────────────────────────────────────────────────────────────────────────────
 *  Implementation
 * ────────────────────────────────────────────────────────────────────────── */

const log = mdlog(colorScheme);

const Documentation = Symbol.for("documentation");

function pipe<T, R>(this: T, func: (value: T) => R): R {
  return func(this);
}

(pipe as any)[Documentation] = `
    # Object.prototype.pipe
    
    Usage:
    
        "hello world".pipe(s => s.toUpperCase())
    
`;

/*

    Object

*/

const deepMergeCustomizer = (objValue: unknown, srcValue: unknown): unknown[] | undefined => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

const ObjectPrototype = {
  pipe,
  tap<T>(this: T, func: (value: T) => void): T {
    func(this);
    return this;
  },
  equals(this: unknown, other: unknown): boolean {
    return isEqual(this, other);
  },
};

const ObjectObject = {
  clone,
  cloneDeep,
  pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return pick(obj, keys as string[]) as Pick<T, K>;
  },
  omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return omit(obj, keys as string[]) as Omit<T, K>;
  },
  deepMerge(...objects: object[]): object {
    return mergeWith({}, ...objects, deepMergeCustomizer);
  },
  deepFreeze<T extends object>(obj: T): Readonly<T> {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const val = (obj as Record<string, unknown>)[prop];
      if (val !== null && typeof val === "object" && !Object.isFrozen(val)) {
        Object.deepFreeze(val as object);
      }
    });
    return obj;
  },
  defaults: defaultsDeep,
  mapKeys(obj: object, fn: (value: unknown, key: string) => string): object {
    return mapKeys(obj, fn);
  },
  mapValues(obj: object, fn: (value: unknown, key: string) => unknown): object {
    return mapValues(obj, fn);
  },
};

/*

    Array

*/

const ArrayPrototype = {
  at(this: unknown[], n: number | number[]): unknown {
    if (Array.isArray(n)) {
      return n.map((i) => (this as unknown[]).at(i));
    }
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) {
      return undefined;
    }
    return this[n];
  },
  chunk(this: unknown[], size: number): unknown[][] {
    return chunk(this, size);
  },
  compact(this: unknown[]): unknown[] {
    return compact(this);
  },
  count(this: unknown[], predicate?: (value: unknown, index: number, array: unknown[]) => boolean): number {
    if (!predicate) return this.length;
    return this.filter(predicate).length;
  },
  distinct(this: unknown[]): unknown[] {
    return [...new Set(this)];
  },
  drop(this: unknown[], n: number): unknown[] {
    return drop(this, n);
  },
  duplicates(this: unknown[]): unknown[] {
    return filter(this, (val, i, iteratee) => includes(iteratee, val, i + 1));
  },
  empty(this: unknown[]): boolean {
    return this.length === 0;
  },
  except(this: unknown[], toRemove: unknown[]): unknown[] {
    return this.filter((el) => !toRemove.includes(el));
  },
  first(this: unknown[], predicate?: (value: unknown) => boolean): unknown {
    if (!predicate) return head(this);
    return this.find(predicate);
  },
  flattenDeep(this: unknown[]): unknown[] {
    return flattenDeep(this);
  },
  frequencies(this: unknown[]): Record<string, number> {
    return countBy(this, identity);
  },
  groupBy(this: unknown[], iteratee: ((value: unknown) => string) | string): Record<string, unknown[]> {
    return groupBy(this, iteratee);
  },
  head(this: unknown[]): unknown {
    return head(this);
  },
  intersect(this: unknown[], other: unknown[]): unknown[] {
    return intersection(this, other);
  },
  intersperse(this: unknown[], separator: unknown): unknown[] {
    if (this.length <= 1) return [...this];
    return this.flatMap((item, i) => (i < this.length - 1 ? [item, separator] : [item]));
  },
  last(this: unknown[], predicate?: (value: unknown, index: number, array: unknown[]) => boolean): unknown {
    if (!predicate) return lodashLast(this);
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) return this[i];
    }
    return undefined;
  },
  max(this: unknown[], fn?: ((value: unknown) => number) | string): unknown {
    if (!fn) return Math.max(...(this as number[]));
    return maxBy(this, fn as any);
  },
  min(this: unknown[], fn?: ((value: unknown) => number) | string): unknown {
    if (!fn) return Math.min(...(this as number[]));
    return minBy(this, fn as any);
  },
  average(this: unknown[], fn?: ((value: unknown) => number) | string): number {
    if (this.length === 0) return NaN;
    if (!fn) return (this as number[]).sum() / this.length;
    return meanBy(this, fn as any);
  },
  pairwise(this: unknown[]): [unknown, unknown][] {
    return this.slice(0, -1).map((item, i) => [item, this[i + 1]]);
  },
  partition(this: unknown[], predicate: (value: unknown) => boolean): [unknown[], unknown[]] {
    return partition(this, predicate);
  },
  reject(this: unknown[], predicate: (value: unknown, index: number, array: unknown[]) => boolean): unknown[] {
    return this.filter((el, i, arr) => !predicate(el, i, arr));
  },
  reversed(this: unknown[]): unknown[] {
    return [...this].reverse();
  },
  rotate(this: unknown[], n: number): unknown[] {
    return this.slice(n, this.length).concat(this.slice(0, n));
  },
  scan(this: unknown[], fn: (acc: unknown, item: unknown) => unknown, initial: unknown): unknown[] {
    const results: unknown[] = [];
    let acc = initial;
    for (const item of this) {
      acc = fn(acc, item);
      results.push(acc);
    }
    return results;
  },
  shuffle(this: unknown[]): unknown[] {
    return shuffle(this);
  },
  sortBy(this: unknown[], fn: ((value: unknown) => unknown) | string): unknown[] {
    return sortBy(this, fn as any);
  },
  sorted(this: unknown[], comparator?: (a: unknown, b: unknown) => number): unknown[] {
    return this.slice(0).sort(comparator as any);
  },
  splitAt(this: unknown[], n: number): [unknown[], unknown[]] {
    const i = Math.trunc(n) || 0;
    return [this.slice(0, i), this.slice(i)];
  },
  sum(this: unknown[], fn?: ((value: unknown) => number) | string): number {
    if (!fn) return (this as number[]).reduce((a, b) => a + b, 0);
    return sumBy(this, fn as any);
  },
  tail(this: unknown[]): unknown[] {
    return tail(this);
  },
  take(this: unknown[], count: number): unknown[] {
    return this.slice(0, count);
  },
  tap(this: unknown[], func: (value: unknown) => void): unknown[] {
    this.forEach(func);
    return this;
  },
  toObject(
    this: unknown[],
    keyFn: (item: unknown, index: number) => string | number | symbol,
    valueFn?: (item: unknown, index: number) => unknown,
  ): Record<string, unknown> {
    return Object.fromEntries(
      this.map((item, i) => [keyFn(item, i), valueFn ? valueFn(item, i) : item]),
    );
  },
  transpose(this: unknown[][]): unknown[][] {
    if (this.length === 0) return [];
    return (this[0] as unknown[]).map((_: unknown, i: number) => this.map((row) => row[i]));
  },
  uniqueBy(this: unknown[], fn: ((value: unknown) => unknown) | string): unknown[] {
    return uniqBy(this, fn as any);
  },
  union(this: unknown[], other: unknown[]): unknown[] {
    return union(this, other);
  },
  window(this: unknown[], size: number): unknown[][] {
    if (size > this.length) return [];
    const result: unknown[][] = [];
    for (let i = 0; i <= this.length - size; i++) {
      result.push(this.slice(i, i + size));
    }
    return result;
  },
  zip(this: unknown[], ...arrays: unknown[][]): unknown[][] {
    return zip(this, ...arrays);
  },
};

const ArrayObject = {
  cartesianProduct(...a: unknown[][]): unknown[][] {
    return a.reduce((a: any, b: any) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));
  },
  zip,
};

/*

    String

*/

const StringPrototype = {
  camelCase(this: string): string {
    return camelCase(this);
  },
  capitalize(this: string): string {
    return capitalize(this);
  },
  chars(this: string): string[] {
    return [...this];
  },
  count(this: string, substring: string): number {
    if (!substring) return 0;
    let count = 0;
    let pos = 0;
    while ((pos = this.indexOf(substring, pos)) !== -1) {
      count++;
      pos += substring.length;
    }
    return count;
  },
  dedent(this: string): string {
    return dedent(this);
  },
  escapeHtml(this: string): string {
    return lodashEscape(this);
  },
  isBlank(this: string): boolean {
    return this.trim().length === 0;
  },
  isPalindrome(this: string): boolean {
    const cleaned = this.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
  },
  kebabCase(this: string): string {
    return kebabCase(this);
  },
  lines(this: string): string[] {
    return this.split("\n");
  },
  removeDiacritics(this: string): string {
    return deburr(this);
  },
  reverse(this: string): string {
    return [...this].reverse().join("");
  },
  similarityTo(this: string, string: string): number {
    return compareTwoStrings(this.valueOf(), string);
  },
  snakeCase(this: string): string {
    return snakeCase(this);
  },
  template(this: string, vars: Record<string, string | number>): string {
    return this.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ""));
  },
  toNumber(this: string): number {
    return Number(this);
  },
  truncate(this: string, length: number, omission = "..."): string {
    return lodashTruncate(this.valueOf(), { length, omission });
  },
  unescapeHtml(this: string): string {
    return lodashUnescape(this);
  },
  words(this: string): string[] {
    return lodashWords(this.valueOf());
  },
};

const StringObject = {};

/*

    Number

*/

const NumberPrototype = {
  absoluteValue(this: number): number {
    return Math.abs(this);
  },
  ceil(this: number, precision?: number): number {
    return ceil(this, precision);
  },
  clamp(this: number, lower: number, upper: number): number {
    return clamp(this, lower, upper);
  },
  duration(this: number): string {
    const ms = Math.abs(this);
    const units: [number, string][] = [
      [86400000, "d"],
      [3600000, "h"],
      [60000, "m"],
      [1000, "s"],
      [1, "ms"],
    ];
    let remaining = ms;
    const parts: string[] = [];
    for (const [divisor, label] of units) {
      if (remaining >= divisor) {
        const count = Math.floor(remaining / divisor);
        remaining %= divisor;
        parts.push(`${count}${label}`);
      }
    }
    return parts.join(" ") || "0ms";
  },
  floor(this: number, precision?: number): number {
    return floor(this, precision);
  },
  fractionalPart(this: number): number {
    const parts = (this + "").split(".");
    if (parts.length < 2) return 0;
    return parseFloat("0." + parts[1]);
  },
  integerPart(this: number): number {
    return Math.abs(Math.trunc(this));
  },
  inRange(this: number, start: number, end?: number): boolean {
    return inRange(this, start, end as number);
  },
  isEven(this: number): boolean {
    return this % 2 === 0;
  },
  isOdd(this: number): boolean {
    return Math.abs(this % 2) === 1;
  },
  isPrime(this: number): boolean {
    if (this < 2 || !Number.isInteger(this.valueOf())) return false;
    if (this === 2) return true;
    if (this % 2 === 0) return false;
    for (let i = 3, s = Math.sqrt(this); i <= s; i += 2) {
      if (this % i === 0) return false;
    }
    return true;
  },
  multipleOf(this: number, k: number): boolean {
    return Number.isInteger(this / k);
  },
  ordinal(this: number): string {
    const n = Math.abs(this);
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },
  pad(this: number, length: number): string {
    return String(this).padStart(length, "0");
  },
  round(this: number, precision?: number): number {
    return round(this, precision);
  },
  sign(this: number): number {
    return Math.sign(this);
  },
  times<R>(this: number, fn: (index: number) => R): R[] {
    return lodashTimes(this, fn);
  },
  to(this: number, end: number, step?: number): number[] {
    return range(this, end, step);
  },
  toBinary(this: number): string {
    return (this >>> 0).toString(2);
  },
  toHex(this: number): string {
    return this.toString(16);
  },
  toOctal(this: number): string {
    return this.toString(8);
  },
  toRoman(this: number): string {
    const n = this.valueOf();
    if (n <= 0 || !Number.isInteger(n) || n > 3999) return "";
    const numerals: [number, string][] = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];
    let result = "";
    let remaining = n;
    for (const [value, symbol] of numerals) {
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
      }
    }
    return result;
  },
};

const NumberObject = {
  fibonacci(n: number): number[] {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const seq = [0, 1];
    for (let i = 2; i < n; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq;
  },
  greatestCommonDivisor(a: number, b: number): number {
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
  leastCommonMultiple(a: number, b: number): number {
    return Math.abs(a * b) / Number.greatestCommonDivisor(a, b);
  },
  random,
  range,
};

/*

    Function

*/

const originalFunctionToString = Function.prototype.toString;

const FunctionPrototype: Record<string, Function> = {
  compose(this: Function, fn: Function): Function {
    const self = this;
    return function (this: unknown, ...args: unknown[]) {
      return self(fn(...args));
    };
  },
  curry(this: Function): Function {
    return curry(this as any);
  },
  debounce(this: Function, wait: number, options?: object): Function {
    return debounce(this as any, wait, options);
  },
  delay(this: Function, ms: number): Function {
    const self = this;
    return function (this: unknown, ...args: unknown[]) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(self(...args)), ms);
      });
    };
  },
  flip(this: Function): Function {
    return lodashFlip(this as any);
  },
  memoize(this: Function, resolver?: Function): Function {
    return memoize(this as any, resolver as any);
  },
  once(this: Function): Function {
    return once(this as any);
  },
  partial(this: Function, ...partials: unknown[]): Function {
    return partial(this as any, ...partials);
  },
  retry(this: Function, n: number, delayMs = 0): Function {
    const self = this;
    return async function (this: unknown, ...args: unknown[]) {
      let lastError: unknown;
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
  throttle(this: Function, wait: number, options?: object): Function {
    return throttle(this as any, wait, options);
  },
  toString(this: Function & { [key: symbol]: string }): string {
    if (this[Documentation]) {
      log(dedent(this[Documentation]));
      return originalFunctionToString.call(this);
    } else {
      return originalFunctionToString.call(this);
    }
  },
};

const createLambda = (expression: string): Function => {
  const regexp = new RegExp("[$]+", "g");

  let maxLength = 0;
  let match;

  // eslint-disable-next-line
  while ((match = regexp.exec(expression)) != null) {
    const paramNumber = match[0].length;
    if (paramNumber > maxLength) {
      maxLength = paramNumber;
    }
  }

  const argArray: string[] = [];
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
  constructor(props: Record<string | symbol, unknown>) {
    super();
    const callable = props[Symbol.for("callable")] as Function;
    return Object.assign(callable.bind(props), props);
  }
}

const FunctionObject: Record<string, unknown> = {
  compose: flowRight,
  conditional: cond,
  constant,
  false: () => false,
  fixedPoint: (f: (g: Function) => Function) => {
    const g = (h: Function) => (x: unknown) => f(h(h))(x);
    return g(g);
  },
  from: (arg: unknown, ...rest: unknown[]) => {
    if (typeof arg === "string") {
      return createLambda(arg);
    }

    if (Array.isArray(arg)) {
      return (arg as unknown[]).zip(rest).flat().compact().join("").pipe(createLambda);
    }

    if (typeof arg === "object" && arg !== null && (arg as Record<symbol, unknown>)[Symbol.for("callable")]) {
      return new CallableObject(arg as Record<string | symbol, unknown>);
    }
  },
  identity,
  isFunction,
  noop,
  pipe: flow,
  true: () => true,
};

/*

    Symbol

*/

const SymbolObject = {
  callable: Symbol.for("callable"),
  documentation: Symbol.for("documentation"),
};

const RegexObject = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  hexColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  IPv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
  ISO8601: /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/,
  URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

/*

    Promise

*/

const PromisePrototype = {
  tap<T>(this: Promise<T>, fn: (value: T) => void): Promise<T> {
    return this.then((value) => {
      fn(value);
      return value;
    });
  },
  timeout<T>(this: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      this,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
      ),
    ]);
  },
};

const PromiseObject = {
  delay<T = void>(ms: number, value?: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value as T), ms));
  },
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  retry<T>(fn: () => Promise<T>, { retries = 3, delay: delayMs = 0 } = {}): Promise<T> {
    return (async () => {
      let lastError: unknown;
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
  },
};

/*

    Date

*/

const DatePrototype = {
  addDays(this: Date, n: number): Date {
    const d = new Date(this);
    d.setDate(d.getDate() + n);
    return d;
  },
  addHours(this: Date, n: number): Date {
    return new Date(this.getTime() + n * 3600000);
  },
  addMinutes(this: Date, n: number): Date {
    return new Date(this.getTime() + n * 60000);
  },
  addMonths(this: Date, n: number): Date {
    const d = new Date(this);
    d.setMonth(d.getMonth() + n);
    return d;
  },
  addSeconds(this: Date, n: number): Date {
    return new Date(this.getTime() + n * 1000);
  },
  addYears(this: Date, n: number): Date {
    const d = new Date(this);
    d.setFullYear(d.getFullYear() + n);
    return d;
  },
  age(this: Date): number {
    const today = new Date();
    let age = today.getFullYear() - this.getFullYear();
    const m = today.getMonth() - this.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.getDate())) {
      age--;
    }
    return age;
  },
  clone(this: Date): Date {
    return new Date(this.getTime());
  },
  daysUntil(this: Date, date: Date): number {
    const ms = date.getTime() - this.getTime();
    return Math.round(ms / 86400000);
  },
  endOfDay(this: Date): Date {
    const d = new Date(this);
    d.setHours(23, 59, 59, 999);
    return d;
  },
  endOfMonth(this: Date): Date {
    const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  },
  format(this: Date, pattern: string): string {
    const pad = (n: number, len = 2) => String(n).padStart(len, "0");
    const tokens: Record<string, string | number> = {
      YYYY: this.getFullYear(),
      YY: String(this.getFullYear()).slice(-2),
      MM: pad(this.getMonth() + 1),
      DD: pad(this.getDate()),
      HH: pad(this.getHours()),
      mm: pad(this.getMinutes()),
      ss: pad(this.getSeconds()),
      SSS: pad(this.getMilliseconds(), 3),
    };
    let result = pattern;
    for (const [token, value] of Object.entries(tokens)) {
      result = result.replace(token, String(value));
    }
    return result;
  },
  isFuture(this: Date): boolean {
    return this.getTime() > Date.now();
  },
  isPast(this: Date): boolean {
    return this.getTime() < Date.now();
  },
  isSameDay(this: Date, date: Date): boolean {
    return (
      this.getFullYear() === date.getFullYear() &&
      this.getMonth() === date.getMonth() &&
      this.getDate() === date.getDate()
    );
  },
  isToday(this: Date): boolean {
    return this.isSameDay(new Date());
  },
  isWeekday(this: Date): boolean {
    const day = this.getDay();
    return day !== 0 && day !== 6;
  },
  isWeekend(this: Date): boolean {
    const day = this.getDay();
    return day === 0 || day === 6;
  },
  relative(this: Date): string {
    const now = Date.now();
    const diff = now - this.getTime();
    const absDiff = Math.abs(diff);
    const past = diff > 0;

    const units: [number, string][] = [
      [31536000000, "year"],
      [2592000000, "month"],
      [604800000, "week"],
      [86400000, "day"],
      [3600000, "hour"],
      [60000, "minute"],
      [1000, "second"],
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
  startOfDay(this: Date): Date {
    const d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  startOfMonth(this: Date): Date {
    return new Date(this.getFullYear(), this.getMonth(), 1);
  },
};

const DateObject = {
  today(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },
  tomorrow(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  yesterday(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  },
};

/*

    Math

*/

const MathObject = {
  average(...nums: number[]): number {
    if (nums.length === 0) return NaN;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  degreesToRadians(deg: number): number {
    return (deg * Math.PI) / 180;
  },
  factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  },
  fibonacci(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    let a = 0;
    let b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  },
  inverseLerp(a: number, b: number, value: number): number {
    if (a === b) return 0;
    return (value - a) / (b - a);
  },
  isPrime(n: number): boolean {
    if (n < 2 || !Number.isInteger(n)) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3, s = Math.sqrt(n); i <= s; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  },
  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },
  radiansToDegrees(rad: number): number {
    return (rad * 180) / Math.PI;
  },
  sum(...nums: number[]): number {
    return nums.reduce((a, b) => a + b, 0);
  },
};

/*

    JSON

*/

const JSONObject = {
  safeParse<T = unknown>(str: string, fallback: T = null as T): T {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  },
};

/*

    Error

*/

const ErrorPrototype = {
  toJSON(this: Error): { name: string; message: string; stack?: string } {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  },
};

/*

    Effects

*/

type EnrichEntry = [object, Record<string, unknown>];

const enrichMap: EnrichEntry[] = [
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
  [Error.prototype, ErrorPrototype],
];

const toPropertyDescriptorMap = (propertyObject: Record<string, unknown>): PropertyDescriptorMap =>
  Object.fromEntries(
    Object.entries(propertyObject).map(([key, value]) => [key, { value }]),
  );
enrichMap.forEach(([o, po]) => Object.defineProperties(o, toPropertyDescriptorMap(po)));

export {};
