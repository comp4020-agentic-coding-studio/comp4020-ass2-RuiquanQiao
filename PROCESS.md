# Process

## What I decided a good course is

One idea, held for twelve weeks, where failing is cheap and frequent enough that
a student keeps going. Three things follow, and they are the positions the whole
site is built on: **every week owes an argument of its own**; **assessment
should measure output, not hours logged**; and **a mechanism that punishes a bad
week will be abandoned in the first bad week**, which is the week it was for.

That is also the course's subject, which made the build reflexive: a course
arguing for short feedback loops could not honestly be built on a long one.

## What I encoded

So the first thing I built was the loop, not the site. `pnpm check` did not run
on this machine at all — two Windows-only theme bugs, one surfacing as axe
failing `document-title` and reading exactly like markup I got wrong. I tested
two explanations and threw both away before finding a path separator that
shipped every `.mdx` page with no layout. An afternoon, and no site to show for
it. The fix lives outside the repo on purpose: CI is Linux, and a dependency
patch that fails to apply there turns the deploy red.

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
  figures to the course record — the quiz row must equal the number of teaching
  weeks, the assignment row the number of assessments. Writing them caught my
  own table mixing two different calculations under one heading.
- *Colour must survive both schemes* became a rule after the table header shipped
  at **2.42:1**, which axe passes because it cannot resolve `oklch()` inside
  `light-dark()`
  ([`5baa3ec`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/5baa3ec)).

The tests are checked by breaking them: weight 50→45 and a Lab moved a week, two
red, the right two. A check I have never seen fail is one I have no reason to
believe.

## What I left unencoded, deliberately

Whether a week is *interesting*. The overlap assertion catches a duplicated week
that was lightly reworded; it cannot catch a week that is merely dull, and I did
not try to make it. Same for voice: `CLAUDE.md` bans exclamation marks and
"level up your studies", which is a floor, not quality. Those stay human
judgements because a test that pretended otherwise would let me stop looking.

## What directing this course changed

The correction that mattered was not technical. I had built the final assessment
around a subject the student *dislikes*, and Ruiquan's own framing was a subject
they **stalled on and still need**
([`fdf9037`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-RuiquanQiao/commit/fdf9037)).
Aversion is a cheap target: clearing thirty hours of dull material only shows the
mechanism makes boredom tolerable. It also had the psychology backwards — people
do not stall on things they want no part of. Six files had inherited the wrong
premise. The course's own argument is what exposed it, which is the strongest
evidence I have that the argument is load-bearing rather than decorative.
