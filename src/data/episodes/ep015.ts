import { Episode } from '../../types';

export const ep015: Episode = {
  id: 'ep-015',
  number: '015',
  title: 'MY SON DOES NOT WORK HERE',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser:
    'Joel has a law degree and a paying job. His father did not expect the two to look like this. Eight opening panels • Three choices • Three different endings.',
  category: 'Kampala Dilemmas',
  badge: 'TERRACE RESTAURANT • KAMPALA',
  badgeColor: 'amber',
  coverImage: 'cover-my-son-does-not-work-here.webp',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“PRIDE DOES NOT PAY THE LANDLORD. WHO PAYS THIS MONTH?”',
    quoteLines: [
      '“A father’s shame often hides his own fear that the world he prepared you for no longer exists.”',
      '“Joel asked the one question that pride cannot answer: Who do I tell my landlord is paying this month?”',
      '“Every path forward has a cost. The question is whose time, whose money, and whose terms you are willing to spend.”',
    ],
    closingQuestion: 'If you were Joel facing tomorrow’s interview and today’s rent, which conversation would you begin?',
    pollOptions: [
      'A. Ask manager for morning off & trade Saturday with Sarah',
      'B. Ask Grace for a different time & send CV tonight',
      'C. Make Dad’s rent promise concrete before stepping away',
    ],
  },
  recommendedNextEpisodeId: 'ep-014',
  sharePrompt:
    'I just played Episode 015: MY SON DOES NOT WORK HERE on Uncle Rwamiti. A law graduate, a restaurant uniform, and a father’s pride. What would your move be?',
  nodes: {
    // PAGE 1: TITLE & COVER
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'AN UNCLE RWAMITI COMIC',
      badgeColor: 'amber',
      headline: 'MY SON DOES NOT WORK HERE',
      leadText: 'Joel has a law degree and a paying job. His father did not expect the two to look like this.',
      bodyParagraphs: [
        'A law graduate. A restaurant uniform. A father’s pride. A conversation nobody expected.',
        'Eight opening panels • Three choices • Three different endings.',
        'All dialogue and branching outcomes follow the supplied producer script.',
      ],
      buttonText: 'START THE STORY ›',
      nextNodeId: 'node-restaurant-1',
      image: 'cover-my-son-does-not-work-here.webp',
    },

    // PAGE 2: 1 THE PROUD INTRODUCTION & 2 AN UNEXPECTED WAITER
    'node-restaurant-1': {
      id: 'node-restaurant-1',
      type: 'consequence',
      badge: 'THE RESTAURANT / SHARED STORY',
      badgeColor: 'amber',
      headline: '1 The proud introduction & 2 An unexpected waiter',
      leadText:
        'Medium wide shot. Four adults at a restaurant table. David leans forward, pleased to discuss his son. Rwamiti studies the menu. Establish the empty table before lunch arrives.',
      bodyParagraphs: [
        'DAVID: “My son finished law last year. We’re waiting for the right opening.”',
        'GRACE: “Tell him to send his CV.”',
        'Joel arrives carrying a tray with four meals. David recognises him first. Grace looks from Joel to David. Make the family resemblance visible but natural.',
        'JOEL: “Good afternoon.”',
        'GRACE: “David! Isn’t this your boy?”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-2.jpg',
    },

    // PAGE 3: 3 THE DENIAL & 4 THE UNIFORM
    'node-restaurant-2': {
      id: 'node-restaurant-2',
      type: 'consequence',
      badge: 'THE RESTAURANT / SHARED STORY',
      badgeColor: 'amber',
      headline: '3 The denial & 4 The uniform',
      leadText:
        'Closer view of David, trying to recover. Joel remains standing with the tray. Rwamiti lowers his menu. Martin quietly moves his water glass to make space.',
      bodyParagraphs: [
        'DAVID: “My son does not work here. He’s just helping someone.”',
        'JOEL: “I work here, Dad.”',
        'David speaks more quietly, leaning towards Joel. Joel glances down briefly at his shirt, then back at his father. The tray remains in his hands.',
        'DAVID: “You told me you were doing something temporary.”',
        'JOEL: “It is temporary.”',
        'DAVID: “But you’re wearing a uniform.”',
        'JOEL: “They don’t give temporary people different clothes.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-3',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-3.jpg',
    },

    // PAGE 4: 5 A POSSIBLE OPENING & 6 THE TIMETABLE
    'node-restaurant-3': {
      id: 'node-restaurant-3',
      type: 'consequence',
      badge: 'THE RESTAURANT / SHARED STORY',
      badgeColor: 'amber',
      headline: '5 A possible opening & 6 The timetable',
      leadText:
        'Grace takes out her phone. At the back, the manager indicates another waiting table. Joel turns slightly towards that voice without walking away.',
      bodyParagraphs: [
        'GRACE: “My firm may need a junior. Tomorrow at ten is unusually free. Could you come?”',
        'MANAGER: “Joel! Table six!”',
        'David answers quickly. Joel places the tray on a folding service stand beside their table, freeing his hands. Grace pauses with her phone.',
        'DAVID: “Of course he’ll come.”',
        'JOEL: “I’m on shift.”',
        'DAVID: “You can miss one morning.”',
        'JOEL: “I missed one last week for an interview.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-4',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-4.jpg',
    },

    // PAGE 5: 7 THE BILL NOBODY ORDERED & 8 THE QUESTION STAYS
    'node-restaurant-4': {
      id: 'node-restaurant-4',
      type: 'consequence',
      badge: 'THE RESTAURANT / SHARED STORY',
      badgeColor: 'amber',
      headline: '7 The bill nobody ordered & 8 The question stays',
      leadText:
        'David’s voice rises slightly. Joel stops reaching for the first plate. Use the untouched meals to hold the silence. The manager is approaching in the background.',
      bodyParagraphs: [
        'DAVID: “Then leave this place. We didn’t pay for law school so you could carry plates.”',
        'JOEL: “Dad. Who do I tell my landlord is paying this month?”',
        'David looks to Rwamiti for support. Rwamiti’s expression softens; he looks at David, then Joel. Grace’s phone remains in her hand. The manager is close enough to speak next.',
        'DAVID: “Say something.”',
        'UNCLE RWAMITI: “Joel asked you a question.”',
      ],
      buttonText: 'NEXT (MAKE YOUR MOVE) ›',
      nextNodeId: 'node-decision',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-7.jpg',
    },

    // PAGE 6: YOUR MOVE (DECISION NODE)
    'node-decision': {
      id: 'node-decision',
      type: 'decision',
      badge: 'YOUR MOVE',
      badgeColor: 'amber',
      headline: 'YOUR MOVE',
      leadText:
        'You are Joel. The interview is tomorrow at ten. Your shift starts at nine. You already missed one morning last week for another interview.',
      highlightText: 'Which conversation do you begin? Choose A, B or C.',
      bodyParagraphs: [
        'The endings are alternative continuations, not events that all happen to Joel.',
      ],
      choices: [
        {
          id: 'choice-a',
          label: 'A. Ask your manager for another morning off. He covered your last absence himself.',
          nextNodeId: 'node-path-a-1',
          statPercent: 44,
        },
        {
          id: 'choice-b',
          label: 'B. Ask Grace for a different interview time. She has already said tomorrow morning is unusually free.',
          nextNodeId: 'node-path-b-1',
          statPercent: 32,
        },
        {
          id: 'choice-c',
          label: 'C. Ask your father to cover your rent if you lose the job. Ask him now, before everyone leaves.',
          nextNodeId: 'node-path-c-1',
          statPercent: 24,
        },
      ],
      image: 'assets/comic-pages/my-son-does-not-work-here/page-9.jpg',
    },

    // PAGE 7: YOUR MOVE A (A1 & A2)
    'node-path-a-1': {
      id: 'node-path-a-1',
      type: 'consequence',
      badge: 'YOUR MOVE A',
      badgeColor: 'amber',
      headline: 'A1 A request during service & A2 Someone else makes room',
      leadText:
        'After serving lunch, Joel speaks to the manager beside the service counter. The manager is watching a queue of orders, not looming over him.',
      bodyParagraphs: [
        'JOEL: “Could I come in late tomorrow? Another interview.”',
        'MANAGER: “I covered you last week. I can’t do it again.”',
        'Sarah joins them, carrying an order pad. Joel turns towards her. The manager checks the shift sheet.',
        'SARAH: “I can cover until twelve. You take my Saturday.”',
        'JOEL: “This Saturday?”',
        'SARAH: “The whole shift.”',
      ],
      buttonText: 'CONTINUE >',
      nextNodeId: 'node-path-a-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-5.jpg',
    },

    // PAGE 8: YOUR MOVE A / CONTINUED (A3 & A4)
    'node-path-a-2': {
      id: 'node-path-a-2',
      type: 'consequence',
      badge: 'YOUR MOVE A / CONTINUED',
      badgeColor: 'amber',
      headline: 'A3 Waiting for the opening & A4 Two people waiting',
      leadText:
        'Next morning. Joel sits outside Grace’s office, in a clean shirt and trousers, holding a plain folder. His phone reads 11:42. A receptionist speaks from behind a desk.',
      bodyParagraphs: [
        'RECEPTIONIST: “Sorry. Her client meeting is running over.”',
        'Close shot of Joel’s phone above the folder. One incoming call from Sarah. Through the partly open office door, Grace is still in discussion. Joel has risen halfway from his chair.',
        'RECEPTIONIST: “She says just a few more minutes.”',
      ],
      buttonText: 'SEE REFLECTION >',
      nextNodeId: 'node-ending-a',
      image: 'cover-my-son-does-not-work-here.webp',
    },

    // PAGE 9: UNCLE RWAMITI / YOUR MOVE A
    'node-ending-a': {
      id: 'node-ending-a',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • YOUR MOVE A',
      badgeColor: 'amber',
      headline: 'WHOSE TIME MADE THIS INTERVIEW POSSIBLE?',
      leadText: 'Whose time made this interview possible? At 11:42, would you stay or leave?',
      bodyParagraphs: [
        'The uncle your parents should probably not have introduced you to!',
        'PeterosPaths.org',
        'Try another choice: go back to the YOUR MOVE page to read a different ending.',
      ],
      choices: [
        {
          id: 'retry-a',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-a',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'rwamiti.jpg',
    },

    // PAGE 10: YOUR MOVE B (B1 & B2)
    'node-path-b-1': {
      id: 'node-path-b-1',
      type: 'consequence',
      badge: 'YOUR MOVE B',
      badgeColor: 'amber',
      headline: 'B1 A reasonable request & B2 Another route',
      leadText:
        'Back at the table, after Joel has served the food. Grace is ready to put away her phone. Joel addresses her directly.',
      bodyParagraphs: [
        'JOEL: “Could we meet after my shift? I finish at five.”',
        'GRACE: “Tomorrow afternoon I’m in court. Then I’m away until Monday.”',
        'Grace sends Joel her email address. David watches. Martin takes a small bite, uncertain whether lunch has resumed.',
        'JOEL: “May I send my CV tonight?”',
        'GRACE: “Please do. We’re speaking to someone tomorrow, but I’ll keep yours.”',
      ],
      buttonText: 'CONTINUE >',
      nextNodeId: 'node-path-b-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-6.jpg',
    },

    // PAGE 11: YOUR MOVE B / CONTINUED (B3 & B4)
    'node-path-b-2': {
      id: 'node-path-b-2',
      type: 'consequence',
      badge: 'YOUR MOVE B / CONTINUED',
      badgeColor: 'amber',
      headline: 'B3 Keeping the shift & B4 A father follows up',
      leadText:
        'Next morning, 10:00. Joel is serving a different table at the restaurant. His phone is tucked away by the counter. A small inset shows the email he sent the previous night, with his CV attached.',
      bodyParagraphs: [
        'CUSTOMER: “Could we have some water, please?”',
        'JOEL: “Certainly.”',
        'One week later. Joel sits on the edge of his bed, still in uniform after work. His phone shows no reply to the email. David calls.',
        'DAVID, ON PHONE: “Did Grace get back to you?”',
        'JOEL: “Not yet.”',
        'DAVID, ON PHONE: “Send me the address. Let me ask her.”',
      ],
      buttonText: 'SEE REFLECTION >',
      nextNodeId: 'node-ending-b',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-8.jpg',
    },

    // PAGE 12: UNCLE RWAMITI / YOUR MOVE B
    'node-ending-b': {
      id: 'node-ending-b',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • YOUR MOVE B',
      badgeColor: 'amber',
      headline: 'WOULD YOU ACCEPT DAVID’S OFFER TO FOLLOW UP?',
      leadText: 'Would you accept David’s offer to follow up? What would you want him to say?',
      bodyParagraphs: [
        'The uncle your parents should probably not have introduced you to!',
        'PeterosPaths.org',
        'Try another choice: go back to the YOUR MOVE page to read a different ending.',
      ],
      choices: [
        {
          id: 'retry-b',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-b',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'rwamiti.jpg',
    },

    // PAGE 13: YOUR MOVE C (C1 & C2)
    'node-path-c-1': {
      id: 'node-path-c-1',
      type: 'consequence',
      badge: 'YOUR MOVE C',
      badgeColor: 'amber',
      headline: 'C1 Make the offer concrete & C2 The condition',
      leadText:
        'At the table, lunch now served. Joel speaks quietly enough to preserve dignity, but everyone can hear. David puts his cutlery down.',
      bodyParagraphs: [
        'JOEL: “If I lose this job going tomorrow, will you cover my rent?”',
        'DAVID: “I can cover one month. I can’t promise more.”',
        'Close view of father and son. David opens his phone. Grace looks away to give them a little privacy.',
        'DAVID: “Send me the landlord’s number. I’ll pay him directly.”',
        'JOEL: “I can pay him.”',
        'DAVID: “I know. That’s how I’m willing to help.”',
      ],
      buttonText: 'CONTINUE >',
      nextNodeId: 'node-path-c-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-7.jpg',
    },

    // PAGE 14: YOUR MOVE C / CONTINUED (C3 & C4)
    'node-path-c-2': {
      id: 'node-path-c-2',
      type: 'consequence',
      badge: 'YOUR MOVE C / CONTINUED',
      badgeColor: 'amber',
      headline: 'C3 The morning away & C4 The next price',
      leadText:
        'Next morning, Joel walks towards Grace’s office. His phone shows a message from David: “Rent paid. Landlord confirmed.” Beneath it is Joel’s conversation with his manager.',
      bodyParagraphs: [
        'Inside the office. Grace sits opposite Joel. His folder is open. His shoulders settle as he listens.',
        'GRACE: “We can offer a six-week placement. It’s unpaid. A job afterwards isn’t guaranteed.”',
        'JOEL: “Could you give me the hours and terms in writing?”',
      ],
      buttonText: 'SEE REFLECTION >',
      nextNodeId: 'node-ending-c',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-8.jpg',
    },

    // PAGE 15: UNCLE RWAMITI / YOUR MOVE C
    'node-ending-c': {
      id: 'node-ending-c',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • YOUR MOVE C',
      badgeColor: 'amber',
      headline: 'WOULD YOU TAKE THE PLACEMENT?',
      leadText: 'Would you take the placement? What would you need to know before deciding?',
      bodyParagraphs: [
        'The uncle your parents should probably not have introduced you to!',
        'PeterosPaths.org',
        'Try another choice: go back to the YOUR MOVE page to read a different ending.',
      ],
      choices: [
        {
          id: 'retry-c',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-c',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'rwamiti.jpg',
    },
  },
};
