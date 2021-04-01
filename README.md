# ES1995 – The Missing JS Polyfill

ES1995 is a polyfill for super-modern Javascript that you can write today.

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
