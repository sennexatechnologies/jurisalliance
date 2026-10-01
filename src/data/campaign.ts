// Content + data-access layer. Every export here is replaceable by a CMS / API call.
import { photoSets } from '../assets';

export const API_URL: string | undefined = (import.meta as any).env?.VITE_API_URL;

export const campaign = {
  shortName: 'JLA',
  alliance: 'Juris Leadership Alliance',
  faculty: 'CUEA Faculty of Law',
  whatsapp: '+254753926295', // international format
  email: 'juriscartels@gmail.com',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/juris_cartels?igsh=bW02amxwNW5va3p1' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@juris.cartels6?_r=1&_t=ZS-94wuHDwylWb' },
    { label: 'X', href: 'https://x.com/juris_cartels' },
  ],
  values: ['Integrity', 'Accountability', 'Service', 'Excellence', 'Representation'],
  quote: { text: 'Leadership isn’t about being seen. It’s about making sure people are heard.', isPlaceholder: true },
};

export const waLink = (message = 'Hello, I’d like to connect and get involved with the campaign.') =>
  `https://wa.me/${campaign.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

// ---------- Candidates ----------
export type Candidate = {
  id: string;
  number: string;
  position: string;
  name: string;
  image: string; // 1024w source for the photo; use <Photo id=...> for responsive output
  imageAlt: string;
  focus: string; // object-position that keeps the face in frame when cropped
  officeRole: string; // one-line description of the office (not a claim about the person)
  officeText: string;
  intro: string | null; // short bio
  story: { who: string | null; why: string | null; philosophy: string | null; stand: string | null; commitment: string | null };
  experience: string[];
  achievements: string[];
  academic: string | null;
  values: string[];
  quote: string | null;
  statement: string | null;
  priorities: string[]; // manifesto ids: placeholder allocation
};

const empty = { who: null, why: null, philosophy: null, stand: null, commitment: null };

export const candidates: Candidate[] = [
  {
    id: 'president', number: '01', position: 'President', name: 'John Otieno "JOHNTE"',
    image: photoSets.president[1024], imageAlt: 'John Otieno, candidate for President', focus: '50% 18%',
    officeRole: 'Overall leadership',
    officeText: 'Sets the direction, chairs the leadership team and answers for the campaign’s commitments.',
    intro: null, story: empty, experience: [], achievements: [], academic: null, quote: null, statement: null,
    values: campaign.values, priorities: ['accountability', 'representation', 'community'],
  },
  {
    id: 'vice-president', number: '02', position: 'Vice President', name: 'Tuvia Anne',
    image: photoSets['vice-president'][1024], imageAlt: 'Tuvia Anne, candidate for Vice President', focus: '50% 32%',
    officeRole: 'Coordination & representation',
    officeText: 'Keeps the team’s work joined up and carries student concerns from every year group to the table.',
    intro: null, story: empty, experience: [], achievements: [], academic: null, quote: null, statement: null,
    values: campaign.values, priorities: ['communication', 'welfare', 'student-life'],
  },
  {
    id: 'secretary-academic-affairs', number: '03', position: 'Secretary of Academic Affairs', name: 'Nkatha Thaitanga',
    image: photoSets['secretary-academic-affairs'][1024], imageAlt: 'Nkatha Thaiting"a, candidate for Secretary of Academic Affairs', focus: '50% 24%',
    officeRole: 'Academic advocacy',
    officeText: 'Speaks for students on teaching, assessment, learning resources and academic processes.',
    intro: null, story: empty, experience: [], achievements: [], academic: null, quote: null, statement: null,
    values: campaign.values, priorities: ['academics', 'career', 'digital'],
  },
];

export const storySections: [keyof Candidate['story'], string][] = [
  ['who', 'Who I am'],
  ['why', 'Why I’m running'],
  ['philosophy', 'My leadership philosophy'],
  ['stand', 'What I stand for'],
  ['commitment', 'My commitment to students'],
];

// ---------- Manifesto ----------
export const manifestoFilters = ['Academics', 'Student welfare', 'Career', 'Representation', 'Communication', 'Facilities', 'Student life'] as const;
export type ManifestoItem = {
  id: string; n: string; category: (typeof manifestoFilters)[number]; title: string; tagline: string;
  issue: string; proposal: string; how: string[]; serves: string; measure: string; status: 'proposed' | 'in-progress' | 'delivered';
};

export const manifesto: ManifestoItem[] = [
  { id: 'academics', n: '01', category: 'Academics', title: 'Academics', tagline: 'Support that starts before the exam timetable does.', status: 'proposed',
    issue: 'Study support is informal. Past papers, revision help and lecturer time reach students through personal contacts, not the Faculty.',
    proposal: 'A Faculty academic support calendar: peer-led revision clinics, a moderated resource bank and published lecturer consultation slots.',
    how: ['Year representatives run revision clinics before every assessment period', 'A shared resource bank organised by unit and moderated for quality', 'Consultation windows agreed with lecturers and published at the start of semester'],
    serves: 'Every student, with a particular focus on first- and second-years.', measure: 'Clinic attendance, resource bank use and a short semester-end student survey.' },
  { id: 'welfare', n: '02', category: 'Student welfare', title: 'Student Welfare', tagline: 'A clear route from a problem to a person who can solve it.', status: 'proposed',
    issue: 'Students facing financial, health or personal difficulty often don’t know who to approach, so they say nothing.',
    proposal: 'A one-page welfare referral map and a confidential first-contact point that connects students to services the university already provides.',
    how: ['Publish who handles what, and where to find them', 'Name a welfare contact on the Faculty leadership team', 'Accept confidential referrals in person or on WhatsApp'],
    serves: 'Any student in difficulty, and friends who want to help but don’t know how.', measure: 'Referrals handled and time taken to respond.' },
  { id: 'communication', n: '03', category: 'Communication', title: 'Communication', tagline: 'One trusted place for Faculty information.', status: 'proposed',
    issue: 'Announcements are scattered across group chats. Rumours travel faster than facts, and students miss deadlines.',
    proposal: 'A centralised, verified faculty communication system with a standard announcement format.',
    how: ['Verified channels for official announcements', 'Every notice states what, who, when and where to go', 'An archive so nothing is lost in a scroll-back'],
    serves: 'All year groups, including students who aren’t in every group chat.', measure: 'Fewer missed notices reported, and a termly check on whether students know where to look.' },
  { id: 'representation', n: '04', category: 'Representation', title: 'Representation', tagline: 'Every year group at the table.', status: 'proposed',
    issue: 'Concerns from different year groups reach Faculty leadership unevenly, or not at all.',
    proposal: 'Structured feedback loops: monthly meetings with class representatives and one open forum each term.',
    how: ['Monthly meeting with all class representatives', 'A standing agenda item for issues submitted through this site', 'A termly open forum with Faculty leadership invited'],
    serves: 'Students in every year group and programme stream.', measure: 'Issues raised, escalated and resolved, published each term.' },
  { id: 'career', n: '05', category: 'Career', title: 'Career Development', tagline: 'From lecture hall to chambers, on purpose.', status: 'proposed',
    issue: 'Pupillage, internship and clerkship information circulates late and mostly by word of mouth.',
    proposal: 'An opportunities desk: one shared calendar of deadlines, application clinics and practitioner conversations.',
    how: ['Publish deadlines in one calendar', 'CV and application clinics run with senior students and alumni', 'Termly sessions with practising advocates and in-house counsel'],
    serves: 'Penultimate- and final-year students first, then all years.', measure: 'Opportunities shared, applications supported and feedback from clinic attendees.' },
  { id: 'facilities', n: '06', category: 'Facilities', title: 'Facilities', tagline: 'Problems logged, not lost.', status: 'proposed',
    issue: 'Problems with lecture halls, library seating and study space are raised informally and rarely tracked.',
    proposal: 'A facilities issue log with a visible status, escalated monthly to the relevant university office.',
    how: ['Collect reports through this site and class representatives', 'Send a consolidated list to the responsible office each month', 'Publish what was raised and what came back'],
    serves: 'All students who use Faculty and campus spaces.', measure: 'Issues logged, escalated and resolved; time to first response.' },
  { id: 'student-life', n: '07', category: 'Student life', title: 'Student Life', tagline: 'A faculty people want to belong to.', status: 'proposed',
    issue: 'Faculty life can feel like lectures and nothing else, especially across year groups.',
    proposal: 'A predictable termly calendar of academic, social and service events that include every year group.',
    how: ['Publish the calendar early each term', 'Pair students across years for mentorship', 'Balance academic, social and service events'],
    serves: 'Students who currently feel disconnected from Faculty life.', measure: 'Participation and feedback after each event.' },
  { id: 'digital', n: '08', category: 'Communication', title: 'Digital Services', tagline: 'Fewer trips, clearer steps.', status: 'proposed',
    issue: 'Common requests need several in-person trips or unclear steps.',
    proposal: 'Map the most common student requests and publish step-by-step guides, and press for online options where the university allows.',
    how: ['Survey students on the most frustrating processes', 'Publish a plain-language guide for each', 'Raise the top three with the relevant offices'],
    serves: 'Students dealing with registration, records and administrative requests.', measure: 'Guides published and processes simplified.' },
  { id: 'accountability', n: '09', category: 'Representation', title: 'Accountability', tagline: 'Leadership you can check.', status: 'proposed',
    issue: 'Students rarely see what their representatives promised, did, or raised on their behalf.',
    proposal: 'A public commitments tracker and a short report after every Faculty meeting.',
    how: ['Publish every manifesto item with a status', 'Post meeting summaries within 72 hours', 'Hold a mid-term public review with open questions'],
    serves: 'Every student, and the next leadership team.', measure: 'Share of commitments met and reports posted on time.' },
  { id: 'community', n: '10', category: 'Student life', title: 'Community', tagline: 'Law in service of people.', status: 'proposed',
    issue: 'Law students have skills the wider community needs, but few structured ways to use them.',
    proposal: 'Community-service projects organised with the Faculty’s clinical legal education programme.',
    how: ['Identify service projects with clinical legal education staff', 'Recruit volunteers across year groups', 'Report outcomes to the Faculty'],
    serves: 'Volunteering students and the communities they work with.', measure: 'Projects run, volunteers involved and partner feedback.' },
];

// ---------- Vision ----------
export type VisionPillarT = { id: string; n: string; title: string; problem: string; vision: string; objective: string; approach: string; benefit: string; manifesto: string };
export const pillars: VisionPillarT[] = [
  { id: 'academic-excellence', n: '01', title: 'Academic Excellence', manifesto: 'academics',
    problem: 'Academic support depends on personal networks.', vision: 'A Faculty where every student knows where academic help is, and can get it.',
    objective: 'Make revision support, resources and lecturer time predictable.', approach: 'Peer clinics, a moderated resource bank and published consultation slots.', benefit: 'Less scrambling before assessments, and a fairer start for every student.' },
  { id: 'student-welfare', n: '02', title: 'Student Welfare', manifesto: 'welfare',
    problem: 'Students in difficulty often don’t know who to ask.', vision: 'A Faculty where asking for help is normal and quick.',
    objective: 'Connect students to existing services faster.', approach: 'A referral map and a confidential first-contact point.', benefit: 'Problems reach the right person before they become crises.' },
  { id: 'representation', n: '03', title: 'Representation', manifesto: 'representation',
    problem: 'Concerns from some year groups never reach decision-makers.', vision: 'Representation that is scheduled, recorded and open to challenge.',
    objective: 'Give every year group a regular route to leadership.', approach: 'Monthly representative meetings and termly open forums.', benefit: 'Being heard doesn’t depend on being loud or well connected.' },
  { id: 'accountability', n: '04', title: 'Accountability', manifesto: 'accountability',
    problem: 'It is hard to see what representatives actually deliver.', vision: 'A leadership team that reports back and can be checked.',
    objective: 'Make every commitment visible and trackable.', approach: 'A public tracker and post-meeting reports.', benefit: 'Students can see progress, or the lack of it, for themselves.' },
  { id: 'career', n: '05', title: 'Career & Professional Development', manifesto: 'career',
    problem: 'Opportunity information arrives late.', vision: 'A Faculty that prepares students for practice on purpose.',
    objective: 'Get deadlines and guidance to students early.', approach: 'An opportunities calendar, application clinics and practitioner sessions.', benefit: 'More students apply, earlier, with stronger applications.' },
  { id: 'community', n: '06', title: 'Community & Culture', manifesto: 'student-life',
    problem: 'Faculty life is fragmented across year groups.', vision: 'A Faculty with a shared calendar and a sense of belonging.',
    objective: 'Bring year groups together through regular events and mentorship.', approach: 'A termly calendar, cross-year mentorship and service projects.', benefit: 'A more connected and supportive Faculty.' },
  { id: 'digital', n: '07', title: 'Digital Transformation', manifesto: 'communication',
    problem: 'Information is scattered and rumours fill the gaps.', vision: 'One trusted place for Faculty information.',
    objective: 'Give students timely, verified information on their phones.', approach: 'Verified channels, structured notices and an archive.', benefit: 'Reduced misinformation and equal access to information.' },
];

// ---------- Team ----------
export type TeamMember = { id: string; group: string; name: string; role: string; line: string; photo?: string };
export const teamGroups = ['Campaign leadership', 'Policy & research', 'Communications', 'Digital strategy', 'Student outreach', 'Events', 'Creative & media'];
const lines: Record<string, string> = {
  'Campaign leadership': 'Keeps every workstream moving and every promise on a deadline.',
  'Policy & research': 'Turns student concerns into workable proposals.',
  Communications: 'Makes the message clear, accurate and easy to share.',
  'Digital strategy': 'Builds the tools that let every student take part from their phone.',
  'Student outreach': 'Listens in every year group, before and after the vote.',
  Events: 'Plans forums, dialogues and campus moments.',
  'Creative & media': 'Designs, photographs and films the campaign.',
};
export const team: TeamMember[] = teamGroups.flatMap((g, gi) =>
  [g === 'Campaign leadership' ? 'Campaign Coordinator' : `${g} Lead`, ...(g === 'Campaign leadership' ? [] : [`${g} Member`])].map((role, i) => ({
    id: `${gi}-${i}`, group: g, name: 'Team Member', role, line: lines[g],
  })),
);

// ---------- Events ----------
export type EventItem = { id: string; title: string; date: string; time: string; endTime?: string; location: string; description: string; agenda?: string[]; speakers?: string[]; status?: 'scheduled' | 'cancelled' | 'completed' };
export const events: EventItem[] = []; // date = YYYY-MM-DD, time = HH:mm

export const eventStart = (e: EventItem) => new Date(`${e.date}T${e.time || '00:00'}`);
export const eventEnd = (e: EventItem) => new Date(`${e.date}T${e.endTime || '23:59'}`);
export const isPast = (e: EventItem) => eventEnd(e).getTime() < Date.now();
export const fmtDate = (d: string | Date) => new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

// ---------- News ----------
export type NewsItem = { id: string; title: string; category: string; date: string | null; image?: string; excerpt: string; content: string[]; author: string; status?: 'published' | 'draft' };
export const newsCategories = ['Campaign', 'Manifesto', 'Events', 'Announcements', 'Student voice', 'Media'];
export const news: NewsItem[] = [
  { id: 'campaign-headquarters-goes-digital', category: 'Campaign', date: null, author: 'The campaign', title: 'Campaign headquarters goes digital',
    excerpt: 'Everything the campaign does now has a home: candidates, manifesto, events and a direct line to us.',
    content: ['This site is the campaign’s public record. It brings the three candidates, the manifesto, the team and the calendar into one place students can open on a phone.', 'It also works in the other direction. Every form on the site is a way for students to tell us what to fix, ask what they want to know, or offer help.', 'Nothing here is an official university or Electoral Commission communication. It is an independent student campaign.'] },
  { id: 'the-vision-in-ten-commitments', category: 'Manifesto', date: null, author: 'Policy & research', title: 'The manifesto: ten commitments, each with a plan',
    excerpt: 'Every item states the issue, the proposal, how it would work, who it serves and how progress could be measured.',
    content: ['We didn’t want a manifesto that reads like a brochure. Each of the ten commitments is written to be checked: what is wrong, what we propose, how it would work, who benefits and how you would know whether it happened.', 'You can search and filter the manifesto by topic, share any single item on WhatsApp, and ask a question about anything that isn’t clear.', 'If something is vague, tell us. That is what the Ask the Campaign form is for.'] },
  { id: 'first-student-forum', category: 'Events', date: null, author: 'Events team', title: 'Student forums: dates will be announced here first',
    excerpt: 'Open forums and a faculty dialogue are planned. Dates go on the events page as soon as they are confirmed.',
    content: ['We plan to hold open forums for each year group and a wider faculty dialogue. Details will be published on the events page, including agenda and how to RSVP.', 'No date has been fixed yet, and we won’t list one until it is confirmed with the relevant offices.'] },
  { id: 'how-to-raise-a-concern', category: 'Student voice', date: null, author: 'Student outreach', title: 'How to raise a concern with the campaign',
    excerpt: 'Four ways to be heard: the Have Your Say panel, Ask the Campaign, Say It Straight, or WhatsApp.',
    content: ['Use Have Your Say (the button at the bottom of every page) for a quick question, idea, issue or piece of feedback.', 'Use Ask the Campaign for questions about the manifesto or candidates. Use Say It Straight for open feedback on what is working and what isn’t.', 'Name and contact details are optional. Submissions are not guaranteed to be anonymous, so please don’t include anything you wouldn’t want the campaign to read.'] },
];

// ---------- FAQ / Questions ----------
export type Question = { id: string; category: string; question: string; answer: string | null; date: string | null; status: 'answered' | 'open' };
export const questions: Question[] = [
  { id: 'q1', category: 'Campaign', question: 'What happens after the election?', date: null, status: 'answered', answer: 'The manifesto becomes a public tracker with a status for every commitment. If elected, the team reports after Faculty meetings and holds a mid-term public review. If not elected, the ideas remain open for whoever is.' },
  { id: 'q2', category: 'Manifesto', question: 'How will students be kept informed?', date: null, status: 'answered', answer: 'Through verified announcement channels with a standard format, summaries of Faculty meetings within 72 hours, and this website as the public record.' },
  { id: 'q3', category: 'Manifesto', question: 'How will manifesto progress be tracked?', date: null, status: 'answered', answer: 'Every item carries a status (proposed, in progress, delivered) and a stated measure. The tracker is public and reviewed with students at the mid-term.' },
  { id: 'q4', category: 'Academics', question: 'How can students raise academic concerns?', date: null, status: 'answered', answer: 'Through class representatives, the Have Your Say panel on this site, or WhatsApp. Academic concerns are taken to the Secretary of Academic Affairs and raised at the monthly representatives’ meeting.' },
  { id: 'q5', category: 'Campaign', question: 'Is this website an official university or election source?', date: null, status: 'answered', answer: 'No. It is an independent student campaign site. For official election information, use the Electoral Commission’s own notices.' },
  { id: 'q6', category: 'Campaign', question: 'Are the poll results on this site official?', date: null, status: 'answered', answer: 'No. Faculty Pulse is an unofficial student sentiment snapshot and does not represent official election results.' },
];

export const shareables = [
  { id: 'q1', kind: 'Manifesto highlight', text: 'Leadership you can check. Every commitment published, tracked and reported.' },
  { id: 'q2', kind: 'Campaign line', text: 'Representation without the noise.' },
  { id: 'q3', kind: 'Manifesto highlight', text: 'One trusted place for Faculty information.' },
];

export const timeline = [
  { date: 'Date 01/09/2026', event: 'Campaign launch', text: 'The candidates introduce the campaign and open the conversation.' },
  { date: 'Date TBC', event: 'Manifesto release', text: 'The full agenda goes public, with every item tracked.' },
  { date: 'Date TBC', event: 'Student engagement', text: 'Class-by-class listening sessions across all year groups.' },
  { date: 'Date TBC', event: 'Faculty dialogue', text: 'An open conversation with Faculty leadership and student representatives.' },
  { date: 'Date TBC', event: 'Debate', text: 'The candidates answer questions from students.' },
  { date: 'Date TBC', event: 'Final outreach', text: 'A last push so every student knows how and where to vote.' },
  { date: 'Date TBC', event: 'Election day', text: 'Vote. Then hold whoever wins to account.' },
];

export type Endorsement = { name: string; role: string; quote: string };
export const endorsements: Endorsement[] = []; // omitted until verified, permissioned quotes are supplied

// ---------- Poll ----------
export type PollOption = { candidateName: string; votes: number; percentage: number; lastUpdated: string };
export type PollData = { options: PollOption[]; totalResponses: number; lastUpdated: string; status: 'open' | 'closed' | 'pending'; live: boolean; preview?: boolean };
export type PulseTopic = { category: string; count: number; percentage: number; lastUpdated: string };

export async function fetchPoll(): Promise<PollData | null> {
  if (!API_URL) return null;
  try {
    const r = await fetch(`${API_URL}/poll`);
    return r.ok ? { ...(await r.json()), live: true } : null;
  } catch { return null; }
}
// Aggregated, anonymised topic counts from reviewed Counsel's Room submissions. Returns null until a backend provides them.
export async function fetchPulseTopics(): Promise<PulseTopic[] | null> {
  if (!API_URL) return null;
  try {
    const r = await fetch(`${API_URL}/trends`);
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
export function previewPoll(): PollData {
  const now = new Date().toISOString();
  const o = [['Candidate A', 0.42], ['Candidate B', 0.31], ['Candidate C', 0.18], ['Undecided', 0.09]] as const;
  return { options: o.map(([candidateName, p]) => ({ candidateName, votes: Math.round(p * 100), percentage: p * 100, lastUpdated: now })), totalResponses: 100, lastUpdated: now, status: 'open', live: false, preview: true };
}

// ---------- Submissions (nothing is stored in the frontend) ----------
export type SubmissionKind = 'voice' | 'ask' | 'straight' | 'volunteer' | 'issue' | 'panel';
export async function submitToBackend(kind: SubmissionKind, payload: Record<string, unknown>): Promise<{ delivered: boolean }> {
  if (API_URL) {
    try {
      const r = await fetch(`${API_URL}/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, ...payload, timestamp: new Date().toISOString() }) });
      if (r.ok) return { delivered: true };
    } catch { /* fall through */ }
  }
  return { delivered: false };
}

