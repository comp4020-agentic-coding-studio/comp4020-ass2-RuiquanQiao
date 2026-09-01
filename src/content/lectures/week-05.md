---
title: A ladder you can actually see
description:
  Why a timer app has never changed anyone's semester, what a coded mechanism
  buys that paper cannot, and the refusals that make a ladder liveable
week: 5
date: 2027-03-22T14:00:00+11:00
teachers:
  - priya-vance
  - kelsen-mbatha
spec:
  - you can say what a rating curve shows you that a stack of paper sheets cannot
  - your implementation stores verdicts, not derived scores, and recomputes the rest
  - you can name at least one feature you deliberately refused, and defend the refusal
related:
  - week-04
  - assessments/01-lol-mechanism
  - week-09
---

The second half of today is the first assessment: you show us the thing, running.

## Why not just use a timer app

Because the entire category measures input. A pomodoro app records that you sat
there for twenty-five minutes and has no opinion about whether anything came out
of it, and after nine months of honest logging the only thing I could tell you
about myself was a duration.

The verdict — *did this sitting achieve the thing I said it would* — is the only
field in the whole system that touches output, and no timer asks for it.

## What code buys you

Paper is better than code for the sitting itself. It is faster, it never
crashes, and nothing about a five-minute tick needs a database.

Code buys exactly one thing, and it is worth the trouble: **a curve**. Two
hundred verdicts is a shape. It tells you that your Tuesdays are real and your
Thursdays are theatre; that the run you remember as a disaster was four losses
inside a month of gains. You cannot hold that in your head and you cannot see it
in a shoebox of paper.

So the rule for what to build: store the verdicts, derive everything else. If
the rating is a stored number you will eventually have a stale one; if it is
recomputed from an ordered list of wins and losses, then re-judging a sitting
from six weeks ago correctly redraws the whole history.

## The worked example

We will read one implementation together. It is faithful to a real ranked system
in the parts that matter — ten tiers, a hundred points per division, placements
that can only gain, a hidden rating whose lead or lag drives how much a single
result swings, drops gated behind a game taken at zero, and protection for a few
games after a promotion.

It has one house rule, which exists to answer the objection *twenty minutes
isn't enough to do anything*. Length picks the mode. Under ten minutes is a
remake: somebody went offline, the game never counted, it touches nothing.
Ten to twenty-five is the casual mode, at half the swing. Twenty-five and up is
ranked, full swing. Suddenly a twenty-minute gap in your day is a thing you can
do something with.

## The refusals matter more than the features

Three things were deliberately left out, and this is the part to copy.

**No decay.** Real ladders take points off you for not playing. This one never
does. A mechanism whose job is to survive your bad weeks cannot have a rule that
punishes you for having one, on its own initiative, while you are not even
looking at it.

**No win-streak bonus.** Undocumented in the original and tier-dependent. It
would add noise to a curve whose whole job is to be legible.

**Nothing pops up when you stop.** No summary card, no score screen, no
in-session checklist panel. Those were built and then cut, because they made
studying feel like a performance of studying.

Write your refusals down. In the demo I will ask you for one, and "I didn't have
time" is a different answer from "I decided against it".

## Assessment 1 demos

Second half of the session. Paper or coded, both are fully marked. Bring it in
whatever state it is actually in.
