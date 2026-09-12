/**
 * Page content. Deliberately lean: this is an ad landing page, so every line
 * either states the offer or removes a reason to hesitate.
 */

/**
 * What a certified school has in place. Codes are the identifiers used in the
 * school's report, not decorative numbering.
 */
export const criteria = [
  {
    code: 'C1',
    title: 'Counsellor on staff',
    line: 'A qualified counsellor with published, defined hours.',
  },
  {
    code: 'C2',
    title: 'Weekly life skill sessions',
    line: 'Well-being sessions conducted by the school.',
  },
  {
    code: 'C3',
    title: 'EPPT for educators',
    line: 'Educator assessment and reports.',
  },
  {
    code: 'C4',
    title: 'EPPT for a specific class',
    line: 'Student assessment and reports for one full class.',
  },
  {
    code: 'C5',
    title: 'Mental health social projects, with proof',
    line: 'Address structural sources of student stress, not only individual support.',
  },
];

/** Three steps, in order. */
export const steps = [
  {
    n: '01',
    title: 'Readiness audit',
    line: 'A 60-minute review of where your campus stands today.',
  },
  {
    n: '02',
    title: 'Assessment',
    line: 'Emotion AI baseline across sampled cohorts, with consent.',
  },
  {
    n: '03',
    title: 'Certification',
    line: 'Close the gaps, get certified, re-audit each year.',
  },
];

/** Objection handling on the briefing page. */
export const gates = [
  {
    title: 'We do not certify every school',
    body: 'We take campuses where leadership can act on what the assessment finds.',
  },
  {
    title: 'The audit is free',
    body: 'No payment at any stage of this process. You leave with findings either way.',
  },
  {
    title: 'You keep the findings',
    body: 'Whether or not you go ahead with certification, the gap map is yours.',
  },
];
