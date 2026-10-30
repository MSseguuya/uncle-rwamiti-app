import { Episode } from '../../types';

export const ep017: Episode = {
  id: 'ep-017',
  number: '017',
  title: 'THEY EXTENDED HER INTERNSHIP',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser:
    'Nora graduated four years ago. Every weekday she leaves home before seven for an unpaid placement. When HR extends her placement for another three months without pay, her father opens the household ledger.',
  category: 'Kampala Dilemmas',
  badge: 'KAMPALA • UNPAID EXTENSION',
  badgeColor: 'amber',
  coverImage: 'assets/comic-pages/extended-internship/page-1.jpg',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“SHE WAS WORKING. HER FAMILY WAS PAYING. THE JOB WAS STILL A POSSIBILITY.”',
    quoteLines: [
      '“Nora explained what leaving the house meant to her: having somewhere to be each morning, where people noticed her work.”',
      '“And her father showed the quiet reality in the household ledger: after one more month of transport money, the family would be borrowing to finance ‘may’.”',
      '“No surprise job offer appeared on Friday. Monday was still uncertain—but this time, the reference letter was in her hand and the true cost was on the table.”',
    ],
    closingQuestion: 'Before deciding whether to accept or decline an unpaid extension, what information, financial limit, or negotiated support would Nora need?',
    pollOptions: [
      'A. Clear budget & vacancy information: Confirm whether a funded role and hiring date actually exist',
      'B. A household financial limit: Cap unpaid time before the family has to borrow for transport',
      'C. Negotiated support & a written reference: Ask for transport support or reduced days, and secure a detailed reference letter',
    ],
  },
  recommendedNextEpisodeId: 'ep-015',
  sharePrompt:
    'I just played THEY EXTENDED HER INTERNSHIP on Uncle Rwamiti. She was working. Her family was paying. The job was still a possibility. What would you need to know before deciding?',
  nodes: {
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'AN UNCLE RWAMITI INTERACTIVE STORY',
      badgeColor: 'amber',
      headline: 'THEY EXTENDED HER INTERNSHIP',
      leadText: '“They want to keep me!” Nora tells her parents. Her father looks up from the table: “Wonderful. How much?”',
      bodyParagraphs: [
        'Nora graduated four years ago. Every weekday she leaves home before seven. Her three-month unpaid placement is ending on Friday—and HR has just emailed to extend it for a further three months.',
        'Experience panels 1 to 10 of Nora’s story and weigh what information, household limit, or negotiated support is needed before deciding.',
      ],
      buttonText: 'START THE STORY ›',
      nextNodeId: 'node-panels-1-4',
      image: 'assets/comic-pages/extended-internship/page-1.jpg',
    },

    'node-panels-1-4': {
      id: 'node-panels-1-4',
      type: 'consequence',
      badge: 'PANELS 1–4 • THE OFFICE & THE EXTENSION EMAIL',
      badgeColor: 'amber',
      headline: '1. Someone Who Leaves for Work · 2. Useful at the Office · 3. Good News · 4. Not Yet',
      leadText:
        'Every weekday morning, Nora leaves home before seven with a packed lunch from her mother. At the office, she has become indispensable.',
      bodyParagraphs: [
        'MUM: “You’ll be late.”',
        'NORA: “They notice.”',
        'SUPERVISOR: “Nora, please finish this before lunch. We’d be lost without you.”',
        'Then an email arrives from HR: “We would like to extend your placement for a further three months.”',
        'NORA: “Will there be an allowance this time?”',
        'SUPERVISOR: “It shows we value your contribution. There’s no approved budget. But a vacancy may come up. I can’t promise a date.”',
      ],
      buttonText: 'NEXT: PANELS 5–7 ›',
      nextNodeId: 'node-panels-5-7',
      image: 'assets/comic-pages/extended-internship/page-2.jpg',
    },

    'node-panels-5-7': {
      id: 'node-panels-5-7',
      type: 'consequence',
      badge: 'PANELS 5–7 • THE HOUSEHOLD LEDGER',
      badgeColor: 'amber',
      headline: '5. What Leaving the House Means · 6. The Bill at Home · 7. An Answer Nobody Likes',
      leadText:
        'At the dinner table that evening, Nora explains why walking away from the office is so difficult—and her father opens the household expenses notebook.',
      bodyParagraphs: [
        'NORA: “At least when I go there, I have somewhere to be.”',
        'MUM: “And if you stop?”',
        'NORA: “People will ask what happened. I’ll have to say I’m home again.”',
        'Her father points to the Household Expenses notebook: Food, Electricity, Transport, Other needs.',
        'FATHER: “I can help with transport for another month. After that, I would be borrowing. I kept hoping you wouldn’t need to.”',
        'NORA: “I didn’t know that.”',
        'FATHER: “What happens if you refuse?”',
        'NORA: “Someone else will probably take it.”',
        'FATHER: “And if you accept?”',
        'NORA: “We pay for another three months of ‘may’.”',
      ],
      buttonText: 'MAKE YOUR MOVE ›',
      nextNodeId: 'node-decision',
      image: 'assets/comic-pages/extended-internship/page-3.jpg',
    },

    'node-decision': {
      id: 'node-decision',
      type: 'decision',
      badge: 'YOUR MOVE • BEFORE DECIDING',
      badgeColor: 'amber',
      headline: 'WHAT WOULD NORA NEED BEFORE DECIDING?',
      leadText:
        'Nora values having somewhere to go and being useful, yet her father would have to borrow after one more month of transport. Before deciding how to answer the extension offer tomorrow morning, what does she need to establish?',
      highlightText: 'Choose the priority Nora brings to the table:',
      bodyParagraphs: [
        'Each choice focuses on concrete information, household financial limits, or negotiated support rather than blind hope.',
      ],
      choices: [
        {
          id: 'choice-limit',
          label: 'A. Respect the household financial limit: Finish the current placement cleanly and ask for a written reference describing the work she has done.',
          nextNodeId: 'node-panel-8-a',
          statPercent: 42,
        },
        {
          id: 'choice-negotiate',
          label: 'B. Test negotiated support first: Ask whether transport support or a 2-day schedule is possible, and if not, conclude with a written reference.',
          nextNodeId: 'node-panel-8-b',
          statPercent: 33,
        },
        {
          id: 'choice-info',
          label: 'C. Ask for concrete hiring information: Request a written review date and budget confirmation before committing the one month her father can afford.',
          nextNodeId: 'node-panel-8-c',
          statPercent: 25,
        },
      ],
      image: 'assets/comic-pages/extended-internship/panel-7.jpg',
    },

    'node-panel-8-a': {
      id: 'node-panel-8-a',
      type: 'consequence',
      badge: 'PANEL 8 • A PRACTICAL REQUEST',
      badgeColor: 'amber',
      headline: '8. Next Day — At the Office',
      leadText:
        'Knowing that another three unpaid months would force her father to borrow for transport, Nora speaks clearly with her supervisor.',
      bodyParagraphs: [
        'NORA: “I can finish my current placement. I can’t afford another three unpaid months. Could I have a reference describing the work I’ve done?”',
        'SUPERVISOR: “I understand.”',
      ],
      buttonText: 'NEXT: PANELS 9–10 (FRIDAY & MONDAY) ›',
      nextNodeId: 'node-panels-9-10',
      image: 'assets/comic-pages/extended-internship/panel-8.jpg',
    },

    'node-panel-8-b': {
      id: 'node-panel-8-b',
      type: 'consequence',
      badge: 'PANEL 8 • TESTING SUPPORT & MAKING A PRACTICAL REQUEST',
      badgeColor: 'amber',
      headline: '8. Next Day — At the Office',
      leadText:
        'Nora checks whether the office can offer transport reimbursement or reduced days. When her supervisor confirms that neither is approved, she makes her decision without bitterness.',
      bodyParagraphs: [
        'NORA: “I can finish my current placement. I can’t afford another three unpaid months. Could I have a reference describing the work I’ve done?”',
        'SUPERVISOR: “I understand.”',
      ],
      buttonText: 'NEXT: PANELS 9–10 (FRIDAY & MONDAY) ›',
      nextNodeId: 'node-panels-9-10',
      image: 'assets/comic-pages/extended-internship/panel-8.jpg',
    },

    'node-panel-8-c': {
      id: 'node-panel-8-c',
      type: 'consequence',
      badge: 'PANEL 8 • VERIFYING THE BUDGET & MAKING A PRACTICAL REQUEST',
      badgeColor: 'amber',
      headline: '8. Next Day — At the Office',
      leadText:
        'When Nora asks whether there is any approved hiring date in the next quarter, her supervisor admits there is none. With that clarity, Nora protects her family’s one remaining month of transport money.',
      bodyParagraphs: [
        'NORA: “I can finish my current placement. I can’t afford another three unpaid months. Could I have a reference describing the work I’ve done?”',
        'SUPERVISOR: “I understand.”',
      ],
      buttonText: 'NEXT: PANELS 9–10 (FRIDAY & MONDAY) ›',
      nextNodeId: 'node-panels-9-10',
      image: 'assets/comic-pages/extended-internship/panel-8.jpg',
    },

    'node-panels-9-10': {
      id: 'node-panels-9-10',
      type: 'consequence',
      badge: 'PANELS 9–10 • NO SURPRISE OFFER & MONDAY MORNING',
      badgeColor: 'emerald',
      headline: '9. No Surprise Offer · 10. Monday Morning',
      leadText:
        'Friday afternoon. There was no last-minute job offer. Nora walks out holding her signed Reference Letter.',
      bodyParagraphs: [
        'COLLEAGUE: “All the best, Nora!”',
        'NORA: “Thank you.”',
        'SUPERVISOR: “Send us your updated CV. We’ll keep it on file.”',
        'Monday morning. Nora sits at the dining table with her laptop and the Reference Letter beside her.',
        'MUM: “What are you doing today?”',
        'NORA: “Following up two applications. Then I need to work out what I can afford to keep trying.”',
        'MUM: “I’m asking, Nora. Shall we look at the transport money together?”',
        'Monday was still uncertain. This time, the cost was on the table.',
      ],
      choices: [
        {
          id: 'retry-ei',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-ei',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'assets/comic-pages/extended-internship/page-4.jpg',
    },
  },
};
