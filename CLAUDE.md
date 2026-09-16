# SLOP3733 — the harness

Rules for working in this repo. Every one of them exists because something went
wrong, or because I decided something and do not want to relitigate it. Where a
rule cost me a build, the cost is written down, because that is the part that
makes it stick.

---

## The claims, so nothing drifts

Every page has to trace back to one of these. If it cannot, it does not belong
on the site. Each has been got wrong at least once, and the wrong version is
written next to it, because the wrong versions are plausible — that is why they
survived.

**1. The premise is an asymmetry, not a difficulty.**
Putting 130 hours into a game is *easy*. Nobody plans it, nobody grits their
teeth, you queue again. Putting the same 130 hours into a course is miserable.
Same hours, same person — the only difference is how fast the activity pays you
back, which is a design property and not a fact about anyone's character. So it
can be built.
> ✗ *"A course is 130 hours, so is a Souls game, and nobody finishes one of
> those on willpower."* Argues that games are hard too, which is beside the
> point and blunts the only comparison the site has.

**2. The MOBA half is for using every minute.**
It answers the specific complaint: you sit down for half an hour, or a morning,
or a whole day; it is painful, you cannot get in, and nothing advances. A MOBA
never allows it — waves every thirty seconds, a known price for leaving lane,
objectives on a clock everyone can see. **There is never a minute in which the
right thing to do is nothing.** Weeks 2–5 build that over your own sitting.

**3. The Souls half is for getting started, and it is NOT planning.**
Nobody decomposes a boss they have never fought. You die in ninety seconds;
ninety seconds has room for exactly **one** observation, so the next attempt has
exactly one new goal. Twenty attempts later the fight is dead and no plan was
ever written. **Decomposition is an output of the attempt cycle, not an input
to it** — which is precisely why it works on a subject too hard to start, where
any plan written on day one is a guess off the table of contents.
> ✗ *"A hundred hours becomes finishable once it is nine fights that each end."*
> Top-down — and **"nine" was invented**, which is the same rule broken twice in
> one sentence (see Numbers, below). The real counts make the opposite case:
> Sekiro has 13 bosses and 29 mini-bosses, Dark Souls III 19 or 25, Elden Ring
> 13 required and about 238 encounters, and no two sources agree. If the
> designers cannot enumerate their own bosses, nobody is enumerating a subject's
> in advance. This version reached the syllabus commit, week 8, week 9, both
> Souls assessments and a staff page before it was caught.

**4. The target is a stall, not an aversion.**
Weeks 10–12 point both mechanisms at the course you **started, stopped,
restarted and stopped again, and still believe you need**. People do not stall
on things they want no part of; wanting it was never the missing ingredient.
> ✗ *"a subject you cannot stand."* Cheap target: clearing thirty hours of dull
> material only shows the mechanism makes boredom tolerable.

**How to check me against this, cheaply.** Both framing errors above were
visible in an *opening paragraph* and nowhere else. In ascending cost: read the
twelve lecture descriptions as one block; read the first paragraph of every
content page; read the site. Nothing below can catch "this paragraph misses the
point" — that stays a human judgement, and these claims exist to make the
judgement fast rather than to automate it.

**The tell.** When a sentence sounds cleverer than it is useful, it is probably
drift. The right versions of all four claims above are blunter than the wrong
ones.

---

## What I do not get to change

Fixed by the brief, and the `README.md` marks the boundary: the Slop identity
(`slopBranding` and the three colour tokens in `astro-theme-slop/slop.css`), the
four collection keys, `astro.config.ts`, and the generated API.

**When a fix appears to need one of them, it doesn't — find the other way.**
Worked example: the link-preview card is authored as SVG, and Astro's SVG
rasterisation is off. The one-line fix is `image.dangerouslyProcessSVG: true` in
`astro.config.ts`. Instead the PNG is generated ahead of time with sharp and the
SVG stays in the repo as its source, with the regeneration command in a comment
next to `socialImage`. Slower, and it leaves the boundary intact.

---

## Colour

**Never write a literal colour in a component or a page.** Use the theme's
semantic tokens — `--at-text`, `--at-text-secondary`, `--at-text-muted`,
`--at-bg`, `--at-bg-alt`, `--at-border`. The theme derives all of them from
three brand values, and it ships a light/dark toggle driven by
`[data-theme="dark"]` on the root.

**`--at-primary` and `--at-heading` are the same lockup gold, and it measures
3.44:1 on the light surface.** That is display-type-only: fine for an `h1` or
`h2`, below the 4.5:1 floor for anything at body size, and 18px bold does *not*
reach the 18.66px that would let it use the 3:1 large-text floor. I have reached
for it as body-sized text **four** times — the table header (2.42:1), the
attempts column, the slider label (3.16:1), and the reading version's slide
headings (3.44:1). For coloured text below display size, derive:
`light-dark(oklch(from var(--at-primary) 42% c h), oklch(from
var(--at-primary) 84% c h))`.

