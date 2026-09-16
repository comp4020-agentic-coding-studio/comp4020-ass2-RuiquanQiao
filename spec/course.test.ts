// The promises this course makes that the build cannot check for itself.
//
// `pnpm build` already catches a dangling `related:` ref, a link that ignores
// the base path, an accessibility violation and a deck that will not compile.
// What it has no opinion about is whether the *course* is coherent: whether the
// weights add up, whether every week is actually taught, whether the shape the
// prose promises is the shape the content collections describe, and whether the
// arithmetic on the home page still follows from the course record.
//
// Everything here reads `dist/`, so it asserts what shipped rather than what
// the source intended. `pnpm test` builds first.
import { readFileSync, readdirSync } from "node:fs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  description: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string; startDate: string; endDate: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const of = (type: string) => api.nodes.filter((n) => n.type === type);
const weekOf = (n: ApiNode) => Number(n.meta?.week);

const TEACHING_WEEKS = 12;
/** Weeks that are spent playing rather than in a lecture hall. Two, on purpose:
 *  see `sessionLabels` in src/site-config.ts and the week 3 and 7 lectures. */
const LAB_WEEKS = [3, 7];

describe("assessment", () => {
  it("adds up to exactly 100%", () => {
    const total = of("assessments").reduce((sum, a) => sum + Number(a.meta?.weight), 0);
    expect(total).toBe(100);
  });

  it("gives every assessment a marking model", () => {
    for (const a of of("assessments")) {
      expect(a.meta?.marking, `${a.id} has no marking block`).toBeTruthy();
    }
  });

  it("spreads the assessments out rather than stacking them at the end", () => {
    const weeks = of("assessments").map(weekOf).toSorted((a, b) => a - b);
    expect(weeks.length).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i] - weeks[i - 1], `assessments in weeks ${weeks}`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("the twelve weeks", () => {
  it("teaches exactly one lecture in each of weeks 1–12", () => {
    const byWeek = new Map<number, string[]>();
    for (const l of of("lectures")) {
      byWeek.set(weekOf(l), [...(byWeek.get(weekOf(l)) ?? []), l.id]);
    }
    for (let w = 1; w <= TEACHING_WEEKS; w++) {
      expect(byWeek.get(w) ?? [], `week ${w}`).toHaveLength(1);
    }
    expect(of("lectures")).toHaveLength(TEACHING_WEEKS);
  });

  it("runs Labs only in the weeks that are spent playing", () => {
    expect(of("sessions").map(weekOf).toSorted((a, b) => a - b)).toEqual(LAB_WEEKS);
  });

  // The brief names "twelve interchangeable weeks" as a failure, and it is not
  // one a build can see. This is a blunt instrument — it catches a week that
  // was duplicated and lightly reworded, not one that is merely dull — but that
  // is the failure mode worth a tripwire.
  it("gives each week a description that is not a reskin of another", () => {
    const words = (s: string) =>
      new Set(
        s
          .toLowerCase()
          .replace(/[^a-z\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 3),
      );
    const lectures = of("lectures");
    for (let i = 0; i < lectures.length; i++) {
      for (let j = i + 1; j < lectures.length; j++) {
        const a = words(lectures[i].description);
        const b = words(lectures[j].description);
        const shared = [...a].filter((w) => b.has(w)).length;
        const overlap = shared / Math.min(a.size, b.size);
        expect(
          overlap,
          `${lectures[i].id} and ${lectures[j].id} share ${Math.round(overlap * 100)}% of their words`,
        ).toBeLessThan(0.5);
      }
    }
  });
});

describe("the deck", () => {
  it("ships at least one lecture with real slides behind it", () => {
    const withSlides = of("lectures").filter((l) => typeof l.meta?.slides === "string");
    expect(withSlides.length).toBeGreaterThanOrEqual(1);
  });

  it("points every `slides:` at a deck that actually built", () => {
    for (const l of of("lectures")) {
      const slides = l.meta?.slides;
      if (typeof slides !== "string") continue;
      const built = resolve("dist", slides.replace(/^\//, ""), "index.html");
      expect(existsSync(built), `${l.id} links ${slides}, which did not build`).toBe(true);
    }
  });
});

describe("deck artwork", () => {
  // Every background and split panel on a slide is authored SVG, and an SVG
  // behind `background-image` fails *silently*: the browser reports a broken
  // image, paints nothing, and logs no console error, so a malformed file
  // looks exactly like a slide that was designed plain.
  //
  // It has happened once already, and from a direction worth naming: XML
  // forbids a double hyphen inside a comment, and every design token in this
  // repo is called `-` `-at-something`. A comment explaining which token a
  // literal hex value stands in for is therefore enough to break the file.
  const assets = existsSync(resolve("src/decks/assets"))
    ? readdirSync(resolve("src/decks/assets")).filter((f) => f.endsWith(".svg"))
    : [];

  it("has artwork to check", () => {
    expect(assets.length).toBeGreaterThan(0);
  });

  it.each(assets)("%s is well-formed XML a browser will actually paint", (file) => {
    const svg = readFileSync(resolve("src/decks/assets", file), "utf8");

    // No DOM parser is reachable from here (neither jsdom nor linkedom is a
    // dependency of this repo), so this checks the three things XML is strict
    // about and HTML is not, which is where a hand-authored SVG actually
    // breaks: comment hygiene, tag balance, and bare ampersands.
    for (const [, body] of svg.matchAll(/<!--([\s\S]*?)-->/g)) {
      expect(body.includes("--"), `${file}: double hyphen inside an XML comment`).toBe(false);
    }
    const withoutComments = svg.replace(/<!--[\s\S]*?-->/g, "");
    expect(
      /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(withoutComments),
      `${file}: unescaped ampersand`,
    ).toBe(false);

    const stack: string[] = [];
    for (const [, closing, name, , selfClosing] of withoutComments.matchAll(
      /<(\/)?([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/)?>/g,
    )) {
      if (closing) expect(stack.pop(), `${file}: stray </${name}>`).toBe(name);
      else if (!selfClosing) stack.push(name);
    }
    expect(stack, `${file}: tags left open`).toEqual([]);

    const root = withoutComments.match(/<svg\b([^>]*)>/)?.[1] ?? "";
    expect(/viewBox="/.test(root), `${file}: no viewBox, so it cannot scale`).toBe(true);
    // These are not decoration. Each one is the diagram its slide argues from,
    // so each one owes a description to anyone reading the deck with a screen
    // reader or reading the text version of it on a phone.
    expect(/aria-label="/.test(root), `${file}: no aria-label`).toBe(true);
  });

  it("is all referenced by a deck, and every reference resolves", () => {
    const decks = readdirSync(resolve("src/decks")).filter((f) => f.endsWith(".deck.mdx"));
    const referenced = new Set<string>();
    for (const deck of decks) {
      const src = readFileSync(resolve("src/decks", deck), "utf8");
      for (const [, url] of src.matchAll(/!\[bg[^\]]*\]\(\.\/assets\/([^)]+)\)/g)) {
        referenced.add(url);
        expect(
          existsSync(resolve("src/decks/assets", url)),
          `${deck} references assets/${url}, which does not exist`,
        ).toBe(true);
      }
    }
    for (const file of assets) {
      expect(referenced.has(file), `assets/${file} is not used by any deck`).toBe(true);
    }
  });

  it("ships every referenced asset into the build", () => {
    for (const file of assets) {
      expect(
        existsSync(resolve("dist/src/decks/assets", file)),
        `assets/${file} never reached dist/`,
      ).toBe(true);
    }
  });

  // The Windows-only bug this catches: astromotion rewrites `./assets/x.svg`
  // to a base-absolute URL by probing for "/src/" in a path node:path.resolve
  // has already normalised to backslashes, so on this machine the rewrite is
  // skipped and the browser resolves the relative URL against /decks/<slug>/.
  // CI is ubuntu and gets it right, which is exactly why it needs asserting:
  // the local build is the one that lies.
  it("makes every background URL base-absolute, not relative to the deck route", () => {
    for (const deck of readdirSync(resolve("src/decks")).filter((f) => f.endsWith(".deck.mdx"))) {
      const slug = deck.replace(/\.deck\.mdx$/, "");
      const html = readFileSync(resolve("dist/decks", slug, "index.html"), "utf8");
      const urls = [...html.matchAll(/background-image:\s*url\('([^']+)'\)/g)].map(([, u]) => u);
      expect(urls.length, `${slug}: no slide artwork at all`).toBeGreaterThan(0);
      for (const url of urls) {
        expect(url.startsWith("/"), `${slug}: ${url} is relative and will 404`).toBe(true);
        const marker = "/src/decks/assets/";
        const at = url.indexOf(marker);
        expect(at, `${slug}: ${url} is not an asset path`).toBeGreaterThanOrEqual(0);
        // Everything before the marker is the deploy base, which pages-base.ts
        // derives from the git origin — so assert the shape, not the value.
        expect(url.slice(at + 1)).toMatch(/^src\/decks\/assets\/[\w.-]+$/);
        expect(
          existsSync(resolve("dist", url.slice(at + 1))),
          `${slug}: ${url} points at nothing in dist/`,
        ).toBe(true);
      }
    }
  });
});

describe("the home page table", () => {
  // The whole argument of the course is four numbers. If the prose drifts from
  // the arithmetic, the argument quietly stops being true and nothing else here
  // would notice.
  const html = readFileSync(resolve("dist/index.html"), "utf8");
  // Astro's scoped styles stamp `data-astro-cid-…` onto every element it owns,
  // so nothing here may assume a bare tag.
  const rows = [...html.matchAll(/<tr[^>]*>\s*<th scope="row"[^>]*>(.*?)<\/th>(.*?)<\/tr>/gs)].map(
    ([, label, rest]) => {
      const cells = [...rest.matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map((m) =>
        m[1].replace(/<[^>]*>/g, "").trim(),
      );
      return { label: label.replace(/<[^>]*>/g, "").trim(), loop: cells[0], attempts: cells[1] };
    },
  );

  const SECONDS = { s: 1, min: 60, week: 604_800 } as const;
  const seconds = (t: string) => {
    const m = t.trim().match(/^(\d+)\s*(s|min|week)s?$/);
    return m ? Number(m[1]) * SECONDS[m[2] as keyof typeof SECONDS] : null;
  };
  const attemptsOf = (r: { attempts: string }) => Number(r.attempts.replace(/[~,]/g, ""));

  it("found the four rows", () => {
    expect(rows.map((r) => r.label)).toEqual([
      "A Souls boss",
      "A ranked match",
      "A weekly quiz",
      "An assignment",
    ]);
  });

  it("derives the short-loop rows from 130 hours ÷ the loop, within rounding", () => {
    for (const r of rows.slice(0, 2)) {
      const [fail, retry] = r.loop.split("→").map((p) => seconds(p));
      expect(fail, `could not parse "${r.loop}"`).not.toBeNull();
      expect(retry, `could not parse "${r.loop}"`).not.toBeNull();
      const exact = (130 * 3600) / (fail! + retry!);
      const printed = attemptsOf(r);
      // Printed with a tilde and rounded to something a reader can hold, so
      // allow 10% — enough for "~4,500" against 4,457, not enough to hide a
      // number that stopped following from the arithmetic.
      expect(Math.abs(printed - exact) / exact, `${r.label}: printed ${printed}, exact ${exact}`).toBeLessThan(0.1);
    }
  });

  // The slider is the same argument made movable, so it must not be able to
  // tell a different story. Its server-rendered default sits on the ranked
  // match, which is also a row of the table; if the two ever disagree, one of
  // them is lying and a reader has no way to tell which.
  it("agrees with the slider's server-rendered default", () => {
    const figure = html.match(/class="loop-figure"[^>]*>([^<]*)</)?.[1]?.trim();
    const ranked = rows.find((r) => r.label === "A ranked match")!;
    expect(figure, "slider default figure not found in dist/index.html").toBeTruthy();
    expect(figure).toBe(ranked.attempts);
  });

  it("ties the slow-loop rows to the course's own shape", () => {
    const quiz = rows.find((r) => r.label === "A weekly quiz")!;
    const assignment = rows.find((r) => r.label === "An assignment")!;
    expect(attemptsOf(quiz), "one quiz per teaching week").toBe(TEACHING_WEEKS);
    expect(attemptsOf(assignment), "one per assessment in this course").toBe(
      of("assessments").length,
    );
  });
});
