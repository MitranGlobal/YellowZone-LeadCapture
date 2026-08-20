/**
 * Page content. Kept out of components so the team can edit words
 * without touching layout code.
 */

export const marketStats = [
  { figure: '127M', label: 'students in Classes 6–12 in India' },
  { figure: '1.47M', label: 'schools across the country' },
  { figure: '10.7M', label: 'teachers in government and private schools' },
  { figure: 'Zero', label: 'national standard for emotional wellbeing' },
];

/** The ledger contrast: what a school can already prove vs what it cannot. */
export const ledger = {
  tracked: [
    'Attendance, daily and term-wise',
    'Marks, unit tests and board results',
    'Fee compliance and enrolment',
    'Infrastructure and safety audits',
    'Affiliation and inspection records',
    'Teacher qualification records',
  ],
  untracked: [
    'How much exam pressure a class is actually carrying',
    'Whether a student in distress knows who to go to',
    'The emotional load your teachers absorb each week',
    'Which cohorts are drifting before attendance drops',
    'Whether your wellbeing policy changes anything in a classroom',
    'What parents are seeing at home that school never hears',
  ],
};

/**
 * Five assessment domains. Codes are rubric identifiers used in the
 * school's report, not decorative numbering.
 */
export const domains = [
  {
    code: 'D1',
    title: 'Student Emotional Climate',
    summary:
      'Baseline emotional state across sampled cohorts, measured with Emotion AI rather than self-report alone.',
    evidence: [
      'Cohort-level emotion mapping',
      'Pressure and stress indicators by grade',
      'Change measured against the baseline',
    ],
  },
  {
    code: 'D2',
    title: 'Teacher Capacity & Load',
    summary:
      'Whether the adults in the building have the training, time and support to respond to what they notice.',
    evidence: [
      'Staff wellbeing literacy assessment',
      'Response confidence audit',
      'Workload and emotional-load review',
    ],
  },
  {
    code: 'D3',
    title: 'Help-Seeking & Response Pathways',
    summary:
      'The route a struggling student actually takes, and what happens at each step once they take it.',
    evidence: [
      'Referral pathway mapping',
      'Counsellor access and case handling',
      'Escalation and follow-up records',
    ],
  },
  {
    code: 'D4',
    title: 'Parent & Home Alignment',
    summary:
      'How much of the pressure originates outside school, and how well the two sides are talking about it.',
    evidence: [
      'Parent engagement assessment',
      'Home-pressure indicators',
      'Communication loop review',
    ],
  },
  {
    code: 'D5',
    title: 'Leadership, Policy & Practice',
    summary:
      'The gap between the wellbeing policy on file and the wellbeing practice in a Tuesday afternoon classroom.',
    evidence: [
      'Policy-to-practice audit',
      'Budget and calendar allocation',
      'Governance and review cadence',
    ],
  },
];

/** A genuine sequence — each stage depends on the one before it. */
export const stages = [
  {
    step: 'Stage 1',
    title: 'Readiness audit',
    duration: 'Week 1',
    body:
      'A structured review of what your school already does for wellbeing, and where the evidence gaps are. This is the session you book below.',
  },
  {
    step: 'Stage 2',
    title: 'Emotion AI assessment',
    duration: 'Weeks 2–4',
    body:
      'Sampled cohorts are assessed with consent, producing a measured emotional baseline instead of an impression.',
  },
  {
    step: 'Stage 3',
    title: 'Zone report and gap map',
    duration: 'Week 5',
    body:
      'Your school receives its position across all five domains, the specific gaps holding it back, and what closing each one requires.',
  },
  {
    step: 'Stage 4',
    title: 'Standardised implementation',
    duration: 'Months 2–6',
    body:
      'Staff training, student sessions and pathway fixes drawn from practices documented in high-performing schools — not invented per campus.',
  },
  {
    step: 'Stage 5',
    title: 'Certification and annual re-audit',
    duration: 'Month 7 onward',
    body:
      'Schools that meet the standard are certified as a Yellow Zone campus and re-audited each year. Certification is held, not owned.',
  },
];

