import { defineSiteConfig } from "astro-theme-university/types";
import { slopBranding } from "astro-theme-slop";
import { courseMeta } from "./course-config";

// The underlying collection and URL remain `sessions`; these labels are the
// language students see.
//
// There are only two of these all semester, in weeks 3 and 7, and both are
// spent playing. Calling them Labs is not a joke: you are gathering first-hand
// observations of a mechanism you will be asked to rebuild, and a week of
// attentive play is the only way to get them.
export const sessionLabels = {
  singular: "Lab",
  plural: "Labs",
} as const;

export const graphCollections = ["sessions", "assessments", "lectures", "people"];

export const courseApiCollections = [
  ...graphCollections.map((key) => ({ key })),
  { key: "policies", dir: "pages/policies" },
];

export const siteConfig = defineSiteConfig({
  ...slopBranding,
  name: "Slop University",

  links: [
    { text: "Lectures", href: "/lectures/" },
    { text: sessionLabels.plural, href: "/sessions/" },
    { text: "Assessment", href: "/assessments/" },
    { text: "People", href: "/people/" },
    { text: "Policies", href: "/policies/" },
  ],

  licence: "CC-BY-NC-SA-4.0",
  // The card is authored as `card.svg` beside this PNG — it is four numbers and
  // two lines of type, so a vector source is the honest one and it keeps the
  // card from drifting out of step with the table on the home page, which is
  // the same four numbers.
  //
  // The PNG is generated from it, not drawn separately, because Astro's SVG
  // rasterisation is off and the only switch for it (`image.dangerouslyProcessSVG`)
  // lives in astro.config.ts, which this deliverable does not get to change.
  // Regenerate after editing the SVG:
  //   node -e "import('sharp').then(async ({default:s})=>{await s(require('fs').readFileSync('src/assets/images/card.svg'),{density:144}).resize(1200,630,{fit:'fill'}).png({compressionLevel:9}).toFile('src/assets/images/card.png')})"
  socialImage: "/src/assets/images/card.png",
  socialImageAlt:
    `${courseMeta.code}: ${courseMeta.title}. Correction opportunities bought ` +
    `by 130 hours — about 4,500 at a Souls boss's loop length, about 250 at a ` +
    `ranked match's, 12 for a weekly quiz, 3 for an assignment.`,
});