**The fourth one wrote no colour at all**, which is why the rule above is not
sufficient on its own. `DeckReading` used `h3` for a list-item heading, the
theme colours every heading with the brand gold, and 19.8px at weight 600 misses
the 18.66px bold threshold by a hair — so it owed the full 4.5:1 and delivered
3.44:1. **So: a small heading is a colour decision even when you never touch
`color`.** Any `h3`–`h6` below ~24px needs the derived arm set explicitly.

A literal colour looks correct in whichever scheme I happened to be in and is
wrong or invisible in the other. I have made exactly this mistake before, in
another project: an inset glow written as `rgba(99,102,241,…)` was the dark
theme's accent hard-coded, so it showed up lavender in all three other themes,
and three more literals were hiding in the same file.

**Every visual change is checked in both schemes before it is committed** — and
not by looking at a screenshot, which renders at the pane's physical size here
and lies about everything geometric.

Two things about *how* to check, both learned by getting a passing result I
should not have trusted:

- **Setting `document.documentElement.dataset.theme` does not re-resolve these
  tokens.** `oklch(from …)` inside `light-dark()` stays on its old value, so
  both schemes report identical numbers and everything looks fine. Click the
  theme toggle in the footer and then **reload**. You know it worked when the
  page background reads `rgb(7,5,4)` instead of the cream.
- **Composite the whole ancestor background chain** before computing a ratio.
  Walking up for the first non-transparent `background-color` and falling back
  to the page is not enough: the table header has a gold fill of its own, and
  that probe reported 8.92:1 for a pairing that was actually 2.42:1. Detect
  opacity by painting a colour over white and then over black and comparing.

**axe passing is not a contrast check.** It cannot resolve `oklch()` inside
`light-dark()`, so it files those pairs as incomplete. It passed 2.42:1.

Two exceptions, and they are the only ones: `src/assets/images/card.svg`, which
is rasterised for link-preview scrapers, and everything in `src/decks/assets/`.
Both are loaded as images rather than as markup, so they are isolated documents
with no access to the page's custom properties and no toggle to survive. Deck
pages are dark-only in any case. The values are the Slop palette written out.

---

## Deck artwork

Every slide background, split panel and figure is authored SVG in
`src/decks/assets/`, referenced with astromotion's `![bg]` syntax. Three things
about it, each of which cost something.

**An SVG behind `background-image` fails silently.** No console error, no
network error, no layout shift — the browser reports a broken image and paints
nothing, which is indistinguishable from a slide that was designed plain. The
only way to see it is to open the file as a page and read the parser error.

**XML forbids a double hyphen inside a comment, and this repo produces them two
ways.** The house em-dash style is `---`, and every design token is called
`--at-something`, so a comment explaining which token a literal hex stands in
for is enough to break the file. It has happened three times: once writing the
colour rationale, twice using the em-dash. `spec/course.test.ts` now checks
comment hygiene, tag balance, bare ampersands, `viewBox` and `aria-label` on
every asset, plus that each one is referenced by a deck, reaches `dist/`, and
comes out with a base-absolute URL.

**Everything I draw comes out too dark.** All eight assets measured a mean
luminance of 14–24 out of 255 on the first pass, and the fighting-game panel
had only **3.8%** of its pixels above a visible threshold — beside body copy it
read as a black bar. Targets that worked: a `bg-*` full-bleed sits under a
scrim and white text, so 8–12% lit is right; a `split-*` panel is looked *at*,
and needs mean ≥ 35 and ≥ 15% lit. Measure it rather than judging by eye on a
bright monitor — paint the SVG into a canvas and read the pixels back.

**Diagrams, not screenshots.** A frame of a boss arena shows nothing about the
loop, and shipping FromSoftware or Riot stills on a public university site is a
licensing problem for a marker to notice. Every figure here is drawn to make one
claim legible — the loop comparison is on a log axis because ninety seconds and
three weeks are four and a half orders of magnitude apart and no linear axis can
hold both.

---

## Content refs

**Cross-collection `related:` entries must carry the collection prefix.** A bare
slug resolves inside the *same* collection, so `related: week-04` written in
`src/content/sessions/` means `sessions/week-04`, which does not exist.

This cost a build: 11 dangling refs at once, the whole `astro:build:done` hook
failing. It is the correct behaviour and I want to keep it — a dangling link
caught in four minutes is worth more than a tidy build — but the rule is: from
`lectures/`, a bare sibling slug is fine; from anywhere else, write
`lectures/week-04` in full.

---

## The twelve weeks must disagree with each other

The brief names "twelve interchangeable weeks" as a failure, and it is the one I
am most likely to commit, because filling twelve slots is easy and making each
one necessary is not.

**Test before committing a week:** could its title be swapped with another
week's without either page becoming wrong? If yes, one of them has no argument
of its own and needs rewriting or deleting.

This is why there are only **two Labs** rather than twelve. I drafted a weekly
studio and cut it: twelve studios would have been twelve pages of the same
paragraph. Weeks 3 and 7 are Labs because those are the two weeks where playing
*is* the work.