// One category list for Counsel's Room, Faculty Pulse, search, analytics and the admin dashboard.
export const issueCategories = ['Academics', 'Student welfare', 'Communication', 'Facilities', 'Career', 'Student life', 'Representation', 'Other'] as const;
export type IssueCategory = (typeof issueCategories)[number];
export const categories: readonly string[] = issueCategories;
export const askCategories: readonly string[] = issueCategories;

// ---------- Counsel's Room ----------
export type CounselMode = 'ask' | 'rant' | 'suggest' | 'issue';
export type CounselStatus = 'received' | 'under-review' | 'responded' | 'resolved' | 'closed';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'hidden' | 'archived';
export type ModerationFlag = 'harassment' | 'personal-information' | 'threat' | 'unverified-allegation' | 'spam' | 'other';

export const statusLabel: Record<CounselStatus, string> = { received: 'Received', 'under-review': 'Under review', responded: 'Responded', resolved: 'Resolved', closed: 'Closed' };

export type CounselSubmission = {
  id: string;
  reference: string; // e.g. JLA-7F42. Random, carries no personal information.
  mode: CounselMode;
  category: IssueCategory;
  message: string;
  anonymous: boolean;
  createdAt: string;
  status: CounselStatus;
  moderationStatus: ModerationStatus; // the public board only ever shows 'approved'
  response: string | null;
  respondedAt: string | null;
};

