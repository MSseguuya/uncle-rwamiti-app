import { Episode } from '../../types';

export const ep014: Episode = {
  id: 'ep-014',
  number: '014',
  title: 'SEND ME SOMETHING SMALL',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser:
    'You have a degree. You have an interview. You need transport money. Again. An illustrated Kampala dilemma where twenty thousand shillings entered a house as transport money and left as a family meeting.',
  category: 'Kampala Dilemmas',
  badge: 'NTINDA • KAMPALA',
  badgeColor: 'amber',
  coverImage: 'cover-send-me-something-small.webp',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“TWENTY THOUSAND ENTERED AS TRANSPORT AND LEFT AS A FAMILY MEETING.”',
    quoteLines: [
      '“My friend, twenty thousand shillings entered this house as transport money and left as a family meeting.”',
      '“Which was harder: finding the money, or telling someone the whole situation?”',
      '“A choice made in survival often costs more in honesty. The question is whether pride was cheaper than transport.”',
    ],
    closingQuestion: 'Which was harder: finding the money, or telling someone the whole situation?',
    pollOptions: [
      'Finding the transport money',
      'Telling someone the whole situation',
      'Both were equally hard',
    ],
  },
  recommendedNextEpisodeId: 'ep-001',
  sharePrompt:
    'I just played Episode 014: SEND ME SOMETHING SMALL on Uncle Rwamiti. Which was harder: finding the money, or telling the whole truth? Test your move!',
  nodes: {
    // PAGE 1: TITLE & COVER
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'AN INTERACTIVE STORY',
      badgeColor: 'amber',
      headline: 'SEND ME SOMETHING SMALL',
      leadText: 'You have a degree. You have an interview. You need transport money. Again.',
      bodyParagraphs: [
        'A fictional story set in Kampala. Your choices stay inside this story. No scores. No right answers.',
      ],
      buttonText: 'PLAY YOUR MOVE ›',
      nextNodeId: 'node-746pm',
    },

    // PAGE 2: 7:46 PM (THE SHORTLIST NARRATIVE)
    'node-746pm': {
      id: 'node-746pm',
      type: 'consequence',
      badge: '7:46 PM',
      badgeColor: 'amber',
      headline: '7:46 PM',
      leadText: 'Your degree hangs above your bed. The nail holding it has achieved permanent employment before you.',
      bodyParagraphs: [
        'You are Alex. Twenty-five. Two years since graduation. Three short placements. Good references. No steady income.',
        'You live with your parents. You help around the house. You apply for jobs. Sometimes you do paid work. When relatives ask what you are doing, you say, “A few things.”',
        'A few things is remarkably flexible employment.',
        'Your phone lights up.\n\nBRIGHTPATH CONSULTING\n“Your application has been shortlisted. Interview tomorrow, 9 a.m., Ntinda. Please bring your original certificates. Further details shortly.”',
        'Return transport: about UGX 20,000.\nMobile-money balance: UGX 2,300.',
        'Then the family WhatsApp group wakes up.\n\nDAD: “Congratulations to Daniel. First salary! He has bought his mother a fridge.”\nMUM: 👏👏👏👏👏👏\nSix claps. You count them. Apparently this is what your statistics course was preparing you for.',
      ],
      buttonText: 'CONTINUED ON NEXT PAGE →',
      nextNodeId: 'node-approach',
    },

    // PAGE 3: 7:46 PM (WHO DO YOU APPROACH?)
    'node-approach': {
      id: 'node-approach',
      type: 'decision',
      badge: 'DECISION 1 OF 3',
      badgeColor: 'amber',
      headline: '7:46 PM',
      leadText: 'You type, “Mum, send me something small.” You stop before pressing send.',
      highlightText: 'Who do you approach?',
      choices: [
        {
          id: 'c-dad',
          label: 'Ask Dad directly ›',
          nextNodeId: 'node-dad',
          statPercent: 38,
        },
        {
          id: 'c-mum',
          label: 'Message Mum privately ›',
          nextNodeId: 'node-mum',
          statPercent: 42,
        },
        {
          id: 'c-sam',
          label: 'Ask my friend Sam ›',
          nextNodeId: 'node-sam',
          statPercent: 20,
        },
      ],
    },

    // ==========================================
    // ROUTE 1: DAD (PAGE 4)
    // ==========================================
    'node-dad': {
      id: 'node-dad',
      type: 'decision',
      badge: 'DAD • YOUR MOVE',
      badgeColor: 'amber',
      headline: 'Dad • Your move',
      leadText: 'You find Dad watching the news. A minister is announcing opportunities for young people. You both watch silently for a moment.',
      bodyParagraphs: [
        '“Dad, I have an interview tomorrow. Could you help me with twenty thousand for transport?”',
        'He lowers the volume.\n“What happened to the thirty thousand I sent last week?”',
        'Ten went on data. Eight on printing and transport to leave a CV. Twelve helped you attend a friend’s birthday.',
        'At the birthday you said work was “moving.” The cake was excellent.',
      ],
      highlightText: 'What do you tell him?',
      choices: [
        {
          id: 'c-dad-truth',
          label: 'The full breakdown, including the birthday ›',
          nextNodeId: 'node-dad-truth',
          statPercent: 52,
        },
        {
          id: 'c-dad-part',
          label: 'Applications, transport and data ›',
          nextNodeId: 'node-dad-part',
          statPercent: 48,
        },
      ],
    },

    // PAGE 7: DAD TRUTH
    'node-dad-truth': {
      id: 'node-dad-truth',
      type: 'consequence',
      badge: 'DAD TRUTH',
      badgeColor: 'emerald',
      headline: 'Dad Truth',
      leadText: '“Twelve thousand for a birthday?” “Yes.” “You should have told me.”',
      bodyParagraphs: [
        '“I wanted one evening where nobody was helping me.”',
        'Dad looks at the television. The minister is still providing opportunities verbally.',
        'He sends UGX 20,000.',
        '“I can cover tomorrow. Don’t assume I can cover every day.”',
        '“Thank you.” It is help. It is also a limit.',
      ],
      buttonText: 'Read the interview details ›',
      nextNodeId: 'node-details-dad-truth',
    },

    // PAGE 29: DAD PART
    'node-dad-part': {
      id: 'node-dad-part',
      type: 'consequence',
      badge: 'DAD PART',
      badgeColor: 'amber',
      headline: 'Dad Part',
      leadText: '“Applications, transport and data,” you say. All true. Collectively incomplete.',
      bodyParagraphs: [
        'Dad sends UGX 20,000.',
        '“Keep track. Money is tight.”',
        'Back in your room, a friend tags you in a birthday photograph. You are holding a plate large enough to require its own qualifications.',
        'Dad is in that group too.',
      ],
      buttonText: 'Read the interview details ›',
      nextNodeId: 'node-details-dad-part',
    },

    // ==========================================
    // ROUTE 2: MUM (PAGE 5)
    // ==========================================
    'node-mum': {
      id: 'node-mum',
      type: 'decision',
      badge: 'MUM • YOUR MOVE',
      badgeColor: 'amber',
      headline: 'Mum • Your move',
      leadText: 'YOU: “Mum, interview tomorrow. Can you send me twenty thousand for transport?”',
      bodyParagraphs: [
        'Three dots appear. Disappear. Return.',
        'MUM: “I can manage ten. It is from the money for my prescription refill tomorrow. Your father can top it up, but tell him tonight.”',
        'Then:\nMUM: “Please don’t make this another secret.”',
      ],
      highlightText: 'Your move:',
      choices: [
        {
          id: 'c-mum-keep',
          label: 'Keep her prescription money. Ask Dad ›',
          nextNodeId: 'node-mum-keep',
          statPercent: 61,
        },
        {
          id: 'c-mum-take',
          label: 'Accept ten and ask Dad for balance ›',
          nextNodeId: 'node-mum-take',
          statPercent: 39,
        },
      ],
    },

    // PAGE 51: MUM KEEP
    'node-mum-keep': {
      id: 'node-mum-keep',
      type: 'consequence',
      badge: 'MUM KEEP',
      badgeColor: 'emerald',
      headline: 'Mum Keep',
      leadText: 'You delete “Are you sure?” You know she will say yes.',
      bodyParagraphs: [
        'YOU: “Keep it, Mum. Let me talk to Dad.”',
        'In the sitting room, you explain the interview and the balance on your phone.',
        'Dad checks his own phone before replying.',
        '“I can manage twenty. Only tomorrow.” He sends it.',
        'Your mother walks past with a cup of tea. She says nothing. For once, nothing feels quite good.',
      ],
      buttonText: 'Read the interview details ›',
      nextNodeId: 'node-details-mum-keep',
    },

    // PAGE 73: MUM TAKE
    'node-mum-take': {
      id: 'node-mum-take',
      type: 'consequence',
      badge: 'MUM TAKE',
      badgeColor: 'amber',
      headline: 'Mum Take',
      leadText: 'Mum sends UGX 10,000. You go to Dad.',
      bodyParagraphs: [
        '“Mum has helped with ten. Could you send the other ten? She needs hers back for her prescription tomorrow.”',
        'He looks towards the kitchen.\n“She told you that?”\n“Yes.”',
        'He sends UGX 10,000 to you and UGX 10,000 to Mum.',
        '“Next time, tell me what is happening before she has to juggle things.”',
        'Mum calls from the kitchen, “And next time, both of you remember I can hear.”',
      ],
      buttonText: 'Read the interview details ›',
      nextNodeId: 'node-details-mum-take',
    },

    // ==========================================
    // ROUTE 3: SAM (PAGE 6)
    // ==========================================
    'node-sam': {
      id: 'node-sam',
      type: 'decision',
      badge: 'SAM • YOUR MOVE',
      badgeColor: 'amber',
      headline: 'Sam • Your move',
      leadText: 'Your last message to Sam was: “Work is hectic, bro.”',
      bodyParagraphs: [
        'It was. You had been replacing “hardworking” with “results-oriented” on your CV.',
        'YOU: “Can you lend me twenty thousand? Interview tomorrow.”',
        'SAM: “Interview? Thought your placement became permanent.”',
      ],
      highlightText: 'Your move:',
      choices: [
        {
          id: 'c-sam-truth',
          label: 'Admit the placement ended six weeks ago ›',
          nextNodeId: 'node-sam-truth',
          statPercent: 45,
        },
        {
          id: 'c-sam-promise',
          label: 'Say you will repay Friday ›',
          nextNodeId: 'node-sam-promise',
          statPercent: 55,
        },
      ],
    },

    // PAGE 95: SAM TRUTH
    'node-sam-truth': {
      id: 'node-sam-truth',
      type: 'consequence',
      badge: 'SAM TRUTH',
      badgeColor: 'emerald',
      headline: 'Sam Truth',
      leadText: 'Sam calls. “Six weeks?” “Yes.” “You could have told me.”',
      bodyParagraphs: [
        '“I didn’t want every conversation to become career advice.”',
        'He laughs softly. “Fair. I have fifteen I can lend. I need it back next Wednesday. If you can’t, tell me before then.”',
        'You accept. Fifteen will cover the slower taxi route if you leave early. It will be tight.',
      ],
      buttonText: 'Read the interview details ›',
      nextNodeId: 'node-details-sam-truth',
    },

    // PAGE 117: SAM PROMISE
    'node-sam-promise': {
      id: 'node-sam-promise',
      type: 'consequence',
      badge: 'SAM PROMISE',
      badgeColor: 'amber',
      headline: 'Sam Promise',
      leadText: 'You have no money expected on Friday. Sam sends UGX 20,000.',
      bodyParagraphs: [
        'SAM: “Please make Friday. That’s part of my electricity money.”',
        'YOU: “Sorted.”',
        'The word costs nothing to send.',
      ],
      buttonText: 'Read the interview details ›',
      nextNodeId: 'node-details-sam-promise',
    },

    // ==========================================
    // THE DETAILS (8:19 PM - PAGES 8, 30, 52, 74, 96, 118)
    // ==========================================
    ...createDetailsNodes(),

    // ==========================================
    // SUB-BRANCH: THE INTERVIEW (PAGES 9, 31, 53, 75, 97, 119)
    // ==========================================
    ...createInterviewNodes(),

    // ==========================================
    // SUB-BRANCH: ASK BEFORE COMMITTING (PAGES 10, 32, 54, 76, 98, 120)
    // ==========================================
    ...createAskBeforeCommittingNodes(),

    // ==========================================
    // SUB-BRANCH: THE PAID TASK (PAGES 11, 33, 55, 77, 99, 121)
    // ==========================================
    ...createPaidTaskNodes(),

    // ==========================================
    // THE 4 ENDINGS & AFTERMATHS (PAGES 12-138)
    // ==========================================
    ...createEndingNodes(),
  },
};

