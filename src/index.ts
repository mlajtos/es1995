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
      ]) as (value: number) => unknown,
    )
    .join(", ")
    .pipe(console.log);
});

test("Number Decomposition", () => {
  const n = -23.47;
  const [s, i, f] = [n.sign(), n.integerPart(), n.fractionalPart()];
  const m = s * (i + f);

  console.log(n === m, m, n);
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
  const doubleAndAddOne = addOne.compose(double) as (...args: number[]) => number;
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
  // Map temperatures to a cold-to-hot color gradient using Color.mix
  const cold = Color.from("#4285F4"); // cold blue
  const hot = Color.from("#EA4335"); // hot red

  const temperatures = [18, 22, 35, 15, 28, 31, 20];
  const [tMin, tMax] = [temperatures.min() as number, temperatures.max() as number];

  temperatures
    .map((temp) => {
      const t = Math.inverseLerp(tMin, tMax, temp);
      const color = cold.mix(hot, t);
      return { temp: `${temp}°C`, t: t.round(2), color: color.toHex() };
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

test("Caesar Cipher", () => {
  // Encrypt & decrypt using character math and modular arithmetic
  const alphabet = "abcdefghijklmnopqrstuvwxyz".chars();

  const shift = (text: string, n: number): string =>
    text
      .chars()
      .map((ch) => {
        const idx = alphabet.indexOf(ch.toLowerCase());
        if (idx === -1) return ch; // keep spaces, punctuation
        const shifted = alphabet[(idx + n + 26) % 26];
        return ch === ch.toUpperCase() ? shifted.toUpperCase() : shifted;
      })
      .join("");

  const encrypt = (text: string, key: number) => shift(text, key);
  const decrypt = (text: string, key: number) => shift(text, -key);

  const message = "Et tu, Brute?";
  const key = 13; // ROT13

  const encrypted = encrypt(message, key);
  const decrypted = decrypt(encrypted, key);

  console.log("Original: ", message);
  console.log("Encrypted:", encrypted);   // "Rg gh, Oehgr?"
  console.log("Decrypted:", decrypted);   // "Et tu, Brute?"
  console.log("Roundtrip:", message === decrypted);

  // Brute-force all 26 rotations
  Number.range(0, 26)
    .map((n) => ({ rotation: n, text: shift(encrypted, n) }))
    .first((r: any) => r.text === message)!
    .pipe(console.log);
});

test("CSV Parser & Analyzer", () => {
  // Parse raw CSV → typed records → aggregate stats, all in one pipeline
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
        (h) => h as string,
        (h, i) => (h === "salary" ? (cols[i] as unknown as string).toNumber() : cols[i]),
      ),
    ) as { name: string; department: string; salary: number }[];

  // Department summary: average salary, head count, top earner
  const report = Object.entries(employees.groupBy("department") as Record<string, typeof employees>)
    .map(([dept, members]) => ({
      department: dept,
      headcount: members.count(),
      avgSalary: (members.map((m) => m.salary) as number[]).average().round(0),
      topEarner: (members as typeof employees).sortBy("salary").reversed().first()!.name,
    }))
    .sortBy("avgSalary")
    .reversed();

  console.log("Employee records:", employees);
  console.log("Department report:");
  report
    .map(
      (r) =>
        `  ${r.department}: ${r.headcount} people, avg $${r.avgSalary}, top: ${r.topEarner}`,
    )
    .pipe((lines: string[]) => lines.join("\n"))
    .pipe(console.log);
});

test("Event Schedule Planner", () => {
  // Pretend it is 2026-04-01T23:47:00
  const now = new Date(2026, 3, 1, 23, 47, 0);

  // Generate a week of events with computed dates
  const events = [
    { title: "Standup",      offset: 1, hour: 9,  min: 0,  duration: 15 },
    { title: "Sprint Review", offset: 2, hour: 14, min: 0,  duration: 60 },
    { title: "Lunch & Learn", offset: 3, hour: 12, min: 30, duration: 45 },
    { title: "Deploy Window", offset: 4, hour: 16, min: 0,  duration: 120 },
    { title: "Retro",         offset: 5, hour: 10, min: 0,  duration: 90 },
    { title: "Happy Hour",    offset: 5, hour: 17, min: 0,  duration: 60 },
    { title: "Standup",       offset: 6, hour: 9,  min: 0,  duration: 15 },
  ].map((e) => {
    const start = now
      .startOfDay()
      .addDays(e.offset)
      .addHours(e.hour)
      .addMinutes(e.min);
    return {
      title: e.title,
      start,
      end: start.addMinutes(e.duration),
      day: start.format("YYYY-MM-DD"),
      time: `${start.format("HH:mm")}–${start.addMinutes(e.duration).format("HH:mm")}`,
      durationStr: (e.duration * 60000).duration(),
    };
  });

  // Group by day, show schedule
  const schedule = events.groupBy("day") as Record<string, typeof events>;
  Object.entries(schedule)
    .sorted(([a], [b]) => (a as string).localeCompare(b as string))
    .map(([day, evts]) => {
      const dayEvents = (evts as typeof events)
        .sortBy("start")
        .map((e) => `    ${e.time} ${e.title} (${e.durationStr})`)
        .join("\n");
      return `  ${day}:\n${dayEvents}`;
    })
    .pipe((lines: string[]) => lines.join("\n"))
    .pipe(console.log);

  // Which day is busiest?
  const busiest = Object.entries(schedule)
    .sorted(([, a], [, b]) => (b as unknown[]).length - (a as unknown[]).length)
    .first() as [string, unknown[]];
  console.log(`Busiest day: ${busiest[0]} with ${busiest[1].length} events`);
});

test("Conway's Game of Life – One Generation", () => {
  // A single step of Conway's Game of Life using pure array transformations
  type Grid = number[][];

  // Glider on an 8×8 board
  const grid: Grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
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

  console.log("Generation 0:\n" + render(grid));
  const gen1 = step(grid);
  console.log("\nGeneration 1:\n" + render(gen1));
  const gen2 = step(gen1);
  console.log("\nGeneration 2:\n" + render(gen2));
});

test("Sieve of Eratosthenes", () => {
  // Functional sieve using ES1995 array primitives
  const sieve = (limit: number): number[] => {
    const candidates = Number.range(2, limit + 1);

    const go = (nums: number[]): number[] => {
      if (nums.empty()) return [];
      const [prime, ...rest] = nums;
      return [prime, ...go(rest.reject((n) => (n as number).multipleOf(prime)))];
    };

    return go(candidates);
  };

  const primes = sieve(100);

  console.log(`Found ${primes.count()} primes up to 100`);
  console.log("Primes:", primes.join(", "));

  // Twin primes (pairs differing by 2)
  const twins = primes
    .pairwise()
    .filter(([a, b]) => (b as number) - (a as number) === 2)
    .map(([a, b]) => `(${a}, ${b})`);

  console.log("Twin primes:", twins.join(", "));

  // Prime gaps histogram
  primes
    .pairwise()
    .map(([a, b]) => (b as number) - (a as number))
    .frequencies()
    .pipe((freq: Record<string, number>) => Object.entries(freq))
    .sorted(([a], [b]) => (a as unknown as number) - (b as unknown as number))
    .map(([gap, count]: [string, number]) => `  gap ${gap}: ${"█".repeat(count)} (${count})`)
    .pipe((lines: string[]) => lines.join("\n"))
    .pipe((s: string) => "Prime gap distribution:\n" + s)
    .pipe(console.log);
});

test("Budget Tracker", () => {
  // A personal finance pipeline showing date, string, number, and object interplay
  interface Transaction {
    date: string;
    category: string;
    amount: number;
    description: string;
  }

  const transactions: Transaction[] = [
    { date: "2026-04-01", category: "food",      amount: -45.50,  description: "Groceries" },
    { date: "2026-04-01", category: "income",    amount: 3200,    description: "Salary" },
    { date: "2026-04-02", category: "transport",  amount: -12.00,  description: "Bus pass" },
    { date: "2026-04-02", category: "food",      amount: -28.75,  description: "Restaurant" },
    { date: "2026-04-03", category: "utilities", amount: -89.00,  description: "Electricity" },
    { date: "2026-04-03", category: "food",      amount: -32.00,  description: "Groceries" },
    { date: "2026-04-04", category: "entertainment", amount: -15.99, description: "Streaming" },
    { date: "2026-04-04", category: "income",    amount: 450,     description: "Freelance" },
    { date: "2026-04-05", category: "food",      amount: -55.00,  description: "Dinner out" },
    { date: "2026-04-05", category: "transport",  amount: -35.00,  description: "Gas" },
  ];

  // Running balance (scan)
  const balances = transactions
    .map((t) => t.amount)
    .scan((acc, x) => acc + x, 0);

  console.log(
    "Running balance:",
    transactions
      .zip(balances)
      .map(([t, bal]) => `${(t as Transaction).date} ${(t as Transaction).description.padEnd(15)} ${(t as Transaction).amount >= 0 ? "+" : ""}${(t as Transaction).amount.toFixed(2).padStart(10)} → $${(bal as number).toFixed(2)}`)
      .pipe((lines: string[]) => lines.join("\n")),
  );

  // Spending by category (excluding income)
  const spending = transactions
    .reject((t) => t.category === "income")
    .groupBy("category") as Record<string, Transaction[]>;

  console.log("\nSpending by category:");
  Object.entries(spending)
    .map(([cat, txns]) => ({
      category: cat,
      total: (txns as Transaction[]).map((t) => t.amount).sum().round(2),
      count: (txns as Transaction[]).count(),
    }))
    .sortBy("total")
    .map((c) => `  ${c.category.padEnd(15)} ${c.count} txns → $${Math.abs(c.total).toFixed(2)}`)
    .pipe((lines: string[]) => lines.join("\n"))
    .pipe(console.log);

  // Final balance
  const finalBalance = transactions.map((t) => t.amount).sum();
  console.log(`\nFinal balance: $${finalBalance.toFixed(2)}`);
});

test("Morse Code Translator", () => {
  // Bidirectional Morse code using string + array + object transforms
  const morseTable: Record<string, string> = {
    A: ".-",    B: "-...",  C: "-.-.",  D: "-..",   E: ".",
    F: "..-.",  G: "--.",   H: "....",  I: "..",    J: ".---",
    K: "-.-",   L: ".-..",  M: "--",    N: "-.",    O: "---",
    P: ".--.",  Q: "--.-",  R: ".-.",   S: "...",   T: "-",
    U: "..-",   V: "...-",  W: ".--",   X: "-..-",  Y: "-.--",
    Z: "--..",  "0": "-----", "1": ".----", "2": "..---",
    "3": "...--", "4": "....-", "5": ".....", "6": "-....",
    "7": "--...", "8": "---..", "9": "----.",
    " ": "/",
  };

  // Build reverse lookup using toObject
  const reverseMorse = Object.entries(morseTable)
    .toObject(
      ([, code]) => code as string,
      ([letter]) => letter,
    ) as Record<string, string>;

  const encode = (text: string): string =>
    text.toUpperCase().chars()
      .map((ch) => morseTable[ch] ?? ch)
      .join(" ");

  const decode = (morse: string): string =>
    morse.split(" ")
      .map((code) => reverseMorse[code] ?? code)
      .join("");

  const message = "Hello World";
  const encoded = encode(message);
  const decoded = decode(encoded);

  console.log("Text:   ", message);
  console.log("Morse:  ", encoded);
  console.log("Decoded:", decoded);
  console.log("Match:  ", message.toUpperCase() === decoded);
});

/*

    New Feature Showcases

*/

test("Schema Validation (z)", () => {
  const UserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    age: z.number().int().positive(),
    role: z.enum("admin", "user", "viewer"),
    tags: z.array(z.string()).nonempty(),
  });

  const good = UserSchema.safeParse({
    name: "Alice",
    email: "alice@example.com",
    age: 30,
    role: "admin",
    tags: ["dev", "lead"],
  });
  console.log("Valid user:", good);

  const bad = UserSchema.safeParse({
    name: "A",
    email: "not-an-email",
    age: -5,
    role: "hacker",
    tags: [],
  });
  console.log("Invalid user:", bad);

  // Composable schemas
  const PublicUser = UserSchema.omit("email");
  console.log("Public user:", PublicUser.safeParse({
    name: "Bob",
    age: 25,
    role: "user",
    tags: ["reader"],
  }));
});

