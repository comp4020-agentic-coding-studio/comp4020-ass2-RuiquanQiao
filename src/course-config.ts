import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    description: z.string().trim().min(80).max(300),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
//
// Level 3, not 1. There are no prerequisites and the reading is light, but the
// course asks you to play two demanding games attentively, ship a working
// mechanism, and then teach yourself a quarter of a subject you dislike in
// three weeks. That is third-year work in everything except its content.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP3733",
  title: "Turning Every Course You Take Into a Game",
  session: "Semester 1",
  year: 2027,
  level: 3,
  startDate: "2027-02-22",
  endDate: "2027-05-28",
  description:
    "A course is 130 hours. So is a Souls game, and nobody finishes one of " +
    "those on willpower. We take both reward structures apart — the ranked " +
    "ladder and the two-minute death loop — build one that fits your own " +
    "week, then prove it on a subject you cannot stand.",
  tags: ["game mechanics", "study design", "motivation"],
}) satisfies CourseMetaInput;
