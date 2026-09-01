# SLOP3733 — the harness

Rules for working in this repo. Every one of them exists because something went
wrong, or because I decided something and do not want to relitigate it. Where a
rule cost me a build, the cost is written down, because that is the part that
makes it stick.

---

## The course, in one paragraph, so nothing drifts

The length of the failure loop is the variable that matters. The two genres
solve **different halves** of it: the ranked ladder buys absolute focus inside
thirty minutes and, over a semester, offers only encouragement through rank —
it cannot break a large task into small ones. Decomposition lives in the Souls
half, because a hundred hours becomes finishable once it is nine fights that
each end. Weeks 2–5 build the first, 6–9 the second, 10–12 point both at a
subject the student actively dislikes.

If a page cannot be traced back to that paragraph, it does not belong on the
site.

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
`--at-heading`, `--at-bg`, `--at-bg-alt`, `--at-border`, `--at-primary`. The
theme derives all of them from three brand values, and it ships a light/dark
toggle driven by `[data-theme="dark"]` on the root.

A literal colour looks correct in whichever scheme I happened to be in and is
wrong or invisible in the other. I have made exactly this mistake before, in
another project: an inset glow written as `rgba(99,102,241,…)` was the dark
theme's accent hard-coded, so it showed up lavender in all three other themes,
and three more literals were hiding in the same file.

**Every visual change is checked in both schemes before it is committed**, by
setting `document.documentElement.dataset.theme` and re-reading the computed
value — not by looking at a screenshot.

One exception, and it is the only one: `src/assets/images/card.svg` uses literal
hex. It is rasterised for link-preview scrapers, so there is no theme to follow
and no toggle to survive. The values are the Slop palette written out.

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

It is also why week 9 was rewritten. Its first version was "the Souls mechanism,
but coded", which made it a mirror of week 5 and said nothing new. What it is
actually for is the asymmetry above.

---

## Numbers

**Every number on the site is one I can derive on request.** 130 hours is one
6-unit course. The `~4,500` on the home page is 130 h ÷ (90 s + 15 s), rounded
down and marked with a tilde. The card and the home-page table carry the same
four numbers, from the same arithmetic, on purpose.

If a number cannot be derived, it comes off the page. An adjective is better
than a figure I invented.

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

- No exclamation marks. No "unlock", "supercharge", "level up your studies".
  The subject is games; the writing does not have to act like one.
- Prefer the specific failure to the general claim. "I have started chapter one
  three times since March" beats "students struggle with motivation".
- The convenor's failures are on the site because they are the evidence. Keep
  them concrete and keep the numbers in — six desk-hours out of sixteen awake
  is the sentence that does the work, not "I was unproductive".
- Say what was refused, not only what was built. Three pages turn on this and it
  is also how the assessments are marked.

---

## Windows

This machine is Git Bash on Windows, and `astro-theme-university@v0.13.2` cannot
build here without two local patches:

```bash
bash /e/ANU/COMP8020/.tools/patch-theme-win.sh   # after every pnpm install
git config core.hooksPath .githooks              # the prepare script fails silently
```

**Never commit either patch, and never make it a pnpm `patchedDependencies`
entry.** CI is ubuntu-latest, where the upstream code is correct; a patch that
fails to apply during a CI install turns the deploy red, and a red deploy costs
the shipped mark outright. The script and the full diagnosis live in
`/e/ANU/COMP8020/CLAUDE.md`.

The second bug is worth knowing about because it lies: it surfaces as axe
failing `document-title`, `html-has-lang` and `region` on some pages, which
reads like a content problem. It is a path-separator bug that ships every
`.md`/`.mdx` page under `src/pages/` with no layout at all.

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
