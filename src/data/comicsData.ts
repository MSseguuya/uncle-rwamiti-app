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
      timeMarker: 'DAY 1 — 10:14 AM TO 12:19 PM',
      caption:
        'DAY 1 — 10:14 AM: Your degree hangs above your bed. Brightpath Consulting shortlists you for a 9:00 AM interview in Ntinda tomorrow. Return transport: about UGX 20,000. Mobile-money balance at 11:03 AM: UGX 2,300.',
      keyMoments: [
        '10:14 AM: Shortlist notification from Brightpath Consulting for 9:00 AM interview in Ntinda tomorrow',
        '11:03 AM: Mobile money balance check shows UGX 2,300',
        '12:18 PM: Family Group message from Dad celebrating Daniel buying his mother a fridge with his first salary',
        'Dilemma: “Mum, send me something small.” — Who do you approach?',
      ],
    },
    {
      pageNumber: 3,
      label: 'Page 2 · The Prescription & Dad’s Top-Up',
      image: 'assets/comic-pages/page-3.jpg',
      timeMarker: 'DAY 1 — 2:17 PM TO 2:25 PM',
      caption:
        'DAY 1 — 2:17 PM: You ask Mum for UGX 20,000 transport. At 2:25 PM she offers UGX 10,000 from her prescription refill money and asks you to tell Dad. Dad sends the other UGX 10,000.',
      keyMoments: [
        '2:17 PM: Asking Mum for twenty thousand for tomorrow’s interview transport',
        '2:25 PM: Mum offers ten thousand from her prescription refill: “Please don’t make this another secret”',
        'Dad sends UGX 10,000 to complete the UGX 20,000 transport fare: “Next time, tell me what is happening before she has to juggle things”',
        'Mum: “And next time, both of you remember I can hear”',
      ],
    },
    {
      pageNumber: 4,
      label: 'Page 3 · Two Separate Organisations & The Clash',
      image: 'assets/comic-pages/page-4.jpg',
      timeMarker: 'MORNING — 10:26 AM TO 11:37 AM',
      caption:
        '10:26 AM: Brightpath reveals the role is a 3-month unpaid graduate placement (4 weekdays/week, no transport allowance — UGX 320,000/month in transport alone). At 11:37 AM, Aisha introduces a paid task from Kigo Initiative cleaning attendance spreadsheets for UGX 80,000.',
      keyMoments: [
        '10:26 AM: Brightpath Consulting details arrive — 3-month unpaid placement, 8 a.m.–5 p.m., no transport allowance',
        'Notebook calculation: UGX 20,000 × 16 weekdays = UGX 320,000 per month for transport alone',
        '11:37 AM: Aisha messages that Kigo Initiative needs help cleaning attendance spreadsheets for UGX 80,000 after review',
        'Timing clash: Interview tomorrow at 9:00 a.m. in Ntinda vs. Paid attendance-data task due by 1:00 p.m.',
      ],
    },
    {
      pageNumber: 5,
      label: 'Page 4 · The Hard Answer & The Choice',
      image: 'assets/comic-pages/page-5.jpg',
      timeMarker: '11:18 AM TO 11:32 AM',
      caption:
        '11:18 AM: Alex asks Brightpath about transport support and past progression. At 11:26 AM Brightpath replies: “No allowance currently. Two of the last twelve participants moved into paid roles. We cannot promise the same.” At 11:31 AM Alex asks Aisha for Kigo’s sample and payment terms.',
      keyMoments: [
        '11:18 AM: Asking Brightpath whether transport support is available and how many from the last cohort moved into paid roles',
        '11:26 AM: Brightpath confirms no allowance and that 2 of the last 12 participants progressed to paid roles (past cohort results do not guarantee individual probability)',
        '11:31 AM: Asking Aisha for the attendance spreadsheet sample and payment terms',
        '11:32 AM: Choosing with open eyes to take Kigo Initiative’s paid attendance task',
      ],
    },
    {
      pageNumber: 6,
      label: 'Page 5 · The Messy Attendance File & Scope Negotiation',
      image: 'assets/comic-pages/page-6.jpg',
      timeMarker: 'NIGHT — 11:22 PM TO 11:42 PM',
      caption:
        '11:22 PM: Reviewing Kigo Initiative’s attendance spreadsheet reveals duplicates, inconsistent names, and missing dates. Alex negotiates with Kigo Initiative: “I can clean what is verifiable. I can’t invent what is missing.” At 11:42 PM Kigo agrees: “All right. Limited delivery for UGX 60,000.”',
      keyMoments: [
        'Inspecting the attendance spreadsheet: duplicate rows, mixed date formats, and missing dates',
        '11:22 PM: Proposing to Kigo Initiative to clean and deduplicate usable records, summarize verified data, and list missing dates by 1:00 p.m.',
        '11:35 PM–11:42 PM: Holding firm when Kigo asks for a complete report; agreeing on Limited Delivery for UGX 60,000',
        'Telling Dad: “I’m skipping the interview and doing this task instead.” — “Is this a job?” — “A task. I don’t know yet.”',
      ],
    },
    {
      pageNumber: 7,
      label: 'Page 6 · Delivery, Payment & Repayment to Mum',
      image: 'assets/comic-pages/page-7.jpg',
      timeMarker: 'NEXT DAY — 12:41 PM TO 2:15 PM',
      caption:
        '12:41 PM: Alex emails Attendance_Cleaned_Summary.xlsx to team@kigoinitiative.org. At 12:58–12:59 PM KigoInitiative accepts and confirms payment this afternoon. At 2:15 PM UGX 60,000 arrives via Mobile Money (Balance: UGX 62,300), and Alex sends UGX 20,000 to Mum (remaining balance: UGX 42,300).',
      keyMoments: [
        '12:41 PM: Sending Attendance_Cleaned_Summary.xlsx (Cleaned Attendance Dataset — Limited Delivery) to team@kigoinitiative.org',
        '12:58 PM–12:59 PM: Kigo Initiative replies “Accepted. Sending payment this afternoon.”',
        '2:15 PM: MTN Mobile Money receives UGX 60,000 from KIGO INITIATIVE (Bal: UGX 62,300 • Sent UGX 20,000 to Mum → UGX 42,300)',
        'Work sample logged: Experience note – Kigo Initiative (Limited Delivery) documenting cleaned and deduplicated attendance records',
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
      dayMarker: 'PAGE 1',
      timeMarker: '10:14 AM – 12:19 PM',
      caption: 'PAGE 1: THE SHORTLIST & THE SHORTFALL.',
      settingDescription: 'Your bedroom. 10:14 AM to 12:19 PM.',
      dialogue: [
        {
          character: 'Brightpath Consulting',
          characterRole: 'Corporate Consultancy • Ntinda (10:14 AM)',
          avatarColor: 'blue',
          text: '“Your application has been shortlisted. Interview tomorrow, 9 a.m., Ntinda.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Mobile Money Alert',
          characterRole: 'System (11:03 AM)',
          avatarColor: 'amber',
          text: 'Available balance: UGX 2,300.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Alex',
          characterRole: 'Graduate • 25 (12:19 PM)',
          avatarColor: 'blue',
          text: 'Return transport: about UGX 20,000. Mobile-money balance: UGX 2,300. In the Family Group, Dad posts: “Congratulations to Daniel. First salary! He has bought his mother a fridge.” Who do you approach?',
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
      dayMarker: 'PAGE 2',
      timeMarker: '2:17 PM – 2:25 PM',
      caption: 'PAGE 2: THE PRESCRIPTION & DAD’S TOP-UP.',
      settingDescription: 'Bedroom and sitting room. 2:17 PM to 2:25 PM.',
      dialogue: [
        {
          character: 'Alex',
          characterRole: 'Graduate • 25 (2:17 PM)',
          avatarColor: 'blue',
          text: '“Mum, interview tomorrow. Can you send me twenty thousand for transport?”',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Mum',
          characterRole: 'Mother • Home (2:25 PM)',
          avatarColor: 'amber',
          text: '“I can manage ten. It is from the money for my prescription refill tomorrow. Your father can top it up, but tell him tonight. Please don’t make this another secret.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Dad',
          characterRole: 'Father',
          avatarColor: 'slate',
          text: '“Next time, tell me what is happening before she has to juggle things.” (Sends UGX 10,000)',
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
        'Alex now has UGX 20,000 for transport (UGX 10,000 from Mum’s prescription refill money and UGX 10,000 from Dad), which Alex repays to Mum with UGX 20,000 once Kigo Initiative pays.',
    },
    {
      id: 'p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/page-4.jpg',
      dayMarker: 'PAGE 3',
      timeMarker: '10:26 AM – 11:37 AM',
      caption: 'PAGE 3: TWO SEPARATE DOORS & THE TIMING CLASH.',
      settingDescription: 'Alex’s desk. 10:26 AM to 11:37 AM.',
      dialogue: [
        {
          character: 'Brightpath Consulting',
          characterRole: 'Corporate Consultancy • Ntinda (10:26 AM)',
          avatarColor: 'blue',
          text: '“Three-month unpaid graduate placement. Four weekdays per week. 8 a.m. – 5 p.m. No transport allowance. Some previous participants have progressed to paid roles.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Aisha',
          characterRole: 'Former Colleague (11:37 AM)',
          avatarColor: 'teal',
          text: '“A small organisation (Kigo Initiative) needs help cleaning attendance spreadsheets. UGX 80,000 after review. Want me to introduce you?”',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
      clashReason:
        'Return transport is UGX 20,000 × 16 weekdays = UGX 320,000 per month for transport alone. Both the Ntinda interview (9:00 a.m.) and the paid attendance-spreadsheet task are tomorrow morning.',
      choices: [
        {
          id: 'c3',
          label: 'Ask Brightpath about transport support & past cohort progression first',
          nextPanelId: 'p5',
        },
        {
          id: 'c4',
          label: 'Ask Aisha for Kigo Initiative’s sample and payment terms',
          nextPanelId: 'p5',
        },
      ],
    },
    {
      id: 'p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/page-5.jpg',
      dayMarker: 'PAGE 4',
      timeMarker: '11:18 AM – 11:32 AM',
      caption: 'PAGE 4: AN HONEST ANSWER, A HARD ANSWER.',
      settingDescription: 'Phone messages. 11:18 AM to 11:32 AM.',
      dialogue: [
        {
          character: 'Brightpath Consulting',
          characterRole: 'Corporate Consultancy • Ntinda (11:26 AM)',
          avatarColor: 'blue',
          text: '“No allowance currently. Two of the last twelve participants moved into paid roles. We cannot promise the same. Please confirm attendance within fifteen minutes.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Alex',
          characterRole: 'Graduate • 25 (11:31 AM)',
          avatarColor: 'blue',
          text: 'An honest answer. A hard answer. Two of the last twelve moved into paid roles, and there is no transport support. To Aisha: “Please send me the sample and payment terms.”',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/page-6.jpg',
      dayMarker: 'PAGE 5',
      timeMarker: '11:22 PM – 11:42 PM',
      caption: 'PAGE 5: THE MESSY ATTENDANCE SPREADSHEET & SCOPE NEGOTIATION.',
      settingDescription: 'Laptop desk at night. 11:22 PM to 11:42 PM.',
      dialogue: [
        {
          character: 'Alex',
          characterRole: 'Graduate • 25 (11:22 PM)',
          avatarColor: 'blue',
          text: '“I can clean and deduplicate the usable records, provide a summary of those, and list missing information by 1 p.m. I can’t produce a complete attendance total without the missing dates.”',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Kigo Initiative',
          characterRole: 'Freelance Client (11:35 PM – 11:42 PM)',
          avatarColor: 'purple',
          text: '“We need a complete report.” → After Alex explains the missing dates: “All right. Limited delivery for UGX 60,000.”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Dad & Alex',
          characterRole: 'At the Bedroom Door',
          avatarColor: 'slate',
          text: 'Alex: “I’m skipping the interview and doing this task instead.” Dad: “Is this a job? And after?” Alex: “A task. I don’t know yet.”',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'p7',
      panelNumber: 7,
      imageUrl: 'assets/comic-pages/page-7.jpg',
      dayMarker: 'PAGE 6',
      timeMarker: '12:41 PM – 2:15 PM',
      caption: 'PAGE 6: DELIVERY, PAYMENT & REPAYING MUM.',
      settingDescription: 'Laptop and sitting room with Uncle Rwamiti. 12:41 PM to 2:15 PM.',
      dialogue: [
        {
          character: 'Alex → Kigo Initiative',
          characterRole: 'Email Delivery (12:41 PM) & Reply (12:58–12:59 PM)',
          avatarColor: 'blue',
          text: 'Sent Attendance_Cleaned_Summary.xlsx (Cleaned Attendance Dataset — Limited Delivery) to team@kigoinitiative.org. Kigo Initiative: “Accepted. Sending payment this afternoon.”',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'MTN Mobile Money',
          characterRole: 'System Alert (2:15 PM)',
          avatarColor: 'amber',
          text: '“Money Received: UGX 60,000 from KIGO INITIATIVE. Bal: UGX 62,300 • Sent UGX 20,000 to Mum (Remaining Bal: UGX 42,300).”',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Work Sample Note',
          characterRole: 'Experience Note – Kigo Initiative (Limited Delivery)',
          avatarColor: 'teal',
          text: '“What I did: Cleaned and deduplicated attendance records, summarized verified data & missing dates. Scope: Reduced from full report to limited delivery. Fee: UGX 60,000 (paid via Mobile Money).”',
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


export const COMIC_BAN_BODAS: ComicBook = {
  id: 'comic-ban-bodas',
  slug: 'ban-bodas',
  issueNumber: '002',
  title: 'Ban Bodas! She Typed. From the Back of a Boda.',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ONE POSSIBLE PATH (KAMPALA RUSH HOUR & THE FARE)',
  description:
    'Jessica types "BAN BODAS. KAMPALA DESERVES BETTER." from the back of Safari\'s boda-boda in Kampala rush hour. Forty minutes later on Uncle Rwamiti\'s veranda, passenger and rider discover whose convenience and livelihood are actually on the line.',
  coverImage: 'assets/comic-pages/ban-bodas/cover.jpg',
  pdfUrl: 'assets/aistudio/Uncle_Rwamiti_Ban_Bodas_Comic_29c19819.pdf',
  releaseDate: 'October 2026',
  pageCount: 4,
  readingTimeMinutes: 4,
  tags: ['Kampala', 'Boda Boda', 'Traffic', 'Livelihood', 'Urban Life', 'Rush Hour', 'Public Transport', 'Social Media'],
  coverNote:
    'Issue #002 of the Uncle Rwamiti comic series. Focuses on the real economic and mobility friction in Kampala between car owners, passengers, and boda-boda riders.',
  rwamitiWisdom:
    'Your post has plenty of passengers. Where are you taking them? When you ban the boda, do you have a plan for the city, or just anger at the traffic? True progress begins when passengers take responsibility for the pressure they exert, while demanding practical transit infrastructure from the city.',
  closingQuestion:
    'You are Jessica. These perspectives can coexist as starting points. What would you post, and what concrete action pledge do you make?',
  pollOptions: [
    'Starting Point A — Passenger Responsibility: Enforce the safety rules. I must stop asking riders to break them.',
    'Starting Point B — Urban Transit Reality: Before banning bodas, show us how people will get to work.',
    'Starting Point C — Rider Livelihood: Safari, what would help you earn a living while riding safely?',
    'Practical Action Extension: (Stop) Stop asking riders to use pavements; (Start) Leave 15 min earlier; (City) Demand safe crossings & dedicated lanes.',
    'Compose Your Own Post: Write your own revised response combining these truths and a practical action pledge.',
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Page 1 · Kampala Rush Hour & The Fare',
      image: 'assets/comic-pages/ban-bodas/page-1.jpg',
      timeMarker: '10:31 AM — KAMPALA RUSH HOUR',
      caption:
        '1. Kampala, rush hour: Jessica posts "BAN BODAS. KAMPALA DESERVES BETTER." from Safari\'s bike. 2. At Uncle Rwamiti\'s home: 40 minutes late. 3. The fare: Safari asks for his money.',
      keyMoments: [
        'Jessica typing anti-boda social media post from the back of Safari\'s bike',
        'Safari navigating bumper-to-bumper Kampala traffic: "Madam, hold properly. We are moving."',
        'Arriving late at Uncle Rwamiti\'s gate: "Forty minutes late! This city! Would I have arrived by car?"',
        'Safari waits for payment: "Should I wait until after the ban for my money?"',
      ],
    },
    {
      pageNumber: 2,
      label: 'Page 2 · Five Minutes for Tea & Safari\'s Past',
      image: 'assets/comic-pages/ban-bodas/page-2.jpg',
      timeMarker: '11:15 AM — ON THE VERANDA',
      caption:
        'Uncle Rwamiti invites Safari for tea. "Spill or Step?" Safari reveals his dream of being a pilot and how a garage mechanic became a boda rider.',
      keyMoments: [
        'Uncle Rwamiti invites Safari to sit down: "Five minutes for tea?"',
        'Safari: "Five. The motorcycle owner does not accept tea as payment."',
        'Auntie introduces the game: "Spill, answer honestly. Step, take a small challenge."',
        'Safari on his childhood dream: "Pilot. I still carry passengers. Just closer to the ground."',
        'Safari\'s past: Worked at a car service garage until someone offered him a bike with daily owner payments.',
      ],
    },
    {
      pageNumber: 3,
      label: 'Page 3 · Riding on Pavements & Passenger Pressure',
      image: 'assets/comic-pages/ban-bodas/page-3.jpg',
      timeMarker: '11:28 AM — THE VERANDA',
      caption:
        'Jessica confronts Safari about pavement riding and red lights. Safari explains the economic pressure from late passengers—and the journey they shared earlier.',
      keyMoments: [
        'Jessica: "But riding on pavements? Going through red lights?"',
        'Safari: "I have used the pavement. Once, a woman had to jump away. I was chasing a fare. She was just walking."',
        'Safari on pressure: "This morning a passenger told me, ‘Use the side. I’m late.’ Sometimes I want the money."',
        'Flashback to their own ride: Jessica had pointed and insisted, "Safari, can’t you pass there? The other riders are passing."',
      ],
    },
    {
      pageNumber: 4,
      label: 'Page 4 · The Owner Calls & Your Move',
      image: 'assets/comic-pages/ban-bodas/page-4.jpg',
      timeMarker: '11:45 AM — DECISION TIME',
      caption:
        'Safari gets a call from the bike owner. Jessica admits: "If they banned you tomorrow, I don’t know how I’d get to work." Uncle Rwamiti shows Jessica her viral post.',
      keyMoments: [
        'Jessica to Safari: "And next time I tell you to use the pavement... Fair."',
        'Safari receives phone call: "The owner. Asking about his payment."',
        'Jessica admits mutual dependence: "If they banned you tomorrow, I honestly don’t know how I’d get to work. Neither do I."',
        'Uncle Rwamiti holds out phone with 452 likes and 217 comments: "Your post has plenty of passengers. Where are you taking them?"',
      ],
    },
  ],
  panels: [
    {
      id: 'bb-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-1.jpg',
      dayMarker: 'PANEL 1',
      timeMarker: '10:31 AM',
      caption: '1. KAMPALA, RUSH HOUR',
      settingDescription: 'Jammed road. Safari\'s motorcycle weaves past taxis and cars.',
      dialogue: [
        {
          character: 'Jessica N.',
          characterRole: 'Passenger • Commuter',
          avatarColor: 'rose',
          text: 'BAN BODAS. KAMPALA DESERVES BETTER.',
          side: 'left',
          bubbleType: 'thought',
        },
        {
          character: 'Safari',
          characterRole: 'Boda Rider • Safari',
          avatarColor: 'emerald',
          text: 'Madam, hold properly. We are moving.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-2.jpg',
      dayMarker: 'PANEL 2',
      timeMarker: '11:11 AM',
      caption: '2. AT UNCLE RWAMITI\'S HOME',
      settingDescription: 'Gate No. 12. Uncle Rwamiti stands at the gate smiling.',
      dialogue: [
        {
          character: 'Jessica',
          characterRole: 'Visitor',
          avatarColor: 'rose',
          text: 'Forty minutes late! This city!',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host & Mentor',
          avatarColor: 'amber',
          text: 'You came by car?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Jessica',
          characterRole: 'Visitor',
          avatarColor: 'rose',
          text: 'Would I have arrived?',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p3',
      panelNumber: 3,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-3.jpg',
      dayMarker: 'PANEL 3',
      timeMarker: '11:13 AM',
      caption: '3. THE FARE',
      settingDescription: 'Safari parks by the curb waiting for payment.',
      dialogue: [
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Should I wait until after the ban for my money?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Jessica',
          characterRole: 'Passenger',
          avatarColor: 'rose',
          text: 'Have you seen how they ride?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host',
          avatarColor: 'amber',
          text: 'You want bodas banned?',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-4.jpg',
      dayMarker: 'PANEL 4',
      timeMarker: '11:15 AM',
      caption: '4. OUTSIDE UNCLE RWAMITI\'S HOME',
      settingDescription: 'Veranda table with tea service and snacks.',
      dialogue: [
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host',
          avatarColor: 'amber',
          text: 'Five minutes for tea?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Five. The motorcycle owner does not accept tea as payment.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Auntie',
          characterRole: 'Hostess',
          avatarColor: 'amber',
          text: 'Spill or Step? Spill, answer honestly. Step, take a small challenge.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-5.jpg',
      dayMarker: 'PANEL 5',
      timeMarker: '11:18 AM',
      caption: '5. ON THE VERANDA',
      settingDescription: 'Safari holds his helmet, watching a child play with a wooden toy airplane.',
      dialogue: [
        {
          character: 'Jessica',
          characterRole: 'Guest',
          avatarColor: 'rose',
          text: 'Spill. Did you always want to ride a boda?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Pilot. I still carry passengers. Just closer to the ground.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host',
          avatarColor: 'amber',
          text: 'Captain Safari.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-6.jpg',
      dayMarker: 'PANEL 6',
      timeMarker: '11:22 AM',
      caption: '6. SAFARI\'S PAST',
      settingDescription: 'Car service garage with mechanics and tools.',
      dialogue: [
        {
          character: 'Safari',
          characterRole: 'Narrator',
          avatarColor: 'emerald',
          text: 'I helped at a garage. Some weeks there was work. Some weeks I waited. Then someone offered me a bike. A payment every day. I started earning.',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p7',
      panelNumber: 7,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-7.jpg',
      dayMarker: 'PANEL 7',
      timeMarker: '11:26 AM',
      caption: '7. BACK ON THE VERANDA',
      settingDescription: 'Jessica gestures in frustration over traffic risks.',
      dialogue: [
        {
          character: 'Jessica',
          characterRole: 'Passenger',
          avatarColor: 'rose',
          text: 'But riding on pavements? Going through red lights?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'I have used the pavement. Once, a woman had to jump away. I was chasing a fare. She was just walking.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p8',
      panelNumber: 8,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-8.jpg',
      dayMarker: 'PANEL 8',
      timeMarker: '11:30 AM',
      caption: '8. LOOKING TOWARDS THE ROAD',
      settingDescription: 'Street with billboard: A SAFER KAMPALA WORKS FOR ALL.',
      dialogue: [
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'This morning a passenger told me, "Use the side. I’m late." Sometimes I can refuse. Sometimes I want the money.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Jessica',
          characterRole: 'Passenger',
          avatarColor: 'rose',
          text: 'You could refuse.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p9',
      panelNumber: 9,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-9.jpg',
      dayMarker: 'PANEL 9',
      timeMarker: '11:35 AM',
      caption: '9. REMEMBERING THEIR JOURNEY',
      settingDescription: 'Flashback panel of Jessica urging Safari through traffic.',
      dialogue: [
        {
          character: 'Jessica',
          characterRole: 'Passenger',
          avatarColor: 'rose',
          text: 'You said there were people walking.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Yes. I told you the other riders were passing.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p10',
      panelNumber: 10,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-10.jpg',
      dayMarker: 'PANEL 10',
      timeMarker: '11:38 AM',
      caption: '10. BACK ON THE VERANDA',
      settingDescription: 'Jessica puts down her tea cup in contemplation.',
      dialogue: [
        {
          character: 'Jessica',
          characterRole: 'Passenger',
          avatarColor: 'rose',
          text: 'I still want you to obey the rules. And next time I tell you to use the pavement...',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Fair. I should remind you of your post?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host',
          avatarColor: 'amber',
          text: 'Screenshot it first.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p11',
      panelNumber: 11,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-11.jpg',
      dayMarker: 'PANEL 11',
      timeMarker: '11:42 AM',
      caption: '11. SAFARI LEAVES',
      settingDescription: 'Safari answers his phone while preparing his bike.',
      dialogue: [
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Yes, I’m coming. The owner. Asking about his payment.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Jessica',
          characterRole: 'Passenger',
          avatarColor: 'rose',
          text: 'If they banned you tomorrow, I honestly don’t know how I’d get to work.',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Safari',
          characterRole: 'Rider',
          avatarColor: 'emerald',
          text: 'Neither do I.',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bb-p12',
      panelNumber: 12,
      imageUrl: 'assets/comic-pages/ban-bodas/panel-12.jpg',
      dayMarker: 'PANEL 12',
      timeMarker: '11:45 AM',
      caption: '12. BACK ON THE VERANDA & YOUR MOVE',
      settingDescription: 'Uncle Rwamiti shows Jessica her post on his smartphone.',
      dialogue: [
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host & Mentor',
          avatarColor: 'amber',
          text: 'Your post has plenty of passengers. Where are you taking them?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Jessica',
          characterRole: 'Poster',
          avatarColor: 'rose',
          text: 'Give me a minute.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
      choices: [
        {
          id: 'bb-c1',
          label: 'Option A (Passenger Accountability): Enforce safety rules. I must stop asking riders to break them.',
          nextPanelId: 'bb-p12',
        },
        {
          id: 'bb-c2',
          label: 'Option B (Systemic Reality): Before talking bans, show us how people will get to work without gridlock.',
          nextPanelId: 'bb-p12',
        },
        {
          id: 'bb-c3',
          label: 'Option C (Rider Collaboration): Safari, what would help you earn a living while riding safely?',
          nextPanelId: 'bb-p12',
        },
        {
          id: 'bb-c4',
          label: 'Option D (Practical Action Extension): Stop asking riders to jump pavements; leave 15 min earlier; lobby the city for dedicated 2-wheel transit lanes.',
          nextPanelId: 'bb-p12',
        },
      ],
    },
  ],
};

export const COMIC_THEY_EXTENDED_HER_INTERNSHIP: ComicBook = {
  id: 'comic-they-extended-her-internship',
  slug: 'they-extended-her-internship',
  issueNumber: '003',
  title: 'They Extended Her Internship',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ONE POSSIBLE PATH (THE HOUSEHOLD BUDGET & THE REFERENCE)',
  description:
    'Nora graduated four years ago. Every weekday she leaves home before seven for an unpaid placement. When HR offers a 3-month extension without allowance, her father asks if they could extend his salary.',
  coverImage: 'assets/comic-pages/extended-internship/cover.jpg',
  pdfUrl: 'assets/aistudio/Uncle_Rwamiti_They_Extended_Her_Internship_Comic_a179f12f.pdf',
  releaseDate: 'October 2026',
  pageCount: 4,
  readingTimeMinutes: 4,
  tags: ['Kampala', 'Unpaid Internship', 'Graduate', 'Career', 'Family Finances', 'Employment', 'Cost of Living'],
  coverNote:
    'Issue #003 of the Uncle Rwamiti comic series. Explores the hidden cost of unpaid experience in corporate Kampala, where parents silently borrow to subsidize their children\'s career hopes.',
  rwamitiWisdom:
    'She was working. Her family was paying. The job was still a possibility. At what point does "gaining experience" turn into an expense your parents are borrowing to subsidize?',
  closingQuestion:
    'Before deciding whether to stay or leave an unpaid extension, what information, financial limit, or negotiated support would Nora need?',
  pollOptions: [
    'A strict financial limit: Cap unpaid placement at 1 month before family borrowings begin',
    'Negotiated support: Request a daily transport stipend or 2-day-a-week schedule to free up job search time',
    'Written milestones: Require a clear date and criteria for when the vacancy will become paid',
    'A clean exit: Accept the reference letter now and protect household finances while applying for paid work',
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Cover · The Envelope & The Extension',
      image: 'assets/comic-pages/extended-internship/page-1.jpg',
      caption:
        'Nora shows her parents the email: "They want to keep me!" Her father looks up from the newspaper: "Wonderful. How much?" On the table lies the envelope: Transport Money.',
      keyMoments: [
        'Nora shows HR email: "Your internship has been extended for another 6 months."',
        'Father asks the core financial question: "Wonderful. How much?"',
        'Envelope labeled "Transport Money" on the dining table',
        'Poster on the wall: "A Brighter Uganda Together"',
      ],
    },
    {
      pageNumber: 2,
      label: 'Panels 1–4 · The Office & The Email',
      image: 'assets/comic-pages/extended-internship/page-2.jpg',
      caption:
        'Nora has been punctual and indispensable at the office. HR sends an email extending her unpaid placement for 3 months. The supervisor confirms there is no budget.',
      keyMoments: [
        '1. Someone who leaves for work: Nora graduated four years ago, leaves home before 7:00 AM every weekday.',
        '2. Useful at the office: Colleagues praise her: "Nora, please finish this before lunch. We’d be lost without you."',
        '3. Good news: HR email arrives: "We would like to extend your placement for a further three months."',
        '4. Not yet: Nora asks: "Will there be an allowance this time?" Supervisor: "There’s no approved budget. But a vacancy may come up. I can’t promise a date."',
      ],
    },
    {
      pageNumber: 3,
      label: 'Panels 5–8 · The Household Budget & The Request',
      image: 'assets/comic-pages/extended-internship/page-3.jpg',
      caption:
        'At home, her father opens the household expenses book: food, electricity, transport. Nora realizes her parents are subsidizing free corporate labor. She makes a dignified decision.',
      keyMoments: [
        '5. What leaving the house means: Nora: "At least when I go there, I have somewhere to be. People will ask what happened."',
        '6. The bill at home: Father shows the ledger: "I can help with transport for another month. After that, I would be borrowing. I kept hoping you wouldn’t need to."',
        '7. An answer nobody likes: Mother: "We pay for another three months of \'may\'." Nora realizes someone else will take the unpaid slot.',
        '8. A practical request: Nora tells her supervisor: "I can finish my current placement. I can’t afford another three unpaid months. Could I have a reference describing the work I’ve done?"',
      ],
    },
    {
      pageNumber: 4,
      label: 'Panels 9–10 & Takeaway · Exit & Monday Morning',
      image: 'assets/comic-pages/extended-internship/page-4.jpg',
      caption:
        'Nora collects her reference letter on Friday. On Monday morning, mother and daughter review transport money together. Uncle Rwamiti poses the question.',
      keyMoments: [
        '9. No surprise offer: Friday afternoon. Colleagues say goodbye; supervisor hands over the reference letter with no counter-offer.',
        '10. Monday morning: Nora is at home following up two paid applications. Mother: "Shall we look at the transport money together?"',
        'Monday was still uncertain, but this time the cost was on the table.',
        'Uncle Rwamiti Verdict: "She was working. Her family was paying. The job was still a possibility. What would you need before deciding?"',
      ],
    },
  ],
  panels: [
    {
      id: 'ei-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/extended-internship/panel-1.jpg',
      dayMarker: 'PANEL 1',
      timeMarker: 'WEEKDAY MORNING',
      caption: '1. SOMEONE WHO LEAVES FOR WORK',
      settingDescription: 'Nora graduated four years ago. Every weekday, she leaves home before seven.',
      dialogue: [
        {
          character: 'Mother',
          characterRole: 'Mum',
          avatarColor: 'amber',
          text: 'You’ll be late.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'They notice.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/extended-internship/panel-2.jpg',
      dayMarker: 'PANEL 2',
      timeMarker: 'AT THE OFFICE',
      caption: '2. USEFUL AT THE OFFICE',
      settingDescription: 'Her three-month unpaid placement is ending on Friday.',
      dialogue: [
        {
          character: 'Supervisor',
          characterRole: 'Manager',
          avatarColor: 'zinc',
          text: 'Nora, please finish this before lunch. We’d be lost without you.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p3',
      panelNumber: 3,
      imageUrl: 'assets/comic-pages/extended-internship/panel-3.jpg',
      dayMarker: 'PANEL 3',
      timeMarker: 'FRIDAY AT THE OFFICE',
      caption: '3. GOOD NEWS',
      settingDescription: 'Email from HR: “We would like to extend your placement for a further three months.”',
      dialogue: [
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'Will there be an allowance this time?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Supervisor',
          characterRole: 'Manager',
          avatarColor: 'zinc',
          text: 'It shows we value your contribution.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/extended-internship/panel-4.jpg',
      dayMarker: 'PANEL 4',
      timeMarker: 'SUPERVISOR’S DESK',
      caption: '4. NOT YET',
      settingDescription: 'Nora asks about budget and hiring timeline.',
      dialogue: [
        {
          character: 'Supervisor',
          characterRole: 'Manager',
          avatarColor: 'zinc',
          text: 'There’s no approved budget. But a vacancy may come up. I can’t promise a date.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/extended-internship/panel-5.jpg',
      dayMarker: 'PANEL 5',
      timeMarker: 'DINNER TABLE',
      caption: '5. WHAT LEAVING THE HOUSE MEANS',
      settingDescription: 'Nora explains why leaving the placement is emotionally difficult.',
      dialogue: [
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'At least when I go there, I have somewhere to be.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Mother',
          characterRole: 'Mum',
          avatarColor: 'amber',
          text: 'And if you stop?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'People will ask what happened. I’ll have to say I’m home again.',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/extended-internship/panel-6.jpg',
      dayMarker: 'PANEL 6',
      timeMarker: 'DINNER TABLE',
      caption: '6. THE BILL AT HOME',
      settingDescription: 'Father opens the Household Expenses notebook: Food, Electricity, Transport, Other needs.',
      dialogue: [
        {
          character: 'Father',
          characterRole: 'Dad',
          avatarColor: 'zinc',
          text: 'I can help with transport for another month. After that, I would be borrowing. I kept hoping you wouldn’t need to.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'I didn’t know that.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p7',
      panelNumber: 7,
      imageUrl: 'assets/comic-pages/extended-internship/panel-7.jpg',
      dayMarker: 'PANEL 7',
      timeMarker: 'DINNER TABLE',
      caption: '7. AN ANSWER NOBODY LIKES',
      settingDescription: 'Nora and her parents weigh both options honestly.',
      dialogue: [
        {
          character: 'Father',
          characterRole: 'Dad',
          avatarColor: 'zinc',
          text: 'What happens if you refuse? And if you accept?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'Someone else will probably take it. And if I accept, we pay for another three months of ‘may’.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p8',
      panelNumber: 8,
      imageUrl: 'assets/comic-pages/extended-internship/panel-8.jpg',
      dayMarker: 'PANEL 8',
      timeMarker: 'NEXT DAY — AT THE OFFICE',
      caption: '8. A PRACTICAL REQUEST',
      settingDescription: 'Supervisor’s office desk. Nora states her limit clearly and asks for a reference.',
      dialogue: [
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'I can finish my current placement. I can’t afford another three unpaid months. Could I have a reference describing the work I’ve done?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Supervisor',
          characterRole: 'Manager',
          avatarColor: 'zinc',
          text: 'I understand.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p9',
      panelNumber: 9,
      imageUrl: 'assets/comic-pages/extended-internship/panel-9.jpg',
      dayMarker: 'PANEL 9',
      timeMarker: 'FRIDAY AFTERNOON',
      caption: '9. NO SURPRISE OFFER',
      settingDescription: 'Friday afternoon. There was no last-minute job offer. Nora leaves with her Reference Letter.',
      dialogue: [
        {
          character: 'Colleague',
          characterRole: 'Coworker',
          avatarColor: 'amber',
          text: 'All the best, Nora!',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Nora',
          characterRole: 'Graduate',
          avatarColor: 'blue',
          text: 'Thank you.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Supervisor',
          characterRole: 'Manager',
          avatarColor: 'zinc',
          text: 'Send us your updated CV. We’ll keep it on file.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p10',
      panelNumber: 10,
      imageUrl: 'assets/comic-pages/extended-internship/panel-10.jpg',
      dayMarker: 'PANEL 10',
      timeMarker: 'MONDAY MORNING',
      caption: '10. MONDAY MORNING & YOUR MOVE',
      settingDescription: 'Monday morning at home. Reference Letter on the table beside Nora’s laptop.',
      dialogue: [
        {
          character: 'Mother',
          characterRole: 'Mum',
          avatarColor: 'amber',
          text: 'What are you doing today? I’m asking, Nora. Shall we look at the transport money together?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Nora',
          characterRole: 'Graduate',
          avatarColor: 'blue',
          text: 'Following up two applications. Then I need to work out what I can afford to keep trying.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Narrator',
          characterRole: 'Uncle Rwamiti Takeaway',
          avatarColor: 'amber',
          text: 'Monday was still uncertain. This time, the cost was on the table. She was working. Her family was paying. The job was still a possibility.',
          side: 'right',
          bubbleType: 'thought',
        },
      ],
      choices: [
        {
          id: 'ei-c1',
          label: 'Information needed first: Confirm whether an approved budget and hiring date actually exist',
          nextPanelId: 'ei-p10',
        },
        {
          id: 'ei-c2',
          label: 'Household financial limit: Cap unpaid time before the family has to borrow for transport',
          nextPanelId: 'ei-p10',
        },
        {
          id: 'ei-c3',
          label: 'Negotiated support: Request a transport allowance or a 2-day weekly schedule',
          nextPanelId: 'ei-p10',
        },
        {
          id: 'ei-c4',
          label: 'Documented exit: Secure a written reference describing the work completed before stepping away',
          nextPanelId: 'ei-p10',
        },
      ],
    },
  ],
};

export const COMIC_MY_SON_DOES_NOT_WORK_HERE: ComicBook = {
  id: 'comic-my-son-does-not-work-here',
  slug: 'my-son-does-not-work-here',
  issueNumber: '004',
  title: 'My Son Does Not Work Here',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ONE POSSIBLE PATH (JOEL, DAVID & THE TERRACE RESTAURANT)',
  description:
    '“My son finished law last year. We are waiting for the right opening.” Then David looks up from his lunch table and sees his son wearing an apron with a tray of food.',
  coverImage: 'assets/comic-pages/my-son-does-not-work-here/cover.jpg',
  pdfUrl: 'assets/aistudio/Uncle_Rwamiti_My_Son_Does_Not_Work_Here_Comic_2d4f6d49.pdf',
  releaseDate: 'October 2026',
  pageCount: 9,
  readingTimeMinutes: 5,
  tags: [
    'Kampala',
    'Graduate',
    'Pride vs Survival',
    'Family Dilemma',
    'Law Degree',
    'Restaurant',
    'Your Move',
  ],
  coverNote:
    'Issue #004 of the Uncle Rwamiti comic series. Explores parental expectations, modern graduate realities, and dignity versus rent. Character clarification: David is the balding father in the checked shirt; Uncle Rwamiti is the grey-haired mentor in spectacles and blazer.',
  rwamitiWisdom:
    'Joel asked a question that hung over the entire table: who pays the landlord this month? Does David’s sharp reaction come from wounded pride before professional peers, fear that the world he prepared his son for has vanished, disappointment after years of tuition sacrifice, or genuine protective anxiety? The story lets readers weigh what truly drove his silence.',
  closingQuestion:
    'You are Joel. The interview is tomorrow at ten. Your shift starts at nine. You already missed one morning last week. Which conversation do you begin?',
  pollOptions: [
    'A. Ask your manager for another morning off. He covered your last absence himself.',
    'B. Ask Grace for a different interview time. She has already said tomorrow morning is unusually free.',
    'C. Ask your father to cover your rent if you lose the job. Ask him now, before everyone leaves.',
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Page 1 · The Right Opening',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-1.jpg',
      timeMarker: '1:10 PM · TERRACE RESTAURANT',
      caption:
        'David to colleagues: “My son finished law last year. We’re waiting for the right opening.” Grace: “Tell him to send his CV.”',
      keyMoments: [
        'David having lunch with professional colleagues at the Terrace Restaurant',
        'Boasting about Joel finishing law school last year',
        'Grace offers an opening in her firm',
      ],
    },
    {
      pageNumber: 2,
      label: 'Page 2 · The Arrival',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-2.jpg',
      timeMarker: '1:12 PM',
      caption:
        'Joel arrives carrying the meal tray with name tag “JOEL”: “Good afternoon.” Grace: “David! Isn’t this your boy?”',
      keyMoments: [
        'Joel arrives with a full tray of grilled meals',
        'Grace recognizes Joel immediately',
        'David freezes at the sight',
      ],
    },
    {
      pageNumber: 3,
      label: 'Page 3 · Just Helping Someone',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-3.jpg',
      timeMarker: '1:14 PM',
      caption:
        'David: “My son does not work here. He’s just helping someone.” Joel: “I work here, Dad.”',
      keyMoments: [
        'David tries to explain it away to preserve status',
        'Joel stands firm in his reality: “I work here, Dad.”',
      ],
    },
    {
      pageNumber: 4,
      label: 'Page 4 · Wearing a Uniform',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-4.jpg',
      timeMarker: '1:16 PM',
      caption:
        'David: “You told me you were doing something temporary. But you’re wearing a uniform.” Joel: “It is temporary. They don’t give temporary people different clothes.”',
      keyMoments: [
        'Confrontation over the waiter uniform',
        'Joel’s practical response about honest survival',
      ],
    },
    {
      pageNumber: 5,
      label: 'Page 5 · The Firm’s Opening',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-5.jpg',
      timeMarker: '1:18 PM',
      caption:
        'Manager in background: “Joel! Table six!” Grace: “My firm may need a junior. Tomorrow at ten is unusually free. Could you come?”',
      keyMoments: [
        'Restaurant pressure: Manager calls Joel for Table six',
        'Grace offers an interview slot tomorrow at 10 AM',
      ],
    },
    {
      pageNumber: 6,
      label: 'Page 6 · Missing a Morning',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-6.jpg',
      timeMarker: '1:20 PM',
      caption:
        'David: “Of course he’ll come. You can miss one morning.” Joel: “I’m on shift. I missed one last week for an interview.”',
      keyMoments: [
        'David dismisses the restaurant shift',
        'Joel points out the risk of losing his job',
      ],
    },
    {
      pageNumber: 7,
      label: 'Page 7 · Carrying Plates',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-7.jpg',
      timeMarker: '1:22 PM',
      caption:
        'David: “Then leave this place. We didn’t pay for law school so you could carry plates.” Joel: “Dad. Who do I tell my landlord is paying this month?”',
      keyMoments: [
        'David commands Joel to quit the restaurant',
        'The core Kampala dilemma: who pays the rent right now?',
      ],
    },
    {
      pageNumber: 8,
      label: 'Page 8 · The Question Stays',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-8.jpg',
      timeMarker: '1:24 PM',
      caption:
        'David: “Say something.” Uncle Rwamiti: “Joel asked you a question.”',
      keyMoments: [
        'David appeals to his elder colleague for support',
        'Uncle Rwamiti holds the mirror: “Joel asked you a question.”',
      ],
    },
    {
      pageNumber: 9,
      label: 'Page 9 · Your Move: Choose A, B, or C',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-9.jpg',
      timeMarker: 'DECISION TIME',
      caption:
        'You are Joel. Interview tomorrow at 10 AM, shift starts at 9 AM. Choose: A (Ask manager), B (Ask Grace), or C (Ask father for rent).',
      keyMoments: [
        'Option A: Ask manager for another morning off',
        'Option B: Ask Grace for a different interview time',
        'Option C: Ask father to cover rent if the job is lost',
      ],
    },
  ],
  panels: [
    {
      id: 'ms-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-1.jpg',
      dayMarker: 'PROLOGUE',
      timeMarker: '1:10 PM',
      caption: '1. THE RIGHT OPENING',
      settingDescription: 'The Terrace Restaurant, Kampala. David and professional colleagues.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'My son finished law last year. We’re waiting for the right opening.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Grace',
          characterRole: 'Colleague • Law Firm Partner',
          avatarColor: 'blue',
          text: 'Tell him to send his CV.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-2.jpg',
      dayMarker: 'PANEL 2',
      timeMarker: '1:12 PM',
      caption: '2. THE ARRIVAL',
      settingDescription: 'Joel arrives with the order.',
      dialogue: [
        {
          character: 'Joel',
          characterRole: 'Waiter • Son',
          avatarColor: 'emerald',
          text: 'Good afternoon.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Grace',
          characterRole: 'Colleague',
          avatarColor: 'blue',
          text: 'David! Isn’t this your boy?',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p3',
      panelNumber: 3,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-3.jpg',
      dayMarker: 'PANEL 3',
      timeMarker: '1:14 PM',
      caption: '3. JUST HELPING SOMEONE',
      settingDescription: 'David’s shock and denial.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'My son does not work here. He’s just helping someone.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Joel',
          characterRole: 'Waiter • Son',
          avatarColor: 'emerald',
          text: 'I work here, Dad.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-4.jpg',
      dayMarker: 'PANEL 4',
      timeMarker: '1:16 PM',
      caption: '4. WEARING A UNIFORM',
      settingDescription: 'David and Joel facing reality.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'You told me you were doing something temporary. But you’re wearing a uniform.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Joel',
          characterRole: 'Son',
          avatarColor: 'emerald',
          text: 'It is temporary. They don’t give temporary people different clothes.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-5.jpg',
      dayMarker: 'PANEL 5',
      timeMarker: '1:18 PM',
      caption: '5. THE FIRM’S OPENING',
      settingDescription: 'Grace extends an invitation.',
      dialogue: [
        {
          character: 'Manager',
          characterRole: 'Restaurant Manager',
          avatarColor: 'slate',
          text: 'Joel! Table six!',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Grace',
          characterRole: 'Law Firm Partner',
          avatarColor: 'blue',
          text: 'My firm may need a junior. Tomorrow at ten is unusually free. Could you come?',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-6.jpg',
      dayMarker: 'PANEL 6',
      timeMarker: '1:20 PM',
      caption: '6. MISSING A MORNING',
      settingDescription: 'The conflict of responsibility.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'Of course he’ll come. You can miss one morning.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Joel',
          characterRole: 'Son',
          avatarColor: 'emerald',
          text: 'I’m on shift. I missed one last week for an interview.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p7',
      panelNumber: 7,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-7.jpg',
      dayMarker: 'PANEL 7',
      timeMarker: '1:22 PM',
      caption: '7. CARRYING PLATES & THE RENT',
      settingDescription: 'Pride vs living expenses.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'Then leave this place. We didn’t pay for law school so you could carry plates.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Joel',
          characterRole: 'Son',
          avatarColor: 'emerald',
          text: 'Dad. Who do I tell my landlord is paying this month?',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p8',
      panelNumber: 8,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-8.jpg',
      dayMarker: 'PANEL 8',
      timeMarker: '1:24 PM',
      caption: '8. THE QUESTION STAYS',
      settingDescription: 'Uncle Rwamiti speaks.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'Say something.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Observer & Guide',
          avatarColor: 'amber',
          text: 'Joel asked you a question.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p9',
      panelNumber: 9,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-9.jpg',
      dayMarker: 'DECISION TIME',
      timeMarker: '1:26 PM · YOUR MOVE',
      caption: '9. YOUR MOVE: THREE DIFFICULT CONVERSATIONS',
      settingDescription:
        'Joel stands holding his tray. David (the balding man in the checked shirt) stares at the table. Grace watches quietly. Uncle Rwamiti looks on.',
      dialogue: [
        {
          character: 'Joel',
          characterRole: 'Graduate & Waiter',
          avatarColor: 'emerald',
          text: 'The interview is tomorrow at ten. My shift starts at nine. I already missed one morning last week. Which conversation do I begin?',
          side: 'left',
          bubbleType: 'thought',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Observer & Guide',
          avatarColor: 'amber',
          text: 'Every door comes with a cost. David is waiting for your move.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
      choices: [
        {
          id: 'ms-c1',
          label: 'A. Ask your manager for another morning off. He covered your last absence himself.',
          nextPanelId: 'ms-p9',
        },
        {
          id: 'ms-c2',
          label: 'B. Ask Grace for a different interview time. She has already said tomorrow morning is unusually free.',
          nextPanelId: 'ms-p9',
        },
        {
          id: 'ms-c3',
          label: 'C. Ask your father to cover your rent if you lose the job. Ask him now, before everyone leaves.',
          nextPanelId: 'ms-p9',
        },
      ],
    },
  ],
};

export const COMIC_BECAUSE_I_SAID_SO: ComicBook = {
  id: 'comic-because-i-said-so',
  slug: 'because-i-said-so-comic',
  issueNumber: '005',
  title: 'Because I Said So.',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ILLUSTRATED COMIC (EVA & MUM: KATETE, OUTSIDE MBARARA)',
  description:
    'In Katete, just outside Mbarara, sixteen-year-old Eva is invited to a Saturday digital illustration workshop. She has read the programme, her teacher confirmed the invitation, and her aunt agreed to take her and bring her back. Her mother says no without looking at the screen.',
  coverImage: 'assets/comic-pages/because-i-said-so/cover.jpg',
  pdfUrl: 'assets/aistudio/Because_I_Said_So_Uncle_Rwamiti_Comic_313c251b.pdf',
  releaseDate: 'October 2026',
  pageCount: 5,
  readingTimeMinutes: 4,
  tags: [
    'Family Dilemma',
    'Parenting',
    'Teen Stories',
    'Digital Illustration',
    'Mbarara',
    'Authority vs Evidence',
    'Communication',
    'Comic Strip',
  ],
  coverNote:
    'Issue #005 of the Uncle Rwamiti comic series. Eva, 16, in Katete outside Mbarara, has spent months learning digital illustration and prepared every detail for a Saturday workshop—the programme, her teacher’s confirmation, and her aunt’s accompaniment.',
  rwamitiWisdom:
    'A parent’s duty is to guide and protect. A refusal to look is something else. When authority feels questioned, the conversation stops being about the evidence.',
  closingQuestion:
    'You are Eva. Your mother has said “No. Because I said so” without reading the details. What do you do next?',
  pollOptions: [
    'A • CHALLENGE HER DIRECTLY: “About this subject, I do know more. Please look before deciding.”',
    'B • WITHDRAW: “Okay, Mum.” Put the phone away and stop explaining.',
    'C • TRY TO KEEP THE CONVERSATION OPEN: “You can still guide me. Can I first show you what I’ve learned?”',
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Cover · Because I Said So.',
      image: 'assets/comic-pages/because-i-said-so/cover.jpg',
      timeMarker: 'KATETE · OUTSIDE MBARARA',
      caption:
        'Eva has done her homework. Her mother hears backtalk. Read the comic. Then make Eva’s next move in the game.',
      keyMoments: [
        'Eva, 16, in Katete just outside Mbarara',
        'Saturday Digital Illustration Workshop invitation on her phone',
        'Mum’s refusal: “No. Because I said so.”',
        'Uncle Rwamiti observes the tension between authority and evidence',
      ],
    },
    {
      pageNumber: 2,
      label: 'Panels 1–4 · The Invitation & “Get a Pencil”',
      image: 'assets/comic-pages/because-i-said-so/page-1a.jpg',
      timeMarker: 'PANELS 1–4',
      caption:
        '1. Eva has spent months learning digital illustration on her phone. 2. She tries to show her mother the Saturday workshop in Mbarara. 3. “Eva, drawing is drawing. Get a pencil.” 4. Eva explains that people use digital illustration for books, posters, and business work.',
      keyMoments: [
        'Panel 1: In Katete, just outside Mbarara, Eva is sixteen and has spent months learning digital illustration on her phone',
        'Panel 2: Eva: “Mum, there’s a digital illustration workshop in Mbarara on Saturday. Look—”',
        'Panel 3: Mum: “Another day playing on a phone? Eva, drawing is drawing. Get a pencil.”',
        'Panel 4: Eva: “It’s digital illustration, Mum. People use it for books, posters and business work.”',
      ],
    },
    {
      pageNumber: 3,
      label: 'Panels 5–8 · Authority vs. Evidence',
      image: 'assets/comic-pages/because-i-said-so/page-1b.jpg',
      timeMarker: 'PANELS 5–8',
      caption:
        '5. “So now you know more than your mother?” 6. “About this, I’ve been learning for months—” / “And I have been your mother for sixteen years.” 7. Eva explains she read the programme, her teacher confirmed the invitation, and her aunt can take her and bring her back. 8. Mum dismisses it as a distraction from school.',
      keyMoments: [
        'Panel 5: Mum: “I went to school before you were born. So now you know more than your mother?”',
        'Panel 6: Eva: “About this, I’ve been learning for months—” Mum: “And I have been your mother for sixteen years.”',
        'Panel 7: Eva: “Did you even look at the details? I read the programme, my teacher confirmed the invitation, and Aunt can take me and bring me back.”',
        'Panel 8: Mum: “These things are a distraction. You have school. You should focus on real subjects.”',
      ],
    },
    {
      pageNumber: 4,
      label: 'Panels 9–10 · “No. Because I Said So.”',
      image: 'assets/comic-pages/because-i-said-so/page-1c.jpg',
      timeMarker: 'PANELS 9–10',
      caption:
        '9. Mum delivers her final word without looking at the screen: “No. Because I said so.” 10. Eva stands holding the phone she was not allowed to show.',
      keyMoments: [
        'Panel 9: Mum: “No. Because I said so.”',
        'Panel 10: Eva stands with her phone in hand—her evidence still unread',
      ],
    },
    {
      pageNumber: 5,
      label: 'Your Move · Three Choices & The Game',
      image: 'assets/comic-pages/because-i-said-so/page-2.jpg',
      timeMarker: 'YOUR MOVE',
      caption:
        'Uncle Rwamiti: “A parent’s duty is to guide and protect. A refusal to look is something else. When authority feels questioned, the conversation stops being about the evidence.” Choose A, B, or C.',
      keyMoments: [
        'A • Challenge her directly: “About this subject, I do know more. Please look before deciding.”',
        'B • Withdraw: “Okay, Mum.” Put the phone away and stop explaining.',
        'C • Try to keep the conversation open: “You can still guide me. Can I first show you what I’ve learned?”',
      ],
    },
  ],
  panels: [
    {
      id: 'bis-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-1.jpg',
      dayMarker: 'KATETE · OUTSIDE MBARARA',
      timeMarker: 'PANEL 1',
      caption: '1. MONTHS OF LEARNING',
      settingDescription: 'In Katete, just outside Mbarara, Eva is sixteen. She has spent months learning digital illustration on her phone.',
      dialogue: [
        {
          character: 'Narrator',
          characterRole: 'Katete, Outside Mbarara',
          avatarColor: 'purple',
          text: 'In Katete, just outside Mbarara, Eva is sixteen. She has spent months learning digital illustration on her phone.',
          side: 'left',
          bubbleType: 'thought',
        },
      ],
    },
    {
      id: 'bis-p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-2.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 2',
      caption: '2. THE SATURDAY WORKSHOP',
      settingDescription: 'Eva approaches her mother holding out her phone.',
      dialogue: [
        {
          character: 'Eva',
          characterRole: '16 • Illustrator',
          avatarColor: 'purple',
          text: 'Mum, there’s a digital illustration workshop in Mbarara on Saturday. Look—',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p3',
      panelNumber: 3,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-3.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 3',
      caption: '3. “DRAWING IS DRAWING. GET A PENCIL.”',
      settingDescription: 'Her mother replies without looking at the phone screen.',
      dialogue: [
        {
          character: 'Mum',
          characterRole: 'Mother',
          avatarColor: 'amber',
          text: 'Another day playing on a phone? Eva, drawing is drawing. Get a pencil.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-4.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 4',
      caption: '4. WHAT DIGITAL ILLUSTRATION IS FOR',
      settingDescription: 'Eva explains what the skill is actually used for.',
      dialogue: [
        {
          character: 'Eva',
          characterRole: '16 • Illustrator',
          avatarColor: 'purple',
          text: 'It’s digital illustration, Mum. People use it for books, posters and business work.',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-5.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 5',
      caption: '5. “SO NOW YOU KNOW MORE THAN YOUR MOTHER?”',
      settingDescription: 'Her mother’s tone sharpens.',
      dialogue: [
        {
          character: 'Mum',
          characterRole: 'Mother',
          avatarColor: 'amber',
          text: 'I went to school before you were born. So now you know more than your mother?',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-6.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 6',
      caption: '6. MONTHS OF LEARNING VS. SIXTEEN YEARS OF MOTHERHOOD',
      settingDescription: 'Eva tries to distinguish subject knowledge from parental authority.',
      dialogue: [
        {
          character: 'Eva',
          characterRole: '16 • Illustrator',
          avatarColor: 'purple',
          text: 'About this, I’ve been learning for months—',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Mum',
          characterRole: 'Mother',
          avatarColor: 'amber',
          text: 'And I have been your mother for sixteen years.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p7',
      panelNumber: 7,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-7.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 7',
      caption: '7. EVA’S PREPARATION & EVIDENCE',
      settingDescription: 'Eva presents the three things she verified beforehand.',
      dialogue: [
        {
          character: 'Eva',
          characterRole: '16 • Illustrator',
          avatarColor: 'purple',
          text: 'Did you even look at the details? I read the programme, my teacher confirmed the invitation, and Aunt can take me and bring me back.',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p8',
      panelNumber: 8,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-8.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 8',
      caption: '8. “THESE THINGS ARE A DISTRACTION.”',
      settingDescription: 'Her mother still does not look at the screen, pointing to school focus.',
      dialogue: [
        {
          character: 'Mum',
          characterRole: 'Mother',
          avatarColor: 'amber',
          text: 'These things are a distraction. You have school. You should focus on real subjects.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p9',
      panelNumber: 9,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-9.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 9',
      caption: '9. “NO. BECAUSE I SAID SO.”',
      settingDescription: 'Her mother closes the discussion.',
      dialogue: [
        {
          character: 'Mum',
          characterRole: 'Mother',
          avatarColor: 'amber',
          text: 'No. Because I said so.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'bis-p10',
      panelNumber: 10,
      imageUrl: 'assets/comic-pages/because-i-said-so/panel-10.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'PANEL 10',
      caption: '10. THE UNREAD SCREEN',
      settingDescription: 'Eva stands holding the phone she was not allowed to show.',
      dialogue: [
        {
          character: 'Eva',
          characterRole: '16 • Illustrator',
          avatarColor: 'purple',
          text: 'I read the programme, my teacher confirmed it, and Aunt agreed to take me and bring me back—yet she said no without looking.',
          side: 'left',
          bubbleType: 'thought',
        },
      ],
    },
    {
      id: 'bis-p11',
      panelNumber: 11,
      imageUrl: 'assets/comic-pages/because-i-said-so/page-2.jpg',
      dayMarker: 'DECISION TIME',
      timeMarker: 'YOUR MOVE',
      caption: '11. YOUR MOVE: WHAT DO YOU DO NEXT?',
      settingDescription: 'You are Eva. Your mother has said no without reading the details. What do you do next?',
      dialogue: [
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host & Mentor',
          avatarColor: 'amber',
          text: 'A parent’s duty is to guide and protect. A refusal to look is something else. When authority feels questioned, the conversation stops being about the evidence.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
      choices: [
        {
          id: 'bis-c1',
          label: 'A • CHALLENGE HER DIRECTLY — “About this subject, I do know more. Please look before deciding.”',
          nextPanelId: 'bis-p11',
        },
        {
          id: 'bis-c2',
          label: 'B • WITHDRAW — “Okay, Mum.” Put the phone away and stop explaining.',
          nextPanelId: 'bis-p11',
        },
        {
          id: 'bis-c3',
          label: 'C • TRY TO KEEP THE CONVERSATION OPEN — “You can still guide me. Can I first show you what I’ve learned?”',
          nextPanelId: 'bis-p11',
        },
      ],
    },
  ],
};

// INITIAL_COMICS contains all 5 issues
export const INITIAL_COMICS: ComicBook[] = [
  ATTACHED_COMIC,
  COMIC_BAN_BODAS,
  COMIC_THEY_EXTENDED_HER_INTERNSHIP,
  COMIC_MY_SON_DOES_NOT_WORK_HERE,
  COMIC_BECAUSE_I_SAID_SO,
];

export function getStoredComics(): ComicBook[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CUSTOM_COMICS_KEY) : null;
    if (!raw) return INITIAL_COMICS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const customOnes = parsed.filter(
        (c) => !INITIAL_COMICS.some((init) => init.id === c.id || init.slug === c.slug)
      );
      return [...INITIAL_COMICS, ...customOnes];
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_COMICS;
}

export function saveCustomComic(comic: ComicBook): ComicBook[] {
  const current = getStoredComics();
  const exists = current.some((c) => c.id === comic.id || c.slug === comic.slug);
  const updated = exists
    ? current.map((c) => (c.id === comic.id || c.slug === comic.slug ? comic : c))
    : [...current, comic];
  try {
    if (typeof window !== 'undefined') {
      const customOnly = updated.filter(
        (c) => !INITIAL_COMICS.some((init) => init.id === c.id || init.slug === c.slug)
      );
      localStorage.setItem(CUSTOM_COMICS_KEY, JSON.stringify(customOnly));
    }
  } catch (e) {}
  return updated;
}

export function deleteCustomComic(comicId: string): ComicBook[] {
  const current = getStoredComics();
  const updated = current.filter((c) => c.id !== comicId && c.slug !== comicId);
  try {
    if (typeof window !== 'undefined') {
      const customOnly = updated.filter(
        (c) => !INITIAL_COMICS.some((init) => init.id === c.id || init.slug === c.slug)
      );
      localStorage.setItem(CUSTOM_COMICS_KEY, JSON.stringify(customOnly));
    }
  } catch (e) {}
  return updated;
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
    keywords: `Comics Comic Books ${comic.title} Uncle Rwamiti Kampala ${comic.tags.join(' ')}`,
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

