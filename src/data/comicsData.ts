import { ComicBook } from '../types';
import { CatalogStory, StoryData } from '../services/storyDatabaseService';

const CUSTOM_COMICS_KEY = 'rwamiti_custom_comic_books_v2';

export const ATTACHED_COMIC: ComicBook = {
  id: 'comic-send-me-something-small',
  slug: 'send-me-something-small',
  issueNumber: '001',
  title: 'Send Me Something Small',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ONE POSSIBLE PATH (PATH 1: MUM’S PRESCRIPTION & THE FREELANCE TASK)',
  description:
    'You have a degree. You have an interview. You need transport money. Again. An illustrated Kampala dilemma where twenty thousand shillings entered a house as transport money and left as a family meeting.',
  coverImage: 'assets/comic-pages/page-1.jpg',
  pdfUrl: 'assets/aistudio/send_me_something_small_Comic_7780a8c2.pdf',
  releaseDate: 'October 2026',
  pageCount: 7,
  readingTimeMinutes: 5,
  tags: ['Kampala', 'Graduate', 'Career', 'Family Dilemma', 'Money', 'One Possible Path'],
  coverNote:
    'Cover illustrates Alex, Mum, Dad, and friend Sam. Note on Cover: Friend Sam appears on the cover art but belongs to an alternative borrowing branch. This comic presents One Possible Path (approaching Mum & Dad).',
  rwamitiWisdom:
    'My friend, twenty thousand shillings entered this house as transport money and left as a family meeting. Which was harder: finding the money, or telling the whole truth?',
  closingQuestion:
    'You just experienced ONE POSSIBLE PATH. If you were Alex facing this dilemma, what would your move have been?',
  pollOptions: [
    'Attended the unpaid Brightpath placement for the corporate name',
    'Chosen the UGX 60,000 freelance task like Alex',
    'Asked Dad for the full 3-month transport budget',
    'Borrowed from friend Sam instead of family',
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Cover · Send Me Something Small',
      image: 'assets/comic-pages/page-1.jpg',
      timeMarker: 'PROLOGUE',
      caption:
        'You have a degree. You have an interview. You need transport money. Again. [ONE POSSIBLE PATH]',
      keyMoments: [
        'Bachelor of Arts degree on the wall',
        'Mum always there; Dad counts the numbers',
        'Cover Note: Friend Sam appears on the cover but belongs to an alternative borrowing branch; this comic follows the Mum & Dad path',
        'Kampala: A brighter tomorrow still possible',
      ],
    },
    {
      pageNumber: 2,
      label: 'Page 1 · The Shortlist',
      image: 'assets/comic-pages/page-2.jpg',
      timeMarker: 'DAY 1 — 7:46 PM',
      caption:
        'DAY 1 — 7:46 PM: Your degree hangs above your bed. Return transport to Ntinda: about UGX 20,000. Mobile-money balance: UGX 2,300.',
      keyMoments: [
        'Shortlist notification from Brightpath Consulting for 9:00 AM interview in Ntinda tomorrow',
        'Mobile money balance check: UGX 2,300',
        'Family WhatsApp: Daniel bought his mother a fridge with first salary; Mum claps 6 times',
        'Dilemma: “Who do you approach?”',
      ],
    },
    {
      pageNumber: 3,
      label: 'Page 2 · The Prescription & Restoration',
      image: 'assets/comic-pages/page-3.jpg',
      timeMarker: 'DAY 1 — 8:05 PM',
      caption:
        'DAY 1 — 8:05 PM: Mum manages ten thousand from her prescription refill. Dad finds out, sends UGX 10,000 to you and UGX 10,000 directly back to Mum.',
      keyMoments: [
        'Mum offers ten thousand from prescription refill: “Please don’t make this another secret”',
        'Dad intervenes and restores Mum’s refill: sends UGX 10,000 to Alex and UGX 10,000 to Mum',
        'Dad: “Next time, tell me what is happening before she has to juggle things”',
        'Mum: “And next time, both of you remember I can hear”',
      ],
    },
    {
      pageNumber: 4,
      label: 'Page 3 · Two Separate Organisations & The Clash',
      image: 'assets/comic-pages/page-4.jpg',
      timeMarker: 'DAY 1 — 8:19 PM',
      caption:
        'DAY 1 — 8:19 PM: Brightpath reveals 3-month unpaid placement (UGX 320,000/month transport). Former colleague Aisha introduces Kigo Initiative for a paid spreadsheet task (UGX 80,000). Why both cannot be done: Interview is at 9:00 AM in Ntinda across traffic, while Kigo Initiative requires delivery by 1:00 PM.',
      keyMoments: [
        'Corporate Placement: Brightpath Consulting in Ntinda requires 4 full weekdays unpaid',
        'Freelance Task: Kigo Community Development Initiative via Aisha needs attendance spreadsheets cleaned for UGX 80,000',
        'Timing Conflict: 9:00 AM Ntinda interview commutes clash with Kigo’s 1:00 PM board meeting deadline',
        'Decision: Commit to corporate unpaid interview or freelance verified data delivery?',
      ],
    },
    {
      pageNumber: 5,
      label: 'Page 4 · The Hard Answer & The Choice',
      image: 'assets/comic-pages/page-5.jpg',
      timeMarker: 'DAY 1 — 8:43 PM',
      caption:
        'DAY 1 — 8:43 PM: Brightpath confirms: “No transport allowance. Two of the last twelve participants moved into paid roles.” Alex declines Brightpath to take Kigo Initiative’s attendance spreadsheet.',
      keyMoments: [
        'Inquiring before confirming: Asking Brightpath recruiter for transport allowance and hiring rates',
        'Reality check: Only 2 of 12 previous participants were hired into paid jobs',
        'Choosing reality over prestige: Declining Brightpath interview to take the paid freelance project',
        'Receiving sample data from Kigo Initiative via Aisha',
      ],
    },
    {
      pageNumber: 6,
      label: 'Page 5 · The Messy Spreadsheet & Scope Negotiation',
      image: 'assets/comic-pages/page-6.jpg',
      timeMarker: 'DAY 1 — 10:15 PM TO DAY 2 — 8:00 AM',
      caption:
        'DAY 1 LATE NIGHT TO DAY 2 MORNING: Missing attendance dates across hundreds of rows. Alex negotiates: “I can clean usable records and build a summary table. I cannot invent missing dates.” Kigo Initiative agrees to UGX 60,000.',
      keyMoments: [
        'Assignment consistency: Cleaning attendance spreadsheets with duplicate entries and missing dates',
        'Professional integrity: Refusing to fabricate missing attendance dates for a quick signoff',
        'Scope agreement: Limited delivery with attendance anomaly log for UGX 60,000',
        'Dad knocks in the morning: “Is this a job?” — “A task. I don’t know yet.”',
      ],
    },
    {
      pageNumber: 7,
      label: 'Page 6 · Delivery, Payment & Mum’s Dividend',
      image: 'assets/comic-pages/page-7.jpg',
      timeMarker: 'DAY 2 — 12:41 PM & 2:15 PM',
      caption:
        'DAY 2 — 12:41 PM: Cleaned attendance dataset delivered on time. 2:15 PM: UGX 60,000 received from KIGO INITIATIVE. Alex sends UGX 20,000 to Mum: “Prescription covered with interest.” Uncle Rwamiti delivers his verdict.',
      keyMoments: [
        'Cleaned attendance spreadsheet and summary table delivered at 12:41 PM',
        'Client payment arrives: UGX 60,000 from KIGO COMMUNITY DEVELOPMENT INITIATIVE',
        'Mum’s money fully repaid with dividend: Alex transfers UGX 20,000 to Mum',
        'Uncle Rwamiti Verdict: “Twenty thousand shillings entered as transport money and left as a family meeting.”',
      ],
    },
  ],
  panels: [
    {
      id: 'p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/page-1.jpg',
      dayMarker: 'PROLOGUE',
      timeMarker: 'EVENING',
      caption: 'ONE POSSIBLE PATH: SEND ME SOMETHING SMALL — Uncle Rwamiti: Your Move.',
      settingDescription: 'Kampala, Uganda. Graduate bedroom.',
      dialogue: [
        {
          character: 'Alex',
          characterRole: 'Graduate • 25',
          avatarColor: 'blue',
          text: 'You have a degree. You have an interview. You need transport money. Again.',
          side: 'right',
          bubbleType: 'thought',
        },
      ],
    },
    {
      id: 'p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/page-2.jpg',
      dayMarker: 'DAY 1',
      timeMarker: '7:46 PM',
      caption: 'PAGE 1: THE SHORTLIST & THE SHORTFALL.',
      settingDescription: 'Your bedroom. 7:46 PM.',
      dialogue: [
        {
          character: 'Brightpath Consulting',
          characterRole: 'Corporate Consultancy • Ntinda',
          avatarColor: 'blue',
          text: '“Your application has been shortlisted. Interview tomorrow, 9 a.m., Ntinda. Please bring original certificates.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Mobile Money Alert',
          characterRole: 'System',
          avatarColor: 'amber',
          text: 'Available balance: UGX 2,300.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Alex',
          characterRole: 'Graduate • 25',
          avatarColor: 'blue',
          text: 'Return transport to Ntinda: about UGX 20,000. Balance: UGX 2,300. Dad is posting about Daniel’s fridge. Who do you approach?',
          side: 'right',
          bubbleType: 'thought',
        },
      ],
      choices: [
        {
          id: 'c1',
          label: 'Message Mum privately about transport',
          nextPanelId: 'p3',
        },
        {
          id: 'c2',
          label: 'Approach Dad directly in the sitting room',
          nextPanelId: 'p3',
        },
      ],
    },
    {
      id: 'p3',
      panelNumber: 3,
      imageUrl: 'assets/comic-pages/page-3.jpg',
      dayMarker: 'DAY 1',
      timeMarker: '8:05 PM',
      caption: 'PAGE 2: THE PRESCRIPTION & DAD’S RESTORATION.',
      settingDescription: 'Family sitting room. 8:05 PM.',
      dialogue: [
        {
          character: 'Mum',
          characterRole: 'Mother • Home',
          avatarColor: 'amber',
          text: '“I can manage ten. It is from the money for my prescription refill tomorrow. Your father can top it up, but tell him tonight. Please don’t make this another secret.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Dad',
          characterRole: 'Father',
          avatarColor: 'slate',
          text: '“Next time, tell me what is happening before she has to juggle things. Here is ten thousand to you, and ten thousand to your mother’s phone.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Mum',
          characterRole: 'Mother • Home',
          avatarColor: 'amber',
          text: '“And next time, both of you remember I can hear.”',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
      resolutionNote:
        'Dad restores Mum’s UGX 10,000 prescription refill immediately so her pharmacy visit remains protected.',
    },
    {
      id: 'p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/page-4.jpg',
      dayMarker: 'DAY 1',
      timeMarker: '8:19 PM',
      caption: 'PAGE 3: TWO SEPARATE DOORS & THE TIMING CLASH.',
      settingDescription: 'Alex’s desk. 8:19 PM.',
      dialogue: [
        {
          character: 'Brightpath Consulting',
          characterRole: 'Corporate Consultancy • Ntinda',
          avatarColor: 'blue',
          text: '“Please note: this is a three-month unpaid graduate placement, four weekdays per week, 8 a.m.–5 p.m. in Ntinda. No transport allowance.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Aisha',
          characterRole: 'Former University Colleague • Junior Analyst',
          avatarColor: 'teal',
          text: '“Alex, Kigo Community Development Initiative needs help cleaning attendance spreadsheets across 14 districts before their 2:00 p.m. board meeting. UGX 80,000 payable upon check. Can you take it?”',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
      clashReason:
        'Timing Conflict: Brightpath’s 9:00 AM interview in Ntinda requires traveling in heavy Kampala morning traffic and waiting for panel rounds until 2:00 PM without laptop power. Kigo Initiative requires attendance spreadsheet delivery by 1:00 PM. Alex cannot physically complete both.',
      choices: [
        {
          id: 'c3',
          label: 'Inquire on placement conversion before choosing',
          nextPanelId: 'p5',
        },
        {
          id: 'c4',
          label: 'Decline Brightpath and take Aisha’s client task',
          nextPanelId: 'p5',
        },
      ],
    },
    {
      id: 'p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/page-5.jpg',
      dayMarker: 'DAY 1',
      timeMarker: '8:43 PM',
      caption: 'PAGE 4: THE HARD TRUTH & CHOOSING THE PAID TASK.',
      settingDescription: 'WhatsApp chat. 8:43 PM.',
      dialogue: [
        {
          character: 'Brightpath Recruiter',
          characterRole: 'Corporate Consultancy • Ntinda',
          avatarColor: 'blue',
          text: '“No allowance or reduced attendance currently. Two of the last twelve participants moved into paid roles. We cannot promise the same. Confirm within 15 minutes.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Alex',
          characterRole: 'Graduate • 25',
          avatarColor: 'blue',
          text: 'Two out of twelve. UGX 320,000 transport cost a month out of Mum and Dad’s pocket for a 16% chance. I am declining. Aisha, send me Kigo Initiative’s sample.',
          side: 'right',
          bubbleType: 'thought',
        },
      ],
    },
    {
      id: 'p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/page-6.jpg',
      dayMarker: 'DAY 1 NIGHT TO DAY 2 MORNING',
      timeMarker: '10:15 PM – 8:00 AM',
      caption: 'PAGE 5: THE MESSY SPREADSHEET & INTEGRITY OVER ILLUSION.',
      settingDescription: 'Laptop desk. 10:15 PM into morning.',
      dialogue: [
        {
          character: 'Alex',
          characterRole: 'Graduate • 25',
          avatarColor: 'blue',
          text: '“I can clean and deduplicate the usable attendance records, compile a verified summary table, and flag missing dates by 1:00 p.m. I cannot invent missing attendance dates.”',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Kigo Initiative Client',
          characterRole: 'Freelance NGO Client (via Aisha)',
          avatarColor: 'purple',
          text: '“Fair. We need an honest report for our board meeting. Limited delivery agreed at UGX 60,000.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Dad',
          characterRole: 'Father',
          avatarColor: 'slate',
          text: '“Is this a job?” — “A task. I don’t know yet.”',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'p7',
      panelNumber: 7,
      imageUrl: 'assets/comic-pages/page-7.jpg',
      dayMarker: 'DAY 2',
      timeMarker: '12:41 PM & 2:15 PM',
      caption: 'PAGE 6: DELIVERY, PAYMENT & MUM’S DIVIDEND.',
      settingDescription: 'Sitting room with Uncle Rwamiti. 2:15 PM.',
      dialogue: [
        {
          character: 'MTN Mobile Money',
          characterRole: 'System Alert',
          avatarColor: 'amber',
          text: '“Y’ello! You have received UGX 60,000 from KIGO COMMUNITY DEVELOPMENT INITIATIVE (Ref: Attendance Data Verification). Available Balance: UGX 62,300.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Alex',
          characterRole: 'Graduate • 25',
          avatarColor: 'blue',
          text: 'Sends UGX 20,000 to Mum: “Mum, prescription covered plus extra for the week.”',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Mum',
          characterRole: 'Mother • Home',
          avatarColor: 'amber',
          text: '“The secret account has closed with a dividend.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'The Observer',
          avatarColor: 'amber',
          text: '“My friend, twenty thousand shillings entered this house as transport money and left as a family meeting. Which was harder: finding the money, or telling the whole truth?”',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
  ],
};

// INITIAL_COMICS contains the attached comic
export const INITIAL_COMICS: ComicBook[] = [ATTACHED_COMIC];

export function getStoredComics(): ComicBook[] {
  return [ATTACHED_COMIC];
}

export function saveCustomComic(comic: ComicBook): ComicBook[] {
  return [ATTACHED_COMIC, comic];
}

export function deleteCustomComic(comicId: string): ComicBook[] {
  return [ATTACHED_COMIC];
}

export function convertComicToCatalogStory(comic: ComicBook): CatalogStory {
  return {
    slug: comic.slug,
    title: comic.title,
    description: comic.description,
    cover: comic.coverImage || 'assets/comic-pages/page-1.jpg',
    duration_minutes: comic.readingTimeMinutes || 5,
    reading_time: `${comic.pageCount} pages · Flippable Comic`,
    category: 'Comics',
    keywords: `Comics Comic Books Send Me Something Small Uncle Rwamiti Graduate Kampala Transport Money Degree ${comic.tags.join(' ')}`,
    legacy_engine: false,
    featured: false,
  };
}

export function convertComicToStoryData(comic: ComicBook): StoryData {
  const nodes: Record<string, any> = {};

  comic.pages.forEach((page, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === comic.pages.length - 1;
    const key = isFirst ? 'opening' : `page-${page.pageNumber}`;
    const nextPage = comic.pages[idx + 1];

    const paragraphs: string[] = [];
    if (page.timeMarker) paragraphs.push(`[${page.timeMarker}]`);
    if (page.caption) paragraphs.push(page.caption);
    if (page.keyMoments && page.keyMoments.length > 0) {
      page.keyMoments.forEach((km) => paragraphs.push(`• ${km}`));
    }

    const choices: Array<{ label: string; to: string }> = [];
    if (nextPage) {
      choices.push({
        label: `FLIP TO PAGE ${nextPage.pageNumber} →`,
        to: `page-${nextPage.pageNumber}`,
      });
    }

    nodes[key] = {
      key,
      title: `${comic.title} · ${page.label}`,
      summary: page.caption || '',
      paragraphs,
      image: page.image,
      choices,
      is_ending: isLast,
    };
  });

  return {
    id: comic.slug,
    title: comic.title,
    image: comic.coverImage,
    category: 'Comics',
    nodes,
  };
}
