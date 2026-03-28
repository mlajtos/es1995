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

/*

    New ES1995 Showcases

*/

test("Array Aggregations", () => {
  const scores = [85, 92, 78, 95, 88, 73, 91, 84];

  console.log("Sum:", scores.sum());
  console.log("Average:", scores.average());
  console.log("Min:", scores.min());
  console.log("Max:", scores.max());
  console.log("Above 85:", scores.count((s) => s > 85));
  console.log("Frequencies:", [1, 2, 2, 3, 3, 3].frequencies());
});

test("Array Advanced", () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Sliding window
  console.log("Windows of 3:", data.window(3));

  // Running sum (scan)
  console.log("Running sum:", data.scan((acc, x) => acc + x, 0));

  // First and last
  console.log("First even:", data.first((n) => n % 2 === 0));
  console.log("Last even:", data.last((n) => n % 2 === 0));

  // Reject (opposite of filter)
  console.log("Odd numbers:", data.reject((n) => n % 2 === 0));

  // toObject
  const users = ["alice", "bob", "charlie"];
  console.log(
    "Users map:",
    users.toObject(
      (name) => name,
      (name) => name.length
    )
  );
});

test("String Utilities", () => {
  console.log("hello world".capitalize());
  console.log("hello world".words());
  console.log("hello world".camelCase());
  console.log("hello world".kebabCase());
  console.log("hello world".snakeCase());
  console.log("A very long string that should be truncated".truncate(20));
  console.log("   ".isBlank());
  console.log("hello".reverse());
  console.log("line1\nline2\nline3".lines());
  console.log("hello".chars());
  console.log("42".toNumber() + 1);
  console.log('<script>alert("xss")</script>'.escapeHtml());
});

test("Number Extras", () => {
  // Parity and primality
  console.log("4 is even:", (4).isEven());
  console.log("7 is odd:", (7).isOdd());
  console.log("17 is prime:", (17).isPrime());

  // Ordinals
  console.log("1st:", (1).ordinal());
  console.log("2nd:", (2).ordinal());
  console.log("23rd:", (23).ordinal());

  // Base conversions
  console.log("255 hex:", (255).toHex());
  console.log("255 binary:", (255).toBinary());
  console.log("255 octal:", (255).toOctal());

  // Repeat n times
  console.log(
    "3 times:",
    (3).times((i) => i * i)
  );

  // Range from number
  console.log("5 to 10:", (5).to(10));

  // Duration formatting
  console.log("Duration:", (3661000).duration());

  // Fibonacci
  console.log("Fibonacci(10):", Number.fibonacci(10));
});

test("Function Composition", () => {
  const double = (x) => x * 2;
  const addOne = (x) => x + 1;
  const square = (x) => x * x;

  // Compose (right-to-left)
  const doubleAndAddOne = addOne.compose(double);
  console.log("compose(3):", doubleAndAddOne(3)); // 7

  // Static compose and pipe
  const transform1 = Function.compose(square, addOne, double);
  const transform2 = Function.pipe(double, addOne, square);
  console.log("Function.compose(3):", transform1(3)); // (3*2+1)^2 = 49
  console.log("Function.pipe(3):", transform2(3)); // (3*2+1)^2 = 49

  // Curry
  const add = ((a, b) => a + b).curry();
  const add10 = add(10);
  console.log("curry add10(5):", add10(5)); // 15

  // Flip
  const divide = (a, b) => a / b;
  const divideFlipped = divide.flip();
  console.log("flip divide(2, 10):", divideFlipped(2, 10)); // 5
});

test("Object Utilities", () => {
  const user = { name: "Alice", age: 30, email: "alice@example.com", password: "secret" };

  console.log("Pick:", Object.pick(user, ["name", "email"]));
  console.log("Omit:", Object.omit(user, ["password"]));

  const defaults = { theme: "dark", lang: "en" };
  const prefs = { theme: "light" };
  console.log("Deep merge:", Object.deepMerge(defaults, prefs));

  // Deep equality
  console.log("equals:", { a: 1, b: [2, 3] }.equals({ a: 1, b: [2, 3] }));

  // Tap
  const result = { x: 1 }.tap((obj) => console.log("tapped:", obj));
  console.log("after tap:", result);
});

test("Date Manipulation", () => {
  const now = new Date();
  console.log("Formatted:", now.format("YYYY-MM-DD HH:mm:ss"));
  console.log("Is weekday:", now.isWeekday());
  console.log("Is weekend:", now.isWeekend());

  const tomorrow = now.addDays(1);
  console.log("Tomorrow:", tomorrow.format("YYYY-MM-DD"));

  const nextMonth = now.addMonths(1);
  console.log("Next month:", nextMonth.format("YYYY-MM-DD"));

  console.log("Start of day:", now.startOfDay().format("YYYY-MM-DD HH:mm:ss"));
  console.log("End of day:", now.endOfDay().format("YYYY-MM-DD HH:mm:ss"));
  console.log("Start of month:", now.startOfMonth().format("YYYY-MM-DD"));
  console.log("End of month:", now.endOfMonth().format("YYYY-MM-DD"));

  const birthday = new Date(1995, 0, 1);
  console.log("Age:", birthday.age());
  console.log("Relative:", birthday.relative());
  console.log("Days until now:", birthday.daysUntil(now));

  console.log("Today:", Date.today().format("YYYY-MM-DD"));
  console.log("Tomorrow:", Date.tomorrow().format("YYYY-MM-DD"));
  console.log("Yesterday:", Date.yesterday().format("YYYY-MM-DD"));
});

test("Math Enhancements", () => {
  console.log("lerp(0, 100, 0.5):", Math.lerp(0, 100, 0.5));
  console.log(
    "mapRange(5, 0, 10, 0, 100):",
    Math.mapRange(5, 0, 10, 0, 100)
  );
  console.log("factorial(10):", Math.factorial(10));
  console.log("fibonacci(10):", Math.fibonacci(10));
  console.log("isPrime(17):", Math.isPrime(17));
  console.log("degreesToRadians(180):", Math.degreesToRadians(180));
  console.log("radiansToDegrees(π):", Math.radiansToDegrees(Math.PI));
  console.log("sum(1,2,3,4,5):", Math.sum(1, 2, 3, 4, 5));
  console.log("average(1,2,3,4,5):", Math.average(1, 2, 3, 4, 5));
});

test("JSON Safety", () => {
  console.log('Valid JSON:', JSON.safeParse('{"a": 1}'));
  console.log("Invalid JSON:", JSON.safeParse("not json", {}));
  console.log("With fallback:", JSON.safeParse("broken", { default: true }));
});

test("Promise Utilities", async () => {
  // Delay
  const value = await Promise.delay(10, "hello");
  console.log("Delayed value:", value);

  // Tap
  const result = await Promise.resolve(42).tap((v) =>
    console.log("Tapped promise:", v)
  );
  console.log("Promise result:", result);
});

test("Error Serialization", () => {
  const err = new Error("Something went wrong");
  console.log("Error as JSON:", err.toJSON());
});

test("RegExp Patterns", () => {
  console.log("Email valid:", RegExp.email.test("user@example.com"));
  console.log("UUID valid:", RegExp.UUID.test("550e8400-e29b-41d4-a716-446655440000"));
  console.log("Hex color valid:", RegExp.hexColor.test("#ff00ff"));
  console.log("IPv4 valid:", RegExp.IPv4.test("192.168.1.1"));
  console.log("ISO8601 valid:", RegExp.ISO8601.test("2024-01-15T10:30:00Z"));
  console.log("URL valid:", RegExp.URL.test("https://example.com/path?q=1"));
});
