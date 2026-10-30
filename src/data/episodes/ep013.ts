import { Episode } from '../../types';

export const ep013: Episode = {
  id: 'ep-013',
  number: '013',
  title: 'BECAUSE I SAID SO.',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser:
    'In Katete, just outside Mbarara, sixteen-year-old Eva is invited to a Saturday digital illustration workshop. She has read the programme, her teacher confirmed the invitation, and her aunt agreed to take her and bring her back. Her mother says no without looking at the screen.',
  category: 'Kampala Dilemmas',
  badge: 'KATETE • MBARARA',
  badgeColor: 'amber',
  coverImage: 'assets/comic-pages/because-i-said-so/cover.jpg',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“A PARENT’S DUTY IS TO GUIDE AND PROTECT. A REFUSAL TO LOOK IS SOMETHING ELSE.”',
    quoteLines: [
      '“Eva did her homework before asking: she read the programme, her teacher confirmed the invitation, and her aunt agreed to accompany her to Mbarara and back.”',
      '“When authority feels questioned, the conversation stops being about the evidence—even when a parent also carries real worries about schoolwork and household priorities.”',
      '“Keeping the conversation open does not guarantee an immediate yes. Sometimes the real victory is getting the evidence seen so the next decision is made with open eyes.”',
    ],
    closingQuestion: 'When Eva’s mother says “No. Because I said so” without reading the details, what do you do next?',
    pollOptions: [
      'A. Challenge her directly: “About this subject, I do know more. Please look before deciding.”',
      'B. Withdraw: “Okay, Mum.” Put the phone away and stop explaining.',
      'C. Try to keep the conversation open: “You can still guide me. Can I first show you what I’ve learned?”',
    ],
  },
  recommendedNextEpisodeId: 'ep-015',
  sharePrompt:
    'I just played Episode 013: BECAUSE I SAID SO. on Uncle Rwamiti. Authority, evidence, and a Saturday workshop in Mbarara. What would your move be?',
  nodes: {
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'AN UNCLE RWAMITI INTERACTIVE STORY',
      badgeColor: 'amber',
      headline: 'BECAUSE I SAID SO.',
      leadText: 'Katete, just outside Mbarara. Eva is sixteen. For four months she has been teaching herself digital illustration on her phone.',
      bodyParagraphs: [
        'Now she has been invited to a Saturday Digital Illustration Workshop in Mbarara.',
        'Before asking her mother Grace, Eva prepares carefully: she reads the full programme, her school art teacher confirms the invitation, and her aunt confirms she can take Eva to Mbarara and bring her back.',
        'Ten opening panels • Three choices • Realistic continuations exploring what happens even when keeping the conversation open still meets a refusal.',
      ],
      buttonText: 'START THE STORY ›',
      nextNodeId: 'node-panels-1-3',
      image: 'assets/comic-pages/because-i-said-so/cover.jpg',
    },

    'node-panels-1-3': {
      id: 'node-panels-1-3',
      type: 'consequence',
      badge: 'PANELS 1–3 • THE INVITATION & DISMISSAL',
      badgeColor: 'amber',
      headline: '1. The Workshop Invitation & 2. “Get a Pencil”',
      leadText:
        'Eva approaches her mother in the sitting room, holding out her phone with the Saturday workshop details open on the screen.',
      bodyParagraphs: [
        'EVA: “Mum, there’s a digital illustration workshop in Mbarara on Saturday. Look—”',
        'Grace glances up without looking at the phone screen.',
        'MUM: “Another day playing on a phone? Eva, drawing is drawing. Get a pencil.”',
        'EVA: “It’s digital illustration, Mum. People use it for books, posters and business work.”',
      ],
      buttonText: 'NEXT: PANELS 4–6 ›',
      nextNodeId: 'node-panels-4-6',
      image: 'assets/comic-pages/because-i-said-so/panel-2.jpg',
    },

    'node-panels-4-6': {
      id: 'node-panels-4-6',
      type: 'consequence',
      badge: 'PANELS 4–6 • AUTHORITY VS. SUBJECT KNOWLEDGE',
      badgeColor: 'amber',
      headline: '3. “So Now You Know More Than Your Mother?” & 4. The Evidence',
      leadText:
        'Grace straightens in her chair, her voice sharpening at the thought of being corrected by her sixteen-year-old daughter.',
      bodyParagraphs: [
        'MUM: “I went to school before you were born. So now you know more than your mother?”',
        'EVA: “About this, I’ve been learning for months—”',
        'MUM: “And I have been your mother for sixteen years.”',
        'EVA: “Did you even look at the details? I read the programme, my teacher confirmed the invitation, and Aunt can take me and bring me back.”',
      ],
      buttonText: 'NEXT: PANELS 7–10 ›',
      nextNodeId: 'node-panels-7-10',
      image: 'assets/comic-pages/because-i-said-so/panel-6.jpg',
    },

    'node-panels-7-10': {
      id: 'node-panels-7-10',
      type: 'consequence',
      badge: 'PANELS 7–10 • THE REFUSAL TO LOOK',
      badgeColor: 'red',
      headline: '5. “No. Because I Said So.” & 6. Uncle Rwamiti’s Observation',
      leadText:
        'Eva holds the phone steady, showing the teacher’s confirmation and her aunt’s message. Her mother still refuses to look at the screen.',
      bodyParagraphs: [
        'MUM: “These things are a distraction. You have school. You should focus on real subjects.”',
        'MUM: “No. Because I said so.”',
        'Eva stands holding the phone she was not allowed to show.',
        'UNCLE RWAMITI: “A parent’s duty is to guide and protect. A refusal to look is something else. When authority feels questioned, the conversation stops being about the evidence.”',
      ],
      buttonText: 'MAKE YOUR MOVE ›',
      nextNodeId: 'node-decision',
      image: 'assets/comic-pages/because-i-said-so/panel-10.jpg',
    },

    'node-decision': {
      id: 'node-decision',
      type: 'decision',
      badge: 'YOUR MOVE',
      badgeColor: 'amber',
      headline: 'YOUR MOVE: WHAT DO YOU DO NEXT?',
      leadText:
        'You are Eva. You have prepared the programme, your teacher’s confirmation, and your aunt’s escort plan. Your mother has said no without reading the details.',
      highlightText: 'How do you respond? Choose A, B or C.',
      bodyParagraphs: [
        'Each choice leads to a realistic continuation—including what happens when you keep the conversation open and still face a refusal.',
      ],
      choices: [
        {
          id: 'choice-a',
          label: 'A • CHALLENGE HER DIRECTLY — “About this subject, I do know more. Please look before deciding.”',
          nextNodeId: 'node-path-a-1',
          statPercent: 28,
        },
        {
          id: 'choice-b',
          label: 'B • WITHDRAW — “Okay, Mum.” Put the phone away and stop explaining.',
          nextNodeId: 'node-path-b-1',
          statPercent: 24,
        },
        {
          id: 'choice-c',
          label: 'C • TRY TO KEEP THE CONVERSATION OPEN — “You can still guide me. Can I first show you what I’ve learned?”',
          nextNodeId: 'node-path-c-1',
          statPercent: 48,
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/page-2.jpg',
    },

    'node-path-a-1': {
      id: 'node-path-a-1',
      type: 'decision',
      badge: 'YOUR MOVE A • CHALLENGE HER DIRECTLY',
      badgeColor: 'red',
      headline: 'A1. Right on the Facts, Tense in the Room',
      leadText:
        'EVA: “About this subject, I do know more. Please look before deciding.”',
      bodyParagraphs: [
        'Your statement is factually true—you have studied digital illustration for four months and read the entire programme, while your mother hasn’t glanced at the screen.',
        'But hearing “I do know more” makes Grace stiffen further. Beneath her defensiveness, she names the specific worry she hadn’t explained before:',
        'MUM: “You think four months on a phone means you can lecture me? Next Tuesday you have continuous assessment tests at school, and every trip into Mbarara costs transport money we need for term expenses. How am I supposed to judge a phone workshop when your school exams are five days away?”',
      ],
      highlightText: 'Now that her real concern—next week’s school tests and household cost—is out in the open, what do you do?',
      choices: [
        {
          id: 'choice-a-walk',
          label: '1. Insist that she is being unfair and walk away to your room.',
          nextNodeId: 'node-ending-a',
          statPercent: 42,
        },
        {
          id: 'choice-a-address',
          label: '2. Address her specific worry: show your completed test revision schedule and ask her to read the teacher’s note even if Saturday is off the table.',
          nextNodeId: 'node-path-c-2',
          statPercent: 58,
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/panel-5.jpg',
    },

    'node-ending-a': {
      id: 'node-ending-a',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • OUTCOME A',
      badgeColor: 'amber',
      headline: 'WHEN THE EVIDENCE NEVER GETS READ',
      leadText:
        'Eva leaves the sitting room knowing her facts were solid. Grace remains in her chair feeling her authority was challenged. The phone screen is never looked at.',
      bodyParagraphs: [
        'Saturday passes without the workshop, and neither mother nor daughter mentions the art teacher’s message again.',
        'UNCLE RWAMITI: “Eva was right that she knew more about digital illustration. Yet when a parent feels their standing is on trial, winning the point often loses the hearing.”',
      ],
      choices: [
        {
          id: 'retry-from-a',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-from-a',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/panel-9.jpg',
    },

    'node-path-b-1': {
      id: 'node-path-b-1',
      type: 'decision',
      badge: 'YOUR MOVE B • WITHDRAW',
      badgeColor: 'amber',
      headline: 'B1. Peace in the Sitting Room, Evidence in Your Pocket',
      leadText:
        'EVA: “Okay, Mum.” You lock the phone, slip it into your pocket, and stop explaining.',
      bodyParagraphs: [
        'The tension in the room drops immediately. Grace nods, relieved that her authority wasn’t contested.',
        'MUM: “Good. Your continuous assessment tests start on Tuesday. Go and revise your chemistry.”',
        'Yet because you stopped explaining, your mother still believes the workshop was just idle phone play—she never learned what digital illustration is used for, or that your art teacher endorsed your work.',
      ],
      highlightText: 'Later that evening, after finishing your chemistry revision, do you leave the subject closed or try a quieter opening?',
      choices: [
        {
          id: 'choice-b-keep-closed',
          label: '1. Keep it closed. At least the house is peaceful tonight.',
          nextNodeId: 'node-ending-b',
          statPercent: 49,
        },
        {
          id: 'choice-b-reopen',
          label: '2. Show her your completed chemistry notes first, then ask: “Since my revision is done, can I show you two illustrations I made so you can guide me?”',
          nextNodeId: 'node-path-c-2',
          statPercent: 51,
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/panel-8.jpg',
    },

    'node-ending-b': {
      id: 'node-ending-b',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • OUTCOME B',
      badgeColor: 'amber',
      headline: 'THE PRICE OF QUIET WITHDRAWAL',
      leadText:
        'Saturday comes and goes peacefully in Katete. Eva’s mother is pleased with her obedience—but still thinks digital illustration is “playing on a phone.”',
      bodyParagraphs: [
        'When the next workshop invitation arrives during the school holidays, Eva realizes she will have to start the exact same explanation from zero.',
        'UNCLE RWAMITI: “Putting the phone away ended the argument in five seconds. The trouble with silence is that it leaves every misunderstanding intact for next time.”',
      ],
      choices: [
        {
          id: 'retry-from-b',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-from-b',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/panel-8.jpg',
    },

    'node-path-c-1': {
      id: 'node-path-c-1',
      type: 'decision',
      badge: 'YOUR MOVE C • KEEP THE CONVERSATION OPEN',
      badgeColor: 'emerald',
      headline: 'C1. What Happens When You Keep It Open—And Still Hear “No”?',
      leadText:
        'EVA: “You can still guide me. Can I first show you what I’ve learned?”',
      bodyParagraphs: [
        'Because Eva respects her mother’s role as a guide rather than turning the moment into a contest, Grace’s posture softens. For the first time, she explains the specific worries behind her refusal:',
        'MUM: “Eva, even with your aunt going to Mbarara and your teacher confirming it, your mid-term tests start on Tuesday. And how do I judge whether a digital workshop is worth transport money and a whole Saturday when I have never seen how this work helps your future? My answer for this Saturday is still no.”',
      ],
      highlightText: 'Keeping the conversation open did not magically turn “no” into “yes” for Saturday. What do you do when the refusal stands?',
      choices: [
        {
          id: 'choice-c-show-anyway',
          label: '1. Accept the “no” for this Saturday before exams, and ask her to spend three minutes looking at your artwork and teacher’s note so she can judge the holiday workshop.',
          nextNodeId: 'node-path-c-2',
          statPercent: 68,
        },
        {
          id: 'choice-c-frustrated',
          label: '2. Say “If the answer is still no, then looking doesn’t matter” and put the phone away.',
          nextNodeId: 'node-ending-b',
          statPercent: 32,
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/panel-7.jpg',
    },

    'node-path-c-2': {
      id: 'node-path-c-2',
      type: 'consequence',
      badge: 'YOUR MOVE C • THE EVIDENCE IS SEEN',
      badgeColor: 'emerald',
      headline: 'C2. A Refusal for Saturday, A Commitment for End of Term',
      leadText:
        'Because the pressure to win Saturday immediately is off the table, Grace takes the phone into her hands and actually looks.',
      bodyParagraphs: [
        'She scrolls through four months of Eva’s digital illustrations—book cover layouts, poster designs, and labelled biology diagrams—and reads the confirmation message from Eva’s art teacher and her aunt.',
        'MUM: “You drew these yourself? On this phone?”',
        'EVA: “Yes, Mum. After finishing my homework.”',
        'MUM: “This is not playing. My decision for this Saturday stays—you have tests on Tuesday and money is tight this week. But on closing day at the end of term, I will come to school and speak with your art teacher myself so we can plan for the holiday workshop properly.”',
      ],
      buttonText: 'SEE UNCLE RWAMITI’S REFLECTION ›',
      nextNodeId: 'node-ending-c',
      image: 'assets/comic-pages/because-i-said-so/panel-10.jpg',
    },

    'node-ending-c': {
      id: 'node-ending-c',
      type: 'consequence',
      badge: 'UNCLE RWAMITI • OUTCOME C',
      badgeColor: 'emerald',
      headline: 'WHEN RESPECTING AUTHORITY OPENS THE EVIDENCE',
      leadText:
        'Eva does not attend the Saturday workshop in Mbarara this week. The disappointment is real—good communication is not a magic spell that erases exam timetables or household budgets.',
      bodyParagraphs: [
        'Yet something fundamental has changed in the house: her mother has looked at the evidence, recognized four months of real skill, and agreed to meet her teacher before the next opportunity.',
        'UNCLE RWAMITI: “Sometimes keeping the conversation open still ends in a ‘no’ for today. The difference is whether tomorrow’s conversation starts from ‘Because I said so’—or from evidence both of you have finally seen.”',
      ],
      choices: [
        {
          id: 'retry-from-c',
          label: 'TRY ANOTHER CHOICE (Return to YOUR MOVE) ›',
          nextNodeId: 'node-decision',
        },
        {
          id: 'restart-from-c',
          label: 'RESTART FROM THE COVER ›',
          nextNodeId: 'node-start',
        },
      ],
      image: 'assets/comic-pages/because-i-said-so/panel-10.jpg',
    },
  },
};

export const EPISODE_013_BECAUSE_I_SAID_SO = ep013;
export default ep013;
