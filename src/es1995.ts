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
    /** Parse hex color string to RGB. */
    toRGB(): ColorRGB;
    /** Parse hex color string to HSL. */
    toHSL(): ColorHSL;
    /** Parse a query string into key-value pairs. */
    parseQueryString(): Record<string, string>;
    /** Parse duration string like "2h30m" to milliseconds. */
    toDuration(): number;
    /** Parse byte string like "1.5 GB" to number of bytes. */
    toBytes(): number;
  }

  interface StringConstructor {
    /** Generate a v4 UUID. */
    uuid(): string;
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
    /** Format bytes as human-readable string. */
    bytes(): string;
    /** Format milliseconds as human-readable duration string. */
    toFileSize(): string;
  }

  interface NumberConstructor {
    fibonacci(n: number): number[];
    greatestCommonDivisor(a: number, b: number): number;
    leastCommonMultiple(a: number, b: number): number;
    random(lower?: number, upper?: number, floating?: boolean): number;
    range(start: number, end?: number, step?: number): number[];
    /** Create hex color from RGB. */
    rgb(r: number, g: number, b: number): string;
    /** Create hex color from HSL. */
    hsl(h: number, s: number, l: number): string;
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
    /** Run async mapper over items with concurrency limit. */
    map<T, R>(items: T[], fn: (item: T, index: number) => Promise<R>, options?: { concurrency?: number }): Promise<R[]>;
    /** Run async fn for each item sequentially. */
    each<T>(items: T[], fn: (item: T, index: number) => Promise<void>): Promise<void>;
    /** Resolve object of promises to object of values. */
    props<T extends Record<string, unknown>>(obj: { [K in keyof T]: Promise<T[K]> | T[K] }): Promise<T>;
    /** Async filter with concurrency. */
    filter<T>(items: T[], fn: (item: T, index: number) => Promise<boolean>, options?: { concurrency?: number }): Promise<T[]>;
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
    readonly queryString: RegExp;
  }

  // ── Schema Validation (z) ────────────────────────────────────────────
  interface SchemaResult<T> { success: boolean; data?: T; error?: string }
  
  interface ZodString {
    min(n: number): ZodString;
    max(n: number): ZodString;
    email(): ZodString;
    url(): ZodString;
    uuid(): ZodString;
    regex(re: RegExp): ZodString;
    nonempty(): ZodString;
    optional(): ZodString;
    parse(value: unknown): string;
    safeParse(value: unknown): SchemaResult<string>;
  }
  
  interface ZodNumber {
    min(n: number): ZodNumber;
    max(n: number): ZodNumber;
    int(): ZodNumber;
    positive(): ZodNumber;
    negative(): ZodNumber;
    nonnegative(): ZodNumber;
    optional(): ZodNumber;
    parse(value: unknown): number;
    safeParse(value: unknown): SchemaResult<number>;
  }
  
  interface ZodBoolean {
    optional(): ZodBoolean;
    parse(value: unknown): boolean;
    safeParse(value: unknown): SchemaResult<boolean>;
  }
  
  interface ZodArray<T> {
    min(n: number): ZodArray<T>;
    max(n: number): ZodArray<T>;
    nonempty(): ZodArray<T>;
    optional(): ZodArray<T>;
    parse(value: unknown): T[];
    safeParse(value: unknown): SchemaResult<T[]>;
  }
  
  interface ZodObject<T> {
    optional(): ZodObject<T>;
    parse(value: unknown): T;
    safeParse(value: unknown): SchemaResult<T>;
    extend<U>(shape: Record<string, unknown>): ZodObject<T & U>;
    pick<K extends keyof T>(...keys: K[]): ZodObject<Pick<T, K>>;
    omit<K extends keyof T>(...keys: K[]): ZodObject<Omit<T, K>>;
  }
  
  interface ZodLiteral<T> {
    parse(value: unknown): T;
    safeParse(value: unknown): SchemaResult<T>;
  }
  
  interface ZodUnion<T> {
    parse(value: unknown): T;
    safeParse(value: unknown): SchemaResult<T>;
  }
  
  interface ZodEnum<T extends string> {
    parse(value: unknown): T;
    safeParse(value: unknown): SchemaResult<T>;
    options: T[];
  }

  var z: {
    string(): ZodString;
    number(): ZodNumber;
    boolean(): ZodBoolean;
    array<T>(schema: { parse(v: unknown): T }): ZodArray<T>;
    object<T extends Record<string, { parse(v: unknown): unknown }>>(shape: T): ZodObject<{ [K in keyof T]: ReturnType<T[K]["parse"]> }>;
    literal<T extends string | number | boolean>(value: T): ZodLiteral<T>;
    union<T extends { parse(v: unknown): unknown }[]>(...schemas: T): ZodUnion<ReturnType<T[number]["parse"]>>;
    enum<T extends string>(...values: T[]): ZodEnum<T>;
  };

  // ── Color ─────────────────────────────────────────────────────────────
  interface ColorRGB { r: number; g: number; b: number }
  interface ColorHSL { h: number; s: number; l: number }

  // ── Type-fest Utility Types ───────────────────────────────────────────
  type PartialDeep<T> = T extends object ? { [P in keyof T]?: PartialDeep<T[P]> } : T;
  type RequiredDeep<T> = T extends object ? { [P in keyof T]-?: RequiredDeep<T[P]> } : T;
  type ReadonlyDeep<T> = T extends object ? { readonly [P in keyof T]: ReadonlyDeep<T[P]> } : T;
  type SetRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
  type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  type SetReadonly<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
  type Simplify<T> = { [K in keyof T]: T[K] } & {};
  type Merge<A, B> = Simplify<Omit<A, keyof B> & B>;
  type ValueOf<T> = T[keyof T];
  type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];
  type StringKeyOf<T> = Extract<keyof T, string>;
  type Opaque<T, K extends string> = T & { readonly __brand: K };
  type NonEmptyArray<T> = [T, ...T[]];
  type Writable<T> = { -readonly [P in keyof T]: T[P] };
  type WritableDeep<T> = T extends object ? { -readonly [P in keyof T]: WritableDeep<T[P]> } : T;
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

    Color Conversions