test("UUID Generation", () => {
  const ids = (5).times(() => String.uuid());
  console.log("UUIDs:", ids);
  console.log("All valid:", ids.every((id: string) => RegExp.UUID.test(id)));
});

test("Color – The Color Class", () => {
  // Create from hex, RGB, HSL, OKLCH
  const tomato = Color.from("#ff6347");
  const blue = Color.rgb(0, 0, 255);
  const green = Color.hsl(120, 100, 50);
  const perceptual = Color.oklch(0.7, 0.15, 150);

  console.log("Tomato:", tomato.toHex(), "RGB:", tomato.toRGB(), "HSL:", tomato.toHSL(), "OKLCH:", tomato.toOKLCH());
  console.log("Blue:", blue.toHex());
  console.log("Green:", green.toHex());
  console.log("Perceptual:", perceptual.toHex());

  // String.toColor() convenience
  const coral = "#ff7f50".toColor();
  console.log("Coral:", coral.toHex(), coral.toRGB());

  // Mixing in OKLCH space (perceptually uniform!)
  const red = Color.from("#ff0000");
  const mix50 = red.mix(blue);
  const mix25 = red.mix(blue, 0.25);
  console.log("Red + Blue 50%:", mix50.toHex());
  console.log("Red + Blue 25%:", mix25.toHex());

  // Adjustments
  console.log("Tomato lighter:", tomato.lighten(0.1).toHex());
  console.log("Tomato darker:", tomato.darken(0.1).toHex());
  console.log("Tomato rotated 90°:", tomato.rotate(90).toHex());
  console.log("Tomato saturated:", tomato.saturate(0.05).toHex());
  console.log("Tomato desaturated:", tomato.desaturate(0.05).toHex());

  // Color harmonies
  console.log("Complementary:", tomato.complementary().toHex());
  console.log("Analogous:", tomato.analogous().map(c => c.toHex()));
  console.log("Triadic:", tomato.triadic().map(c => c.toHex()));

  // Accessibility
  const white = Color.from("#ffffff");
  const black = Color.from("#000000");
  console.log("White luminance:", white.luminance().round(3));
  console.log("Black luminance:", black.luminance().round(3));
  console.log("Contrast white/black:", white.contrastRatio(black).round(2));
  console.log("Contrast tomato/white:", tomato.contrastRatio(white).round(2));

  // OKLCH perceptually uniform rainbow
  const rainbow = Number.range(0, 360, 30).map((h) => Color.oklch(0.7, 0.15, h).toHex());
  console.log("OKLCH rainbow:", rainbow);

  // Composable with pipe
  const result = Color.from("#336699")
    .pipe((c) => c.lighten(0.1))
    .pipe((c) => c.rotate(30))
    .toHex();
  console.log("Piped color:", result);

  // Color.random()
  console.log("Random:", Color.random().toHex());
});

