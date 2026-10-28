const fs = require('fs');

// Read existing comicsData.ts to preserve ATTACHED_COMIC verbatim
const existing = fs.readFileSync('src/data/comicsData.ts', 'utf8');

// Find ATTACHED_COMIC definition: from "export const ATTACHED_COMIC: ComicBook = {" up to the end of the object before "export const INITIAL_COMICS"
const attachedStart = existing.indexOf('export const ATTACHED_COMIC: ComicBook = {');
const attachedEnd = existing.indexOf('// INITIAL_COMICS contains the attached comic');
const attachedComicCode = existing.substring(attachedStart, attachedEnd).trim();

const newComicsCode = `
export const COMIC_BAN_BODAS: ComicBook = {
  id: 'comic-ban-bodas',
  slug: 'ban-bodas',
  issueNumber: '002',
  title: 'Ban Bodas! She Typed. From the Back of a Boda.',
  series: 'Uncle Rwamiti: Your Move',
  pathLabel: 'ONE POSSIBLE PATH (KAMPALA RUSH HOUR & THE FARE)',
  description:
    'Jessica types "BAN BODAS. KAMPALA DESERVES BETTER." from the back of Safari\\'s boda-boda in Kampala rush hour. Forty minutes later on Uncle Rwamiti\\'s veranda, passenger and rider discover whose convenience and livelihood are actually on the line.',
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
        '1. Kampala, rush hour: Jessica posts "BAN BODAS. KAMPALA DESERVES BETTER." from Safari\\'s bike. 2. At Uncle Rwamiti\\'s home: 40 minutes late. 3. The fare: Safari asks for his money.',
      keyMoments: [
        'Jessica typing anti-boda social media post from the back of Safari\\'s bike',
        'Safari navigating bumper-to-bumper Kampala traffic: "Madam, hold properly. We are moving."',
        'Arriving late at Uncle Rwamiti\\'s gate: "Forty minutes late! This city! Would I have arrived by car?"',
        'Safari waits for payment: "Should I wait until after the ban for my money?"',
      ],
    },
    {
      pageNumber: 2,
      label: 'Page 2 · Five Minutes for Tea & Safari\\'s Past',
      image: 'assets/comic-pages/ban-bodas/page-2.jpg',
      timeMarker: '11:15 AM — ON THE VERANDA',
      caption:
        'Uncle Rwamiti invites Safari for tea. "Spill or Step?" Safari reveals his dream of being a pilot and how a garage mechanic became a boda rider.',
      keyMoments: [
        'Uncle Rwamiti invites Safari to sit down: "Five minutes for tea?"',
        'Safari: "Five. The motorcycle owner does not accept tea as payment."',
        'Auntie introduces the game: "Spill, answer honestly. Step, take a small challenge."',
        'Safari on his childhood dream: "Pilot. I still carry passengers. Just closer to the ground."',
        'Safari\\'s past: Worked at a car service garage until someone offered him a bike with daily owner payments.',
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
      settingDescription: 'Jammed road. Safari\\'s motorcycle weaves past taxis and cars.',
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
      caption: '2. AT UNCLE RWAMITI\\'S HOME',
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
      caption: '4. OUTSIDE UNCLE RWAMITI\\'S HOME',
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
      caption: '6. SAFARI\\'S PAST',
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
    'Issue #003 of the Uncle Rwamiti comic series. Explores the hidden cost of unpaid experience in corporate Kampala, where parents silently borrow to subsidize their children\\'s career hopes.',
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
        '11. An answer nobody likes: Mother: "We pay for another three months of \\'may\\'." Nora realizes someone else will take the unpaid slot.',
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
  pathLabel: 'THREE BRANCHING ENDINGS (PATH A, PATH B, PATH C)',
  description:
    'Joel has a law degree and a paying job. His father did not expect the two to look like this. When David brings his friends to lunch and finds his son serving their table, pride and rent collide.',
  coverImage: 'assets/comic-pages/my-son-does-not-work-here/cover.jpg',
  pdfUrl: 'assets/aistudio/Uncle_Rwamiti_My_Son_Does_Not_Work_Here_Comic_0d0560c0.pdf',
  releaseDate: 'October 2026',
  pageCount: 15,
  readingTimeMinutes: 8,
  tags: ['Kampala', 'Law Graduate', 'Pride', 'Youth Employment', 'Family Expectations', 'Rent', 'Branching Comic'],
  coverNote:
    'Issue #004 of the Uncle Rwamiti comic series. Features a shared opening story (Pages 1–6) leading to three distinct branching endings: Path A (Swap shifts), Path B (Protect the shift), and Path C (Ask Dad for rent guarantee).',
  rwamitiWisdom:
    'We didn’t pay for law school so you could carry plates. But who do you tell the landlord is paying this month? Pride is expensive when the rent is due.',
  closingQuestion:
    'Which move would you have chosen as Joel?',
  pollOptions: [
    'Path A: Trade shifts with Sarah and risk the late interview',
    'Path B: Protect your paying job, send the CV, and stay on shift',
    'Path C: Make Dad put his money where his pride is and ask for rent guarantee',
  ],
  alternativeRoutes: [
    {
      title: 'Path A: Trade Shifts with Sarah',
      description: 'Joel gets Sarah to cover his morning shift in exchange for his Saturday. At 11:42 Grace is still in a client meeting while Sarah calls.',
      slug: 'my-son-does-not-work-here',
    },
    {
      title: 'Path B: Protect the Shift & Email CV',
      description: 'Joel asks for an interview after 5:00 PM. Grace is away, but takes his CV. A week later there is no reply, and David wants to follow up.',
      slug: 'my-son-does-not-work-here',
    },
    {
      title: 'Path C: Make Dad Guarantee Rent',
      description: 'Joel asks David: "If I lose this job, will you cover my rent?" David pays one month directly to the landlord. Grace offers an unpaid 6-week placement.',
      slug: 'my-son-does-not-work-here',
    },
  ],
  pages: [
    {
      pageNumber: 1,
      label: 'Cover & Intro · My Son Does Not Work Here',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-1.jpg',
      caption: 'A law graduate. A restaurant uniform. A father\\'s pride. A conversation nobody expected.',
      keyMoments: [
        'Joel has a law degree and a paying job. His father did not expect the two to look like this.',
        'Eight opening panels • Three choices • Three different endings',
      ],
    },
    {
      pageNumber: 2,
      label: 'Panels 1–2 · The Introduction & Unexpected Waiter',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-2.jpg',
      caption: '1. David boasts: "My son finished law last year." 2. Joel arrives carrying a tray with four meals: "Good afternoon."',
      keyMoments: [
        'David: "My son finished law last year. We’re waiting for the right opening."',
        'Grace: "Tell him to send his CV."',
        'Joel arrives carrying lunch tray. Grace: "David! Isn’t this your boy?"',
      ],
    },
    {
      pageNumber: 3,
      label: 'Panels 3–4 · The Denial & The Uniform',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-3.jpg',
      caption: '3. David: "My son does not work here." Joel: "I work here, Dad." 4. "They don’t give temporary people different clothes."',
      keyMoments: [
        'David attempts recovery: "He’s just helping someone." Joel: "I work here, Dad."',
        'David: "You told me you were doing something temporary."',
        'Joel: "It is temporary. They don’t give temporary people different clothes."',
      ],
    },
    {
      pageNumber: 4,
      label: 'Panels 5–6 · A Possible Opening & The Timetable',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-4.jpg',
      caption: '5. Grace offers: "My firm may need a junior. Tomorrow at ten?" 6. Joel: "I’m on shift. I missed one last week for an interview."',
      keyMoments: [
        'Grace: "My firm may need a junior. Tomorrow at ten is unusually free. Could you come?"',
        'Manager calls: "Joel! Table six!"',
        'David insists: "Of course he’ll come." Joel: "I’m on shift. I missed one last week for an interview."',
      ],
    },
    {
      pageNumber: 5,
      label: 'Panels 7–8 · The Bill Nobody Ordered & The Question',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-5.jpg',
      caption: '7. David: "We didn’t pay for law school so you could carry plates." Joel: "Who do I tell my landlord is paying this month?" 8. Uncle Rwamiti: "Joel asked you a question."',
      keyMoments: [
        'David: "Then leave this place. We didn’t pay for law school so you could carry plates."',
        'Joel: "Dad. Who do I tell my landlord is paying this month?"',
        'David turns to Rwamiti: "Say something." Uncle Rwamiti: "Joel asked you a question."',
      ],
    },
    {
      pageNumber: 6,
      label: 'Page 6 · YOUR MOVE (Decision Page)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-6.jpg',
      caption: 'You are Joel. The interview is tomorrow at ten. Your shift starts at nine. Which conversation do you begin?',
      keyMoments: [
        'Choice A: Ask manager for another morning off (He covered your last absence yourself).',
        'Choice B: Ask Grace for a different interview time (Tomorrow morning is unusually free).',
        'Choice C: Ask your father to cover your rent if you lose the job.',
      ],
    },
    {
      pageNumber: 7,
      label: 'Path A · Panels A1–A2 (Someone Else Makes Room)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-7.jpg',
      caption: 'Path A: Manager refuses: "I can’t do it again." Sarah steps in: "I can cover until twelve. You take my Saturday."',
      keyMoments: [
        'Manager: "I covered you last week. I can’t do it again."',
        'Sarah makes room: "I can cover until twelve. You take my Saturday. The whole shift."',
      ],
    },
    {
      pageNumber: 8,
      label: 'Path A · Panels A3–A4 (Two People Waiting)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-8.jpg',
      caption: 'Path A: At 11:42 outside Grace\\'s office, Grace\\'s meeting is running over while Sarah calls Joel\\'s phone.',
      keyMoments: [
        'Joel sits waiting in a clean shirt. Phone reads 11:42.',
        'Receptionist: "Sorry. Her client meeting is running over. Just a few more minutes."',
        'Incoming call from Sarah on Joel’s phone. Joel has risen halfway from his chair.',
      ],
    },
    {
      pageNumber: 9,
      label: 'Path A · Uncle Rwamiti Takeaway',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-9.jpg',
      caption: 'Uncle Rwamiti Verdict A: "Whose time made this interview possible? At 11:42, would you stay or leave?"',
      keyMoments: [
        'Whose time made this interview possible?',
        'At 11:42, would you stay or leave?',
      ],
    },
    {
      pageNumber: 10,
      label: 'Path B · Panels B1–B2 (Another Route)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-10.jpg',
      caption: 'Path B: Joel asks: "Could we meet after my shift at five?" Grace is in court, then away; accepts CV by email.',
      keyMoments: [
        'Joel: "Could we meet after my shift? I finish at five."',
        'Grace: "Tomorrow afternoon I’m in court. Then away until Monday. Please send your CV tonight."',
      ],
    },
    {
      pageNumber: 11,
      label: 'Path B · Panels B3–B4 (Keeping the Shift & The Follow-Up)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-11.jpg',
      caption: 'Path B: Joel works his 10:00 AM shift. One week later, no reply from Grace. David calls: "Send me the address. Let me ask her."',
      keyMoments: [
        'Next morning 10:00: Joel is serving tables. His job is safe.',
        'One week later: No reply to the CV email.',
        'David calls on phone: "Did Grace get back to you? Send me the address. Let me ask her."',
      ],
    },
    {
      pageNumber: 12,
      label: 'Path B · Uncle Rwamiti Takeaway',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-12.jpg',
      caption: 'Uncle Rwamiti Verdict B: "Would you accept David’s offer to follow up? What would you want him to say?"',
      keyMoments: [
        'Would you accept David’s offer to follow up?',
        'What would you want him to say?',
      ],
    },
    {
      pageNumber: 13,
      label: 'Path C · Panels C1–C2 (Make the Offer Concrete)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-13.jpg',
      caption: 'Path C: Joel asks: "If I lose this job, will you cover my rent?" David agrees: "One month. Send me the landlord’s number."',
      keyMoments: [
        'Joel: "If I lose this job going tomorrow, will you cover my rent?"',
        'David: "I can cover one month. Send me the landlord’s number. I’ll pay him directly."',
        'Joel: "I can pay him." David: "I know. That’s how I’m willing to help."',
      ],
    },
    {
      pageNumber: 14,
      label: 'Path C · Panels C3–C4 (The Morning Away & The Next Price)',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-14.jpg',
      caption: 'Path C: Rent paid. Inside Grace\\'s office, Grace offers a six-week unpaid placement. Joel asks: "Could you give me terms in writing?"',
      keyMoments: [
        'David messages: "Rent paid. Landlord confirmed."',
        'Grace inside office: "We can offer a six-week placement. It’s unpaid. A job afterwards isn’t guaranteed."',
        'Joel: "Could you give me the hours and terms in writing?"',
      ],
    },
    {
      pageNumber: 15,
      label: 'Path C · Uncle Rwamiti Takeaway',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-15.jpg',
      caption: 'Uncle Rwamiti Verdict C: "Would you take the placement? What would you need to know before deciding?"',
      keyMoments: [
        'Would you take the placement?',
        'What would you need to know before deciding?',
      ],
    },
  ],
  panels: [
    {
      id: 'ms-p1',
      panelNumber: 1,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-2.jpg',
      dayMarker: 'PANEL 1',
      timeMarker: 'LUNCHTIME',
      caption: '1. THE PROUD INTRODUCTION',
      settingDescription: 'Restaurant table. David leans forward proudly.',
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
          characterRole: 'Law Partner',
          avatarColor: 'rose',
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
      timeMarker: '1:15 PM',
      caption: '2. AN UNEXPECTED WAITER',
      settingDescription: 'Joel arrives carrying a food tray with four meals.',
      dialogue: [
        {
          character: 'Joel',
          characterRole: 'Waiter • Son',
          avatarColor: 'blue',
          text: 'Good afternoon.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Grace',
          characterRole: 'Law Partner',
          avatarColor: 'rose',
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
      timeMarker: '1:17 PM',
      caption: '3. THE DENIAL',
      settingDescription: 'David flustered, trying to recover dignity.',
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
          avatarColor: 'blue',
          text: 'I work here, Dad.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p4',
      panelNumber: 4,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-3.jpg',
      dayMarker: 'PANEL 4',
      timeMarker: '1:19 PM',
      caption: '4. THE UNIFORM',
      settingDescription: 'Joel wearing restaurant apron and name badge.',
      dialogue: [
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'You told me you were doing something temporary.',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'Joel',
          characterRole: 'Waiter • Son',
          avatarColor: 'blue',
          text: 'It is temporary. They don’t give temporary people different clothes.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p5',
      panelNumber: 5,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-4.jpg',
      dayMarker: 'PANEL 5',
      timeMarker: '1:21 PM',
      caption: '5. A POSSIBLE OPENING & 6. THE TIMETABLE',
      settingDescription: 'Grace reaches for her phone. Manager calls from the back.',
      dialogue: [
        {
          character: 'Grace',
          characterRole: 'Law Partner',
          avatarColor: 'rose',
          text: 'My firm may need a junior. Tomorrow at ten is unusually free. Could you come?',
          side: 'left',
          bubbleType: 'speech',
        },
        {
          character: 'David',
          characterRole: 'Father',
          avatarColor: 'zinc',
          text: 'Of course he’ll come.',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Joel',
          characterRole: 'Waiter • Son',
          avatarColor: 'blue',
          text: 'I’m on shift. I missed one last week for an interview.',
          side: 'left',
          bubbleType: 'speech',
        },
      ],
    },
    {
      id: 'ms-p6',
      panelNumber: 6,
      imageUrl: 'assets/comic-pages/my-son-does-not-work-here/page-5.jpg',
      dayMarker: 'PANEL 6',
      timeMarker: '1:25 PM',
      caption: '7. THE BILL NOBODY ORDERED & 8. THE QUESTION STAYS',
      settingDescription: 'David and Joel face each other. Uncle Rwamiti looks on.',
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
          characterRole: 'Waiter • Son',
          avatarColor: 'blue',
          text: 'Dad. Who do I tell my landlord is paying this month?',
          side: 'right',
          bubbleType: 'speech',
        },
        {
          character: 'Uncle Rwamiti',
          characterRole: 'Host & Mentor',
          avatarColor: 'amber',
          text: 'Joel asked you a question.',
          side: 'right',
          bubbleType: 'speech',
        },
      ],
    },
  ],
};
`;

