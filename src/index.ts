import "./es1995";

const test = (name: string, f: () => void): void => {
  console.group(name);
  f();
  console.groupEnd();
};

test("Fancy FizzBuzz", () => {
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
});

test("Functional Objects", () => {
  const count = Function.from({
    state: 0,
    [Symbol.callable]() {
      this.state += 1;
      return this.state;
    },
  });

  (count as Function)().pipe(console.log);
  (count as Function)().pipe(console.log);
  (count as Function)().pipe(console.log);
});

test("Number Decomposition", () => {
  const n = -23.47;
  const [s, i, f] = [n.sign(), n.integerPart(), n.fractionalPart()];
  const m = s * (i + f);

  console.log(n === m, m, n);
});

test("Lambda Shortcut", () => {
  const $ = Function.from;

  const sumOfSquares1 = (n: number) => (n * (n - 1) * (2 * n - 1)) / 6;
  const sumOfSquares2 = (n: number) =>
    Number.range(n)
      .map($`$ * $`)
      .reduce($`$ + $$` as any);

  console.log(sumOfSquares1(100) === sumOfSquares2(100), sumOfSquares1(100));
});

test("Builtin documentation", () => {
  const add = (a: number, b: number) => a + b;

  // Markdown documentation
  (add as any)[Symbol.documentation] = `
        # Add function

        Adds two numbers together.

        **Usage:**
            add(23, 47);
            const add10 = add.partial(10);
    `;

  console.log(add);
});

test("Array Manipulation – Texas Hold'em", () => {
  const suits = "♠♥♦♣".split("");
  const ranks = [...Number.range(2, 11), ..."JQKA".split("")];

  let deck = Array.cartesianProduct(suits, ranks).map((card: unknown[]) => card.join(""));

  // Fisher-Yates + random cut
  deck = deck.shuffle().rotate(Number.random(0, deck.length));

  const players = ["Douglas Crockford", "Marc Andreessen", "John-David Dalton"];

  let playersCards: unknown[];
  [playersCards, deck] = deck.splitAt(2 * players.length);
  playersCards = Array.zip(...playersCards.chunk(players.length));
  const hands = Object.fromEntries(players.zip(playersCards));

  let flop: unknown[], turn: unknown[], river: unknown[];

  [flop, deck] = deck.drop(1).splitAt(3);
  [turn, deck] = deck.drop(1).splitAt(1);
  [river, deck] = deck.drop(1).splitAt(1);

  const game = {
    hands,
    community: { flop, turn, river },
  };

  console.log(game);
});

test("Merge Sort", () => {
  const mergeSort = (L: number[]): number[] =>
    L.length <= 1
      ? L
      : (L.splitAt(L.length / 2) as [number[], number[]])
          .map(mergeSort)
          .pipe((L: number[][]) => merge(...L));

  const merge = Function.conditional([
    [(A: number[], B: number[]) => A.empty() || B.empty(), (A: number[], B: number[]) => A.concat(B)],
    [([a]: number[], [b]: number[]) => a < b, ([a, ...A]: number[], B: number[]) => [a, ...merge(A, B)]],
    [Function.true, (A: number[], B: number[]) => merge(B, A)], // ba-dum-ts
  ]) as (...args: unknown[]) => number[];

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
    "Clémentine",
  ];

  const searchTerm = "cle";

  names
    .map((name) => name.removeDiacritics().toLowerCase())
    // Sørensen–Dice coefficient: 0.0 – 1.0
    .map((safeName) => searchTerm.similarityTo(safeName))
    .zip(names)
    .sorted(([a], [b]) => (b as number) - (a as number))
    .take(3)
    .pipe(console.log);
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
      (name) => name as string,
      (name) => (name as string).length,
    ),
  );

  // Pairwise
  console.log("Pairwise:", [1, 2, 3, 4, 5].pairwise());

  // Intersperse
  console.log("Intersperse:", ["a", "b", "c"].intersperse("–"));

  // Transpose
  console.log("Transpose:", [[1, 2, 3], [4, 5, 6], [7, 8, 9]].transpose());
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

  // New string extensions
  console.log("racecar".isPalindrome());
  console.log("A man a plan a canal Panama".isPalindrome());
  console.log("hello hello world".count("hello"));
  console.log("Hello {{name}}, you are {{age}} years old!".template({ name: "Alice", age: 30 }));
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

  // Roman numerals
  console.log("1995 in Roman:", (1995).toRoman());
  console.log("42 in Roman:", (42).toRoman());
  console.log("2026 in Roman:", (2026).toRoman());

  // Repeat n times
  console.log(
    "3 times:",
    (3).times((i) => i * i),
  );

  // Range from number
  console.log("5 to 10:", (5).to(10));

  // Duration formatting
  console.log("Duration:", (3661000).duration());

  // Fibonacci
  console.log("Fibonacci(10):", Number.fibonacci(10));
});

