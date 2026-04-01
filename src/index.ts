import "./es1995";

// ✦ Magnum Opus — Intergalactic JS Conference Speaker Rankings 🚀
//
// "If JS was like this from the start, humans would dominate the whole galaxy"
//                                                              — Elon Musk

interface Speaker {
  name: string;
  talk: string;
  planet: string;
  rating: number;
  fee: number;
  confirmed: boolean;
}

const speakers: Speaker[] = [
  { name: "Brendan Eich",       talk: "I Did JS in 10 Days (AMA)",        planet: "Earth",     rating: 9.7, fee: 50000, confirmed: true  },
  { name: "God",                talk: "Replacing Perl: A Cosmic Journey", planet: "Heaven",    rating: 9.9, fee: 0,     confirmed: false },
  { name: "Alan Kay",           talk: "The Web Is Still a Joke",          planet: "Xerox PARC", rating: 8.5, fee: 42000, confirmed: true  },
  { name: "Steve Ballmer",      talk: "DEVELOPERS DEVELOPERS DEVELOPERS", planet: "Microsoft", rating: 7.2, fee: 99999, confirmed: true  },
  { name: "Alan Turing",        talk: "What TC39 Can See Ahead",          planet: "Bletchley", rating: 9.1, fee: 0,     confirmed: false },
  { name: "Sebastian Mackenzie", talk: "Building Rome in < 1 Day",       planet: "GitHub",    rating: 8.8, fee: 15000, confirmed: true  },
  { name: "Joe Armstrong",      talk: "Stenographers Inside Phones",     planet: "Erlang",    rating: 8.0, fee: 12000, confirmed: true  },
  { name: "Elon Musk",          talk: "Quantum Bitcoin on Neuralink",    planet: "Mars",      rating: 6.5, fee: 420000, confirmed: false },
];

// 🎪 Build the conference program using ES1995 pipelines
const program = speakers
  .reject((s) => !s.confirmed)                                    // only confirmed speakers
  .sortBy("rating").reversed()                                    // best rated first
  .tap((top) => console.log(`🏆 Keynote: ${top.first()!.name}`))
  .groupBy("planet")                                              // group by origin
  .entries()                                                      // Object → Array bridge
  .map(([planet, talks]) => ({
    planet:     planet.capitalize(),
    speakers:   talks.length,
    avgRating:  talks.map((t: Speaker) => t.rating).average().round(1),
    totalFees:  talks.map((t: Speaker) => t.fee).sum(),
    topSpeaker: talks.sortBy("rating").last()!.name,
    badge:      Color.hsl(talks.length * 120, 70, 50).toHex(),
    topTalk:    talks.sortBy("rating").last()!.talk,
  }))
  .sortBy("avgRating").reversed();

// 🚀 Render it to the DOM with htm + Preact
const App = () => html`
  <div style=${{ fontFamily: "system-ui, sans-serif", maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
    <h1 style=${{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
      🚀 Intergalactic JS Conference
    </h1>
    <p style=${{ color: "#666", fontStyle: "italic", marginTop: 0 }}>
      "I did JS in 10 days. If I had one more day, ES1995 would be there from the start." — Brendan Eich
    </p>

    <div style=${{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
      ${program.map((p) => html`
        <div style=${{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "1rem",
          borderLeft: `4px solid ${p.badge}`,
          background: "#fafafa",
        }}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style=${{ margin: 0, fontSize: "1.2rem" }}>
              ${p.planet === "Earth" ? "🌍" : "🪐"} ${p.planet}
            </h2>
            <span style=${{
              background: p.badge,
              color: "white",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}>
              ⭐ ${p.avgRating}
            </span>
          </div>
          <p style=${{ margin: "0.5rem 0 0", color: "#555" }}>
            🎤 <strong>${p.topSpeaker}</strong> — "${p.topTalk}"
          </p>
          <p style=${{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#888" }}>
            ${p.speakers} speaker${p.speakers > 1 ? "s" : ""} · 💰 $${p.totalFees.toLocaleString()} total fees
          </p>
        </div>
      `)}
    </div>

    <footer style=${{ marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1rem", color: "#999", fontSize: "0.8rem" }}>
      <p>Powered by ES1995 — The LAST Polyfill. Built with <code>htm</code> + <code>preact</code>.</p>
      <p>"DEVELOPERS DEVELOPERS DEVELOPERS" — Steve Ballmer</p>
    </footer>
  </div>
`;

render(html`<${App} />`, document.getElementById("app")!);