test("Promise Concurrency", async () => {
  const fakeFetch = async (id: number): Promise<string> => {
    await Promise.sleep(10);
    return `Result-${id}`;
  };

  // Map with concurrency limit
  const results = await Promise.map(
    Number.range(1, 6),
    (id) => fakeFetch(id),
    { concurrency: 2 },
  );
  console.log("Promise.map:", results);

  // Resolve an object of promises
  const data = await Promise.props({
    user: Promise.resolve({ name: "Alice" }),
    posts: Promise.resolve([1, 2, 3]),
    count: Promise.resolve(42),
  });
  console.log("Promise.props:", data);

  // Filter with async predicate
  const evens = await Promise.filter(
    Number.range(1, 11),
    async (n) => n % 2 === 0,
  );
  console.log("Async evens:", evens);
});

test("Duration & Byte Parsing", () => {
  // Parse duration strings
  console.log('"2h30m" =', "2h30m".toDuration(), "ms");
  console.log('"1d12h" =', "1d12h".toDuration().duration());
  console.log('"500ms" =', "500ms".toDuration(), "ms");

  // Format / parse bytes
  console.log("1.5 GB =", "1.5 GB".toBytes(), "bytes");
  console.log("Format:", (1536000).bytes());
  console.log("Round-trip:", "2.5 MB".toBytes().bytes());
});

