// A deck, read as text.
//
// Reveal scales a fixed 1280x720 canvas to whatever it is given, so at 390px
// the deck lands as a 390x219 letterbox with body text at 8.8px. That is not
// a bug in the deck and it is not fixable from here — astromotion hardcodes
// the canvas and explicitly disables Reveal's narrow-viewport scroll view —
// but it does mean the deck is unreadable on the phone half of the marking
// environment. So the lecture page carries a reading version alongside it.
//
// The one rule: it is DERIVED. A hand-written summary of a deck is a second
// copy of the argument that starts drifting the first time either is edited,
// and this repo already has a rule about that. Everything below is parsed
// from the same `.deck.mdx` the slides are built from.
//
// Figure descriptions come from each SVG's `aria-label`, which spec/ already
// requires every asset to carry. That check was written for screen readers;
// it pays for itself twice here.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type SlideKind = "hero" | "impact" | "quote" | "plain";

export interface DeckBlock {
  type: "p" | "quote" | "list";
  html: string;
  items?: string[];
}

export interface DeckSlide {
  n: number;
  kind: SlideKind;
  heading?: string;
  blocks: DeckBlock[];
  /** The `aria-label` of the slide's artwork, if it has any. */
  figure?: string;
}

const DECKS = "src/decks";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The inline subset the decks actually use. Anything else stays literal,
 *  which is the safe direction to fail in. */
const inline = (s: string) =>
  escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*]+)\*/g, "$1<em>$2</em>");

function figureLabel(file: string): string | undefined {
  const svg = readFileSync(resolve(DECKS, "assets", file), "utf8");
  return svg.match(/aria-label="([^"]*)"/)?.[1];
}

export function readDeck(slug: string): { title: string; slides: DeckSlide[] } {
  const src = readFileSync(resolve(DECKS, `${slug}.deck.mdx`), "utf8").replace(/\r\n/g, "\n");
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  const title = fm?.[1].match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? slug;
  const body = fm ? src.slice(fm[0].length) : src;

  const slides: DeckSlide[] = [];
  for (const raw of body.split(/\n---\n/)) {
    // Presenter notes and authoring comments are not on the slide, so they
    // are not in the reading version either.
    const chunk = raw.replace(/```(?:notes|comment)\n[\s\S]*?\n```/g, "");

    let kind: SlideKind = "plain";
    const cls = chunk.match(/\{\/\*\s*_class:\s*(\w+)\s*\*\/\}/)?.[1];
    if (cls === "hero" || cls === "impact" || cls === "quote") kind = cls;

    const bg = chunk.match(/!\[bg[^\]]*\]\(\.\/assets\/([^)]+)\)/);
    const figure = bg ? figureLabel(bg[1]) : undefined;

    const lines = chunk
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/!\[bg[^\]]*\]\([^)]*\)/g, "")
      .split("\n");

    let heading: string | undefined;
    const blocks: DeckBlock[] = [];
    let para: string[] = [];
    let list: string[] = [];

    const flush = () => {
      if (list.length) {
        blocks.push({ type: "list", html: "", items: list.map(inline) });
        list = [];
      }
      if (para.length) {
        const text = para.join(" ").trim();
        if (text.startsWith("> ")) blocks.push({ type: "quote", html: inline(text.slice(2)) });
        else if (text) blocks.push({ type: "p", html: inline(text) });
        para = [];
      }
    };

    for (const line of lines) {
      const t = line.trim();
      if (!t) {
        flush();
        continue;
      }
      const h = t.match(/^#{1,6}\s+(.*)$/);
      if (h) {
        flush();
        // A hero slide's `# title` and `## subtitle` are one unit; keep the
        // first as the heading and let the second become a line under it.
        if (heading === undefined) heading = h[1];
        else blocks.push({ type: "p", html: inline(h[1]) });
        continue;
      }
      const li = t.match(/^-\s+(.*)$/);
      if (li) {
        if (para.length) flush();
        list.push(li[1]);
        continue;
      }
      if (list.length) flush();
      para.push(t);
    }
    flush();

    if (heading || blocks.length || figure) {
      slides.push({ n: slides.length + 1, kind, heading, blocks, figure });
    }
  }

  return { title, slides };
}
