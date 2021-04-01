import "./es1995";

const test = (name, f) => {
  console.group(name);
  f();
  console.groupEnd();
};

test("Fancy FizzBuzz", () => {
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
});

test("Functional Objects", () => {
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
});

test("Number Decomposition", () => {
  // const n = Number.random(-10, 10, true);
  const n = -23.47;
  const [s, i, f] = [n.sign(), n.integerPart(), n.fractionalPart()];
  const m = s * (i + f);

  console.log(n === m, m, n);
});

test("Lambda Shortcut", () => {
  const $ = Function.from;

  const sumOfSquares1 = (n) => (n * (n - 1) * (2 * n - 1)) / 6;
  const sumOfSquares2 = (n) =>
    Number.range(n)
      .map($`$ * $`)
      .reduce($`$ + $$`);

  console.log(sumOfSquares1(100) === sumOfSquares2(100), sumOfSquares1(100));
});

test("Builtin documentation", () => {
  const add = (a, b) => a + b;

  // Markdown documentation
  add[Symbol.documentation] = `
        # Add function

        Adds two numbers together.

        **Usage:**
            add(23, 47);
            const add10 = add.partial(10);
    `;

  console.log(add);
});

test("Array Manipulation", () => {
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
});

test("Merge Sort", () => {
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
});

test("Fuzzy String Match", () => {
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
});

test("Array indexing", () => {
  const squares = Number.range(10).map((i) => i ** 2);
  const oddIndices = Number.range(1, 10, 2);

  const squaresAtOddIndices = squares.at(oddIndices);

  console.log(squares, oddIndices, squaresAtOddIndices);
});