test("Query String", () => {
  const qs = "name=Alice&age=30&city=New%20York";
  console.log("Parsed:", qs.parseQueryString());
  console.log("Valid?", RegExp.queryString.test(qs));
  console.log("URL query:", "?foo=bar&baz=42".parseQueryString());
});

test("Type-fest: Branded Types (Opaque)", () => {
  // Opaque / branded types prevent mixing up IDs
  type UserId = Opaque<string, "UserId">;
  type PostId = Opaque<string, "PostId">;

  const createUser = (name: string): { id: UserId; name: string } => ({
    id: String.uuid() as UserId,
    name,
  });

  const createPost = (title: string, authorId: UserId): { id: PostId; title: string; authorId: UserId } => ({
    id: String.uuid() as PostId,
    title,
    authorId,
  });

  const user = createUser("Alice");
  const post = createPost("Hello World", user.id);
  // post.authorId = post.id; // ← Would be a compile-time error! PostId ≠ UserId

  console.log("User:", user);
  console.log("Post:", post);
  console.log("IDs are different branded types — the compiler keeps us safe!");
});

test("Type-fest: Deep Partial Config", () => {
  // PartialDeep lets you override just the nested pieces you care about
  interface AppConfig {
    server: { host: string; port: number; ssl: { cert: string; key: string } };
    database: { url: string; pool: { min: number; max: number } };
    features: string[];
  }

  const defaults: AppConfig = {
    server: { host: "localhost", port: 3000, ssl: { cert: "", key: "" } },
    database: { url: "sqlite://dev.db", pool: { min: 2, max: 10 } },
    features: ["auth", "logging"],
  };

  // Only override what you need — deeply!
  const overrides: PartialDeep<AppConfig> = {
    server: { port: 8080, ssl: { cert: "/path/to/cert" } },
    database: { pool: { max: 50 } },
  };

  // Deep merge to get the final config
  const config = Object.deepMerge(defaults, overrides);
  console.log("Merged config:", config);
  console.log("Port overridden:", (config as any).server.port === 8080);
  console.log("Pool max:", (config as any).database.pool.max === 50);
  console.log("Host kept:", (config as any).server.host === "localhost");
});