// Helper generators for full branching coverage
function createDetailsNodes() {
  const routes = ['dad-truth', 'dad-part', 'mum-keep', 'mum-take', 'sam-truth', 'sam-promise'];
  const nodes: Record<string, any> = {};

  for (const r of routes) {
    nodes[`node-details-${r}`] = {
      id: `node-details-${r}`,
      type: 'decision',
      badge: '8:19 PM • THE DETAILS',
      badgeColor: 'amber',
      headline: '8:19 PM • The details',
      leadText: 'The promised message arrives.',
      bodyParagraphs: [
        'BRIGHTPATH CONSULTING\n“Please note: this is a three-month unpaid graduate placement, four weekdays per week, 8 a.m.–5 p.m. No transport allowance. Some previous participants have progressed to paid roles, subject to vacancies. Tomorrow’s interview does not guarantee selection.”',
        'You do the arithmetic.\nUGX 20,000 return transport. Sixteen days in a four-week month. UGX 320,000 for transport alone.',
        'Food is not included in the calculation. Apparently you are expected to photosynthesise.',
        'Another message arrives. Aisha, from your previous placement.\n\nAISHA: “Remember those attendance spreadsheets you cleaned? A small organisation needs help with theirs. UGX 80,000 for the task, payable after they check it. They can share a sample tonight. Want me to introduce you?”',
        'The task needs work tomorrow morning. It clashes with the interview.',
      ],
      highlightText: 'Your move:',
      choices: [
        {
          id: `c-hear-${r}`,
          label: 'Attend the interview. Hear them out ›',
          nextNodeId: `node-interview-${r}`,
          statPercent: 44,
        },
        {
          id: `c-ask-${r}`,
          label: 'Ask about support and prospects ›',
          nextNodeId: `node-ask-${r}`,
          statPercent: 32,
        },
        {
          id: `c-task-${r}`,
          label: 'Explore Aisha’s paid task ›',
          nextNodeId: `node-paid-task-${r}`,
          statPercent: 24,
        },
      ],
    };
  }
  return nodes;
}