It is also why week 9 has been rewritten twice. Its first version was "the Souls
mechanism, but coded", a mirror of week 5 that said nothing new. Its second
version had claim 3 backwards — it taught decomposition as something you author
before you attack. What it is actually for is the division of labour: the ladder
buys the inside of thirty minutes and offers nothing but encouragement past it,
and getting a grip on something too hard to start is the other half.

---

## Numbers

**Every number on the site is one I can derive or cite on request.** 130 hours
is one 6-unit course. The `~4,500` on the home page is 130 h ÷ (90 s + 15 s),
rounded and marked with a tilde. The card and the home-page table carry the same
four numbers, from the same arithmetic, on purpose.

**I have broken this rule once, so it is not theoretical.** "Nine fights" was a
number I made up because a sentence needed one, and it then sat in six files for
a fortnight sounding authoritative. The counts it was standing in for are real,
looked up, and disagree with each other — which turned out to be the more
interesting fact and is now in week 8.

If a number cannot be derived or sourced, it comes off the page. **An adjective
is better than a figure I invented**, and "a handful" is an honest word.

---

## Dates

Twelve teaching weeks, Monday lectures, 2027-02-22 to 2027-05-28, with a
two-week break after week 6 (5 and 12 April).

**Lecture times are 14:00 local and Labs 13:00, and that matters.**
`spec/data-integrity.test.ts` takes the first ten characters of the serialised
date, so anything before about 11:00 with an AEDT offset serialises to the
previous day in UTC and the check reads the wrong date. Daylight saving ends
2027-04-04: weeks 1–6 are `+11:00`, weeks 7–12 are `+10:00`.

---

## Voice

This is a course site, read by someone deciding whether to enrol. Not a pitch.

**Explain, in order, like you are talking to one person.** Each sentence should
follow from the one before it, and a reader should never have to stop and work
out what a line meant. This is the rule I break most often and it has its own
failure mode, described under The tell above: a compressed, quotable line that
sounds like an insight and delivers less than the plain sentence it replaced.
The week 6 deck shipped with a slide reading only **"The cruelty is the
disguise"** — three words, nothing a student can act on — where the honest line
is "the punishing game has the shortest loop of the three". Titles too:
week 12 was called **"Settlement"**, which is a word, not a description of a
week.

When a heading or a slide needs a second read, it is wrong. Rewrite it as the
sentence you would say out loud.

- No exclamation marks. No "unlock", "supercharge", "level up your studies".
  The subject is games; the writing does not have to act like one.
- **Watch the em-dash habit.** Two `—` clauses stacked in one sentence is how a
  description stops being readable; nine of the twelve lecture descriptions had
  it. Most of them wanted a full stop and a second sentence.
- Prefer the specific failure to the general claim. "I have started chapter one
  three times since March" beats "students struggle with motivation".
- The convenor's failures are on the site because they are the evidence. Keep
  them concrete and keep the numbers in — six desk-hours out of sixteen awake
  is the sentence that does the work, not "I was unproductive".
- Say what was refused, not only what was built. Three pages turn on this and it
  is also how the assessments are marked.

---

## Windows

This machine is Git Bash on Windows, and neither
`astro-theme-university@v0.13.2` nor `astromotion@v0.23.0` builds here
correctly without local patches:

```bash
bash /e/ANU/COMP8020/.tools/patch-theme-win.sh   # after every pnpm install
git config core.hooksPath .githooks              # the prepare script fails silently
```

**Never commit either patch, and never make it a pnpm `patchedDependencies`
entry.** CI is ubuntu-latest, where the upstream code is correct; a patch that
fails to apply during a CI install turns the deploy red, and a red deploy costs
the shipped mark outright. The script and the full diagnosis live in
`/e/ANU/COMP8020/CLAUDE.md`.

Two of the three are worth knowing individually, because neither says what it
is.

The theme's second bug **lies**: it surfaces as axe failing `document-title`,
`html-has-lang` and `region` on some pages, which reads like a content problem.
It is a path-separator bug that ships every `.md`/`.mdx` page under
`src/pages/` with no layout at all.

astromotion's is the same family in the opposite direction, and it **only
breaks locally**. `remark-deck-bg.ts` makes `![bg](./assets/x.svg)` into a
base-absolute URL by probing for `/src/` in a path `node:path.resolve` has
already normalised to backslashes, so on Windows the probe is always `-1`, the
rewrite is skipped, and the browser resolves `./assets/x.svg` against
`/decks/<slug>/` and 404s. ubuntu CI gets it right. **So the local build is the
one that lies here** — every piece of slide artwork is invisible on this machine
and correct in production, which is the worst way round for authoring it.
`spec/course.test.ts` asserts the rewritten shape so the patch cannot silently
fall off.

---

## Before pushing

```bash
pnpm check            # typecheck, build, a11y, links, deck, spec
pnpm check:evidence   # the submission gate
```

`check:evidence` for an Assignment 2 repo additionally requires that
`git grep STARTER_CONTENT -- src` is empty and that none of the four starter
images survives unchanged. All four are handled: two portraits deleted with the
placeholder staff, `hero-home.avif` deleted for a deliberately image-free home
page, and `card.png` regenerated from my own SVG.
