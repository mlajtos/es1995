# ES1995 – The LAST Polyfill

ES1995 is the only JS/TS polyfill you'll ever need. A coherent set of composable primitives that span the whole stack – with an API surface that is predictable and smooth. JavaScript: Batteries Included.

Written in TypeScript with first-class type declarations for a smooth editor experience.

## What people said about ES1995

> [Brendan Eich](https://twitter.com/BrendanEich):
>
> "I did JS in 10 days. If I had one more day, ES1995 would be there from the start."

> [Alan Kay](https://en.wikiquote.org/wiki/Alan_Kay):
>
> "[…][…] The Web in comparison [to the Internet] is a joke. The Web was done by amateurs. […] JS is pile of bricks with limestone on top. […] To be precise, in case of ES1995, a change in perspective is worth **negative** 80 IQ points. […][…] […]"

> [Sebastian Mackenzie](https://twitter.com/sebmck):
>
> "If we had ES1995, [Rome](https://github.com/rome/tools) **would** be build in a day. Maybe less."

> [Joe Armstrong](https://twitter.com/joeerl):
>
> "Discovered that I can speak tweets by pressing the microphone button and it gets it right most of the time this is amazing and saves a lot of time.
>
> One thing puzzles me.
>
> How did they fit the stenographer inside the phone?"

> [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing):
>
> "[TC39](https://tc39.es) can only see a short distance ahead, but they can see plenty there that needs to be done."

> [Elon Musk](https://twitter.com/elonmusk):
>
> "If JS was like this from the start, humans would dominate the whole galaxy and we would have quantum-resistant Bitcoin with instant transactions running on Neuralink. \*\*nodding\*\* "

> [Steve Ballmer](https://www.youtube.com/watch?v=KMU0tzLwhbE):
>
> ["DEVELOPERS DEVELOPERS DEVELOPERS"](https://www.youtube.com/watch?v=KMU0tzLwhbE)

> [God](https://xkcd.com/224/):
>
> "I was looking for a replacement for [Perl](https://xkcd.com/224/) and JS with ES1995 looks pretty slick!"

## Primitives

ES1995 enriches **every** built-in type with composable, predictable methods.

> **`tap` is uniform** — `tap(fn)` always passes `this` to `fn` (the whole value), whether called on an Object, Array, or Promise. Use `forEach` for element-wise iteration.

| Primitive | Prototype Methods | Static Methods |
| ----------- | ----------------------------------------- | ---------------------------------- |
| **Object** | `pipe`, `tap`, `equals`, `entries`, `keys`, `values` | `clone`, `cloneDeep`, `pick`, `omit`, `deepMerge`, `deepFreeze`, `defaults`, `mapKeys`, `mapValues` |
| **Array** | `at`, `chunk`, `compact`, `count`, `distinct`, `drop`, `duplicates`, `empty`, `except`, `first`, `flattenDeep`, `frequencies`, `groupBy`, `head`, `intersect`, `intersperse`, `last`, `max`, `min`, `average`, `pairwise`, `partition`, `reject`, `reversed`, `rotate`, `scan`, `shuffle`, `sortBy`, `sorted`, `splitAt`, `sum`, `tail`, `take`, `toObject`, `transpose`, `uniqueBy`, `union`, `window`, `zip` | `cartesianProduct`, `zip` |
| **String** | `camelCase`, `capitalize`, `chars`, `count`, `dedent`, `escapeHtml`, `isBlank`, `isPalindrome`, `kebabCase`, `lines`, `parseQueryString`, `removeDiacritics`, `reverse`, `similarityTo`, `snakeCase`, `template`, `toBytes`, `toColor`, `toDate`, `toDuration`, `toNumber`, `truncate`, `unescapeHtml`, `words` | `uuid` |
| **Number** | `absoluteValue`, `bytes`, `ceil`, `clamp`, `duration`, `floor`, `fractionalPart`, `integerPart`, `inRange`, `isEven`, `isOdd`, `isPrime`, `multipleOf`, `ordinal`, `pad`, `round`, `sign`, `times`, `to`, `toBinary`, `toFileSize`, `toHex`, `toOctal`, `toRoman` | `fibonacci`, `greatestCommonDivisor`, `leastCommonMultiple`, `random`, `range` |
| **Function** | `compose`, `curry`, `debounce`, `delay`, `flip`, `memoize`, `once`, `partial`, `retry`, `throttle` | `compose`, `conditional`, `constant`, `fixedPoint`, `identity`, `isFunction`, `noop`, `pipe`, `true`, `false` |
| **Promise** | `tap`, `timeout` | `delay`, `each`, `filter`, `map`, `props`, `retry`, `sleep` |
| **Date** | `addDays`, `addHours`, `addMinutes`, `addMonths`, `addSeconds`, `addYears`, `age`, `clone`, `daysUntil`, `endOfDay`, `endOfMonth`, `format`, `isFuture`, `isPast`, `isSameDay`, `isToday`, `isWeekday`, `isWeekend`, `relative`, `startOfDay`, `startOfMonth` | `today`, `tomorrow`, `yesterday` |
| **Math** | | `average`, `degreesToRadians`, `factorial`, `fibonacci`, `inverseLerp`, `isPrime`, `lerp`, `radiansToDegrees`, `sum` |
| **JSON** | | `safeParse` |
| **Error** | `toJSON` | |
| **Symbol** | | `documentation` |
| **RegExp** | | `email`, `hexColor`, `IPv4`, `ISO8601`, `queryString`, `URL`, `UUID` |

### Schema Validation (`z` global)

A lightweight, Zod-inspired schema validator — zero dependencies, full chainability:

| Method | Description |
| --- | --- |
| `z.string()` | String schema with `.min()`, `.max()`, `.email()`, `.url()`, `.uuid()`, `.regex()`, `.nonempty()`, `.optional()` |
| `z.number()` | Number schema with `.min()`, `.max()`, `.int()`, `.positive()`, `.negative()`, `.nonnegative()`, `.optional()` |
| `z.boolean()` | Boolean schema with `.optional()` |
| `z.array(schema)` | Array schema with `.min()`, `.max()`, `.nonempty()`, `.optional()` |
| `z.object(shape)` | Object schema with `.extend()`, `.pick()`, `.omit()`, `.optional()` |
| `z.literal(value)` | Literal value schema |
| `z.union(...schemas)` | Union schema |
| `z.enum(...values)` | Enum schema |

All schemas support `.parse(value)`, `.safeParse(value)`, `.parseAsync(promiseOrValue)`, and `.safeParseAsync(promiseOrValue)`.

### Type-fest Utility Types

Globally available deep utility types — no imports needed:

`PartialDeep`, `RequiredDeep`, `ReadonlyDeep`, `SetRequired`, `SetOptional`, `SetReadonly`, `Simplify`, `Merge`, `ValueOf`, `Entries`, `StringKeyOf`, `Opaque`, `NonEmptyArray`, `Writable`, `WritableDeep`

### Color Class

A first-class `Color` object with perceptually uniform mixing in OKLCH space:

| Method | Description |
| --- | --- |
| `Color.from("#ff6347")` | Create from hex string |
| `Color.rgb(255, 99, 71)` | Create from RGB components |
| `Color.hsl(9, 100, 64)` | Create from HSL components |
| `Color.oklch(0.7, 0.15, 30)` | Create from OKLCH (perceptually uniform) |
| `Color.random()` | Random color |
| `"#ff6347".toColor()` | String → Color |
| `.toHex()`, `.toRGB()`, `.toHSL()`, `.toOKLCH()` | Convert between color spaces |
| `.mix(other, t?)` | Perceptually uniform mixing in OKLCH |
| `.lighten(n)`, `.darken(n)` | Adjust lightness |
| `.saturate(n)`, `.desaturate(n)` | Adjust chroma |
| `.rotate(deg)` | Rotate hue |
| `.complementary()`, `.analogous()`, `.triadic()` | Color harmonies |
| `.luminance()`, `.contrastRatio(other)` | Accessibility / WCAG |

## Showcase

### Fancy FizzBuzz

```ts
Number.range(1, 101)
  .map(
    Function.conditional([
      // 15 === Number.leastCommonMultiple(3, 5)
      [(n: number) => n.multipleOf(15), () => "FizzBuzz"],
      [(n: number) => n.multipleOf(5), () => "Buzz"],
      [(n: number) => n.multipleOf(3), () => "Fizz"],
      [Function.true, Function.identity],
    ]),
  )
  .join(", ")
  .pipe(console.log);
```

### Number decomposition

```ts
const n = -23.47;
const [s, i, f] = [n.sign(), n.integerPart(), n.fractionalPart()];
const m = s * (i + f);

console.assert(n === m);
```

### Array manipulation – Texas Hold'em

```ts
const suits = "♠♥♦♣".split("");
const ranks = [...Number.range(2, 11), ..."JQKA".split("")];

let deck = Array.cartesianProduct(suits, ranks).map((card) => card.join(""));

// Fisher-Yates + random cut
deck = deck.shuffle().rotate(Number.random(0, deck.length));

const players = ["Douglas Crockford", "Marc Andreessen", "John-David Dalton"];

let playersCards;
[playersCards, deck] = deck.splitAt(2 * players.length);
playersCards = Array.zip(...playersCards.chunk(players.length));
const hands = Object.fromEntries(players.zip(playersCards));

let flop, turn, river;

[flop, deck] = deck.drop(1).splitAt(3);
[turn, deck] = deck.drop(1).splitAt(1);
[river, deck] = deck.drop(1).splitAt(1);

const game = {
  hands,
  community: { flop, turn, river },
};

console.log(game);
```

### Merge Sort

```ts
const mergeSort = (L: number[]): number[] =>
  L.length <= 1
    ? L
    : L.splitAt(L.length / 2)
        .map(mergeSort)
        .pipe((L) => merge(...L));

const merge = Function.conditional([
  [(A, B) => A.empty() || B.empty(), (A, B) => A.concat(B)],
  [([a], [b]) => a < b, ([a, ...A], B) => [a, ...merge(A, B)]],
  [Function.true, (A, B) => merge(B, A)], // ba-dum-ts
]);

Number.range(10).shuffle().pipe(mergeSort).pipe(console.log);
```

### Color Interpolation – Temperature Gradient

Map temperatures to a cold-to-hot gradient using `Color.mix` (perceptually uniform in OKLCH):

```ts
const cold = Color.from("#4285F4");  // cold blue
const hot  = Color.from("#EA4335");  // hot red

const temperatures = [18, 22, 35, 15, 28, 31, 20];
const [tMin, tMax] = [temperatures.min(), temperatures.max()];

temperatures
  .map((temp) => {
    const t = Math.inverseLerp(tMin, tMax, temp);
    const color = cold.mix(hot, t);          // perceptually uniform!
    return { temp: `${temp}°C`, t: t.round(2), color: color.toHex() };
  })
  .sortBy("temp")
  .pipe(console.log);

// { temp: "15°C", t: 0,    color: "#4285f4" }   ← cold blue
// { temp: "22°C", t: 0.35, color: "#9d6cbb" }
// { temp: "35°C", t: 1,    color: "#ea4335" }   ← hot red
```

### Student Grade Report

```ts
const students = [
  { name: "Alice",   scores: [92, 88, 95, 87] },
  { name: "Bob",     scores: [78, 82, 71, 85] },
  { name: "Charlie", scores: [95, 97, 93, 98] },
  { name: "Diana",   scores: [65, 72, 68, 74] },
  { name: "Eve",     scores: [88, 91, 84, 90] },
];

students
  .map((s) => ({
    ...s,
    avg:   s.scores.average().round(1),
    best:  s.scores.max(),
    worst: s.scores.min(),
  }))
  .sortBy("avg")
  .reversed()
  .map((s, i) => `${(i + 1).ordinal()} ${s.name}: ${s.avg} (${s.worst}–${s.best})`)
  .intersperse("---")
  .pipe((lines) => lines.join("\n"))
  .pipe(console.log);

// 1st Charlie: 95.75 (93–98)
// ---
// 2nd Alice: 90.5 (87–95)
// ---
// 3rd Eve: 88.25 (84–91)
// ---
// 4th Bob: 79 (71–85)
// ---
// 5th Diana: 69.75 (65–74)
```

### Word Frequency Analysis

```ts
const text = `To be or not to be that is the question
Whether tis nobler in the mind to suffer
The slings and arrows of outrageous fortune
Or to take arms against a sea of troubles`;

text
  .toLowerCase()
  .words()
  .frequencies()
  .pipe(Object.entries)
  .sorted(([, a], [, b]) => b - a)
  .take(8)
  .map(([word, count]) => `${word}: ${"█".repeat(count)} (${count})`)
  .pipe((lines) => lines.join("\n"))
  .pipe(console.log);

// to: ████ (4)
// the: ██ (2)
// of: ██ (2)
// be: ██ (2)
// ...
```

### Roman Numeral Timeline

```ts
const milestones = [
  { year: 1995, event: "JavaScript created by Brendan Eich" },
  { year: 1997, event: "ECMAScript 1 standardized" },
  { year: 2009, event: "Node.js released" },
  { year: 2015, event: "ES6/ES2015 – the big leap" },
  { year: 2026, event: "ES1995 becomes the LAST polyfill" },
];

milestones
  .map((m) => `${m.year.toRoman()} (${m.year}) – ${m.event}`)
  .pipe((lines) => lines.join("\n"))
  .pipe(console.log);

// MCMXCV (1995) – JavaScript created by Brendan Eich
// MCMXCVII (1997) – ECMAScript 1 standardized
// MMIX (2009) – Node.js released
// MMXV (2015) – ES6/ES2015 – the big leap
// MMXXVI (2026) – ES1995 becomes the LAST polyfill
```

### Fuzzy string match

```ts
const names = [
  "Timothée", "Beyoncé", "Penélope", "Renée", "Clémence",
  "Zoë", "Chloë", "Øyvind", "Žofia", "Michał", "Clémentine",
];

const searchTerm = "cle";

names
  .map((name) => name.removeDiacritics().toLowerCase())
  // Sørensen–Dice coefficient: 0.0 – 1.0
  .map((safeName) => searchTerm.similarityTo(safeName))
  .zip(names)
  .sorted(([a], [b]) => b - a)
  .take(3)
  .pipe(console.log);
// [0.4444, "Clémence"]
// [0.3636, "Clémentine"]
// [0,      "Timothée"]
```

### String Superpowers

```ts
"hello world".capitalize();                    // "Hello world"
"hello world".camelCase();                     // "helloWorld"
"hello world".kebabCase();                     // "hello-world"
"hello world".snakeCase();                     // "hello_world"
"hello".reverse();                             // "olleh"
"hello".chars();                               // ["h", "e", "l", "l", "o"]
"  ".isBlank();                                // true
"racecar".isPalindrome();                      // true
"A man a plan a canal Panama".isPalindrome();  // true
"hello hello world".count("hello");            // 2
"42".toNumber() + 1;                           // 43

"Hello {{name}}, you are {{age}}!".template({ name: "Alice", age: 30 });
// "Hello Alice, you are 30!"

'<script>alert("xss")</script>'.escapeHtml();
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Number Superpowers

```ts
(17).isPrime();       // true
(4).isEven();         // true
(7).isOdd();          // true
(1).ordinal();        // "1st"
(23).ordinal();       // "23rd"
(255).toHex();        // "ff"
(255).toBinary();     // "11111111"
(3661000).duration(); // "1h 1m 1s"

(5).to(10);                  // [5, 6, 7, 8, 9]
(3).times((i) => i * i);     // [0, 1, 4]

(1995).toRoman();             // "MCMXCV"
(42).toRoman();               // "XLII"
(2026).toRoman();             // "MMXXVI"

Number.fibonacci(10);         // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Date Made Easy

```ts
// Pretend it is 2026-04-01T23:47:00
const now = new Date(2026, 3, 1, 23, 47, 0);

now.format("YYYY-MM-DD HH:mm:ss");   // "2026-04-01 23:47:00"
now.isWeekday();                       // true (Wednesday)
now.addDays(7).format("YYYY-MM-DD");  // "2026-04-08"
now.startOfDay();                      // 2026-04-01T00:00:00
now.endOfMonth();                      // 2026-04-30T23:59:59

// JavaScript's birthday – first public release with Netscape Navigator 2.0
const jsBirthday = new Date(1995, 11, 4); // December 4, 1995
jsBirthday.age();        // 30 (as of 2026-04-01)
jsBirthday.relative();   // "30 years ago"

Date.today();     // start of today
Date.tomorrow();  // start of tomorrow
Date.yesterday(); // start of yesterday
```

### Function Composition & Currying

```ts
const double = (x: number) => x * 2;
const addOne = (x: number) => x + 1;
const square = (x: number) => x * x;

// Right-to-left composition
const transform = Function.compose(square, addOne, double);
transform(3);  // (3*2+1)² = 49

// Left-to-right pipeline
const pipeline = Function.pipe(double, addOne, square);
pipeline(3);   // (3*2+1)² = 49

// Currying
const add = ((a: number, b: number) => a + b).curry();
const add10 = add(10);
add10(5);  // 15

// Retry on failure
const fetchData = (() => fetch("/api")).retry(3, 1000);
```

### Object Utilities

```ts
const user = { name: "Alice", age: 30, email: "alice@example.com", password: "secret" };

Object.pick(user, ["name", "email"]);
// { name: "Alice", email: "alice@example.com" }

Object.omit(user, ["password"]);
// { name: "Alice", age: 30, email: "alice@example.com" }

Object.deepMerge({ theme: "dark", lang: "en" }, { theme: "light" });
// { theme: "light", lang: "en" }

{ a: 1, b: [2, 3] }.equals({ a: 1, b: [2, 3] });  // true
```

### Math – lerp & inverseLerp

```ts
Math.lerp(0, 100, 0.5);            // 50
Math.inverseLerp(0, 100, 75);      // 0.75
Math.factorial(10);                  // 3628800
Math.fibonacci(10);                  // 55
Math.isPrime(17);                    // true
Math.degreesToRadians(180);          // π
Math.sum(1, 2, 3, 4, 5);           // 15
Math.average(1, 2, 3, 4, 5);       // 3
```

### Promise Utilities

```ts
// Sleep
await Promise.sleep(1000);

// Delay with value
const value = await Promise.delay(100, "hello");

// Tap into promise chain
await fetch("/api")
  .tap((response) => console.log("Got:", response.status))
  .then((r) => r.json());

// Timeout
await someSlowOperation().timeout(5000);

// Retry
await Promise.retry(() => fetch("/unreliable-api"), { retries: 3, delay: 1000 });
```

### JSON Safety

```ts
JSON.safeParse('{"valid": true}');          // { valid: true }
JSON.safeParse("not json", {});             // {}
JSON.safeParse("broken", { default: true }); // { default: true }
```

### RegExp Patterns

```ts
RegExp.email.test("user@example.com");                          // true
RegExp.UUID.test("550e8400-e29b-41d4-a716-446655440000");       // true
RegExp.hexColor.test("#ff00ff");                                 // true
RegExp.IPv4.test("192.168.1.1");                                // true
RegExp.ISO8601.test("2026-04-01T23:47:00Z");                    // true
RegExp.URL.test("https://example.com");                          // true
```

### Fun fun fun

```ts
const fetchArticle = (id: string) => {
  // get the latest hot shit from Hacker News
};
const fetchArticleOnlyOnce = fetchArticle.memoize();
```

```ts
const onResizeWindow = () => {
  // recalculate expensive layout
};
const smartOnResizeWindow = onResizeWindow.debounce(150);
```

```ts
const onClick = () => {
  // http://clickclickclick.click
};
const rateLimitedOnClick = onClick.throttle(1000);
```

```ts
const add = (a: number, b: number) => a + b;
const add10 = add.partial(10);
```

### Array Indexing

```ts
const squares = Number.range(10).map((i) => i ** 2);
const squareAtFirst = squares.at(1);

const oddIndices = Number.range(1, 10, 2);
const squaresAtOddIndices = squares.at(oddIndices);
```

### Caesar Cipher

```ts
const alphabet = "abcdefghijklmnopqrstuvwxyz".chars();

const shift = (text: string, n: number): string =>
  text
    .chars()
    .map((ch) => {
      const idx = alphabet.indexOf(ch.toLowerCase());
      if (idx === -1) return ch;
      const shifted = alphabet[(idx + n + 26) % 26];
      return ch === ch.toUpperCase() ? shifted.toUpperCase() : shifted;
    })
    .join("");

const encrypt = (text: string, key: number) => shift(text, key);
const decrypt = (text: string, key: number) => shift(text, -key);

const message = "Et tu, Brute?";
const encrypted = encrypt(message, 13);  // "Rg gh, Oehgr?"
const decrypted = decrypt(encrypted, 13); // "Et tu, Brute?"

// Brute-force all 26 rotations
Number.range(0, 26)
  .map((n) => ({ rotation: n, text: shift(encrypted, n) }))
  .first((r) => r.text === message)
  .pipe(console.log);
```

### CSV Parser & Analyzer

Parse raw CSV → typed records → aggregate stats in one pipeline:

```ts
const csv = `name,department,salary
Alice,Engineering,120000
Bob,Marketing,95000
Charlie,Engineering,135000
Diana,Marketing,105000
Eve,Engineering,128000
Frank,Design,110000
Grace,Design,115000`;

const [headerLine, ...rows] = csv.lines();
const headers = headerLine.split(",");

const employees = rows
  .map((row) => row.split(","))
  .map((cols) =>
    headers.toObject(
      (h) => h,
      (h, i) => (h === "salary" ? cols[i].toNumber() : cols[i]),
    ),
  );

// Department summary
Object.entries(employees.groupBy("department"))
  .map(([dept, members]) => ({
    department: dept,
    headcount: members.count(),
    avgSalary: members.map((m) => m.salary).average().round(0),
    topEarner: members.sortBy("salary").reversed().first().name,
  }))
  .sortBy("avgSalary")
  .reversed()
  .pipe(console.log);

// Engineering: 3 people, avg $127667, top: Charlie
// Design:      2 people, avg $112500, top: Grace
// Marketing:   2 people, avg $100000, top: Diana
```

### Event Schedule Planner

```ts
const now = new Date(2026, 3, 1, 23, 47, 0);

const events = [
  { title: "Standup",       offset: 1, hour: 9,  min: 0,  duration: 15 },
  { title: "Sprint Review", offset: 2, hour: 14, min: 0,  duration: 60 },
  { title: "Lunch & Learn", offset: 3, hour: 12, min: 30, duration: 45 },
  { title: "Deploy Window", offset: 4, hour: 16, min: 0,  duration: 120 },
  { title: "Retro",         offset: 5, hour: 10, min: 0,  duration: 90 },
  { title: "Happy Hour",    offset: 5, hour: 17, min: 0,  duration: 60 },
].map((e) => {
  const start = now.startOfDay().addDays(e.offset).addHours(e.hour).addMinutes(e.min);
  return {
    title: e.title,
    day: start.format("YYYY-MM-DD"),
    time: `${start.format("HH:mm")}–${start.addMinutes(e.duration).format("HH:mm")}`,
    durationStr: (e.duration * 60000).duration(),
  };
});

// Group by day → print schedule
Object.entries(events.groupBy("day"))
  .sorted(([a], [b]) => a.localeCompare(b))
  .map(([day, evts]) =>
    `${day}:\n` + evts.sortBy("time").map((e) => `  ${e.time} ${e.title}`).join("\n"),
  )
  .pipe((lines) => lines.join("\n"))
  .pipe(console.log);
```

### Conway's Game of Life

A single step of Conway's Game of Life using pure array transformations:

```ts
type Grid = number[][];

const grid: Grid = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],  // Glider
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const neighbors = (g: Grid, r: number, c: number): number =>
  (-1).to(2)
    .flatMap((dr) => (-1).to(2).map((dc) => [dr, dc]))
    .reject(([dr, dc]) => dr === 0 && dc === 0)
    .map(([dr, dc]) => (g[r + dr] ?? [])[c + dc] ?? 0)
    .sum();

const step = (g: Grid): Grid =>
  g.map((row, r) =>
    row.map((cell, c) => {
      const n = neighbors(g, r, c);
      return cell === 1
        ? (n === 2 || n === 3 ? 1 : 0)   // survive
        : (n === 3 ? 1 : 0);              // birth
    }),
  );

const render = (g: Grid): string =>
  g.map((row) => row.map((c) => (c ? "█" : "·")).join(" ")).join("\n");

console.log("Gen 0:\n" + render(grid));
console.log("Gen 1:\n" + render(step(grid)));
```

### Sieve of Eratosthenes

Functional prime sieve using ES1995 array primitives:

```ts
const sieve = (limit: number): number[] => {
  const candidates = Number.range(2, limit + 1);
  const go = (nums: number[]): number[] => {
    if (nums.empty()) return [];
    const [prime, ...rest] = nums;
    return [prime, ...go(rest.reject((n) => n.multipleOf(prime)))];
  };
  return go(candidates);
};

const primes = sieve(100);
console.log("Primes:", primes.join(", "));

// Twin primes
primes
  .pairwise()
  .filter(([a, b]) => b - a === 2)
  .map(([a, b]) => `(${a}, ${b})`)
  .pipe(console.log);  // (3, 5), (5, 7), (11, 13), (17, 19), (29, 31), ...

// Prime gap histogram
primes
  .pairwise()
  .map(([a, b]) => b - a)
  .frequencies()
  .pipe(Object.entries)
  .sorted(([a], [b]) => a - b)
  .map(([gap, count]) => `gap ${gap}: ${"█".repeat(count)} (${count})`)
  .pipe(console.log);
```

### Budget Tracker

A personal finance pipeline combining Date, String, Number, and Object:

```ts
const transactions = [
  { date: "2026-04-01", category: "food",    amount: -45.50,  description: "Groceries" },
  { date: "2026-04-01", category: "income",  amount: 3200,    description: "Salary" },
  { date: "2026-04-02", category: "food",    amount: -28.75,  description: "Restaurant" },
  { date: "2026-04-03", category: "utilities", amount: -89.00, description: "Electricity" },
  { date: "2026-04-04", category: "income",  amount: 450,     description: "Freelance" },
  // ...
];

// Running balance via scan
transactions
  .map((t) => t.amount)
  .scan((acc, x) => acc + x, 0)
  .zip(transactions)
  .map(([bal, t]) => `${t.date} ${t.description.padEnd(15)} → $${bal.toFixed(2)}`)
  .pipe(console.log);

// Spending by category
transactions
  .reject((t) => t.category === "income")
  .groupBy("category")
  .pipe(Object.entries)
  .map(([cat, txns]) => ({
    category: cat,
    total: txns.map((t) => t.amount).sum().round(2),
  }))
  .sortBy("total")
  .pipe(console.log);
```

### Morse Code Translator

```ts
const morseTable: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", " ": "/",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.",
};

// Build reverse lookup using toObject
const reverseMorse = Object.entries(morseTable)
  .toObject(([, code]) => code, ([letter]) => letter);

const encode = (text: string): string =>
  text.toUpperCase().chars()
    .map((ch) => morseTable[ch] ?? ch)
    .join(" ");

const decode = (morse: string): string =>
  morse.split(" ").map((code) => reverseMorse[code] ?? code).join("");

encode("Hello World");  // ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
decode(encode("Hello World"));  // "HELLO WORLD"
```

---

Checkout `src/es1995.ts` for other funky stuff.