test("Function Composition", () => {
  const double = (x: number) => x * 2;
  const addOne = (x: number) => x + 1;
  const square = (x: number) => x * x;

  // Compose (right-to-left)
  const doubleAndAddOne = addOne.compose(double);
  console.log("compose(3):", doubleAndAddOne(3)); // 7

  // Static compose and pipe
  const transform1 = Function.compose(square, addOne, double);
  const transform2 = Function.pipe(double, addOne, square);
  console.log("Function.compose(3):", (transform1 as Function)(3)); // (3*2+1)^2 = 49
  console.log("Function.pipe(3):", (transform2 as Function)(3)); // (3*2+1)^2 = 49

  // Curry
  const add = ((a: number, b: number) => a + b).curry();
  const add10 = add(10);
  console.log("curry add10(5):", (add10 as Function)(5)); // 15

  // Flip
  const divide = (a: number, b: number) => a / b;
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
  // Pretend it is 2026-04-01T23:47:00
  const now = new Date(2026, 3, 1, 23, 47, 0);
  console.log("Formatted:", now.format("YYYY-MM-DD HH:mm:ss")); // "2026-04-01 23:47:00"
  console.log("Is weekday:", now.isWeekday()); // true (Wednesday)
  console.log("Is weekend:", now.isWeekend()); // false

  const nextWeek = now.addDays(7);
  console.log("Next week:", nextWeek.format("YYYY-MM-DD")); // "2026-04-08"

  const nextMonth = now.addMonths(1);
  console.log("Next month:", nextMonth.format("YYYY-MM-DD")); // "2026-05-01"

  console.log("Start of day:", now.startOfDay().format("YYYY-MM-DD HH:mm:ss")); // "2026-04-01 00:00:00"
  console.log("End of day:", now.endOfDay().format("YYYY-MM-DD HH:mm:ss")); // "2026-04-01 23:59:59"
  console.log("Start of month:", now.startOfMonth().format("YYYY-MM-DD")); // "2026-04-01"
  console.log("End of month:", now.endOfMonth().format("YYYY-MM-DD")); // "2026-04-30"

  // JavaScript's birthday – first public release with Netscape Navigator 2.0
  const jsBirthday = new Date(1995, 11, 4); // December 4, 1995
  // age() and relative() use the real current date, not the pretend date above
  console.log("JavaScript's age:", jsBirthday.age());
  console.log("Relative:", jsBirthday.relative());
  console.log("Days since JS was born:", jsBirthday.daysUntil(now));

  console.log("Today:", Date.today().format("YYYY-MM-DD"));
  console.log("Tomorrow:", Date.tomorrow().format("YYYY-MM-DD"));
  console.log("Yesterday:", Date.yesterday().format("YYYY-MM-DD"));
});

test("Math – lerp & inverseLerp", () => {
  console.log("lerp(0, 100, 0.5):", Math.lerp(0, 100, 0.5)); // 50
  console.log("inverseLerp(0, 100, 75):", Math.inverseLerp(0, 100, 75)); // 0.75
  console.log("factorial(10):", Math.factorial(10)); // 3628800
  console.log("fibonacci(10):", Math.fibonacci(10)); // 55
  console.log("isPrime(17):", Math.isPrime(17));
  console.log("degreesToRadians(180):", Math.degreesToRadians(180));
  console.log("radiansToDegrees(π):", Math.radiansToDegrees(Math.PI));
  console.log("sum(1,2,3,4,5):", Math.sum(1, 2, 3, 4, 5));
  console.log("average(1,2,3,4,5):", Math.average(1, 2, 3, 4, 5));
});

