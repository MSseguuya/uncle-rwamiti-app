import { Episode } from '../../types';

export const ep015: Episode = {
  id: 'ep-015',
  number: '015',
  title: 'MY SON DOES NOT WORK HERE',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser:
    'Joel has a law degree and a paying job. His father did not expect the two to look like this.',
  category: 'Kampala Dilemmas',
  badge: 'TERRACE RESTAURANT • KAMPALA',
  badgeColor: 'amber',
  coverImage: 'assets/comic-pages/my-son-does-not-work-here/page-1.jpg',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“JOEL ASKED YOU A QUESTION.”',
    quoteLines: [
      '“Why did David say his son did not work there? Was it pride in front of friends, disappointment after paying for law school, fear that temporary work becomes permanent, or concern for Joel’s future?”',
      '“Joel restored his dignity without making a speech—and asked the one question that cannot be waved away: Who do I tell my landlord is paying this month?”',
      '“Every path forward carries a concrete cost. The question is whose time, whose money, and whose terms are on the table.”',
    ],
    closingQuestion: 'If you were Joel facing tomorrow’s interview and today’s rent, which conversation would you begin?',
    pollOptions: [
      'A. Ask your manager for another morning off. He covered your last absence himself.',
      'B. Ask Grace for a different interview time. She has already said tomorrow morning is unusually free.',
      'C. Ask your father to cover your rent if you lose the job. Ask him now, before everyone leaves.',
    ],
  },
  recommendedNextEpisodeId: 'ep-014',
  sharePrompt:
    'I just played Episode 015: MY SON DOES NOT WORK HERE on Uncle Rwamiti. A law graduate, a restaurant uniform, and a father’s reaction. What would your move be?',
  nodes: {
    // COVER
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'AN INTERACTIVE STORY',
      badgeColor: 'amber',
      headline: 'MY SON DOES NOT WORK HERE',
      leadText: 'Joel has a law degree and a paying job. His father did not expect the two to look like this.',
      bodyParagraphs: [
        'A law graduate. A restaurant uniform. A father’s reaction at lunch. A question about rent that cannot be ignored.',
      ],
      buttonText: 'START THE STORY ›',
      nextNodeId: 'node-restaurant-1',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-1.jpg',
    },

    // SCENE 1: THE PROUD INTRODUCTION
    'node-restaurant-1': {
      id: 'node-restaurant-1',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'The proud introduction',
      leadText:
        'Four friends sit at a restaurant table before lunch arrives. David leans forward, pleased to talk about his son while Uncle Rwamiti studies the menu.',
      bodyParagraphs: [
        'DAVID: “My son finished law last year. We’re waiting for the right opening.”',
        'GRACE: “Tell him to send his CV.”',
        'Joel arrives carrying a tray with four meals. David recognises him first. Grace looks from Joel to David.',
        'JOEL: “Good afternoon.”',
        'GRACE: “David! Isn’t this your boy?”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-2.jpg',
    },

    // SCENE 2: THE DENIAL
    'node-restaurant-2': {
      id: 'node-restaurant-2',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'The denial',
      leadText:
        'David tries to recover in front of his guests while Joel remains standing with the tray. Uncle Rwamiti lowers his menu, and Martin quietly moves his water glass to make space.',
      bodyParagraphs: [
        'DAVID: “My son does not work here. He’s just helping someone.”',
        'JOEL: “I work here, Dad.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-2b',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-3.jpg',
    },

    // SCENE 2B: THE UNIFORM
    'node-restaurant-2b': {
      id: 'node-restaurant-2b',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'The uniform',
      leadText:
        'David lowers his voice, leaning towards Joel. Joel glances down briefly at his shirt, then looks back at his father with the tray still in his hands.',
      bodyParagraphs: [
        'DAVID: “You told me you were doing something temporary.”',
        'JOEL: “It is temporary.”',
        'DAVID: “But you’re wearing a uniform.”',
        'JOEL: “They don’t give temporary people different clothes.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-3',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-4.jpg',
    },

    // SCENE 3: A POSSIBLE OPENING
    'node-restaurant-3': {
      id: 'node-restaurant-3',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'A possible opening',
      leadText:
        'Grace takes out her phone. Across the room, the manager calls out toward another waiting table. Joel turns slightly toward that voice without walking away.',
      bodyParagraphs: [
        'GRACE: “My firm may need a junior. Tomorrow at ten is unusually free. Could you come?”',
        'MANAGER: “Joel! Table six!”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-3b',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-5.jpg',
    },

    // SCENE 3B: THE TIMETABLE
    'node-restaurant-3b': {
      id: 'node-restaurant-3b',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'The timetable',
      leadText:
        'David answers for him immediately. Joel sets the tray on a folding stand beside the table, freeing his hands. Grace pauses with her phone.',
      bodyParagraphs: [
        'DAVID: “Of course he’ll come.”',
        'JOEL: “I’m on shift.”',
        'DAVID: “You can miss one morning.”',
        'JOEL: “I missed one last week for an interview.”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-4',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-6.jpg',
    },

    // SCENE 4: THE BILL NOBODY ORDERED
    'node-restaurant-4': {
      id: 'node-restaurant-4',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'The bill nobody ordered',
      leadText:
        'David’s voice rises. Joel stops reaching for the first plate, and silence settles over the untouched meals.',
      bodyParagraphs: [
        'DAVID: “Then leave this place. We didn’t pay for law school so you could carry plates.”',
        'JOEL: “Dad. Who do I tell my landlord is paying this month?”',
      ],
      buttonText: 'NEXT ›',
      nextNodeId: 'node-restaurant-4b',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-7.jpg',
    },

    // SCENE 4B: THE QUESTION STAYS
    'node-restaurant-4b': {
      id: 'node-restaurant-4b',
      type: 'consequence',
      badge: 'THE RESTAURANT',
      badgeColor: 'amber',
      headline: 'The question stays',
      leadText:
        'David turns to Uncle Rwamiti for support. Rwamiti looks from David to Joel while Grace holds her phone in silence.',
      bodyParagraphs: [
        'DAVID: “Say something.”',
        'UNCLE RWAMITI: “Joel asked you a question.”',
      ],
      buttonText: 'MAKE YOUR MOVE ›',
      nextNodeId: 'node-decision',
      image: 'assets/comic-pages/my-son-does-not-work-here/page-8.jpg',
    },

    // YOUR MOVE (DECISION NODE)
    'node-decision': {
      id: 'node-decision',
      type: 'decision',
      badge: 'YOUR MOVE',
      badgeColor: 'amber',
      headline: 'YOUR MOVE',
      leadText:
        'You are Joel. The interview is tomorrow at ten. Your shift starts at nine. You already missed one morning last week for another interview.',
      highlightText: 'Which conversation do you begin? Choose A, B or C.',
      bodyParagraphs: [],
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

    // PATH A — SCENE 1
    'node-path-a-1': {
      id: 'node-path-a-1',
      type: 'consequence',
      badge: 'YOUR MOVE A',
      badgeColor: 'amber',
      headline: 'Someone else makes room',
      leadText:
        'After serving lunch, Joel speaks to the manager beside the service counter while orders queue up.',
      bodyParagraphs: [
        'JOEL: “Could I come in late tomorrow? Another interview.”',
        'MANAGER: “I covered you last week. I can’t do it again.”',
        'Sarah steps up with her order pad as the manager checks the shift sheet.',
        'SARAH: “I can cover until twelve. You take my Saturday.”',
        'JOEL: “This Saturday?”',
        'SARAH: “The whole shift.”',
      ],
      buttonText: 'CONTINUE ›',
      nextNodeId: 'node-path-a-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/path-a-1.jpg',
    },

    // PATH A — SCENE 2
    'node-path-a-2': {
      id: 'node-path-a-2',
      type: 'consequence',
      badge: 'YOUR MOVE A',
      badgeColor: 'amber',
      headline: 'Two people waiting',
      leadText:
        'The next morning, Joel sits outside Grace’s office in a clean shirt and trousers, holding his folder. His phone reads 11:42.',
      bodyParagraphs: [
        'RECEPTIONIST: “Sorry. Her client meeting is running over.”',
        'Joel’s phone vibrates with an incoming call from Sarah. Through the partly open office door, Grace is still in discussion. Joel rises halfway from his chair.',
        'RECEPTIONIST: “She says just a few more minutes.”',
      ],
      buttonText: 'SEE REFLECTION ›',
      nextNodeId: 'node-ending-a',
      image: 'assets/comic-pages/my-son-does-not-work-here/path-a-2.jpg',
    },

    // PATH A — REFLECTION
    'node-ending-a': {
      id: 'node-ending-a',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • YOUR MOVE A',
      badgeColor: 'amber',
      headline: 'WHOSE TIME MADE THIS INTERVIEW POSSIBLE?',
      leadText: 'Whose time made this interview possible? At 11:42, would you stay or leave?',
      bodyParagraphs: [
        'Sarah covered your morning until twelve on the promise you would return on time—and take her full Saturday shift.',
        'Now Grace’s door is almost open, and Sarah is calling.',
      ],
      choices: [
        {
          id: 'retry-a',
          label: 'TRY ANOTHER CHOICE ›',
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

    // PATH B — SCENE 1
    'node-path-b-1': {
      id: 'node-path-b-1',
      type: 'consequence',
      badge: 'YOUR MOVE B',
      badgeColor: 'amber',
      headline: 'A reasonable request',
      leadText:
        'Back at the table, after serving the food, Joel speaks to Grace before she puts her phone away.',
      bodyParagraphs: [
        'JOEL: “Could we meet after my shift? I finish at five.”',
        'GRACE: “Tomorrow afternoon I’m in court. Then I’m away until Monday.”',
        'Grace shares her email address with Joel while David watches from across the table.',
        'JOEL: “May I send my CV tonight?”',
        'GRACE: “Please do. We’re speaking to someone tomorrow, but I’ll keep yours.”',
      ],
      buttonText: 'CONTINUE ›',
      nextNodeId: 'node-path-b-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/path-b-1.jpg',
    },

    // PATH B — SCENE 2
    'node-path-b-2': {
      id: 'node-path-b-2',
      type: 'consequence',
      badge: 'YOUR MOVE B',
      badgeColor: 'amber',
      headline: 'Keeping the shift',
      leadText:
        'Having sent his CV the night before, Joel works his 10:00 a.m. shift at the restaurant.',
      bodyParagraphs: [
        'CUSTOMER: “Could we have some water, please?”',
        'JOEL: “Certainly.”',
        'One week later, Joel sits on the edge of his bed, still in uniform after work. There has been no reply to his email when his father calls.',
        'DAVID: “Did Grace get back to you?”',
        'JOEL: “Not yet.”',
        'DAVID: “Send me the address. Let me ask her.”',
      ],
      buttonText: 'SEE REFLECTION ›',
      nextNodeId: 'node-ending-b',
      image: 'assets/comic-pages/my-son-does-not-work-here/path-b-2.jpg',
    },

    // PATH B — REFLECTION
    'node-ending-b': {
      id: 'node-ending-b',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • YOUR MOVE B',
      badgeColor: 'amber',
      headline: 'WOULD YOU ACCEPT DAVID’S OFFER TO FOLLOW UP?',
      leadText: 'Would you accept David’s offer to follow up? What would you want him to say?',
      bodyParagraphs: [
        'Keeping your shift protected your income and your word at work, even though it meant missing the morning slot.',
        'Now your father wants to step into the follow-up himself.',
      ],
      choices: [
        {
          id: 'retry-b',
          label: 'TRY ANOTHER CHOICE ›',
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

    // PATH C — SCENE 1
    'node-path-c-1': {
      id: 'node-path-c-1',
      type: 'consequence',
      badge: 'YOUR MOVE C',
      badgeColor: 'amber',
      headline: 'Make the offer concrete',
      leadText:
        'At the table, with lunch now served, Joel speaks quietly enough to keep his dignity, though everyone can hear. David sets his cutlery down.',
      bodyParagraphs: [
        'JOEL: “If I lose this job going tomorrow, will you cover my rent?”',
        'DAVID: “I can cover one month. I can’t promise more.”',
        'David opens his phone while Grace looks away to give father and son a moment of privacy.',
        'DAVID: “Send me the landlord’s number. I’ll pay him directly.”',
        'JOEL: “I can pay him.”',
        'DAVID: “I know. That’s how I’m willing to help.”',
      ],
      buttonText: 'CONTINUE ›',
      nextNodeId: 'node-path-c-2',
      image: 'assets/comic-pages/my-son-does-not-work-here/path-c-1.jpg',
    },

    // PATH C — SCENE 2
    'node-path-c-2': {
      id: 'node-path-c-2',
      type: 'consequence',
      badge: 'YOUR MOVE C',
      badgeColor: 'amber',
      headline: 'The next price',
      leadText:
        'The next morning, Joel walks toward Grace’s office. His phone shows a message from his father: “Rent paid. Landlord confirmed.”',
      bodyParagraphs: [
        'Inside the office, Grace sits opposite Joel with his folder open on the desk.',
        'GRACE: “We can offer a six-week placement. It’s unpaid. A job afterwards isn’t guaranteed.”',
        'JOEL: “Could you give me the hours and terms in writing?”',
      ],
      buttonText: 'SEE REFLECTION ›',
      nextNodeId: 'node-ending-c',
      image: 'assets/comic-pages/my-son-does-not-work-here/path-c-2.jpg',
    },

    // PATH C — REFLECTION
    'node-ending-c': {
      id: 'node-ending-c',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • YOUR MOVE C',
      badgeColor: 'amber',
      headline: 'WOULD YOU TAKE THE PLACEMENT?',
      leadText: 'Would you take the placement? What would you need to know before deciding?',
      bodyParagraphs: [
        'One month of rent is paid—directly to the landlord on your father’s terms—and the placement lasts six unpaid weeks with no guarantee.',
        'Asking for the hours and terms in writing gives you facts before you decide what happens to your job.',
      ],
      choices: [
        {
          id: 'retry-c',
          label: 'TRY ANOTHER CHOICE ›',
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
