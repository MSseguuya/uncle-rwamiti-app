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
    'Your post has plenty of passengers. Where are you taking them? When you ban the boda, do you have a plan for the city, or just anger at the traffic?',
  closingQuestion:
    'You are Jessica. What would you write now on your viral post?',
  pollOptions: [
    'Enforce the safety rules. I must stop asking riders to break them.',
    'Before banning bodas, show us how people will get to work.',
    'Safari, what would help you earn a living while riding safely?',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-1.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-1.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-1.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-2.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-2.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-2.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-3.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-3.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-3.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-4.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-4.jpg',
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
      imageUrl: 'assets/comic-pages/ban-bodas/page-4.jpg',
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
          label: 'A: Enforce the safety rules. I must stop asking riders to break them.',
          nextPanelId: 'bb-p12',
        },
        {
          id: 'bb-c2',
          label: 'B: Before banning bodas, show us how people will get to work.',
          nextPanelId: 'bb-p12',
        },
        {
          id: 'bb-c3',
          label: 'C: Safari, what would help you earn a living while riding safely?',
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
    'Was leaving the unpaid placement the right decision for Nora?',
  pollOptions: [
    'Yes — unpaid extensions with no budget rarely convert to real jobs',
    'No — stay in the office where you are visible and a vacancy might open',
    'Negotiate a transport stipend first before walking away',
    'Take the reference letter and focus fully on paid applications',
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
      label: 'Panels 9–12 · The Household Budget & The Request',
      image: 'assets/comic-pages/extended-internship/page-3.jpg',
      caption:
        'At home, her father opens the household expenses book: food, electricity, transport. Nora realizes her parents are subsidizing free corporate labor. She makes a dignified decision.',
      keyMoments: [
        '9. What leaving the house means: Nora: "At least when I go there, I have somewhere to be. People will ask what happened."',
        '10. The bill at home: Father shows the ledger: "I can help with transport for another month. After that, I would be borrowing. I kept hoping you wouldn’t need to."',
        '11. An answer nobody likes: Mother: "We pay for another three months of \'may\'." Nora realizes someone else will take the unpaid slot.',
        '12. A practical request: Nora tells her supervisor: "I can finish my current placement. I can’t afford another three unpaid months. Could I have a reference describing the work I’ve done?"',
      ],
    },
    {
      pageNumber: 4,
      label: 'Panels 13–14 & Takeaway · Exit & Monday Morning',
      image: 'assets/comic-pages/extended-internship/page-4.jpg',
      caption:
        'Nora collects her reference letter on Friday. On Monday morning, mother and daughter review transport money together. Uncle Rwamiti poses the question.',
      keyMoments: [
        '13. No surprise offer: Friday afternoon. Colleagues say goodbye; supervisor hands over the reference letter with no counter-offer.',
        '14. Monday morning: Nora is at home following up two paid applications. Mother: "Shall we look at the transport money together?"',
        'Monday was still uncertain, but this time the cost was on the table.',
        'Uncle Rwamiti Verdict: "She was working. Her family was paying. The job was still a possibility. Was leaving the right decision for Nora?"',
      ],
    },
  ],
  panels: [
    {
      id: 'ei-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/extended-internship/page-1.jpg',
      dayMarker: 'PANEL 1',
      timeMarker: 'EVENING AT HOME',
      caption: 'COVER: THE EXTENSION & THE ENVELOPE',
      settingDescription: 'Dining table with fruit basket, tea, and an envelope of transport money.',
      dialogue: [
        {
          character: 'Nora',
          characterRole: 'Graduate • Intern',
          avatarColor: 'blue',
          text: 'They want to keep me!',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Father',
          characterRole: 'Dad',
          avatarColor: 'zinc',
          text: 'Wonderful. How much?',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/extended-internship/page-2.jpg',
      dayMarker: 'PANEL 2',
      timeMarker: 'WEEKDAY MORNING',
      caption: '1. SOMEONE WHO LEAVES FOR WORK',
      settingDescription: 'Doorway of home. Mother hands Nora a packed lunch container.',
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
      id: 'ei-p3',
      panelNumber: 3,
      imageUrl: 'assets/comic-pages/extended-internship/page-2.jpg',
      dayMarker: 'PANEL 3',
      timeMarker: 'AT THE OFFICE',
      caption: '2. USEFUL AT THE OFFICE',
      settingDescription: 'Corporate open office. Supervisor passes a folder to Nora.',
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
      id: 'ei-p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/extended-internship/page-2.jpg',
      dayMarker: 'PANEL 4',
      timeMarker: 'FRIDAY AFTERNOON',
      caption: '3. GOOD NEWS & 4. NOT YET',
      settingDescription: 'Email notification from HR: Placement Extension.',
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
          text: 'It shows we value your contribution. There’s no approved budget, but a vacancy may come up. I can’t promise a date.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/extended-internship/page-3.jpg',
      dayMarker: 'PANEL 5',
      timeMarker: 'DINNER TABLE',
      caption: '9. WHAT LEAVING THE HOUSE MEANS & 10. THE BILL AT HOME',
      settingDescription: 'Father opens the household expenses book: Food, Electricity, Transport.',
      dialogue: [
        {
          character: 'Nora',
          characterRole: 'Intern',
          avatarColor: 'blue',
          text: 'At least when I go there, I have somewhere to be. People will ask what happened. I’ll have to say I’m home again.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Father',
          characterRole: 'Dad',
          avatarColor: 'zinc',
          text: 'I can help with transport for another month. After that, I would be borrowing. I kept hoping you wouldn’t need to.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ei-p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/extended-internship/page-3.jpg',
      dayMarker: 'PANEL 6',
      timeMarker: 'NEXT DAY AT OFFICE',
      caption: '12. A PRACTICAL REQUEST',
      settingDescription: 'Supervisor office desk. Nora stands firm.',
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
    'Issue #004 of the Uncle Rwamiti comic series. Explores parental pride, modern graduate job markets, and what happens when an unexpected encounter puts dignity and rent into sharp focus.',
  rwamitiWisdom:
    'Pride does not pay the landlord. A father’s shame often hides his own fear that the world he prepared you for no longer exists. Joel asked a simple question: who pays this month?',
  closingQuestion:
    'You are Joel. The interview is tomorrow at ten. Your shift starts at nine. You already missed one morning last week. Which conversation do you begin?',
  pollOptions: [
    'A. Ask your manager for another morning off (he covered your last absence himself)',
    'B. Ask Grace for a different interview time (tomorrow morning is free)',
    'C. Ask your father to cover your rent if you lose the job (ask before they leave)',
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
  ],
};

export const COMIC_BECAUSE_I_SAID_SO: ComicBook = {
  id: 'comic-because-i-said-so',
  slug: 'because-i-said-so-comic',
  issueNumber: '005',
  title: 'Because I Said So.',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ILLUSTRATED COMIC (EVA & MUM: MBARARA WORKSHOP)',
  description:
    'Eva has done her homework. Her mother hears backtalk. Read the comic. Then make Eva’s next move in the game.',
  coverImage: 'assets/comic-pages/because-i-said-so/cover.jpg',
  pdfUrl: 'assets/aistudio/Because_I_Said_So_Uncle_Rwamiti_Comic_313c251b.pdf',
  releaseDate: 'October 2026',
  pageCount: 2,
  readingTimeMinutes: 4,
  tags: [
    'Family Dilemma',
    'Parenting',
    'Teen Stories',
    'Digital Art',
    'Mbarara',
    'Respect vs Ambition',
    'Communication',
    'Comic Strip',
  ],
  coverNote:
    'Issue #005 of the Uncle Rwamiti comic series. Eva, 16, has learned digital illustration in Katete and prepared everything for a Saturday workshop in Mbarara, but her mother hears backtalk.',
  rwamitiWisdom:
    'A parent’s “no” often guards against dangers they lived through, but a child’s dream must eventually find its own footing with courage, patience, and honesty.',
  closingQuestion:
    'Eva knows something her mother has not examined. Her explanation has been treated as disrespect. What does she do?',
  pollOptions: [
    'Challenge her directly: “About this subject, I do know more. Please look before deciding.”',
    'Withdraw: “Okay, Mum.” Put the phone away and stop explaining.',
    'Try to keep conversation open: “You can still guide me. Can I first show you what I’ve learned?”',
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Page 1 · 10-Panel Comic Strip',
      image: 'assets/comic-pages/because-i-said-so/page-1.jpg',
      timeMarker: 'KATETE, OUTSIDE MBARARA',
      caption:
        '1. Something worth showing · 2. The invitation · 3. A pencil should do · 4. She did prepare · 5. Let me show you · 6. The question changes · 7. A familiar worry · 8. She explains again · 9. Still not convinced · 10. A decision now',
      keyMoments: [
        'Eva shows Mum her digital art on the phone',
        'Mum tells her drawing is drawing and to get a pencil',
        'Eva has the programme, teacher approval, and aunt escort arranged',
        'Mum: “So now you know more than your mother? No. Because I said so.”',
      ],
    },
    {
      pageNumber: 2,
      label: 'Page 2 · Your Move & Choices',
      image: 'assets/comic-pages/because-i-said-so/page-2.jpg',
      timeMarker: 'YOUR MOVE',
      caption:
        'Eva knows something her mother has not examined. Her explanation has been treated as disrespect. What does she do?',
      keyMoments: [
        'Choice 1: Challenge her directly',
        'Choice 2: Withdraw and put the phone away',
        'Choice 3: Try to keep the conversation open',
        'Uncle Rwamiti note: the uncle your parents should probably never have introduced you to',
      ],
    },
  ],
  panels: [
    {
      id: 'bis-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/because-i-said-so/page-1.jpg',
      dayMarker: 'KATETE',
      timeMarker: 'MORNING',
      caption: 'BECAUSE I SAID SO. 10-PANEL COMIC STRIP.',
      settingDescription: 'Katete home, outside Mbarara.',
      dialogue: [
        {
          character: 'Eva',
          characterRole: '16 • Aspiring Illustrator',
          avatarColor: 'purple',
          text: 'Mum, I made this.',
          side: 'left',
          bubbleType: 'speech',
        },
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
      id: 'bis-p2',
      panelNumber: 2,
      imageUrl: 'assets/comic-pages/because-i-said-so/page-2.jpg',
      dayMarker: 'DECISION',
      timeMarker: 'YOUR MOVE',
      caption: 'YOUR MOVE: What does Eva do next?',
      settingDescription: 'Three choices for Eva.',
      dialogue: [
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host & Mentor',
          avatarColor: 'amber',
          text: 'Eva knows something her mother has not examined. Her explanation has been treated as disrespect. What does she do?',
          side: 'right',
          bubbleType: 'speech',
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