function createInterviewNodes() {
  const routes = ['dad-truth', 'dad-part', 'mum-keep', 'mum-take', 'sam-truth', 'sam-promise'];
  const nodes: Record<string, any> = {};

  for (const r of routes) {
    const dadKnockText = r.startsWith('mum') || r.startsWith('sam')
      ? '“Your mother says you have an interview.”'
      : '“Have they sent the interview details?”';

    nodes[`node-interview-${r}`] = {
      id: `node-interview-${r}`,
      type: 'decision',
      badge: 'THE INTERVIEW',
      badgeColor: 'amber',
      headline: 'The interview',
      leadText: 'You put your certificates in a folder. Dad knocks.',
      bodyParagraphs: [
        dadKnockText,
        'You show him the message.',
        '“Unpaid?”',
        '“For three months. There could be a job.”',
        '“Could be?”',
        'His question annoys you because you have asked yourself the same one.',
      ],
      highlightText: 'What do you ask for?',
      choices: [
        {
          id: `c-only-${r}`,
          label: 'Tomorrow only. Ask questions first ›',
          nextNodeId: `ending-tomorrow-only-${r}`,
          statPercent: 68,
        },
        {
          id: `c-budget-${r}`,
          label: 'Ask for support for the three months ›',
          nextNodeId: `ending-family-budget-${r}`,
          statPercent: 32,
        },
      ],
    };
  }
  return nodes;
}