// Contract for the future admin dashboard (never rendered publicly):
//   POST   /admin/counsel/:id/moderation  { action: 'approve'|'reject'|'hide'|'archive'|'flag', flag?: ModerationFlag }
//   POST   /admin/counsel/:id/response    { response: string }
//   PATCH  /admin/counsel/:id/status      { status: CounselStatus }
export const moderationActions = ['approve', 'reject', 'hide', 'archive', 'respond', 'change-status', 'flag'] as const;
export const moderationFlags: ModerationFlag[] = ['harassment', 'personal-information', 'threat', 'unverified-allegation', 'spam', 'other'];

export const counselModes: { id: CounselMode; verb: string; title: string; blurb: string }[] = [
  { id: 'ask', verb: 'Ask', title: 'Ask the campaign', blurb: 'Have a question? Put it on the record.' },
  { id: 'rant', verb: 'Rant', title: 'Rant', blurb: 'Say what’s on your mind. Plainly.' },
  { id: 'suggest', verb: 'Suggest', title: 'Share an idea', blurb: 'What could make student life better?' },
  { id: 'issue', verb: 'Raise an issue', title: 'Raise an issue', blurb: 'Something broken that needs attention.' },
];

const REF_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export function newReference(): string {
  const b = crypto.getRandomValues(new Uint8Array(4));
  return `JLA-${Array.from(b, (n) => REF_CHARS[n % REF_CHARS.length]).join('')}`;
}