/** Benchmark precedent — the argument for why a standard works. */
export const precedents = [
  {
    mark: 'NABH',
    field: 'Healthcare quality',
    before: 'Hospitals claimed quality. Patients had no way to compare.',
    after: 'Accreditation made quality visible, comparable and improvable.',
    href: 'https://nabh.co/',
  },
  {
    mark: 'LEED',
    field: 'Green buildings',
    before: 'Every developer said the building was sustainable.',
    after: 'A rating turned a claim into a measured, certified level.',
    href: 'https://www.usgbc.org/leed',
  },
  {
    mark: 'Yellow Zone',
    field: 'Emotional wellbeing in schools',
    before: 'Every school says it cares about student wellbeing.',
    after: 'Assessment, benchmark, certification — the same logic, for how children feel.',
    href: null,
  },
];

export const fit = {
  yes: [
    'You are the principal, correspondent, trustee or director — someone who can act on the report',
    'Your campus has at least 300 students in Classes 6–12',
    'You already sense a wellbeing problem and want it measured, not described',
    'You are willing to let the assessment tell you something uncomfortable',
  ],
  no: [
    'You want a certificate for the prospectus without the assessment behind it',
    'You need the report to say what leadership has already decided',
    'No one on staff can own a six-month implementation',
    'You are looking for a one-day motivational session for students',
  ],
};

export const proofPoints = [
  { figure: '20+', label: 'years studying what schools never teach' },
  { figure: '2,000+', label: 'teens and professionals trained' },
  { figure: '40+', label: 'nationalities worked with' },
  { figure: '300+', label: 'teens personally mentored' },
];

export const testimonials = [
  {
    name: 'Dhanusri Karthiselva',
    role: 'Student, Class 11',
    quote:
      'Before joining, I used to feel very stressed about my studies. Even when I sat to study, I kept worrying and could not concentrate. I learned how to calm my mind and focus step by step. Now I feel more relaxed while studying and I do not panic like before.',
  },
  {
    name: 'Likhit Bhardwaj',
    role: 'Student, Class 10',
    quote:
      'Earlier I used to get distracted very easily, especially because of my phone. I learned how to control distractions and improve my focus. Now I can sit and study for longer without getting distracted, and I feel more confident about my preparation.',
  },
];

export const faqs = [
  {
    q: 'Is this a counselling service for our students?',
    a: 'No. Counselling treats individuals. Yellow Zone assesses the school as an institution — its climate, its staff capacity, its referral pathways and its policy-to-practice gap — and certifies the school against a standard. Individual support is one of the things the audit checks you have in place.',
  },
  {
    q: 'How is the emotional assessment actually done?',
    a: 'Through Emotion AI applied to sampled cohorts with school and parent consent, combined with structured staff and leadership review. The output is a cohort-level baseline. We do not produce psychological diagnoses of individual children.',
  },
  {
    q: 'What about student data and privacy?',
    a: 'Assessment runs on consent, reporting is cohort-level rather than individual, and the school signs a data agreement before any assessment begins. The specifics are walked through in your readiness audit before you commit to anything further.',
  },
  {
    q: 'What does the full certification cost?',
    a: 'It depends on campus size, number of cohorts assessed and the implementation scope your gap map calls for. The readiness audit is where that number gets built for your school — nobody quotes you before seeing your campus.',
  },
  {
    q: 'How long before we can be certified?',
    a: 'Roughly seven months from baseline assessment to certification decision, assuming implementation starts on schedule. Schools that already have strong pathways in place move faster.',
  },
  {
    q: 'What happens if our school does not meet the standard?',
    a: 'You get the gap map and a route to close it. Certification is withheld, not failed publicly — no school is named as uncertified. The point of a standard is to be reachable.',
  },
];

/** Qualification gates on the briefing page. */
export const gates = [
  {
    title: `Only 12 campuses this cohort`,
    body:
      'Every certified school gets direct involvement from our assessment team. Beyond twelve campuses, that attention stops being real. The cohort closes when it fills.',
  },
  {
    title: 'We review every school personally',
    body:
      'Not every campus is accepted. We take schools where leadership can genuinely act on what the assessment finds — otherwise the report becomes another file.',
  },
  {
    title: 'The audit fee filters, it does not fund',
    body:
      'A nominal fee separates schools that are serious from schools that are curious. It is deducted from your certification cost if you proceed.',
  },
  {
    title: 'Not the right fit? Refunded immediately',
    body:
      'If after the readiness audit we conclude this is not right for your campus right now, the fee is returned. No conditions. We only succeed when your school does.',
  },
];