function createAskBeforeCommittingNodes() {
  const routes = ['dad-truth', 'dad-part', 'mum-keep', 'mum-take', 'sam-truth', 'sam-promise'];
  const nodes: Record<string, any> = {};

  for (const r of routes) {
    nodes[`node-ask-${r}`] = {
      id: `node-ask-${r}`,
      type: 'decision',
      badge: 'ASK BEFORE COMMITTING',
      badgeColor: 'amber',
      headline: 'Ask before committing',
      leadText: 'You write to the recruiter asking if transport support or fewer on-site days are possible.',
      bodyParagraphs: [
        'You write:\n“Thank you. Before I confirm, may I ask whether transport support or fewer on-site days are possible? How many participants from the last cohort moved into paid roles?”',
        'At 8:43 p.m., the recruiter replies:\n“No allowance or reduced attendance currently. Two of the last twelve participants moved into paid roles. We cannot promise the same. Could you confirm attendance within fifteen minutes? We need to finalise the list.”',
        'You appreciate the answer. You dislike the answer. Both fit inside the same head.',
      ],
      highlightText: 'Your move:',
      choices: [
        {
          id: `c-confirm-${r}`,
          label: 'Confirm the interview as information-gathering ›',
          nextNodeId: `ending-tomorrow-only-${r}`,
          statPercent: 54,
        },
        {
          id: `c-decline-${r}`,
          label: 'Decline and ask Aisha for the sample ›',
          nextNodeId: `node-paid-task-${r}`,
          statPercent: 46,
        },
      ],
    };
  }
  return nodes;
}