export type CounselInput = {
  mode: CounselMode;
  category: IssueCategory;
  message: string;
  context?: string;
  responseFormat?: string;
  anonymous: boolean;
  publicOk?: boolean; // permission to show on the moderated board
  contact?: string; // only ever set when anonymous === false
};

// Anonymous submissions never include name or contact fields. Nothing is stored in the browser.
export async function submitCounsel(input: CounselInput): Promise<{ delivered: boolean; reference: string }> {
  const reference = newReference();
  if (API_URL) {
    const body: Record<string, unknown> = { reference, mode: input.mode, category: input.category, message: input.message, anonymous: input.anonymous, publicOk: !!input.publicOk };
    if (input.context) body.context = input.context;
    if (input.responseFormat) body.responseFormat = input.responseFormat;
    if (!input.anonymous && input.contact) body.contact = input.contact;
    try {
      const r = await fetch(`${API_URL}/counsel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', body: JSON.stringify(body) });
      if (r.ok) {
        const j = await r.json().catch(() => ({}));
        return { delivered: true, reference: typeof j.reference === 'string' ? j.reference : reference };
      }
    } catch { /* fall through */ }
  }
  return { delivered: false, reference };
}

// Public board: the server should only return approved items; the client filters again defensively.
export async function fetchBoard(): Promise<CounselSubmission[] | null> {
  if (!API_URL) return null;
  try {
    const r = await fetch(`${API_URL}/counsel/board`, { credentials: 'omit' });
    if (!r.ok) return null;
    const list: CounselSubmission[] = await r.json();
    return list.filter((x) => x.moderationStatus === 'approved');
  } catch { return null; }
}

export async function fetchStatus(reference: string): Promise<{ status: CounselStatus; response: string | null } | 'unavailable' | null> {
  if (!API_URL) return 'unavailable';
  try {
    const r = await fetch(`${API_URL}/counsel/status/${encodeURIComponent(reference.trim().toUpperCase())}`, { credentials: 'omit' });
    return r.ok ? await r.json() : null;
  } catch { return 'unavailable'; }
}

// "Is this an issue you care about?" Aggregated server-side; no identity is sent.
export async function sendSignal(reference: string, value: 'yes' | 'not-sure'): Promise<boolean> {
  if (!API_URL) return false;
  try {
    const r = await fetch(`${API_URL}/counsel/${encodeURIComponent(reference)}/signal`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', body: JSON.stringify({ value }) });
    return r.ok;
  } catch { return false; }
}

// ---------- Search index ----------
export type SearchHit = { type: string; title: string; text: string; to: string };
export function buildIndex(): SearchHit[] {
  return [
    ...candidates.map((c) => ({ type: 'Candidate', title: `${c.position}: ${c.name}`, text: `${c.officeRole} ${c.officeText}`, to: `/candidates/${c.id}` })),
    ...manifesto.map((m) => ({ type: 'Manifesto', title: m.title, text: `${m.category} ${m.issue} ${m.proposal} ${m.how.join(' ')}`, to: `/manifesto?item=${m.id}` })),
    ...pillars.map((p) => ({ type: 'Vision', title: p.title, text: `${p.problem} ${p.vision} ${p.objective} ${p.approach}`, to: `/vision#${p.id}` })),
    ...news.map((n) => ({ type: 'Newsroom', title: n.title, text: `${n.category} ${n.excerpt} ${n.content.join(' ')}`, to: `/newsroom/${n.id}` })),
    ...events.map((e) => ({ type: 'Event', title: e.title, text: `${e.location} ${e.description}`, to: `/events/${e.id}` })),
    ...counselModes.map((m) => ({ type: "Counsel's Room", title: m.title, text: m.blurb, to: `/counsels-room?mode=${m.id}` })),
    ...issueCategories.map((c) => ({ type: 'Category', title: c, text: `Questions, issues and ideas about ${c.toLowerCase()}`, to: `/counsels-room?category=${encodeURIComponent(c)}#board` })),
    ...questions.map((q) => ({ type: 'FAQ', title: q.question, text: `${q.category} ${q.answer ?? ''}`, to: `/faculty-pulse#questions` })),
  ];
}
