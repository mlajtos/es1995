# ES1995 – The LAST Polyfill

ES1995 is the only JS polyfill you'll ever need. A coherent set of composable primitives that span the whole stack – with an API surface that is predictable and smooth. The JavaScript as the LAST language.

## What people said about ES1995

> [Brendan Eich](https://twitter.com/BrendanEich):
>
> “I did JS in 10 days. If I had one more day, ES1995 would be there from the start.”

> [Alan Kay](https://en.wikiquote.org/wiki/Alan_Kay):
>
> “[…][…] The Web in comparison [to the Internet] is a joke. The Web was done by amateurs. […] JS is pile of bricks with limestone on top. […] To be precise, in case of ES1995, a change in perspective is worth **negative** 80 IQ points. […][…] […]”

> [Sebastian Mackenzie](https://twitter.com/sebmck):
>
> “If we had ES1995, [Rome](https://github.com/rome/tools) **would** be build in a day. Maybe less.”

> [Joe Armstrong](https://twitter.com/joeerl):
>
> “Discovered that I can speak tweets by pressing the microphone button and it gets it right most of the time this is amazing and saves a lot of time.
>
> One thing puzzles me.
>
> How did they fit the stenographer inside the phone?”

> [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing):
>
> “[TC39](https://tc39.es) can only see a short distance ahead, but they can see plenty there that needs to be done.”

> [Elon Musk](https://twitter.com/elonmusk):
>
> “If JS was like this from the start, humans would dominate the whole galaxy and we would have quantum-resistant Bitcoin with instant transactions running on Neuralink. \*\*nodding\*\* ”

> [Steve Ballmer](https://www.youtube.com/watch?v=KMU0tzLwhbE):
>
> [“DEVELOPERS DEVELOPERS DEVELOPERS”](https://www.youtube.com/watch?v=KMU0tzLwhbE)

> [God](https://xkcd.com/224/):
>
> “I was looking for a replacement for [Perl](https://xkcd.com/224/) and JS with ES1995 looks pretty slick!”

## Primitives

ES1995 enriches **every** built-in type with composable, predictable methods:

| Primitive | Prototype Methods | Static Methods |
| ----------- | ----------------------------------------- | ---------------------------------- |
| **Object** | `pipe`, `tap`, `equals` | `clone`, `cloneDeep`, `pick`, `omit`, `deepMerge`, `deepFreeze`, `defaults`, `mapKeys`, `mapValues` |
| **Array** | `at`, `chunk`, `compact`, `count`, `distinct`, `drop`, `duplicates`, `empty`, `except`, `first`, `flattenDeep`, `frequencies`, `groupBy`, `head`, `intersect`, `last`, `max`, `min`, `average`, `partition`, `reject`, `reversed`, `rotate`, `scan`, `shuffle`, `sortBy`, `sorted`, `splitAt`, `sum`, `tail`, `take`, `tap`, `toObject`, `uniqueBy`, `union`, `window`, `zip` | `cartesianProduct`, `zip` |
| **String** | `camelCase`, `capitalize`, `chars`, `dedent`, `escapeHtml`, `isBlank`, `kebabCase`, `lines`, `removeDiacritics`, `reverse`, `similarityTo`, `snakeCase`, `toNumber`, `truncate`, `unescapeHtml`, `words` | |
| **Number** | `absoluteValue`, `ceil`, `clamp`, `duration`, `floor`, `fractionalPart`, `integerPart`, `inRange`, `isEven`, `isOdd`, `isPrime`, `multipleOf`, `ordinal`, `pad`, `round`, `sign`, `times`, `to`, `toBinary`, `toHex`, `toOctal` | `fibonacci`, `greatestCommonDivisor`, `leastCommonMultiple`, `random`, `range` |
| **Function** | `compose`, `curry`, `debounce`, `delay`, `flip`, `memoize`, `once`, `partial`, `retry`, `throttle` | `compose`, `conditional`, `constant`, `fixedPoint`, `from`, `identity`, `isFunction`, `noop`, `pipe`, `true`, `false` |
| **Promise** | `tap`, `timeout` | `delay`, `sleep`, `retry` |
| **Date** | `addDays`, `addHours`, `addMinutes`, `addMonths`, `addSeconds`, `addYears`, `age`, `clone`, `daysUntil`, `endOfDay`, `endOfMonth`, `format`, `isFuture`, `isPast`, `isSameDay`, `isToday`, `isWeekday`, `isWeekend`, `relative`, `startOfDay`, `startOfMonth` | `today`, `tomorrow`, `yesterday` |
| **Math** | | `average`, `degreesToRadians`, `factorial`, `fibonacci`, `isPrime`, `lerp`, `mapRange`, `radiansToDegrees`, `sum` |
| **JSON** | | `safeParse` |
| **Error** | `toJSON` | |
| **Symbol** | | `callable`, `documentation` |
| **RegExp** | | `email`, `hexColor`, `IPv4`, `ISO8601`, `URL`, `UUID` |

## Showcase

### Fancy FizzBuzz

```js
Number.range(1, 101)
  .map(
    Function.conditional([
      // 15 === Number.leastCommonMultiple(3, 5)
      [(n) => n.multipleOf(15), () => "FizzBuzz"],
      [(n) => n.multipleOf(5), () => "Buzz"],
      [(n) => n.multipleOf(3), () => "Fizz"],
      [Function.true, Function.identity]
    ])
  )
  .join(", ")
  .pipe(console.log);
```

### Functional Objects

```js
const count = Function.from({
  state: 0,
  [Symbol.callable]() {
    this.state += 1;
    return this.state;
  }
});

count().pipe(console.log);
count().pipe(console.log);
count().pipe(console.log);
```

### Number decomposition

```js
const n = -23.47;
const [s, i, f] = [n.sign(), n.integerPart(), n.fractionalPart()];
const m = s * (i + f);

console.assert(n === m);
```

### Array manipulation – Texas Hold'em

```js
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
  community: { flop, turn, river }
};

console.log(game);
```

### Merge Sort

```js
const mergeSort = (L) =>
  L.length <= 1
    ? L
    : L.splitAt(L.length / 2)
        .map(mergeSort)
        .pipe((L) => merge(...L));

const merge = Function.conditional([
  [(A, B) => A.empty() || B.empty(), (A, B) => A.concat(B)],
  [([a], [b]) => a < b, ([a, ...A], B) => [a, ...merge(A, B)]],
  [Function.true, (A, B) => merge(B, A)] // ba-dum-ts
]);

Number.range(10).shuffle().pipe(mergeSort).pipe(console.log);
```

### Fuzzy string match

```js
const names = [
  "Timothée",
  "Beyoncé",
  "Penélope",
  "Renée",
  "Clémence",
  "Zoë",
  "Chloë",
  "Øyvind",
  "Žofia",
  "Michał",
  "Clémentine"
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
// [0.4444444444444444, "Clémence"]
// [0.36363636363636365, "Clémentine"]
// [0, "Timothée"]
```

### Array Aggregations

```js
const scores = [85, 92, 78, 95, 88, 73, 91, 84];

scores.sum();      // 686
scores.average();  // 85.75
scores.min();      // 73
scores.max();      // 95
scores.count((s) => s > 85);  // 4

[1, 2, 2, 3, 3, 3].frequencies();  // { 1: 1, 2: 2, 3: 3 }
```

### Sliding Windows & Running Accumulations

```js
const data = [1, 2, 3, 4, 5];

data.window(3);  // [[1,2,3], [2,3,4], [3,4,5]]
data.scan((acc, x) => acc + x, 0);  // [1, 3, 6, 10, 15]
```

### String Transformations

```js
"hello world".capitalize();  // "Hello world"
"hello world".camelCase();   // "helloWorld"
"hello world".kebabCase();   // "hello-world"
"hello world".snakeCase();   // "hello_world"
"hello".reverse();           // "olleh"
"hello".chars();             // ["h", "e", "l", "l", "o"]
"  ".isBlank();              // true
"42".toNumber() + 1;         // 43

'<script>alert("xss")</script>'.escapeHtml();
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Number Superpowers

```js
(17).isPrime();     // true
(4).isEven();       // true
(7).isOdd();        // true
(1).ordinal();      // "1st"
(23).ordinal();     // "23rd"
(255).toHex();      // "ff"
(255).toBinary();   // "11111111"
(3661000).duration(); // "1h 1m 1s"

(5).to(10);         // [5, 6, 7, 8, 9]
(3).times((i) => i * i);  // [0, 1, 4]

Number.fibonacci(10);  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Function Composition & Currying

```js
const double = (x) => x * 2;
const addOne = (x) => x + 1;
const square = (x) => x * x;

// Right-to-left composition
const transform = Function.compose(square, addOne, double);
transform(3);  // (3*2+1)^2 = 49

// Left-to-right pipeline
const pipeline = Function.pipe(double, addOne, square);
pipeline(3);   // (3*2+1)^2 = 49

// Currying
const add = ((a, b) => a + b).curry();
const add10 = add(10);
add10(5);  // 15

// Retry on failure
const fetchData = (() => fetch("/api")).retry(3, 1000);
```

### Object Utilities

```js
const user = { name: "Alice", age: 30, email: "alice@example.com", password: "secret" };

Object.pick(user, ["name", "email"]);
// { name: "Alice", email: "alice@example.com" }

Object.omit(user, ["password"]);
// { name: "Alice", age: 30, email: "alice@example.com" }

Object.deepMerge({ theme: "dark", lang: "en" }, { theme: "light" });
// { theme: "light", lang: "en" }

{ a: 1, b: [2, 3] }.equals({ a: 1, b: [2, 3] });  // true
```

### Date Made Easy

```js
const now = new Date();

now.format("YYYY-MM-DD HH:mm:ss");  // "2024-03-15 14:30:00"
now.isWeekday();                      // true
now.addDays(7).format("YYYY-MM-DD"); // "2024-03-22"
now.startOfDay();                     // 2024-03-15T00:00:00
now.endOfMonth();                     // 2024-03-31T23:59:59

const birthday = new Date(1995, 0, 1);
birthday.age();        // 29
birthday.relative();   // "29 years ago"

Date.today();     // start of today
Date.tomorrow();  // start of tomorrow
Date.yesterday(); // start of yesterday
```

### Promise Utilities

```js
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

### Math Enhancements

```js
Math.lerp(0, 100, 0.5);                // 50
Math.mapRange(5, 0, 10, 0, 100);       // 50
Math.factorial(10);                      // 3628800
Math.fibonacci(10);                      // 55
Math.isPrime(17);                        // true
Math.degreesToRadians(180);              // π
Math.sum(1, 2, 3, 4, 5);               // 15
Math.average(1, 2, 3, 4, 5);           // 3
```

### JSON Safety

```js
JSON.safeParse('{"valid": true}');          // { valid: true }
JSON.safeParse("not json", {});             // {}
JSON.safeParse("broken", { default: true }); // { default: true }
```

### RegExp Patterns

```js
RegExp.email.test("user@example.com");                          // true
RegExp.UUID.test("550e8400-e29b-41d4-a716-446655440000");       // true
RegExp.hexColor.test("#ff00ff");                                 // true
RegExp.IPv4.test("192.168.1.1");                                // true
RegExp.ISO8601.test("2024-01-15T10:30:00Z");                    // true
RegExp.URL.test("https://example.com");                          // true
```

### Fun fun fun

```js
const fetchArticle = (id) => {
  // get the latest hot shit from Hacker News
};
const fetchArticleOnlyOnce = fetchArticle.memoize();
```

```js
const onResizeWindow = () => {
  // recalculate expensive layout
};
const smartOnResizeWindow = onResizeWindow.debounce(150);
```

```js
const onClick = () => {
  // http://clickclickclick.click
};
const rateLimitedOnClick = onClick.throttle(1000);
```

```js
const add = (a, b) => a + b;
const add10 = add.partial(10);
```

### Array Indexing

```js
const squares = Number.range(10).map((i) => i ** 2);
const squareAtFirst = squares.at(1);

const oddIndices = Number.range(1, 10, 2);
const squaresAtOddIndices = squares.at(oddIndices);
```

---

Checkout `src/es1995.js` for other funky stuff.