test("JSON Safety", () => {
  console.log("Valid JSON:", JSON.safeParse('{"a": 1}'));
  console.log("Invalid JSON:", JSON.safeParse("not json", {}));
  console.log("With fallback:", JSON.safeParse("broken", { default: true }));
});

test("Promise Utilities", async () => {
  // Delay
  const value = await Promise.delay(10, "hello");
  console.log("Delayed value:", value);

  // Tap
  const result = await Promise.resolve(42).tap((v) => console.log("Tapped promise:", v));
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
  console.log("ISO8601 valid:", RegExp.ISO8601.test("2026-04-01T23:47:00Z"));
  console.log("URL valid:", RegExp.URL.test("https://example.com/path?q=1"));
});

/*

    Larger Composition Examples

*/

test("Color Interpolation – Temperature Gradient", () => {
  // Map temperatures to a cold-to-hot color gradient using lerp & inverseLerp
  const coldColor = [66, 133, 244]; // #4285F4 (cold blue)
  const hotColor = [234, 67, 53]; // #EA4335 (hot red)

  const temperatures = [18, 22, 35, 15, 28, 31, 20];
  const [tMin, tMax] = [temperatures.min() as number, temperatures.max() as number];

  temperatures
    .map((temp) => {
      const t = Math.inverseLerp(tMin, tMax, temp);
      const rgb = (coldColor as number[])
        .zip(hotColor)
        .map(([c, h]) => Math.lerp(c as number, h as number, t).round(0));
      return { temp: `${temp}°C`, t: t.round(2), color: `rgb(${rgb.join(",")})` };
    })
    .sortBy("temp")
    .pipe(console.log);
});

test("Word Frequency Analysis", () => {
  const text = `To be or not to be that is the question
Whether tis nobler in the mind to suffer
The slings and arrows of outrageous fortune
Or to take arms against a sea of troubles`;

  text
    .toLowerCase()
    .words()
    .frequencies()
    .pipe((freq: Record<string, number>) => Object.entries(freq))
    .sorted(([, a]: [string, number], [, b]: [string, number]) => b - a)
    .take(8)
    .map(([word, count]: [string, number]) => `${word}: ${"█".repeat(count)} (${count})`)
    .pipe((lines: string[]) => lines.join("\n"))
    .pipe(console.log);
});

test("Student Grade Report", () => {
  interface Student {
    name: string;
    scores: number[];
  }

  const students: Student[] = [
    { name: "Alice", scores: [92, 88, 95, 87] },
    { name: "Bob", scores: [78, 82, 71, 85] },
    { name: "Charlie", scores: [95, 97, 93, 98] },
    { name: "Diana", scores: [65, 72, 68, 74] },
    { name: "Eve", scores: [88, 91, 84, 90] },
  ];

  students
    .map((s) => ({
      ...s,
      avg: s.scores.average().round(1),
      best: s.scores.max(),
      worst: s.scores.min(),
    }))
    .sortBy("avg")
    .reversed()
    .map((s, i) => `${(i + 1).ordinal()} ${s.name}: ${s.avg} (${s.worst}–${s.best})`)
    .intersperse("---")
    .pipe((lines: string[]) => lines.join("\n"))
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
});

test("Mini Matrix Operations", () => {
  const A = [
    [1, 2, 3],
    [4, 5, 6],
  ];

  console.log("Matrix A:", A);
  console.log("Transposed:", A.transpose());
  console.log("Flat:", A.flattenDeep());

  // Dot product via zip
  const v1 = [1, 2, 3];
  const v2 = [4, 5, 6];
  const dot = v1.zip(v2).map(([a, b]) => (a as number) * (b as number)).sum();
  console.log("Dot product:", dot); // 32
});

test("Roman Numeral Timeline", () => {
  // Key dates in JavaScript history, expressed in Roman numerals
  const milestones = [
    { year: 1995, event: "JavaScript created by Brendan Eich" },
    { year: 1997, event: "ECMAScript 1 standardized" },
    { year: 2009, event: "Node.js released" },
    { year: 2015, event: "ES6/ES2015 – the big leap" },
    { year: 2026, event: "ES1995 becomes the LAST polyfill" },
  ];

  milestones
    .map((m) => `${m.year.toRoman()} (${m.year}) – ${m.event}`)
    .pipe((lines: string[]) => lines.join("\n"))
    .pipe(console.log);
});
