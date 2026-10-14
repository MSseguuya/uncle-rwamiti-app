import { Episode } from '../../types';

export const ep013: Episode = {
  id: 'ep-013',
  number: '013',
  title: 'BECAUSE I SAID SO',
  subtitle: 'An Uncle Rwamiti: Your Move Story',
  teaser: 'Eva has checked the facts. Her mother has made the decision. Neither has told the other everything. You play Eva, sixteen, in Katete outside Mbarara.',
  category: 'Kampala Dilemmas',
  badge: 'KATETE • MBARARA',
  badgeColor: 'amber',
  coverImage: 'cover-because-i-said-so.webp',
  isPremium: false,
  published: true,
  initialNodeId: 'node-start',
  rwamitiEnding: {
    headline: '“TWO PEOPLE. MORE THAN ONE KIND OF KNOWLEDGE.”',
    quoteLines: [
      '“Eva has checked the facts. Her mother has made the decision. Neither has told the other everything.”',
      '“‘Because I said so’ is rarely about the thing being refused. It is about fear dressed in authority.”',
      '“Good preparation can help. A relationship also needs room to question the decision process.”',
    ],
    closingQuestion: '“What might change if Eva and her mother asked what the other knew—and what neither had yet explained?”',
    pollOptions: [
      'LISTENING TO EACH OTHER',
      'SHARING THE FULL INFORMATION',
      'CHECKING THE CHANGED ARRANGEMENTS',
      'MORE THAN ONE OF THESE',
    ],
  },
  recommendedNextEpisodeId: 'ep-001',
  sharePrompt: 'I just played Episode 013: BECAUSE I SAID SO on Uncle Rwamiti. Two people, more than one kind of knowledge. What is your move? Test your move!',
  nodes: {
    // PAGE 1: TITLE & INTRODUCTION
    'node-start': {
      id: 'node-start',
      type: 'start',
      badge: 'KATETE • MBARARA',
      badgeColor: 'amber',
      headline: 'AN UNCLE RWAMITI: YOUR MOVE STORY',
      leadText: 'Eva has checked the facts. Her mother has made the decision. Neither has told the other everything.',
      bodyParagraphs: [
        'You play Eva, sixteen, in Katete outside Mbarara. Your choices lead to different consequences. Later, you can replay the disagreement as her mother.',
        'No points. No correct answers. Only choices, consequences, and another move.',
        'Eva, her family and the workshop in this story are fictional. • Free to play • Approx. five minutes',
      ],
      buttonText: 'YOUR MOVE →',
      nextNodeId: 'node-decision-1',
    },

    // PAGE 2: DECISION 1 OF 2 - EVA'S PERSPECTIVE
    'node-decision-1': {
      id: 'node-decision-1',
      type: 'decision',
      badge: 'DECISION 1 OF 2',
      badgeColor: 'amber',
      headline: 'EVA’S PERSPECTIVE',
      leadText: 'Eva, sixteen, lived in Katete, outside Mbarara. She had attended St Hellen’s Primary School and was now in Form Four at Maryhill.',
      bodyParagraphs: [
        'On Saturday, a digital-design workshop was taking place in Mbarara. Eva wanted to learn how to turn her drawings into digital illustrations.',
        'She had checked the organiser’s official page, read the programme and asked a teacher to confirm the invitation.',
        '“Mum, may I go?” “No. Those things are scams.”',
        'Eva placed her phone on the table. “Here is the organiser. Here is the programme. My teacher checked it.”',
        'Her mother barely glanced at the screen. “I said no.”',
        '“But you haven’t even—” “Because I said so.”',
        'Eva picked up her phone. She had evidence that the workshop was genuine. She had not mentioned that her friend, who was supposed to travel with her, had cancelled. She would now be going alone.',
      ],
      highlightText: 'What does Eva do?',
      choices: [
        {
          id: 'c1_go_secretly',
          label: 'A • GO SECRETLY',
          nextNodeId: 'node-went-secretly',
        },
        {
          id: 'c1_stay_home',
          label: 'B • STAY HOME AND CLOSE THE CONVERSATION',
          nextNodeId: 'node-stayed-home',
        },
        {
          id: 'c1_ask_concern',
          label: 'C • ASK ABOUT THE CONCERN; TELL THE WHOLE PLAN',
          nextNodeId: 'node-opened-conversation',
        },
      ],
    },

    // PAGE 3: DECISION 2 OF 2 - EVA WENT SECRETLY
    'node-went-secretly': {
      id: 'node-went-secretly',
      type: 'decision',
      badge: 'DECISION 2 OF 2 • EVA WENT SECRETLY',
      badgeColor: 'red',
      headline: 'THE VENUE CHANGES',
      leadText: 'Eva said she was visiting her friend.',
      bodyParagraphs: [
        'On the way to Mbarara, her phone vibrated. The organiser had changed the venue because the original room was unavailable. The new room was inside a hotel she did not know.',
        'Her teacher replied to her message: “The workshop is genuine. I have not checked the new venue.”',
        'Another message arrived.',
        'Mum: “Your friend is here. Where are you?”',
        'Eva had been right about the workshop. Now she needed help with something she had not checked.',
      ],
      highlightText: 'What is Eva’s next move?',
      choices: [
        {
          id: 'c2_a1',
          label: 'A1 • TELL MUM THE TRUTH AND ASK FOR HELP',
          nextNodeId: 'node-ending-a1',
        },
        {
          id: 'c2_a2',
          label: 'A2 • STOP AND SEEK VERIFIED ADULT SUPPORT',
          nextNodeId: 'node-ending-a2',
        },
        {
          id: 'c2_a3',
          label: 'A3 • CONTINUE AND ANSWER MUM LATER',
          nextNodeId: 'node-ending-a3',
        },
      ],
    },

    // PAGE 4: DECISION 2 OF 2 - EVA STAYED HOME
    'node-stayed-home': {
      id: 'node-stayed-home',
      type: 'decision',
      badge: 'DECISION 2 OF 2 • EVA STAYED HOME',
      badgeColor: 'zinc',
      headline: 'THE QUIET HOUSE',
      leadText: 'Eva stayed home. “I hope you’ve understood,” her mother said.',
      bodyParagraphs: [
        'Eva nodded. She had understood something. It was not what her mother thought.',
        'The next morning, Eva saw photographs from the workshop. It had taken place successfully at a changed venue.',
        'Her teacher asked why she had missed it. “Family arrangements,” Eva replied.',
        'Then the organiser announced another session.',
      ],
      highlightText: 'What does Eva do now?',
      choices: [
        {
          id: 'c2_b1',
          label: 'B1 • EXPLAIN WHAT THE CONVERSATION DID TO HER',
          nextNodeId: 'node-ending-b1',
        },
        {
          id: 'c2_b2',
          label: 'B2 • PREPARE A COMPLETE PLAN AND ASK AGAIN',
          nextNodeId: 'node-ending-b2',
        },
        {
          id: 'c2_b3',
          label: 'B3 • KEEP QUIET AND PLAN WITHOUT MUM',
          nextNodeId: 'node-ending-b3',
        },
      ],
    },

    // PAGE 5: DECISION 2 OF 2 - EVA OPENED THE CONVERSATION
    'node-opened-conversation': {
      id: 'node-opened-conversation',
      type: 'decision',
      badge: 'DECISION 2 OF 2 • EVA OPENED THE CONVERSATION',
      badgeColor: 'emerald',
      headline: 'THE AGREED PLAN CHANGES',
      leadText: '“What exactly worries you?” Eva asked.',
      bodyParagraphs: [
        'Her mother folded her arms. “The journey. Who is responsible for you there? What if the plan changes?”',
        'Eva looked down. “My friend has cancelled.”',
        '“So you were going alone?” “Yes. I should have told you.”',
        'Her mother finally read the invitation. “The workshop looks genuine,” she said. “I should have checked before calling it a scam.”',
        'They arranged for an aunt to accompany Eva and agreed to verify any venue change before travelling.',
        'On Saturday morning, the organiser announced a new venue. The aunt could no longer accompany her.',
        'Their agreed plan has changed. What does Eva do?',
      ],
      choices: [
        {
          id: 'c2_c1',
          label: 'C1 • CONTACT MUM AND RENEGOTIATE',
          nextNodeId: 'node-ending-c1',
        },
        {
          id: 'c2_c2',
          label: 'C2 • GO ANYWAY: PERMISSION WAS ALREADY GIVEN',
          nextNodeId: 'node-ending-c2',
        },
        {
          id: 'c2_c3',
          label: 'C3 • DECLINE AND FIND ANOTHER ROUTE',
          nextNodeId: 'node-ending-c3',
        },
      ],
    },

    // PAGE 6: EVA'S ENDING A1
    'node-ending-a1': {
      id: 'node-ending-a1',
      type: 'consequence',
      badge: 'EVA’S ENDING • A1',
      badgeColor: 'red',
      headline: 'THE CALL SHE DID NOT WANT TO MAKE',
      leadText: '“Mum, I lied. I’m on my way to the workshop. They’ve changed the venue.”',
      bodyParagraphs: [
        'Her mother’s first response was anger. Her second was a question. “Where exactly are you?”',
        'Eva waited at a familiar shop while her mother arranged to meet her. They missed the opening session.',
        'The argument was not over. But Eva no longer had to manage the uncertainty alone.',
      ],
      highlightText: 'REFLECTION: Telling the truth reopened access to help. It did not erase the lie.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 7: EVA'S ENDING A2
    'node-ending-a2': {
      id: 'node-ending-a2',
      type: 'consequence',
      badge: 'EVA’S ENDING • A2',
      badgeColor: 'amber',
      headline: 'CHECKING TWICE',
      leadText: 'Eva stopped at a familiar place and contacted her teacher.',
      bodyParagraphs: [
        'The teacher helped verify the venue and contacted Eva’s mother about the changed arrangements.',
        'Her mother wanted Eva home. Eva wanted to argue that she had been right.',
        'Her teacher interrupted gently. “The workshop is real. That does not settle every part of the plan.”',
        'Eva returned home. They still needed to discuss why she had lied—and why her evidence had been dismissed.',
      ],
      highlightText: 'REFLECTION: Seeking reliable support helped with the immediate decision. The damaged trust still needed attention.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 8: EVA'S ENDING A3
    'node-ending-a3': {
      id: 'node-ending-a3',
      type: 'consequence',
      badge: 'EVA’S ENDING • A3',
      badgeColor: 'amber',
      headline: 'A REAL WORKSHOP, AN UNFINISHED ARGUMENT',
      leadText: 'The workshop took place. Eva learned something useful.',
      bodyParagraphs: [
        'Her mother spent the afternoon trying to establish where she was.',
        'When Eva returned, she held up her new digital illustration. “See? It wasn’t a scam.”',
        'Her mother looked at the picture. “I’m glad you learned something. Why did I have to discover where you were from someone else?”',
        'Eva’s evidence answered one question. It did not answer the other.',
      ],
      highlightText: 'REFLECTION: A successful afternoon did not make every decision leading to it sound.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 9: EVA'S ENDING B1
    'node-ending-b1': {
      id: 'node-ending-b1',
      type: 'consequence',
      badge: 'EVA’S ENDING • B1',
      badgeColor: 'emerald',
      headline: 'THE ANSWER BEHIND THE ANSWER',
      leadText: 'Eva told her mother how the conversation had felt.',
      bodyParagraphs: [
        'Her mother admitted she had not examined the information. “I was worried about the journey,” she said.',
        '“Then why did you say the workshop was a scam?”',
        'Her mother paused. “That was unfair.”',
        'Eva admitted her friend had cancelled. They had both left out something important.',
        'They agreed to discuss the next invitation with the full information on the table.',
      ],
      highlightText: 'REFLECTION: The useful conversation began when both explained what they had concealed.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 10: EVA'S ENDING B2
    'node-ending-b2': {
      id: 'node-ending-b2',
      type: 'consequence',
      badge: 'EVA’S ENDING • B2',
      badgeColor: 'emerald',
      headline: 'A BETTER PLAN, THE SAME QUESTION',
      leadText: 'Eva prepared a clear plan. Her mother read it this time and asked questions about transport and supervision.',
      bodyParagraphs: [
        'They found an arrangement both could accept.',
        'Before they finished, Eva asked: “What should I do next time you say no without looking?”',
        'Her mother had no immediate answer.',
        'The practical plan had improved. Their way of disagreeing still needed work.',
      ],
      highlightText: 'REFLECTION: Good preparation can help. A relationship also needs room to question the decision process.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 11: EVA'S ENDING B3
    'node-ending-b3': {
      id: 'node-ending-b3',
      type: 'consequence',
      badge: 'EVA’S ENDING • B3',
      badgeColor: 'zinc',
      headline: 'QUIET DOES NOT MEAN AGREEMENT',
      leadText: 'Eva stopped mentioning opportunities.',
      bodyParagraphs: [
        'Her mother noticed fewer arguments and assumed things were improving.',
        'Eva asked friends for advice about the next session.',
        'There was less noise at home. There was also less information passing between them.',
      ],
      highlightText: 'REFLECTION: The disagreement disappeared from view. It had not been resolved.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 12: EVA'S ENDING C1
    'node-ending-c1': {
      id: 'node-ending-c1',
      type: 'consequence',
      badge: 'EVA’S ENDING • C1',
      badgeColor: 'emerald',
      headline: 'PERMISSION TO THINK AGAIN',
      leadText: 'Eva contacted her mother. Together they checked the changed venue.',
      bodyParagraphs: [
        'They could not find suitable accompaniment in time. Eva missed this session.',
        'But her mother helped her contact the organiser about the next one.',
        'Eva was disappointed. She had also learned that telling her mother about a change did not automatically end the conversation.',
      ],
      highlightText: 'REFLECTION: A shared decision can still be disappointing. Trust includes reconsidering when circumstances change.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 13: EVA'S ENDING C2
    'node-ending-c2': {
      id: 'node-ending-c2',
      type: 'consequence',
      badge: 'EVA’S ENDING • C2',
      badgeColor: 'amber',
      headline: 'THE PLAN THAT EXPIRED',
      leadText: 'Eva attended and returned with something she was proud of.',
      bodyParagraphs: [
        'Then her mother discovered that the aunt had not gone.',
        '“But you gave permission,” Eva said.',
        '“For the arrangement we discussed.”',
        'Eva had treated the earlier answer as permanent, even though important conditions had changed.',
        'They now needed to decide what their agreements actually meant.',
      ],
      highlightText: 'REFLECTION: Agreement about one plan does not automatically cover a different plan.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 14: EVA'S ENDING C3
    'node-ending-c3': {
      id: 'node-ending-c3',
      type: 'consequence',
      badge: 'EVA’S ENDING • C3',
      badgeColor: 'emerald',
      headline: 'ANOTHER WAY FORWARD',
      leadText: 'Eva told her mother she would miss the session. Then she contacted the organiser.',
      bodyParagraphs: [
        'There was no online workshop, but there were introductory materials she could use and another session planned.',
        'Her mother sat beside her as she tried the first exercise.',
        'Neither had got everything they wanted that Saturday. They had kept the opportunity—and the conversation—alive.',
      ],
      highlightText: 'REFLECTION: Changing the route did not require abandoning the goal.',
      buttonText: 'CONTINUE TO REFLECTION →',
      nextNodeId: 'node-eva-story-completed',
    },

    // PAGE 15: EVA'S STORY COMPLETED
    'node-eva-story-completed': {
      id: 'node-eva-story-completed',
      type: 'decision',
      badge: 'EVA’S STORY COMPLETED',
      badgeColor: 'amber',
      headline: 'TWO PEOPLE. MORE THAN ONE KIND OF KNOWLEDGE.',
      leadText: 'Eva could check the workshop online. Her mother could raise questions about the journey and responsibility.',
      bodyParagraphs: [
        'Both could withhold information. Both could make assumptions.',
        'What does Eva owe her mother—and what does her mother owe Eva?',
        'Which needed the most attention? There is no correct answer. You may reflect privately or select a response on the next page.',
      ],
      choices: [
        {
          id: 'c_opt_poll',
          label: 'OPTIONAL REFLECTION POLL',
          nextNodeId: 'node-reflection-poll',
        },
        {
          id: 'c_see_mum',
          label: 'SEE MUM’S SIDE',
          nextNodeId: 'node-mother-perspective',
        },
        {
          id: 'c_try_another',
          label: 'TRY ANOTHER MOVE',
          nextNodeId: 'node-decision-1',
        },
        {
          id: 'c_explore_more',
          label: 'EXPLORE MORE STORIES',
          nextNodeId: 'node-wrapup',
        },
      ],
    },

    // PAGE 16: OPTIONAL PRIVATE POLL
    'node-reflection-poll': {
      id: 'node-reflection-poll',
      type: 'decision',
      badge: 'OPTIONAL PRIVATE POLL',
      badgeColor: 'amber',
      headline: 'WHICH NEEDED THE MOST ATTENTION?',
      leadText: 'Choose a response. This does not send or count votes; it is a private reflection prompt.',
      bodyParagraphs: [
        'Listening to each other. Sharing the full information. Checking the changed arrangements. Or more than one of these?',
        'There is no correct answer.',
      ],
      choices: [
        {
          id: 'poll_1',
          label: 'LISTENING TO EACH OTHER',
          nextNodeId: 'node-reflection-counts',
        },
        {
          id: 'poll_2',
          label: 'SHARING THE FULL INFORMATION',
          nextNodeId: 'node-reflection-counts',
        },
        {
          id: 'poll_3',
          label: 'CHECKING THE CHANGED ARRANGEMENTS',
          nextNodeId: 'node-reflection-counts',
        },
        {
          id: 'poll_4',
          label: 'MORE THAN ONE OF THESE',
          nextNodeId: 'node-reflection-counts',
        },
      ],
    },

    // PAGE 17: YOUR REFLECTION COUNTS
    'node-reflection-counts': {
      id: 'node-reflection-counts',
      type: 'decision',
      badge: 'REFLECTION',
      badgeColor: 'amber',
      headline: 'YOUR REFLECTION COUNTS',
      leadText: 'Your choice is yours to consider; no answer has been scored, transmitted or stored.',
      bodyParagraphs: [
        'What might change if Eva and her mother asked what the other knew—and what neither had yet explained?',
      ],
      choices: [
        {
          id: 'c_refl_mum',
          label: 'SEE MUM’S SIDE',
          nextNodeId: 'node-mother-perspective',
        },
        {
          id: 'c_refl_retry',
          label: 'TRY ANOTHER MOVE',
          nextNodeId: 'node-decision-1',
        },
        {
          id: 'c_refl_explore',
          label: 'EXPLORE MORE STORIES',
          nextNodeId: 'node-wrapup',
        },
      ],
    },

    // PAGE 18: MOTHER'S PERSPECTIVE
    'node-mother-perspective': {
      id: 'node-mother-perspective',
      type: 'decision',
      badge: 'MOTHER’S PERSPECTIVE • ONE DECISION',
      badgeColor: 'red',
      headline: 'NOW YOU ARE EVA’S MOTHER.',
      leadText: 'This is a replay of the original disagreement, not a continuation of Eva’s ending.',
      bodyParagraphs: [
        'Your daughter shows you an invitation on her phone. You recently heard about someone losing money through a convincing online invitation.',
        'You are also unsure how Eva will travel, who will supervise her and what happens if arrangements change.',
        'You have not read the invitation. Eva says her teacher checked it.',
        'When you hesitate, she says: “Mum, you haven’t even looked.”',
        'You feel challenged.',
      ],
      highlightText: 'What do you say?',
      choices: [
        {
          id: 'm1_no_explain',
          label: 'M1 • NO. I DON’T HAVE TO EXPLAIN MYSELF.',
          nextNodeId: 'node-mother-ending-m1',
        },
        {
          id: 'm2_teacher_checked',
          label: 'M2 • YOUR TEACHER CHECKED IT? THEN GO.',
          nextNodeId: 'node-mother-ending-m2',
        },
        {
          id: 'm3_check_whole_plan',
          label: 'M3 • LET’S CHECK IT. EXPLAIN THE WHOLE PLAN.',
          nextNodeId: 'node-mother-ending-m3',
        },
      ],
    },

    // PAGE 19: MOTHER'S ENDING M1
    'node-mother-ending-m1': {
      id: 'node-mother-ending-m1',
      type: 'decision',
      badge: 'MOTHER’S ENDING • M1',
      badgeColor: 'zinc',
      headline: 'AN ANSWER WITHOUT A CONVERSATION',
      leadText: 'Eva stops arguing.',
      bodyParagraphs: [
        'You still do not know that her friend has cancelled.',
        'Your decision is clear. Your understanding of the situation is incomplete.',
      ],
      highlightText: 'REFLECTION: How will you know whether silence means agreement, disappointment or concealment?',
      choices: [
        {
          id: 'm1_replay_mum',
          label: 'REPLAY MUM’S SIDE',
          nextNodeId: 'node-mother-perspective',
        },
        {
          id: 'm1_replay_eva',
          label: 'REPLAY EVA’S STORY',
          nextNodeId: 'node-decision-1',
        },
        {
          id: 'm1_explore',
          label: 'EXPLORE MORE STORIES',
          nextNodeId: 'node-wrapup',
        },
      ],
    },

    // PAGE 20: MOTHER'S ENDING M2
    'node-mother-ending-m2': {
      id: 'node-mother-ending-m2',
      type: 'decision',
      badge: 'MOTHER’S ENDING • M2',
      badgeColor: 'amber',
      headline: 'ONE QUESTION ANSWERED',
      leadText: 'You accept the teacher’s confirmation and say yes.',
      bodyParagraphs: [
        'Later, you discover that Eva intended to travel alone.',
        'You checked whether the workshop was genuine. You did not discuss the rest of the arrangement.',
      ],
      highlightText: 'REFLECTION: What else needed checking before either of you could make an informed decision?',
      choices: [
        {
          id: 'm2_replay_mum',
          label: 'REPLAY MUM’S SIDE',
          nextNodeId: 'node-mother-perspective',
        },
        {
          id: 'm2_replay_eva',
          label: 'REPLAY EVA’S STORY',
          nextNodeId: 'node-decision-1',
        },
        {
          id: 'm2_explore',
          label: 'EXPLORE MORE STORIES',
          nextNodeId: 'node-wrapup',
        },
      ],
    },

    // PAGE 21: MOTHER'S ENDING M3
    'node-mother-ending-m3': {
      id: 'node-mother-ending-m3',
      type: 'decision',
      badge: 'MOTHER’S ENDING • M3',
      badgeColor: 'emerald',
      headline: 'GUIDANCE THAT MAKES ROOM',
      leadText: 'You read the invitation. “The workshop appears genuine. I was too quick to dismiss it.”',
      bodyParagraphs: [
        'Then you ask about transport. Eva tells you her friend has cancelled.',
        'You explain your concerns and examine alternatives together.',
        'You have not promised to say yes. You have made it possible to discuss the decision.',
      ],
      highlightText: 'REFLECTION: Could explaining your reasoning make your guidance more useful?',
      choices: [
        {
          id: 'm3_replay_mum',
          label: 'REPLAY MUM’S SIDE',
          nextNodeId: 'node-mother-perspective',
        },
        {
          id: 'm3_replay_eva',
          label: 'REPLAY EVA’S STORY',
          nextNodeId: 'node-decision-1',
        },
        {
          id: 'm3_explore',
          label: 'EXPLORE MORE STORIES',
          nextNodeId: 'node-wrapup',
        },
      ],
    },

    // PAGE 22: YOUR MOVE CONTINUES
    'node-wrapup': {
      id: 'node-wrapup',
      type: 'climax',
      badge: 'UNCLE RWAMITI • YOUR MOVE',
      badgeColor: 'amber',
      headline: 'ANOTHER FAMILY. ANOTHER UNCOMFORTABLE CHOICE.',
      leadText: 'YOUR MOVE CONTINUES',
      bodyParagraphs: [
        'Explore more free Uncle Rwamiti: Your Move stories.',
        'Get more from Petero’s Paths',
        'Uncle Rwamiti — the uncle your parents should probably never have introduced you to.',
      ],
      buttonText: 'REPLAY EVA’S STORY',
      nextNodeId: 'node-decision-1',
    },
  },
};
