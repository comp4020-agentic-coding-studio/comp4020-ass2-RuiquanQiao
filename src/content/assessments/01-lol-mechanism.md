---
title: "Assessment 1: a short-loop mechanism"
description:
  Build something that gives a thirty-minute sitting the structure a ranked
  match has, run it for a fortnight, and demonstrate it live
week: 5
due: 2027-03-22T14:00:00+11:00
weight: 25
marking:
  mode: holistic
  description:
    Marked live from the demonstration, on whether the mechanism actually
    changed a sitting and whether it would survive a bad week. A running paper
    system beats an elegant unfinished program. Ambition is not scored; use is.
spec:
  - a sitting run under your mechanism has a win condition written before it started
  - you have at least ten real sittings logged, including losses
  - you can state one thing you decided against building, and why
related:
  - lectures/week-04
  - lectures/week-05
  - 02-souls-mechanism
---

> Build the thing that stops the second half of a thirty-minute sitting from
> disappearing, and show us it working.

Weeks 2 to 4 took a ranked match apart: three clocks, a win condition per
contest, a rating that survives between them. This asks you to put a small
version of that under your own studying.

## Two routes, equally marked

**Simple** — paper, index cards, a notebook, a wall. Nothing on a screen.

**Coded** — a script, a spreadsheet with real logic in it, a small app,
something vibe-coded in an afternoon. Whatever you can drive.

Neither is the harder route and neither scores higher. A paper system in daily
use will mark better than a half-finished program every time, and the reverse
is also true. Pick the one you will actually run, and note that you may choose
differently for [Assessment 2](/assessments/02-souls-mechanism/) — several
people should.

## What it has to do

At minimum, the four parts from week 4:

- a **win condition** for the sitting, written before it starts and checkable
  by someone who is not you
- a **short recurring interval** that forces a one-word decision
- one **scheduled moment** inside the sitting, set in advance
- a **verdict** — W or L — that you record at the end, judged against the win
  condition rather than against how it felt

If you build the coded route, store the verdicts and derive everything else. A
stored rating goes stale; a rating recomputed from an ordered list of verdicts
means re-judging a sitting from three weeks ago correctly redraws the history.

## What you submit

Nothing, in advance. This is demonstrated live in the second half of the week 5
lecture, in about six minutes:

1. Show the mechanism. Run one cycle of it in front of us, at whatever speed is
   honest.
2. Show the log — at least ten real sittings, and if none of them is an L we
   will want to talk about your win conditions.
3. Name one thing you decided **not** to build, and defend the decision.

That third one is scored as heavily as the first two. Refusing a feature is a
design act, and "I didn't have time" is a different answer from "I decided
against it". The reference implementation we read in week 5 refuses three
things, and the refusals are the best part of it.

## What we are not looking for

Elaborateness. Screenshots of a dashboard. A mechanism that requires you to be
in a good mood to operate. If it looks like something you would be embarrassed
to be caught doing, it will not survive contact with your real life and it will
not mark well here.