function createPaidTaskNodes() {
  const routes = ['dad-truth', 'dad-part', 'mum-keep', 'mum-take', 'sam-truth', 'sam-promise'];
  const nodes: Record<string, any> = {};

  for (const r of routes) {
    nodes[`node-paid-task-${r}`] = {
      id: `node-paid-task-${r}`,
      type: 'decision',
      badge: 'THE PAID TASK',
      badgeColor: 'amber',
      headline: 'The paid task',
      leadText: 'Aisha introduces you by message. You ask for the sample, deadline and payment terms before agreeing.',
      bodyParagraphs: [
        'The sample contains inconsistent dates, duplicate entries and three spellings of one district.',
        'You recognise the problem. You also recognise that the full file may be worse.',
        'The client proposes a cleaned file and short summary by 1 p.m. tomorrow, one round of corrections, payment of UGX 80,000 by the next working day after acceptance.',
        'You have a laptop and spreadsheet software. You will need UGX 5,000 for extra data. Every funding route leaves enough for that purchase.',
        'You confirm the scope and payment terms in writing. The client agrees.',
        'Then the full file arrives.\nSeveral hundred rows are missing attendance dates. You cannot reconstruct them from what you have.',
      ],
      highlightText: 'Your move:\n────────\nENDINGS',
      choices: [
        {
          id: `c-eighty-${r}`,
          label: 'Offer a smaller, verifiable delivery ›',
          nextNodeId: `ending-eighty-thousand-${r}`,
          statPercent: 62,
        },
        {
          id: `c-stayup-${r}`,
          label: 'Keep the full promise and stay up ›',
          nextNodeId: `ending-file-at-107-${r}`,
          statPercent: 38,
        },
      ],
    };
  }
  return nodes;
}