*/

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const h = hex.replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map((x) => Math.round(x).clamp(0, 255).toString(16).padStart(2, "0")).join("");
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
  toRGB(this: string): { r: number; g: number; b: number } {
    return hexToRgb(this);
  },
  toHSL(this: string): { h: number; s: number; l: number } {
    const { r, g, b } = hexToRgb(this);
    return rgbToHsl(r, g, b);
  },
  parseQueryString(this: string): Record<string, string> {
    const str = this.replace(/^\?/, "");
    if (!str) return {};
    return Object.fromEntries(
      str.split("&").map((pair) => {
        const [key, ...rest] = pair.split("=");
        return [decodeURIComponent(key), decodeURIComponent(rest.join("="))];
      }),
    );
  },
  toDuration(this: string): number {
    const units: Record<string, number> = { ms: 1, s: 1000, m: 60000, min: 60000, h: 3600000, d: 86400000, w: 604800000, y: 31536000000 };
    let total = 0;
    const re = /(\d+(?:\.\d+)?)\s*(ms|min|[smhdwy])/gi;
    let match;
    while ((match = re.exec(this)) !== null) {
      total += parseFloat(match[1]) * (units[match[2].toLowerCase()] ?? 0);
    }
    return total;
  },
  toBytes(this: string): number {
    const units: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4, pb: 1024 ** 5 };
    const match = this.trim().match(/^([\d.]+)\s*([a-z]+)$/i);
    if (!match) return NaN;
    return parseFloat(match[1]) * (units[match[2].toLowerCase()] ?? NaN);
  },
};