const tailCode = `
// INITIAL_COMICS contains all 4 issues
export const INITIAL_COMICS: ComicBook[] = [
  ATTACHED_COMIC,
  COMIC_BAN_BODAS,
  COMIC_THEY_EXTENDED_HER_INTERNSHIP,
  COMIC_MY_SON_DOES_NOT_WORK_HERE,
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
    reading_time: \`\${comic.pageCount} pages · Flippable Comic\`,
    category: 'Comics',
    keywords: \`Comics Comic Books \${comic.title} Uncle Rwamiti Kampala \${comic.tags.join(' ')}\`,
    legacy_engine: false,
    featured: false,
  };
}

export function convertComicToStoryData(comic: ComicBook): StoryData {
  const nodes: Record<string, any> = {};

  comic.pages.forEach((page, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === comic.pages.length - 1;
    const key = isFirst ? 'opening' : \`page-\${page.pageNumber}\`;
    const nextPage = comic.pages[idx + 1];

    const paragraphs: string[] = [];
    if (page.timeMarker) paragraphs.push(\`[\${page.timeMarker}]\`);
    if (page.caption) paragraphs.push(page.caption);
    if (page.keyMoments && page.keyMoments.length > 0) {
      page.keyMoments.forEach((km) => paragraphs.push(\`• \${km}\`));
    }

    const choices: Array<{ label: string; to: string }> = [];
    if (nextPage) {
      choices.push({
        label: \`FLIP TO PAGE \${nextPage.pageNumber} →\`,
        to: \`page-\${nextPage.pageNumber}\`,
      });
    }

    nodes[key] = {
      key,
      title: \`\${comic.title} · \${page.label}\`,
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
`;

const fullFile = `import { ComicBook } from '../types';
import { CatalogStory, StoryData } from '../services/storyDatabaseService';

const CUSTOM_COMICS_KEY = 'rwamiti_custom_comic_books_v2';

${attachedComicCode}

${newComicsCode}

${tailCode}
`;

fs.writeFileSync('src/data/comicsData.ts', fullFile);
console.log('src/data/comicsData.ts successfully written with all 4 comics!');