function createEndingNodes() {
  const routes = ['dad-truth', 'dad-part', 'mum-keep', 'mum-take', 'sam-truth', 'sam-promise'];
  const nodes: Record<string, any> = {};

  // AFTERMATH MAP BY ROUTE
  const aftermathTexts: Record<string, { lead: string; body: string[]; samRepaymentNote?: string }> = {
    'dad-truth': {
      lead: 'That evening Dad asks, “Any more birthdays this week?”',
      body: [
        'You almost defend yourself. Then you notice he is smiling.',
        '“One,” you say. “I may attend emotionally.”',
        'You agree to discuss what help is possible next Sunday. Neither of you calls it pocket money.',
      ],
    },
    'dad-part': {
      lead: 'Dad sends the birthday photograph.',
      body: [
        '“Printing and data?”',
        'You type three explanations and delete them.',
        '“Twelve thousand was for the birthday. I should have told you.”',
        'He replies, “Yes.”',
        'Tomorrow’s opportunity was real. So was the missing part of your account. The next conversation will have to include both.',
      ],
    },
    'mum-keep': {
      lead: 'Mum collects her prescription refill the next day using the money she kept.',
      body: [
        'Later she asks, “What happened?”',
        'You tell her the whole version. It takes longer than “Fine.”',
        'She does not solve it. She stops peeling for a moment and listens.',
      ],
    },
    'mum-take': {
      lead: 'Mum confirms that Dad’s replacement money reached her. Her prescription refill is covered.',
      body: [
        '“I don’t mind helping,” she tells you. “I mind being the secret account.”',
        'You ask whether the three of you can discuss support together next Sunday.',
        '“I’ll be there,” she says. “It is also my sitting room.”',
      ],
    },
    'sam-truth': {
      lead: 'You message Sam before Wednesday.',
      body: [
        '“I don’t have the fifteen yet. Can we agree a new date? I know you were counting on it.”',
        'He replies. The conversation is easier than pretending, but asking still catches in your throat.',
      ],
      samRepaymentNote: '“I’ve received payment. Sending your fifteen back today.”',
    },
    'sam-promise': {
      lead: 'On Thursday, Sam asks, “Still okay for tomorrow?”',
      body: [
        'You write, “I can’t repay tomorrow. I had no confirmed money coming when I promised Friday. I’m sorry. Can we agree another date?”',
        'He replies, “I needed that money. Please don’t make promises like that.”',
        'You keep the chat open. There is no clever reply that settles it.',
      ],
      samRepaymentNote: 'You send his twenty thousand, then write, “The placement ended six weeks ago. I should have said.” He replies, “I needed that money. Please don’t make promises like that.” You keep the chat open. There is no clever reply that settles it.',
    },
  };

  for (const r of routes) {
    const af = aftermathTexts[r];

    // ==========================================
    // ENDING 1: TOMORROW ONLY
    // ==========================================
    const dadTomorrowLead = r.startsWith('sam')
      ? 'Dad reads the message twice. “You have tomorrow’s transport. I cannot commit to three months.”'
      : 'Dad reads the message twice. “The money I sent is for tomorrow. I cannot commit to three months.”';

    nodes[`ending-tomorrow-only-${r}`] = {
      id: `ending-tomorrow-only-${r}`,
      type: 'consequence',
      badge: 'ONE OF FOUR POSSIBLE ENDINGS',
      badgeColor: 'amber',
      headline: 'TOMORROW ONLY',
      leadText: dadTomorrowLead,
      bodyParagraphs: [
        'You reply, “I haven’t agreed to three months either.” He pulls out a chair.',
        'You write three questions: What work would I do? Who would supervise me? When would we review whether this is worth continuing?',
        'The next morning you attend. The interviewer describes useful work and a supervisor willing to provide a reference. There is still no allowance and no guaranteed vacancy.',
        'You ask for the terms in writing and time to consider them.',
        'You leave with less transport money and more information. No job. No signature.',
        'Aisha says the paid task has gone to someone else, but you may send your availability for future work.',
      ],
      buttonText: 'Continue to what happened next ›',
      nextNodeId: `aftermath-tomorrow-only-${r}`,
    };

    nodes[`aftermath-tomorrow-only-${r}`] = {
      id: `aftermath-tomorrow-only-${r}`,
      type: 'consequence',
      badge: 'THE AFTERMATH',
      badgeColor: 'amber',
      headline: 'What you carried into the room',
      leadText: af.lead,
      bodyParagraphs: af.body,
      buttonText: 'Hear Uncle Rwamiti ›',
      nextNodeId: 'node-rwamiti-verdict-1',
    };

    // ==========================================
    // ENDING 2: THE FAMILY BUDGET
    // ==========================================
    nodes[`ending-family-budget-${r}`] = {
      id: `ending-family-budget-${r}`,
      type: 'consequence',
      badge: 'ONE OF FOUR POSSIBLE ENDINGS',
      badgeColor: 'amber',
      headline: 'THE FAMILY BUDGET',
      leadText: '“If they select you,” Dad says, “what would it cost us?”',
      bodyParagraphs: [
        '“About three hundred and twenty thousand a month in transport. Before food.”',
        'He takes a notebook from the drawer. You had imagined a lecture. The notebook is worse. It contains numbers.',
        'There are bills you know about and one you do not.',
        '“I can offer one hundred thousand towards a first month,” he says. “That does not cover it.”',
        'For a moment you want to accuse him of not believing in you. Instead, you sit with the shortfall.',
        'You attend the interview the next morning. When they ask whether you can commit, you say you need a workable funding arrangement before accepting. They will not hold a place indefinitely.',
        'That evening, your certificates return to the shelf. Beside them is a page showing what the opportunity would actually cost.',
      ],
      buttonText: 'Continue to what happened next ›',
      nextNodeId: `aftermath-family-budget-${r}`,
    };

    nodes[`aftermath-family-budget-${r}`] = {
      id: `aftermath-family-budget-${r}`,
      type: 'consequence',
      badge: 'THE AFTERMATH',
      badgeColor: 'amber',
      headline: 'What you carried into the room',
      leadText: af.lead,
      bodyParagraphs: af.body,
      buttonText: 'Hear Uncle Rwamiti ›',
      nextNodeId: 'node-rwamiti-verdict-2',
    };

    // ==========================================
    // ENDING 3: EIGHTY THOUSAND, WITH CONDITIONS
    // ==========================================
    nodes[`ending-eighty-thousand-${r}`] = {
      id: `ending-eighty-thousand-${r}`,
      type: 'consequence',
      badge: 'ONE OF FOUR POSSIBLE ENDINGS',
      badgeColor: 'amber',
      headline: 'EIGHTY THOUSAND, WITH CONDITIONS',
      leadText: 'You message the client:\n“I can clean and deduplicate the usable records, provide a summary of those records, and list the missing information by 1 p.m. I cannot produce a complete attendance total without the missing dates.”',
      bodyParagraphs: [
        'Nine minutes pass. “We need a complete report,” the client replies.',
        'You explain what would be needed. They agree to the limited delivery for UGX 60,000. Any later work on recovered records will be separately agreed.',
        'Less money. A promise you can make.',
        'Dad knocks. You show him the task and explain why you are not attending the interview.',
        'He asks, “Is this a job?” “A task.” “And after?” “I don’t know yet.”',
        'The next day you deliver at 12:41 p.m. The client requests a corrected heading, then accepts the file. Payment arrives the following working day.',
        'It is not a salary. After data costs and any repayment, it is not even the full sixty thousand.',
        'You save a description of the work, without the client’s records, and ask permission to use a redacted sample. They have not answered yet.',
      ],
      buttonText: 'Continue to what happened next ›',
      nextNodeId: `aftermath-eighty-thousand-${r}`,
    };

    const samPaidAftermath = r === 'sam-truth' && af.samRepaymentNote
      ? [af.samRepaymentNote, 'He replies. The conversation is easier than pretending, but asking still catches in your throat.']
      : r === 'sam-promise' && af.samRepaymentNote
      ? [af.samRepaymentNote]
      : af.body;

    nodes[`aftermath-eighty-thousand-${r}`] = {
      id: `aftermath-eighty-thousand-${r}`,
      type: 'consequence',
      badge: 'THE AFTERMATH',
      badgeColor: 'amber',
      headline: 'What you carried into the room',
      leadText: af.lead,
      bodyParagraphs: samPaidAftermath,
      buttonText: 'Hear Uncle Rwamiti ›',
      nextNodeId: 'node-rwamiti-verdict-3',
    };

    // ==========================================
    // ENDING 4: THE FILE AT 1:07 PM
    // ==========================================
    nodes[`ending-file-at-107-${r}`] = {
      id: `ending-file-at-107-${r}`,
      type: 'consequence',
      badge: 'ONE OF FOUR POSSIBLE ENDINGS',
      badgeColor: 'amber',
      headline: 'THE FILE AT 1:07 PM',
      leadText: 'You tell the client, “No problem.” At midnight there are problems.',
      bodyParagraphs: [
        'At 2 a.m., the missing dates remain missing. Staying awake has failed to manufacture them.',
        'You clean most of the file, then tell the client at 11:30 a.m. that a complete summary is impossible without additional records.',
        '“You should have told us yesterday,” they reply. “We needed this for a meeting.”',
        'They accept the usable cleaned file for UGX 40,000, payable the next working day. They will handle the summary internally.',
        'You agree. No further work is requested.',
        'Dad finds you asleep beside the laptop that afternoon.',
        '“Interview?”\nYou explain the task, the missing records and the reduced payment. He listens.',
        '“So what did you learn?”\nYou look at him. “Please let me sleep before this becomes a graduation speech.” He closes the door quietly.',
      ],
      buttonText: 'Continue to what happened next ›',
      nextNodeId: `aftermath-file-at-107-${r}`,
    };

    nodes[`aftermath-file-at-107-${r}`] = {
      id: `aftermath-file-at-107-${r}`,
      type: 'consequence',
      badge: 'THE AFTERMATH',
      badgeColor: 'amber',
      headline: 'What you carried into the room',
      leadText: af.lead,
      bodyParagraphs: af.body,
      buttonText: 'Hear Uncle Rwamiti ›',
      nextNodeId: 'node-rwamiti-verdict-4',
    };
  }

  // Uncle Rwamiti verdicts & Ending Cards
  const verdicts = [
    {
      id: 'node-rwamiti-verdict-1',
      cardId: 'card-tomorrow-only',
      title: 'TOMORROW ONLY',
      quote: '“I went to the interview. I left with questions to answer.”',
    },
    {
      id: 'node-rwamiti-verdict-2',
      cardId: 'card-family-budget',
      title: 'THE FAMILY BUDGET',
      quote: '“We finally counted what the opportunity would cost.”',
    },
    {
      id: 'node-rwamiti-verdict-3',
      cardId: 'card-eighty-thousand',
      title: 'EIGHTY THOUSAND, WITH CONDITIONS',
      quote: '“I chose the paid task. The scope changed. So did the fee.”',
    },
    {
      id: 'node-rwamiti-verdict-4',
      cardId: 'card-file-at-107',
      title: 'THE FILE AT 1:07 PM',
      quote: '“I promised the whole report before seeing the whole problem.”',
    },
  ];

  for (const v of verdicts) {
    nodes[v.id] = {
      id: v.id,
      type: 'decision',
      badge: 'A MOMENT TO THINK',
      badgeColor: 'amber',
      headline: 'Uncle Rwamiti',
      leadText: 'Uncle Rwamiti has been suspiciously quiet. Now he puts down his tea.',
      bodyParagraphs: [
        '“My friend, twenty thousand shillings entered this house as transport money and left as a family meeting.”',
        'He looks at your phone.\n“Which was harder: finding the money, or telling someone the whole situation?”',
        'Which part was hardest for you? Think about it privately, then choose to see your ending card.',
      ],
      choices: [
        {
          id: `c-see-${v.cardId}`,
          label: 'See my ending card ›',
          nextNodeId: v.cardId,
          statPercent: 100,
        },
      ],
    };

    nodes[v.cardId] = {
      id: v.cardId,
      type: 'climax',
      badge: 'THE END ... OR ANOTHER BEGINNING',
      badgeColor: 'amber',
      headline: 'YOUR ENDING CARD',
      leadText: v.title,
      bodyParagraphs: [
        v.quote,
        'One evening. Different choices. What would you do?',
        'Uncle Rwamiti: Your Move',
        'The uncle your parents should probably never have introduced you to.',
        'unclerwamiti.com | PeterosPaths.org',
      ],
      choices: [
        {
          id: `c-retry-${v.cardId}`,
          label: 'TRY ANOTHER MOVE ›',
          nextNodeId: 'node-approach',
        },
        {
          id: `c-restart-${v.cardId}`,
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
    };
  }

  return nodes;
}