const StringObject = {
  uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  },
};

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
    return Math.abs(this % 1);
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
  bytes(this: number): string {
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let n = Math.abs(this);
    let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n % 1 === 0 ? n : n.toFixed(2)} ${units[i]}`;
  },
  toFileSize(this: number): string {
    return (this as any).bytes();
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
  rgb(r: number, g: number, b: number): string {
    return rgbToHex(r, g, b);
  },
  hsl(h: number, s: number, l: number): string {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
  },
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
  queryString: /^([^=&]+=[^&]*&)*[^=&]+=[^&]*$/,
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
  async map<T, R>(items: T[], fn: (item: T, index: number) => Promise<R>, { concurrency = Infinity } = {}): Promise<R[]> {
    if (concurrency === Infinity) return Promise.all(items.map(fn));
    const results: R[] = new Array(items.length);
    let idx = 0;
    const run = async (): Promise<void> => {
      while (idx < items.length) {
        const i = idx++;
        results[i] = await fn(items[i], i);
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
    return results;
  },
  async each<T>(items: T[], fn: (item: T, index: number) => Promise<void>): Promise<void> {
    for (let i = 0; i < items.length; i++) await fn(items[i], i);
  },
  async props<T extends Record<string, unknown>>(obj: Record<string, unknown>): Promise<T> {
    const keys = Object.keys(obj);
    const values = await Promise.all(keys.map((k) => Promise.resolve(obj[k])));
    return Object.fromEntries(keys.map((k, i) => [k, values[i]])) as T;
  },
  async filter<T>(items: T[], fn: (item: T, index: number) => Promise<boolean>, { concurrency = Infinity } = {}): Promise<T[]> {
    const results = await (Promise as any).map(items, async (item: T, i: number) => ({ item, keep: await fn(item, i) }), { concurrency });
    return results.filter((r: { keep: boolean }) => r.keep).map((r: { item: T }) => r.item);
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

    Schema Validation (z)

*/

class ZodValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZodValidationError";
  }
}

type Check = (value: unknown) => string | null;

const createSchema = <T>(baseCheck: Check, checks: Check[] = []) => {
  const allChecks = [baseCheck, ...checks];
  
  const validate = (value: unknown): { success: boolean; data?: T; error?: string } => {
    for (const check of allChecks) {
      const error = check(value);
      if (error) return { success: false, error };
    }
    return { success: true, data: value as T };
  };

  return {
    parse(value: unknown): T {
      const result = validate(value);
      if (!result.success) throw new ZodValidationError(result.error!);
      return result.data!;
    },
    safeParse(value: unknown) {
      return validate(value);
    },
    _checks: allChecks,
    _baseCheck: baseCheck,
  };
};

const addCheck = <S extends ReturnType<typeof createSchema>>(schema: S, check: Check): S => {
  return { ...schema, ...createSchema(schema._baseCheck, [...schema._checks.slice(1), check]) } as S;
};

const zImpl = {
  string() {
    const base = createSchema<string>((v) => typeof v === "string" ? null : `Expected string, got ${typeof v}`);
    const chain = {
      ...base,
      min: (n: number) => addStringChain(addCheck(base, (v) => (v as string).length >= n ? null : `String must be at least ${n} characters`)),
      max: (n: number) => addStringChain(addCheck(base, (v) => (v as string).length <= n ? null : `String must be at most ${n} characters`)),
      email: () => addStringChain(addCheck(base, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string) ? null : "Invalid email")),
      url: () => addStringChain(addCheck(base, (v) => { try { new URL(v as string); return null; } catch { return "Invalid URL"; } })),
      uuid: () => addStringChain(addCheck(base, (v) => RegExp.UUID.test(v as string) ? null : "Invalid UUID")),
      regex: (re: RegExp) => addStringChain(addCheck(base, (v) => re.test(v as string) ? null : `Does not match ${re}`)),
      nonempty: () => addStringChain(addCheck(base, (v) => (v as string).length > 0 ? null : "String must not be empty")),
      optional: () => {
        const optBase = createSchema<string | undefined>((v) => v === undefined || typeof v === "string" ? null : `Expected string or undefined, got ${typeof v}`, base._checks.slice(1));
        return { ...optBase, ...chain };
      },
    };
    return chain;

    function addStringChain(s: any) {
      return {
        ...s,
        min: (n: number) => addStringChain(addCheck(s, (v) => (v as string).length >= n ? null : `String must be at least ${n} characters`)),
        max: (n: number) => addStringChain(addCheck(s, (v) => (v as string).length <= n ? null : `String must be at most ${n} characters`)),
        email: () => addStringChain(addCheck(s, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string) ? null : "Invalid email")),
        url: () => addStringChain(addCheck(s, (v) => { try { new URL(v as string); return null; } catch { return "Invalid URL"; } })),
        uuid: () => addStringChain(addCheck(s, (v) => RegExp.UUID.test(v as string) ? null : "Invalid UUID")),
        regex: (re: RegExp) => addStringChain(addCheck(s, (v) => re.test(v as string) ? null : `Does not match ${re}`)),
        nonempty: () => addStringChain(addCheck(s, (v) => (v as string).length > 0 ? null : "String must not be empty")),
        optional: () => {
          const optBase = createSchema<string | undefined>((v) => v === undefined || typeof v === "string" ? null : `Expected string or undefined, got ${typeof v}`, s._checks.slice(1));
          return { ...optBase, ...s };
        },
      };
    }
  },

  number() {
    const base = createSchema<number>((v) => typeof v === "number" && !Number.isNaN(v) ? null : `Expected number, got ${typeof v}`);
    const chain = {
      ...base,
      min: (n: number) => addNumberChain(addCheck(base, (v) => (v as number) >= n ? null : `Number must be >= ${n}`)),
      max: (n: number) => addNumberChain(addCheck(base, (v) => (v as number) <= n ? null : `Number must be <= ${n}`)),
      int: () => addNumberChain(addCheck(base, (v) => Number.isInteger(v) ? null : "Expected integer")),
      positive: () => addNumberChain(addCheck(base, (v) => (v as number) > 0 ? null : "Expected positive number")),
      negative: () => addNumberChain(addCheck(base, (v) => (v as number) < 0 ? null : "Expected negative number")),
      nonnegative: () => addNumberChain(addCheck(base, (v) => (v as number) >= 0 ? null : "Expected non-negative number")),
      optional: () => {
        const optBase = createSchema<number | undefined>((v) => v === undefined || (typeof v === "number" && !Number.isNaN(v)) ? null : `Expected number or undefined`);
        return { ...optBase, ...chain };
      },
    };
    return chain;

    function addNumberChain(s: any) {
      return {
        ...s,
        min: (n: number) => addNumberChain(addCheck(s, (v) => (v as number) >= n ? null : `Number must be >= ${n}`)),
        max: (n: number) => addNumberChain(addCheck(s, (v) => (v as number) <= n ? null : `Number must be <= ${n}`)),
        int: () => addNumberChain(addCheck(s, (v) => Number.isInteger(v) ? null : "Expected integer")),
        positive: () => addNumberChain(addCheck(s, (v) => (v as number) > 0 ? null : "Expected positive number")),
        negative: () => addNumberChain(addCheck(s, (v) => (v as number) < 0 ? null : "Expected negative number")),
        nonnegative: () => addNumberChain(addCheck(s, (v) => (v as number) >= 0 ? null : "Expected non-negative number")),
        optional: () => {
          const optBase = createSchema<number | undefined>((v) => v === undefined || (typeof v === "number" && !Number.isNaN(v)) ? null : `Expected number or undefined`);
          return { ...optBase, ...s };
        },
      };
    }
  },

  boolean() {
    const base = createSchema<boolean>((v) => typeof v === "boolean" ? null : `Expected boolean, got ${typeof v}`);
    return {
      ...base,
      optional() {
        return createSchema<boolean | undefined>((v) => v === undefined || typeof v === "boolean" ? null : `Expected boolean or undefined`);
      },
    };
  },

  array<T>(itemSchema: { parse(v: unknown): T; safeParse(v: unknown): { success: boolean; error?: string } }) {
    const base = createSchema<T[]>((v) => {
      if (!Array.isArray(v)) return `Expected array, got ${typeof v}`;
      for (let i = 0; i < v.length; i++) {
        const r = itemSchema.safeParse(v[i]);
        if (!r.success) return `[${i}]: ${r.error}`;
      }
      return null;
    });
    const chain = {
      ...base,
      min: (n: number) => addArrayChain(addCheck(base, (v) => (v as unknown[]).length >= n ? null : `Array must have at least ${n} items`)),
      max: (n: number) => addArrayChain(addCheck(base, (v) => (v as unknown[]).length <= n ? null : `Array must have at most ${n} items`)),
      nonempty: () => addArrayChain(addCheck(base, (v) => (v as unknown[]).length > 0 ? null : "Array must not be empty")),
      optional: () => {
        const optBase = createSchema<T[] | undefined>((v) => v === undefined ? null : base._baseCheck(v));
        return { ...optBase, ...chain };
      },
    };
    return chain;

    function addArrayChain(s: any) {
      return {
        ...s,
        min: (n: number) => addArrayChain(addCheck(s, (v) => (v as unknown[]).length >= n ? null : `Array must have at least ${n} items`)),
        max: (n: number) => addArrayChain(addCheck(s, (v) => (v as unknown[]).length <= n ? null : `Array must have at most ${n} items`)),
        nonempty: () => addArrayChain(addCheck(s, (v) => (v as unknown[]).length > 0 ? null : "Array must not be empty")),
        optional: () => {
          const optBase = createSchema<T[] | undefined>((v) => v === undefined ? null : s._baseCheck(v));
          return { ...optBase, ...s };
        },
      };
    }
  },

  object<T extends Record<string, { parse(v: unknown): unknown; safeParse(v: unknown): { success: boolean; error?: string } }>>(shape: T) {
    type Out = { [K in keyof T]: ReturnType<T[K]["parse"]> };
    const keys = Object.keys(shape);
    const base = createSchema<Out>((v) => {
      if (typeof v !== "object" || v === null || Array.isArray(v)) return `Expected object, got ${typeof v}`;
      const obj = v as Record<string, unknown>;
      for (const key of keys) {
        const r = shape[key].safeParse(obj[key]);
        if (!r.success) return `${key}: ${r.error}`;
      }
      return null;
    });
    return {
      ...base,
      optional() {
        return createSchema<Out | undefined>((v) => v === undefined ? null : base._baseCheck(v));
      },
      extend(extra: Record<string, { parse(v: unknown): unknown; safeParse(v: unknown): { success: boolean; error?: string } }>) {
        return zImpl.object({ ...shape, ...extra });
      },
      pick(...pickKeys: string[]) {
        const picked: Record<string, unknown> = {};
        for (const k of pickKeys) if (k in shape) picked[k] = shape[k];
        return zImpl.object(picked as any);
      },
      omit(...omitKeys: string[]) {
        const remaining: Record<string, unknown> = {};
        for (const k of keys) if (!omitKeys.includes(k)) remaining[k] = shape[k];
        return zImpl.object(remaining as any);
      },
    };
  },

  literal<T extends string | number | boolean>(expected: T) {
    return createSchema<T>((v) => v === expected ? null : `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(v)}`);
  },

  union(...schemas: { parse(v: unknown): unknown; safeParse(v: unknown): { success: boolean; error?: string } }[]) {
    return createSchema<unknown>((v) => {
      const errors: string[] = [];
      for (const schema of schemas) {
        const r = schema.safeParse(v);
        if (r.success) return null;
        errors.push(r.error!);
      }
      return `No matching schema: ${errors.join("; ")}`;
    });
  },

  enum(...values: string[]) {
    const schema = createSchema<string>((v) => typeof v === "string" && values.includes(v) ? null : `Expected one of ${values.join(", ")}, got ${JSON.stringify(v)}`);
    return { ...schema, options: values };
  },
};

(globalThis as any).z = zImpl;

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
