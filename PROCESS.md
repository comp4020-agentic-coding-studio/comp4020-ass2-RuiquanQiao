# Process

## What I decided a good course is

One idea, held for twelve weeks, where failing is cheap and frequent enough that
a student keeps going. Three positions follow: **every week owes an argument of
its own**; **assessment measures output, not hours logged**; and **a mechanism
that punishes a bad week gets abandoned in the first bad week**, which is the
week it was for.

That is also the course's subject, which made the build reflexive: a course
arguing for short feedback loops could not honestly be built on a long one.

## What I encoded

So the first thing I built was the loop, not the site. `pnpm check` did not run
on this machine at all — two Windows-only theme bugs, one of which surfaced as
axe failing `document-title` and read exactly like markup I got wrong. Two
explanations tested and thrown away before the real one: a path separator that
shipped every `.mdx` page with no layout. An afternoon, no site to show for it.

Then the positions themselves went into `CLAUDE.md` and `spec/`, because a
position I only hold in my head is one I will trade away at midnight:

- *Every week owes an argument* became a swap test in the harness — could two
  week titles trade places without either page becoming wrong? — and then an
  assertion that no two lecture descriptions share more than half their words
  ([`8946cd7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/8946cd7)).
  It is also why there are two Labs rather than twelve studios: twelve would
  have been twelve pages of one paragraph
  ([`8ce8d70`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/8ce8d70)).
- *Every number must be derivable* became assertions tying the home page's
  figures to the course record: the quiz row must equal the teaching weeks, the
  assignment row the assessments. Writing them caught my table mixing two
  calculations under one heading.
- *Colour must survive both schemes* became a rule after the table header shipped
  at **2.42:1**, which axe passes because it cannot resolve `oklch()` inside
  `light-dark()`
  ([`5baa3ec`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/5baa3ec)).

The tests are checked by breaking them: weight 50→45 and a Lab moved a week, two
red, the right two. A check I have never seen fail is one I have no reason to
believe.

## What I left unencoded, deliberately

Whether a week is *interesting*. The overlap assertion catches a duplicated week
that was lightly reworded; it cannot catch one that is merely dull, and I did
not try to make it. Same for voice. Those stay human judgements, because a test
that pretended otherwise would let me stop looking.

## What directing this course changed

The corrections that mattered were not technical, and both were the same
mistake.

I had the final assessment aimed at a subject the student *dislikes*; the course
is about one they **stalled on and still need**
([`fdf9037`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/fdf9037)).
And I had written the Souls half as planning — a hundred hours resolved into
"nine fights", a figure I had simply invented — when the whole point is that
**nobody decomposes a boss they have never fought**. Ninety seconds holds one lesson, so the next attempt has one new
goal, and the fight comes apart with no plan ever written. Decomposition is an
output of the attempt cycle. That version had reached eight files
([`7613555`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/7613555)).

Both times I took the tidier, more symmetrical formulation over the blunter
useful one — *games are hard too*; *break the mountain into nine pieces* — and
both survived because they sounded like something. That is the failure mode I
watch for now. Both were visible in an opening paragraph and nowhere else, which
is an argument for reading rendered pages rather than diffs.
