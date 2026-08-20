/**
 * Page content. Deliberately lean: this is an ad landing page, so every line
 * either states the offer or removes a reason to hesitate.
 */

/** What the assessment scores. Codes are the identifiers used in the report. */
export const domains = [
  { code: 'D1', title: 'Student emotional climate', line: 'Measured, not estimated.' },
  { code: 'D2', title: 'Teacher capacity', line: 'Can your staff respond to what they notice?' },
  { code: 'D3', title: 'Help-seeking pathways', line: 'What happens when a child asks for help.' },
  { code: 'D4', title: 'Parent alignment', line: 'How much pressure starts at home.' },
  { code: 'D5', title: 'Policy vs practice', line: 'The gap between the file and the classroom.' },
];

/** Three steps, in order. */
export const steps = [
  { n: '01', title: 'Readiness audit', line: 'A 60-minute review of where your campus stands today.' },
  { n: '02', title: 'Assessment', line: 'Emotion AI baseline across sampled cohorts, with consent.' },
  { n: '03', title: 'Certification', line: 'Close the gaps, get certified, re-audit each year.' },
];

/** Objection handling on the briefing page. */
export const gates = [
  {
    title: 'We do not certify every school',
    body: 'We take campuses where leadership can act on what the assessment finds.',
  },
  {
    title: 'Not the right fit? Refunded',
    body: 'If we conclude this is not right for your campus, your fee is returned immediately.',
  },
  {
    title: 'Adjusted against certification',
    body: 'The audit fee comes off your certification cost if you go ahead.',
  },
];
