// Content + data-access layer. Every export here is replaceable by a CMS / API call.
import { communityPhotos, photoSets } from '../assets';

export const API_URL: string | undefined = (import.meta as any).env?.VITE_API_URL;

export const campaign = {
  shortName: 'JA',
  alliance: 'Juris Alliance',
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
    intro: "I'm John Otieno, a passionate leader dedicated to serving our student body.",
    story: { who: "I am John Otieno, a third-year law student at CUEA, a student leader, athlete, and servant of the community. I currently serve as Chairman of the Law Sports Society, Chairman of Juris Leadership Alliance and Captain of the CUEA Dark Knghts basketball team. I believe leadership is earned through service, consistency and character.", why: "I'm running because I believe students deserve leadership that listens, acts and delivers. From spearheading 'Operation Okoa Missing Marks' to participating in community outreach and civic education initiatives, I have consistently sought practical solutions to students concerns. I'm running to take that spirit of service further.", philosophy: "Transformational leadership. I believe leadership should inspire people to see possibilities beyond what currently exists - while giving them the confidence, tools and space to make those possibilities real. My role is not to do everything myself. It is to bring out the best in the people around me.", stand: "Integrity. Accountability. Inclusion. I believe accountability is non-negitiable and that every student deserves a voice regardless of their status, background or position. I want to build a culture where people are empowered to contribute, challenge ideas and become btter versions of themselves.", commitment: "I will take responsibility for the work entrusted to me and remain accountable for the outcomes. As Lao Tzu put it; A leader is best when people barely know he exists; when his work is done, his aim fulfilled, they will say: we did it ourselves." },
    experience: ['Chairman of the Law Sports Society', 'Chairman of Juris Leadership Alliance', 'Captain of the CUEA Dark Knights basketball team'], achievements: [], academic: null, quote: null, statement: "Leadership that inspires. Service that delivers.",
    values: campaign.values, priorities: ['accountability', 'our-committees', 'diploma-students'],
  },
  {
    id: 'vice-president', number: '02', position: 'Vice President', name: 'Tuvia Anne',
    image: photoSets['vice-president'][1024], imageAlt: 'Tuvia Anne, candidate for Vice President', focus: '50% 32%',
    officeRole: 'Coordination & representation',
    officeText: 'Keeps the team’s work joined up and carries student concerns from every year group to the table.',
    intro: "I'm Tuvia Anne, a dedicated student leader committed to enhancing student life and welfare.", 
    story: { who: "I am Anne Tuvia, a student leader committed to service, advocacy and creating opportunities for others. My leadership has been shaped by the people who have supported and mentoredme - my family, teachers, peers and friends. Their influence taught me a simple principle: Be the change you want to see. Today, I serve as Head of Moot Training, Legal Policy Coordinator at LAJI, Head of Oral Advocacy at CUEA Law Firm, Deputy Head of the International Court of Justice at Kenya Model UJ, and Vice Chair of Juris Organization, among other leadership roles.", why: "I'm running for Law School Vice President because I believe my  experiences have equipped me to contribute meaningfully to better student service, stronger opprtunities and a better experience for every law student. I have experienced leadership from different angles - advocacy, training, policy, student organisations and professional development - and I want to bring that experience directly into student leadership.", philosophy: "I believe leadership is about service, collaboration and empowerment. A leader's role is to create an environment where every student feels heard, valued and capable of contributing to the community. I aim to foster a culture of inclusivity, transparency and accountability.", stand: "I stand for student welfare, effective communication and a vibrant student life. I am committed to ensuring that every student's voice is represented in decision-making processes and that their concerns are addressed promptly and effectively.", commitment: "I commit to being a proactive, approachable and responsive Vice President. I will work tirelessly to ensure that our student body thrives academically, socially and personally." },
    experience: [ 'Head of Moot Training', 'Head of Oral Advocacy - CUEA  Law Firm', 'Legal Policy Coordinator - LAJI', 'Deputy Head of the International Court of Justice - Kenya Model UN', 'Vice Chair - Juris Organization' ], achievements: [], academic: null, quote: null, statement: "Leadership that serves. Opportunities that reach everyone.",
    values: campaign.values, priorities: ['put-cuea-fol-on-the-map', 'student-dignity-welfare', 'sports-culture-social-life'],
  },
  {
    id: 'secretary-academic-affairs', number: '03', position: 'Secretary of Academic Affairs', name: 'Cindy Nkatha',
    image: photoSets['secretary-academic-affairs'][1024], imageAlt: 'Cindy Nkatha, candidate for Secretary of Academic Affairs', focus: '50% 24%',
    officeRole: 'Academic advocacy',
    officeText: 'Speaks for students on teaching, assessment, learning resources and academic processes.',
    intro: "I'm Cindy Nkatha, a passionate advocate for academic excellence and student success.", 
    story: { who: "I am Cindy Nkatha Thaiting'a, a third year Law student, communications leader, graphic designer and passionate advocate for student representation, I currently serve as Communications Director at KMUN CUEA and enjoy working with people, creating meaningful connections and turning ideas into action.", why: "I'm running for Secretary of Academic Affairs because I believe that every student deserves a fair and enriching academic experience. I have seen how academic challenges can impact students' confidence and success, and I want to ensure that every student's voice is heard in shaping our academic environment.", philosophy: "I believe in proactive engagement, transparency and collaboration. My approach to leadership is to listen first, understand the needs of the students, and then work with faculty and administration to implement effective solutions. A good leader doesn't simply speak for people. They listen, communicate and follow-through. I also belive in teamwork beceause meaningful solutions are rarely created by one person alone.", stand: "I stand for academic integrity, accessibility and support. I am committed to advocating for policies and practices that enhance the learning experience for all students. I want every student to know what is happening in their faculty, know where to seek support and have meaningful platforms to share their ideas and concerns.", commitment: "I commit to being a dedicated advocate for students' academic interests, ensuring that their concerns are addressed and that they have access to the resources they need to succeed. As Secreatry, I will not just be a voice for students - I will make sure their voices reach where decisions are made" }, 
    experience: ['Communications Director - KMUN CUEA', 'Graphic Designer', 'Experience in student communication, creative design and collaborative initiatives', 'Experience working with students and creating platforms for engagement and representation'], achievements: [], academic: null, quote: null, statement: "Communication that connects. Advocacy that delivers.",
    values: campaign.values, priorities: ['academics-missing-marks', 'post-university-success', 'disability-rights-inclusion'],
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
// Chapters (the former "filters") in reading order. Every commitment belongs to exactly one.
export const manifestoFilters = ['Academics', 'Student welfare', 'Career', 'Student life', 'Representation', 'Communication'] as const;
export type ManifestoCategory = (typeof manifestoFilters)[number];

// Approved chapter introductions. Intentionally empty: none have been supplied by the committee yet.
// Add `Academics: '…'` etc. and the chapter header renders it automatically.
export const manifestoChapterIntros: Partial<Record<ManifestoCategory, string>> = {};

// The official published document. The website is the reading experience; the PDF is the authoritative download.
export const manifestoPdf = { href: '/Juris-Manifesto.pdf', filename: 'Juris-Manifesto-Official.pdf', label: 'Official manifesto (PDF)' };
export const manifestoTagline = 'Restoring Prestige';

export type ManifestoItem = {
  id: string; // stable URL slug, used for ?item= deep links
  aliases?: string[]; // previous ids that must keep resolving
  n: string; category: ManifestoCategory; title: string;
  tagline?: string; // optional approved one-liner
  issue?: string; // optional: the problem as stated by the campaign
  proposal?: string; // WHAT: the commitment, verbatim from the official document
  how: string[]; // HOW: action points, verbatim
  impact?: string; // IMPACT: only where the document states one
  serves?: string; measure?: string; // optional, not supplied for most commitments yet
  note?: string; // a status note that must travel with the commitment
  table?: { label: string; text: string; ref: string }[];
  pdfSection: number; // section number in the official PDF
  status: 'proposed' | 'in-progress' | 'delivered'; // delivery status: where the campaign's promise stands
  publication: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // publication status: whether the content is approved for the site
};

const manifestoAll: ManifestoItem[] = [
  { id: 'academics-missing-marks', aliases: ['academics & missing marks', 'academics'], n: '01', category: 'Academics', title: 'Academics & Missing Marks', pdfSection: 1, status: 'proposed', publication: 'PUBLISHED',
    proposal: 'Our president spearheaded Operation Ondoa Missing Marks, and we will finish the job. We will work with the IT team to move missing-marks filing into the student portal: submit, track and get notified.',
    impact: 'This saves time and money, especially for students who are away on holiday and miss the deadline to file.',
    how: ['Faculty Academics representatives will follow up every case, especially for Common Units taught in the main school, such as Communication Skills.', 'Every case is logged and tracked until it is resolved, with Heads of Department kept in the loop.', 'A reminder campaign about re-mark deadlines (two weeks from release of results) and supplementary or special exam applications.'] },
  { id: 'student-dignity-welfare', aliases: ['welfare', 'facilities'], n: '02', category: 'Student welfare', title: 'Student Dignity and Welfare', pdfSection: 2, status: 'proposed', publication: 'PUBLISHED',
    how: ['Respect both ways. We will have zero tolerance for harassment. We will address guard harassment at the gates and undignified incidents such as students being locked out or kicked out over the use of A5 books. We will also urge students to be courteous in return. Student to student harassment will also be dealt with.', 'Bridging the Admin-Student gap. We will be an authentic representative voice at administrative level and defend student interests without bowing to pressure.', 'The basics. Working mirrors and a steady supply of tissue in the washrooms, watered grass, revamping the computer lab and making it open for use, stronger WiFi and the reopening of the campus canteen.', 'Weekly Suggestion Box. Students drop concerns in the box (physical and digital) any day. It is checked every Friday, and we publish "You said, we did".'] },
  { id: 'disability-rights-inclusion', n: '03', category: 'Student welfare', title: 'Disability Rights, Accessibility and Inclusion', pdfSection: 3, status: 'proposed', publication: 'PUBLISHED',
    proposal: 'Inclusion is its own pillar, not a footnote. Under Article 54 of the Constitution, persons with disabilities are entitled to dignity, access to educational institutions and facilities, and reasonable access to materials and devices. Article 7(3) also recognises Kenyan Sign Language and Braille. We will advocate for:',
    how: ['Reasonable examination and learning accommodations.', 'A direct channel for students with disabilities to raise concerns with student leadership and have them followed up. We do not claim to have all the answers, so we will listen first.'],
    note: 'The wording of this pillar will only be finalised after consultation with students with disabilities.' },
  { id: 'post-university-success', aliases: ['career'], n: '04', category: 'Career', title: 'Post University Success', pdfSection: 4, status: 'proposed', publication: 'PUBLISHED',
    how: ['Through our partnership framework with UNICAF, eligible students can access a substantial Unicaf scholarship towards internationally recognised programmes with partner institutions (Unicaf University, the University of Suffolk and the University of East London), as well as professional short courses. Students can stack these on top of their law degrees for a competitive edge before they graduate. Eligibility, programmes and fees depend on the partnership terms, and the scholarship covers tuition only. We will publish approved, accurate information on how to apply.', "Careers days and Law firm internships. We will work with law firms to make internship applications easier, with a one-stop guide, and place students with firms within the Handbook's 100 km attachment limit.", 'Alumni network. Graduates mentoring students through career talks, referrals, pupillage and bar-course guidance.', 'Opportunity Hub. One trusted place for interview invitations, internships and scholarship alerts.', 'Entrepreneur Hub. A space for law students to network, pitch and advertise their businesses.'] },
  { id: 'sports-culture-social-life', aliases: ['student-life'], n: '05', category: 'Student life', title: 'Sports, Culture and Social Life', pdfSection: 5, status: 'proposed', publication: 'PUBLISHED',
    how: ['More sports. Through the FOL Sports Club we will expand beyond football to basketball and other indoor and outdoor games, with a week dedicated to sports that also includes fun races.', 'Both genders. Sports has long been male-focused, so our Sports Committee will have both a male and a female representative.', 'Prestige and excitement. Law school works with other faculties but is independent, so we will bring back dedicated law mixers, academic events, a Finalists Dinner and a memorable end-of-year Gala, following the official University dress code.', 'Moot and debate events that will not only take place in the Sep intake semesters but also May to August.', 'We shall push for our Moot Court to have a proper infrastructure. (Coat of arms etc)', 'Law school events. Game nights, movie nights and festivals.'] },
  { id: 'our-committees', aliases: ['representation'], n: '06', category: 'Representation', title: 'Our Committees', pdfSection: 7, status: 'proposed', publication: 'PUBLISHED',
    proposal: 'Committees make the plan run. Under the Handbook they are formed through the Students Governing Convention, so we will table these for approval. The heads of these committees will receive certification.',
    how: [],
    table: [
      { label: 'Academics', text: "Missing marks system, timetables, Diploma-to-LLB case, Dean's List, suggestion box follow-up, moot and research support", ref: 'Handbook 6.2.1' },
      { label: 'Clubs and Societies', text: 'Supports law clubs to register (15+ members and a patron) and run active programmes', ref: 'Handbook 6.2.6, 6.3' },
      { label: 'Sports', text: 'Basketball, Sports Week, fun races, FOL Sports Club; one male and one female representative', ref: 'Handbook 6.2.2' },
      { label: 'Events', text: 'Law mixers, Finalists Dinner and Gala', ref: 'Proposed 6.2.4' },
      { label: 'Post School Success', text: 'Opportunity Hub, scholarships, Entrepreneur Hub, law firm internships, alumni network', ref: 'New: works with 6.4 and 7.2' },
      { label: 'Publicity', text: 'Social media, storytelling, "You said, we did", accessible communication', ref: '6.2.5 and Publicity Secretary' },
      { label: 'Disabilities', text: 'Works with students with disabilities to identify barriers, secure reasonable accommodations and accessible materials, and make sure every event, space and opportunity in the Faculty of Law is open to all.', ref: 'Handbook 8.2.3' },
    ] },
  { id: 'accountability', n: '07', category: 'Representation', title: 'Accountability', pdfSection: 8, status: 'proposed', publication: 'PUBLISHED',
    how: ['Published minutes and a semester report on what we did and spent.', 'A public promise tracker: Not started, In progress, Done.', 'Equal treatment of all students, including Diploma students, regardless of gender or background (Article 27).', 'Lecturer accountability. They should be able to provide adequate support to students. (Notes and other materials required)'] },
  { id: 'diploma-students', aliases: ['digital'], n: '08', category: 'Representation', title: 'Diploma Students, We See You', pdfSection: 9, status: 'proposed', publication: 'PUBLISHED',
    proposal: 'On our one on one conversations with diploma students, we took note that they would love to proceed to LLB. As part of our mission we shall continue fighting and following up and carry on from where the previous administration left',
    how: [] },
  { id: 'put-cuea-fol-on-the-map', aliases: ['communication', 'community'], n: '09', category: 'Communication', title: 'Put CUEA FOL on the Map', pdfSection: 10, status: 'proposed', publication: 'PUBLISHED',
    how: ['An effective media team that tells the story of CUEA law students and gives updates on ongoing events.', 'Inter law-school events. Sports tournaments with other law schools, hosting debates and moots.'] },
];

// Only approved, published content reaches the site.
export const manifesto: ManifestoItem[] = manifestoAll.filter((m) => m.publication === 'PUBLISHED');

// Old ids and aliases keep resolving to the stable slug.
export const resolveManifesto = (key?: string | null): ManifestoItem | undefined =>
  key ? manifesto.find((m) => m.id === key || m.aliases?.includes(key)) : undefined;

// "Respect both ways. We will…" → ['Respect both ways', 'We will…']. Only splits short, label-like openers.
export function splitLead(s: string): { lead: string | null; text: string } {
  const i = s.indexOf('. ');
  if (i > 0 && i <= 36 && s.slice(0, i).split(' ').length <= 5) return { lead: s.slice(0, i), text: s.slice(i + 2) };
  return { lead: null, text: s };
}
export const firstSentence = (s: string) => { const m = s.match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : s; };

// ---------- Vision ----------
export type VisionPillarT = { id: string; n: string; title: string; problem: string; vision: string; objective: string; approach: string; benefit: string; manifesto: string };
export const pillars: VisionPillarT[] = [
  { id: 'academic-excellence', n: '01', title: 'Academic Excellence', manifesto: 'academics-missing-marks',
    problem: 'Academic support depends on personal networks.', vision: 'A Faculty where every student knows where academic help is, and can get it.',
    objective: 'Make revision support, resources and lecturer time predictable.', approach: 'Peer clinics, a moderated resource bank and published consultation slots.', benefit: 'Less scrambling before assessments, and a fairer start for every student.' },
  { id: 'student-welfare', n: '02', title: 'Student Welfare', manifesto: 'student-dignity-welfare',
    problem: 'Students in difficulty often don’t know who to ask.', vision: 'A Faculty where asking for help is normal and quick.',
    objective: 'Connect students to existing services faster.', approach: 'A referral map and a confidential first-contact point.', benefit: 'Problems reach the right person before they become crises.' },
  { id: 'representation', n: '03', title: 'Representation', manifesto: 'our-committees',
    problem: 'Concerns from some year groups never reach decision-makers.', vision: 'Representation that is scheduled, recorded and open to challenge.',
    objective: 'Give every year group a regular route to leadership.', approach: 'Monthly representative meetings and termly open forums.', benefit: 'Being heard doesn’t depend on being loud or well connected.' },
  { id: 'accountability', n: '04', title: 'Accountability', manifesto: 'accountability',
    problem: 'It is hard to see what representatives actually deliver.', vision: 'A leadership team that reports back and can be checked.',
    objective: 'Make every commitment visible and trackable.', approach: 'A public tracker and post-meeting reports.', benefit: 'Students can see progress, or the lack of it, for themselves.' },
  { id: 'career', n: '05', title: 'Career & Professional Development', manifesto: 'post-university-success',
    problem: 'Opportunity information arrives late.', vision: 'A Faculty that prepares students for practice on purpose.',
    objective: 'Get deadlines and guidance to students early.', approach: 'An opportunities calendar, application clinics and practitioner sessions.', benefit: 'More students apply, earlier, with stronger applications.' },
  { id: 'community', n: '06', title: 'Community & Culture', manifesto: 'sports-culture-social-life',
    problem: 'Faculty life is fragmented across year groups.', vision: 'A Faculty with a shared calendar and a sense of belonging.',
    objective: 'Bring year groups together through regular events and mentorship.', approach: 'A termly calendar, cross-year mentorship and service projects.', benefit: 'A more connected and supportive Faculty.' },
  { id: 'digital', n: '07', title: 'Digital Transformation', manifesto: 'put-cuea-fol-on-the-map',
    problem: 'Information is scattered and rumours fill the gaps.', vision: 'One trusted place for Faculty information.',
    objective: 'Give students timely, verified information on their phones.', approach: 'Verified channels, structured notices and an archive.', benefit: 'Reduced misinformation and equal access to information.' },
];

// ---------- Community ----------
// Evidence of how the campaign shows up. Empty until real, approved stories are supplied; replace with a CMS / API call.
export const communityCategories = ['Outreach', 'Meetings', 'Competitions', 'Engagements', 'Moments', 'Gallery'] as const;
export type CommunityCategory = (typeof communityCategories)[number];
export type CommunityImage = { src: string; srcSet?: string; alt: string; caption?: string; credit?: string; consent?: 'confirmed' | 'pending'; width?: number; height?: number; focus?: string };
export type CommunityStory = {
  id: string; slug: string; category: CommunityCategory; title: string; summary: string;
  body: string[]; date: string | null; location: string | null;
  image: CommunityImage | null; gallery: CommunityImage[];
  manifesto?: string; // ManifestoItem id of the related commitment
  featured?: boolean;
  highlight?: string; // optional pull-line for the highlight band, only when approved
  layout?: 'standard' | 'photo-story';
  usageNote?: string; // shown with the story when photos carry usage conditions
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};
const P = communityPhotos;
// Metadata the team has not supplied (date, location, credit, quotes, figures) is left empty on purpose. Fill in via CMS/API.
export const community: CommunityStory[] = [
  { id: 'c1', slug: 'cooking-alongside-the-community', category: 'Engagements', title: 'Cooking alongside the community', status: 'PUBLISHED', featured: true, date: null, location: null,
    summary: 'Sleeves up, flour out. A team member rolls dough at a shared table while the moment is recorded.',
    body: ['A team member rolls out dough at a floury table under a simple shelter, while another person records the moment on a phone.', 'Full details of this engagement are being confirmed with the team and will be added here.'],
    image: { ...P.kitchen, focus: '50% 35%' }, gallery: [] },
  { id: 'c2', slug: 'an-evening-gathering', category: 'Meetings', title: 'An evening gathering', status: 'PUBLISHED', date: null, location: null,
    summary: 'Students and guests around round tables, listening and talking.',
    body: ['Students and guests are seated at round tables in a hall, in conversation across the tables.', 'Details of the programme will be added once confirmed.'],
    image: P.evening, gallery: [] },
  { id: 'c3', slug: 'time-with-young-people', category: 'Outreach', title: 'Time with young people', status: 'PUBLISHED', date: null, location: null,
    summary: 'A group of young people and team members, together outdoors.',
    body: ['A group of young people gather outdoors beside a colourful community building, smiling and waving for the camera.', 'Details of this visit will be added once confirmed.'],
    image: { ...P.youth, consent: 'pending', focus: '50% 30%' }, gallery: [] },
  { id: 'c4', slug: 'a-visit-to-the-office', category: 'Engagements', title: 'A visit to the office', status: 'PUBLISHED', date: null, location: null,
    summary: 'The team in a wood-panelled office, standing together with their hosts.',
    body: ['Eight team members stand with two seated hosts in a wood-panelled office lined with law books and flags.', 'Details of the visit will be added once confirmed.'],
    image: { ...P.office, focus: '50% 40%' }, gallery: [] },
  { id: 'c5', slug: 'the-team-together', category: 'Moments', title: 'The team together', status: 'PUBLISHED', date: null, location: null,
    summary: 'Fourteen of us, one courtyard, one photograph.',
    body: ['Team members stand together in a garden courtyard around a metal fire pit, many in matching blue shirts.'],
    image: P.team, gallery: [] },
  { id: 'c6', slug: 'campaign-photo-gallery', category: 'Gallery', title: 'Campaign photo gallery', status: 'PUBLISHED', layout: 'photo-story', date: null, location: null,
    summary: 'Every approved photograph in one place.',
    body: ['Photographs from across the campaign, shown together. Captions, credits and dates are added as they are confirmed.'],
    image: P.team, gallery: [P.evening, P.kitchen, P.office, P.youth, P.team] },
];

export async function fetchCommunity(): Promise<CommunityStory[]> {
  const list = API_URL
    ? await fetch(`${API_URL}/community`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<CommunityStory[]>; })
    : community;
  return list.filter((s) => s.status === 'PUBLISHED');
}

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
  { id: 'the-vision-in-ten-commitments', category: 'Manifesto', date: null, author: 'Policy & research', title: 'The manifesto: nine commitments, in plain language',
    excerpt: 'The official manifesto is now readable on the site: a Quick Read for three minutes and the Full Manifesto for the whole argument.',
    content: ['The official Juris manifesto is available as a PDF, and now as a page you can read on a phone. It sets out nine commitments, each with what we will do and how.', 'Use the Quick Read for the short version, jump between chapters, share any single commitment on WhatsApp, and ask a question about anything that isn’t clear.', 'If something is vague, tell us. That is what the Ask the Campaign form is for.'] },
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
  { id: 'q3', category: 'Manifesto', question: 'How will manifesto progress be tracked?', date: null, status: 'answered', answer: 'The manifesto promises a public promise tracker with three states: Not started, In progress and Done, alongside published minutes and a semester report on what was done and spent.' },
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
    ...manifesto.map((m) => ({ type: 'Manifesto', title: m.title, text: `${m.category} ${m.issue ?? ''} ${m.proposal ?? ''} ${m.how.join(' ')} ${m.table?.map((t) => `${t.label} ${t.text}`).join(' ') ?? ''}`, to: `/manifesto?item=${m.id}` })),
    ...pillars.map((p) => ({ type: 'Vision', title: p.title, text: `${p.problem} ${p.vision} ${p.objective} ${p.approach}`, to: `/vision#${p.id}` })),
    ...news.map((n) => ({ type: 'Newsroom', title: n.title, text: `${n.category} ${n.excerpt} ${n.content.join(' ')}`, to: `/newsroom/${n.id}` })),
    ...manifestoFilters.map((c) => ({ type: 'Manifesto chapter', title: c, text: `Manifesto commitments on ${c.toLowerCase()}`, to: `/manifesto#ch-${c.toLowerCase().replace(/\s+/g, '-')}` })),
    ...community.filter((s) => s.status === 'PUBLISHED').map((s) => ({ type: 'Community', title: s.title, text: `${s.category} ${s.summary} ${s.location ?? ''}`, to: `/community/${s.slug}` })),
    ...events.map((e) => ({ type: 'Event', title: e.title, text: `${e.location} ${e.description}`, to: `/events/${e.id}` })),
    ...counselModes.map((m) => ({ type: "Counsel's Room", title: m.title, text: m.blurb, to: `/counsels-room?mode=${m.id}` })),
    ...issueCategories.map((c) => ({ type: 'Category', title: c, text: `Questions, issues and ideas about ${c.toLowerCase()}`, to: `/counsels-room?category=${encodeURIComponent(c)}#board` })),
    ...questions.map((q) => ({ type: 'FAQ', title: q.question, text: `${q.category} ${q.answer ?? ''}`, to: `/faculty-pulse#questions` })),
  ];
}
