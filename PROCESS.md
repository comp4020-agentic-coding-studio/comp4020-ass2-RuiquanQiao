# Process

A course arguing that short feedback loops beat willpower cannot honestly be
built on a long one. That constraint decided how I worked, and it is the only
through-line here worth reporting.

So the first thing I built was the loop, not the site. `pnpm check` runs a
typecheck, the build, an axe pass over every page, a link check, the deck
compiler and the spec suite — and on this machine it did not run at all. Two
bugs in the theme, both Windows-only, both invisible on the Linux runner. The
second one lies about itself: it surfaces as axe failing `document-title` and
`html-has-lang` on some pages, which reads exactly like markup I got wrong. I
tested two explanations and threw both away — axe caching a torn-down document
across worker reuse, then `dom.window.close()` — before one probe killed them
by showing the pass counts split 30/30 against 6/9 by *page* rather than by scan
order. The cause was a path separator: the theme tests for `\pages\`, Vite hands
it ids with forward slashes, and every `.mdx` page under `src/pages/` was
shipping with no layout at all. `dist/policies/index.html` was 513 bytes against
21,695 for the `.astro`-authored one.

Most of an afternoon, and no site to show for it. I did it anyway, because the
alternative was writing twenty-eight pages blind — CI does not run while the
repo is private. The fix deliberately lives outside the repo, in a script on
this machine: CI is Linux, where the upstream code is correct, and a dependency
patch that fails to apply during a CI install turns the deploy red, which costs
the shipped mark outright.

That bought a fifteen-second verdict, and it immediately caught things I would
not have. Eleven dangling refs in one build, because a bare `related:` slug
resolves inside its own collection, so `week-04` written under `sessions/`
means `sessions/week-04`
([`8ce8d70`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/8ce8d70)).
One empty table header in the deck failed the entire build on a single minor
violation
([`c7ba2cb`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/c7ba2cb)).
Both are the course's own argument happening to me: the failure was small, it
arrived at once, and I only had to hold one lesson at a time.

What I would not accept back was filler. My first outline gave every week a
studio session — which is what a course site is supposed to look like, and
would have been twelve pages of the same paragraph. "Twelve interchangeable
weeks" is the failure this brief names, so there are two Labs, in weeks 3 and 7,
because those are the only two weeks where playing *is* the work
([`8ce8d70`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/8ce8d70)).

Week 9 was the real revision. It began as "the Souls mechanism, but coded" — a
mirror of week 5 that said nothing new. Writing it, I found the argument the
course had been missing: the ladder buys absolute focus inside thirty minutes
and over a semester offers only encouragement through rank; it cannot break a
large task into small ones. Decomposition lives in the Souls half. That
asymmetry is now what weeks 1 and 12 point at.

The last decision was refusing a fix. The link-preview card is authored as SVG,
Astro's rasterisation is off, and the switch is one line in `astro.config.ts` —
a file the brief fixes. I rasterised it myself with sharp and left the boundary
alone. Slower, and the same judgement the assessments ask students for: refusing
something is a design act, and "I didn't have time" is a different answer from
"I decided against it".
