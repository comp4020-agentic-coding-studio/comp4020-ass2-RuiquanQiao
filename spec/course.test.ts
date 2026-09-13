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
import { readFileSync } from "node:fs";
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

  it("ties the slow-loop rows to the course's own shape", () => {
    const quiz = rows.find((r) => r.label === "A weekly quiz")!;
    const assignment = rows.find((r) => r.label === "An assignment")!;
    expect(attemptsOf(quiz), "one quiz per teaching week").toBe(TEACHING_WEEKS);
    expect(attemptsOf(assignment), "one per assessment in this course").toBe(
      of("assessments").length,
    );
  });
});