test("String.toDate – Date Parsing", () => {
  // Complement to Date.format() – parse strings back to Dates
  const date = "2026-03-28".toDate();
  console.log("Parsed ISO:", date.format("YYYY-MM-DD")); // "2026-03-28"

  const datetime = "2026-03-28T15:30:00Z".toDate();
  console.log("Parsed datetime:", datetime.format("YYYY-MM-DD HH:mm:ss"));

  // Round-trip: format → parse → format
  const original = new Date(2026, 3, 1, 23, 47, 0);
  const formatted = original.format("YYYY-MM-DD");
  const roundTripped = formatted.toDate().format("YYYY-MM-DD");
  console.log("Round-trip:", formatted, "→", roundTripped, "match:", formatted === roundTripped);
});

test("Object ↔ Array Bridge", () => {
  const user = { name: "Alice", age: 30, role: "admin" };

  // .entries(), .keys(), .values() on objects
  console.log("Entries:", user.entries());
  console.log("Keys:", user.keys());
  console.log("Values:", user.values());

  // Fluent pipeline: Object → Array → transform → Object
  const uppercased = user
    .entries()
    .map(([k, v]) => [k, typeof v === "string" ? (v as string).toUpperCase() : v] as [string, unknown])
    .toObject(([k]) => k, ([, v]) => v);
  console.log("Uppercased:", uppercased);

  // Object → sorted entries → take top N
  const scores = { alice: 95, bob: 87, charlie: 92, diana: 99, eve: 88 };
  const top3 = scores
    .entries()
    .sorted(([, a], [, b]) => (b as number) - (a as number))
    .take(3)
    .map(([name, score]) => `${name}: ${score}`);
  console.log("Top 3:", top3);
});

test("z.parseAsync – Async Validation", async () => {
  const emailSchema = z.string().email();

  // Parse a Promise-wrapped value
  const result = await emailSchema.safeParseAsync(Promise.resolve("alice@example.com"));
  console.log("Async valid:", result);

  const bad = await emailSchema.safeParseAsync(Promise.resolve("not-an-email"));
  console.log("Async invalid:", bad);

  // parseAsync throws on failure
  try {
    await emailSchema.parseAsync(Promise.resolve("valid@test.com"));
    console.log("parseAsync succeeded");
  } catch (e) {
    console.log("parseAsync threw:", e);
  }
});
