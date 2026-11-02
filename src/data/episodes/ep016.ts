import { Episode } from '../../types';

export const ep016: Episode = {
  id: 'ep-016',
  number: '016',
  title: 'BAN BODAS! SHE TYPED. FROM THE BACK OF A BODA.',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser:
    'Jessica types “BAN BODAS. KAMPALA DESERVES BETTER.” from the back of Safari’s motorcycle in Kampala rush hour. Forty minutes later on Uncle Rwamiti’s veranda, passenger and rider confront both dangerous riding and passenger pressure.',
  category: 'Comics',
  badge: 'KAMPALA RUSH HOUR • THE VERANDA',
  badgeColor: 'amber',
  coverImage: 'assets/comic-pages/ban-bodas/cover.jpg',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“YOUR POST HAS PLENTY OF PASSENGERS. WHERE ARE YOU TAKING THEM?”',
    quoteLines: [
      '“Safari owned his conduct: he admitted using the pavement when a woman had to jump out of the way while he was chasing a fare.”',
      '“And Jessica had to face her own pressure from earlier on that very ride: ‘Safari, can’t you pass there? The other riders are passing.’”',
      '“All three final responses can coexist as starting points—and reflection becomes real when it changes what you stop requesting, what you start doing, and what you ask the city to fix.”',
    ],
    closingQuestion: 'You are Jessica. Which response do you post, and what practical step do you take before your next ride?',
    pollOptions: [
      'A. Enforce the safety rules. I must stop asking riders to break them.',
      'B. Before banning bodas, show us how people will get to work.',
      'C. Safari, what would help you earn a living while riding safely?',
    ],
  },
  recommendedNextEpisodeId: 'ep-015',
  sharePrompt:
    'I just played BAN BODAS! SHE TYPED. FROM THE BACK OF A BODA. on Uncle Rwamiti. What would you write now—and what would you change on your next ride?',
  nodes: {
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'AN INTERACTIVE STORY',
      badgeColor: 'amber',
      headline: 'BAN BODAS! SHE TYPED. FROM THE BACK OF A BODA.',
      leadText: 'Kampala rush hour. Jessica is on the back of Safari’s motorcycle, forty minutes late.',
      bodyParagraphs: [
        'From the back seat of the boda that is carrying her through jammed traffic, Jessica posts: “BAN BODAS. KAMPALA DESERVES BETTER.”',
      ],
      buttonText: 'START THE STORY ›',
      nextNodeId: 'node-panels-1-3',
      image: 'assets/comic-pages/ban-bodas/cover.jpg',
    },

    'node-panels-1-3': {
      id: 'node-panels-1-3',
      type: 'consequence',
      badge: 'KAMPALA RUSH HOUR & THE FARE',
      badgeColor: 'amber',
      headline: 'Kampala Rush Hour & The Fare',
      leadText:
        'In bumper-to-bumper Kampala traffic, Jessica types on her phone from the back of Safari’s motorcycle: “BAN BODAS. KAMPALA DESERVES BETTER.”',
      bodyParagraphs: [
        'SAFARI: “Madam, hold properly. We are moving.”',
        'At Uncle Rwamiti’s gate, Jessica checks her watch in frustration.',
        'JESSICA: “Forty minutes late! This city!”',
        'UNCLE RWAMITI: “You came by car?”',
        'JESSICA: “Would I have arrived?”',
        'Beside the gate, Safari waits on his motorcycle.',
        'SAFARI: “Should I wait until after the ban for my money?”',
        'JESSICA: “Have you seen how they ride?”',
        'UNCLE RWAMITI: “You want bodas banned?”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-panels-4-6',
      image: 'assets/comic-pages/ban-bodas/panel-1.jpg',
    },

    'node-panels-4-6': {
      id: 'node-panels-4-6',
      type: 'consequence',
      badge: 'FIVE MINUTES FOR TEA',
      badgeColor: 'amber',
      headline: 'Captain Safari',
      leadText:
        'Uncle Rwamiti invites Safari onto the veranda for five minutes of tea.',
      bodyParagraphs: [
        'SAFARI: “Five. The motorcycle owner does not accept tea as payment.”',
        'AUNTIE: “Spill or Step? Spill, answer honestly. Step, take a small challenge.”',
        'JESSICA: “Spill. Did you always want to ride a boda?”',
        'SAFARI: “Pilot. I still carry passengers. Just closer to the ground.”',
        'UNCLE RWAMITI: “Captain Safari.”',
        'SAFARI: “I helped at a garage. Some weeks there was work. Some weeks I waited. Then someone offered me a bike. A payment every day. I started earning.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-panels-7-9',
      image: 'assets/comic-pages/ban-bodas/panel-5.jpg',
    },

    'node-panels-7-9': {
      id: 'node-panels-7-9',
      type: 'consequence',
      badge: 'PAVEMENTS & PASSENGER PRESSURE',
      badgeColor: 'amber',
      headline: 'Remembering Their Journey',
      leadText:
        'Jessica challenges Safari directly about dangerous riding in Kampala.',
      bodyParagraphs: [
        'JESSICA: “But riding on pavements? Going through red lights?”',
        'SAFARI: “I have used the pavement. Once, a woman had to jump away. I was chasing a fare. She was just walking.”',
        'JESSICA: “Exactly.”',
        'SAFARI: “This morning a passenger told me, ‘Use the side. I’m late.’ I can refuse. Sometimes I do. Sometimes I want the money.”',
        'JESSICA: “You could refuse.”',
        'Then Jessica remembers their own ride thirty minutes earlier—when she pointed toward the pavement and asked: “Safari, can’t you pass there?”',
        'JESSICA: “You said there were people walking.”',
        'SAFARI: “Yes.”',
        'JESSICA: “I told you the other riders were passing.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-panels-10-12',
      image: 'assets/comic-pages/ban-bodas/panel-9.jpg',
    },

    'node-panels-10-12': {
      id: 'node-panels-10-12',
      type: 'consequence',
      badge: 'THE OWNER CALLS & THE VIRAL POST',
      badgeColor: 'amber',
      headline: 'Where Are You Taking Them?',
      leadText:
        'On the veranda, both rider and passenger reckon with their part.',
      bodyParagraphs: [
        'JESSICA: “I still want you to obey the rules. And next time I tell you to use the pavement…”',
        'SAFARI: “Fair. I should remind you of your post?”',
        'UNCLE RWAMITI: “Screenshot it first.”',
        'Safari’s phone rings—it is the motorcycle owner asking about his daily payment. As Safari prepares to leave, Jessica looks at the jammed road.',
        'JESSICA: “If they banned you tomorrow, I honestly don’t know how I’d get to work.”',
        'SAFARI: “Neither do I.”',
        'Uncle Rwamiti holds up Jessica’s phone: her “BAN BODAS” post now has 452 likes and 217 comments.',
        'UNCLE RWAMITI: “Your post has plenty of passengers. Where are you taking them?”',
        'JESSICA: “Give me a minute.”',
      ],
      buttonText: 'MAKE YOUR MOVE ›',
      nextNodeId: 'node-decision-1',
      image: 'assets/comic-pages/ban-bodas/panel-12.jpg',
    },

    'node-decision-1': {
      id: 'node-decision-1',
      type: 'decision',
      badge: 'YOUR MOVE • PART 1: WHAT WOULD YOU WRITE NOW?',
      badgeColor: 'amber',
      headline: 'YOU ARE JESSICA. WHAT WOULD YOU WRITE NOW?',
      leadText:
        'Notice that options A, B, and C do not contradict one another—they can coexist as starting points for a fuller, more honest post.',
      highlightText: 'Choose the starting point for your revised post:',
      bodyParagraphs: [
        'What would your answer address—and what would it leave unresolved until action follows?',
      ],
      choices: [
        {
          id: 'choice-a',
          label: 'A. Enforce the safety rules. I must stop asking riders to break them.',
          nextNodeId: 'node-decision-2a',
          statPercent: 38,
        },
        {
          id: 'choice-b',
          label: 'B. Before banning bodas, show us how people will get to work.',
          nextNodeId: 'node-decision-2b',
          statPercent: 34,
        },
        {
          id: 'choice-c',
          label: 'C. Safari, what would help you earn a living while riding safely?',
          nextNodeId: 'node-decision-2c',
          statPercent: 28,
        },
      ],
      image: 'assets/comic-pages/ban-bodas/page-4.jpg',
    },

    'node-decision-2a': {
      id: 'node-decision-2a',
      type: 'decision',
      badge: 'YOUR MOVE • PART 2: PRACTICAL EXTENSION',
      badgeColor: 'emerald',
      headline: 'CARRYING REFLECTION INTO ACTION',
      leadText:
        'You draft your reply starting with Option A: “Enforce the safety rules—and as passengers, we must stop pressuring riders to use the pavement when we are running late.”',
      highlightText: 'To carry reflection into action, what practical change do you commit to starting tomorrow?',
      bodyParagraphs: [
        'What will Jessica actually stop requesting, start doing, or ask the city to change?',
      ],
      choices: [
        {
          id: 'act-a1',
          label: '1. STOP requesting pavement shortcuts or red-light jumps even when late for a meeting.',
          nextNodeId: 'node-ending',
          statPercent: 45,
        },
        {
          id: 'act-a2',
          label: '2. START leaving 15 minutes earlier and telling riders upfront: “No sidewalk riding—we wait for the light.”',
          nextNodeId: 'node-ending',
          statPercent: 35,
        },
        {
          id: 'act-a3',
          label: '3. ASK THE CITY for protected pedestrian crossings, working junction signals, and dedicated two-wheel lanes.',
          nextNodeId: 'node-ending',
          statPercent: 20,
        },
      ],
      image: 'assets/comic-pages/ban-bodas/panel-10.jpg',
    },

    'node-decision-2b': {
      id: 'node-decision-2b',
      type: 'decision',
      badge: 'YOUR MOVE • PART 2: PRACTICAL EXTENSION',
      badgeColor: 'emerald',
      headline: 'CARRYING REFLECTION INTO ACTION',
      leadText:
        'You draft your reply starting with Option B: “Before talking about banning bodas, show us how commuters will actually get to work—and how riders will earn a living while keeping pedestrians safe.”',
      highlightText: 'To carry reflection into action, what practical change do you commit to starting tomorrow?',
      bodyParagraphs: [
        'What will Jessica actually stop requesting, start doing, or ask the city to change?',
      ],
      choices: [
        {
          id: 'act-b1',
          label: '1. STOP blaming riders alone while quietly telling them “Use the side, the other riders are passing.”',
          nextNodeId: 'node-ending',
          statPercent: 40,
        },
        {
          id: 'act-b2',
          label: '2. START budgeting realistic travel time and wearing a passenger helmet on every trip.',
          nextNodeId: 'node-ending',
          statPercent: 35,
        },
        {
          id: 'act-b3',
          label: '3. ASK THE CITY for reliable public transit corridors, safer boda stages, and physical barriers protecting walkways.',
          nextNodeId: 'node-ending',
          statPercent: 25,
        },
      ],
      image: 'assets/comic-pages/ban-bodas/panel-11.jpg',
    },

    'node-decision-2c': {
      id: 'node-decision-2c',
      type: 'decision',
      badge: 'YOUR MOVE • PART 2: PRACTICAL EXTENSION',
      badgeColor: 'emerald',
      headline: 'CARRYING REFLECTION INTO ACTION',
      leadText:
        'You draft your reply starting with Option C: “Today I sat down for five minutes of tea with my rider, Safari. Instead of shouting slogans, we need to ask what helps riders earn an honest living without risking pedestrians on the pavement.”',
      highlightText: 'To carry reflection into action, what practical change do you commit to starting tomorrow?',
      bodyParagraphs: [
        'What will Jessica actually stop requesting, start doing, or ask the city to change?',
      ],
      choices: [
        {
          id: 'act-c1',
          label: '1. STOP rewarding reckless speed or pressuring riders who are already racing daily bike-owner payments.',
          nextNodeId: 'node-ending',
          statPercent: 42,
        },
        {
          id: 'act-c2',
          label: '2. START building regular, trusted rider arrangements where safe riding is valued over cutting corners.',
          nextNodeId: 'node-ending',
          statPercent: 36,
        },
        {
          id: 'act-c3',
          label: '3. ASK THE CITY for fairer financing rules, rider safety training, and clear road markings at busy junctions.',
          nextNodeId: 'node-ending',
          statPercent: 22,
        },
      ],
      image: 'assets/comic-pages/ban-bodas/panel-8.jpg',
    },

    'node-ending': {
      id: 'node-ending',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • REFLECTION INTO ACTION',
      badgeColor: 'emerald',
      headline: 'A POST THAT CARRIES REAL WEIGHT',
      leadText:
        'Jessica publishes her follow-up post—combining honesty about her own impatience on the bike with Safari’s candour about the pavement and a concrete call for safer Kampala streets.',
      bodyParagraphs: [
        'Instead of a shouting match in the comments, readers begin naming what they will stop asking riders to do—and what the city must build so getting to work does not pit commuters, riders, and pedestrians against each other.',
        'UNCLE RWAMITI: “When both the passenger and the rider admit where they crossed the line, the conversation stops generating heat and starts finding a road forward.”',
      ],
      choices: [
        {
          id: 'retry-bb',
          label: 'TRY ANOTHER STARTING POINT (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision-1',
        },
        {
          id: 'restart-bb',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'assets/comic-pages/ban-bodas/panel-12.jpg',
    },
  },
};
