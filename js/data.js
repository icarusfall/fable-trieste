/* ============================================================
   The Typewriter of Trieste — story data
   Languages, items, quest stages, and every line of dialogue.

   Dialogue node shape:
   {
     sp:   speaker name (null = narration)
     port: portrait key
     lang: 'en'|'it'|'tri'|'sl'|'sr'|'de'|'el'  (null = narration)
     text: the line (already "translated" if the player understands)
     note: small red footnote (used for untranslated languages)
     next: id of next node (shows "continue")
     choices: [{ t, lang, next, if(), do() }]
     do():  side effect when node is shown
     end:  true → close dialogue after this node
   }
   ============================================================ */

/* ---------- languages ---------- */
const LANGS = {
  en:  { label: 'English',                          cls: 'lang-known'   },
  it:  { label: 'Italian — you manage',             cls: 'lang-partial' },
  tri: { label: 'Triestino — you follow it',        cls: 'lang-partial' },
  sl:  { label: 'Slovene — near your Macedonian',   cls: 'lang-known'   },
  sr:  { label: 'Serbian — yours',                  cls: 'lang-known'   },
  de:  { label: 'German — unknown',                 cls: 'lang-unknown' },
  el:  { label: 'Greek — unknown',                  cls: 'lang-unknown' },
};
const UNKNOWN_LANGS = new Set(['de', 'el']);

/* ---------- items ---------- */
const ITEMS = {
  joyceticket: { name: "Joyce's 'pawn ticket'",
    desc: 'Folded and presented with enormous ceremony. You have not examined it closely. Perhaps you should have.' },
  bettingslip: { name: 'A betting slip (Erin’s Pride, 3rd race)',
    desc: 'The horse lost. The sonnet on the back rhymes “Trieste” with “celeste”, which is cheating in two languages.' },
  ticket1014: { name: 'Pawn ticket No. 1014',
    desc: 'One typewriter, much abused. Property of the Monte di Pietà until four crowns say otherwise.' },
  typewriter: { name: "Joyce's typewriter",
    desc: 'Heavier than it looks, like its owner’s correspondence.' },
  sardine: { name: 'A sardine (gift)',
    desc: 'Fresh from the Adriatic, presented in friendship. The friendship is doing better than the sardine.' },
  flowers: { name: 'Carnations in newspaper',
    desc: 'Red, slightly seditious. The newspaper is last Tuesday’s Piccolo.' },
  rosemary: { name: 'A sprig of rosemary',
    desc: 'For remembrance, says Marija. In this city, practically a controlled substance.' },
  sonnet: { name: 'A signed sonnet',
    desc: '“One day this will be worth more than the Monte di Pietà and everything in it.” — the author, who still owes you wages.' },
  homer: { name: 'A plaster head of Homer (chipped)',
    desc: 'He has seen worse. He saw Troy.' },
};

/* ---------- factions ---------- */
const REPS = {
  lit:  'Literary Circle',
  dock: 'Riva & Docks',
  auth: 'The Authorities',
};

/* ---------- quest stages (journal) ---------- */
const QUEST_STAGES = [
  'Find the Caffè San Marco, off the big piazza, and ask for the English teacher. The note is signed only “J.”',
  'Redeem the typewriter from the Monte di Pietà — the municipal pawnshop, in the north-west of the quarter. Joyce has given you “the ticket”.',
  'The “ticket” was a betting slip with a sonnet on the back. The real one is lost between the café and the canal. Ask around — the flower seller by the Ponterosso market sees everything.',
  'A docker called Anton picked up the ticket by the fish stalls on the riva. He wants a small favour first.',
  'You have ticket No. 1014 — and you need four crowns. Joyce’s advice: “Apply to Schmitz at the Veneziani paint works. Say it is for Literature.”',
  'Redeem the typewriter at the Monte di Pietà: ticket No. 1014 plus four crowns.',
  'Carry the typewriter back to Joyce at the Caffè San Marco. Try not to drop it in the canal.',
  'Scene complete. Trieste continues. So, unfortunately, does Joyce.',
];

/* ---------- intro cards ---------- */
const INTRO_CARDS = [
  `TRIESTE, 1909.<br><br>The great port of an empire that does not yet know it is dying. Steamers from Salonica, paperwork from Vienna, and seven languages arguing over the price of fish.`,
  `You came up from Macedonia with three languages, one coat, and a talent for noticing things. The politics back home were conducted with dynamite; you prefer cities where the explosions are merely financial.`,
  `On the boat, a man who owed you a favour paid you in advice and one scrap of paper.<span class="note">To the bearer — I require a person of discretion, energy, and no better options. Ask for the English teacher at the Caffè San Marco. Payment will be discussed, at length, and in the abstract.<br><br>— J.</span>`,
];

/* ============================================================
   DIALOGUES
   ============================================================ */
const DIALOGUES = {

  /* ================= JOYCE — first meeting ================= */

  joyce_intro: {
    sp: null, port: 'narrator',
    text: 'At the rear table, behind a fortification of saucers, sits a thin young man in somebody else’s waistcoat, writing on the back of what appears to be his own bill.',
    next: 'ji_hello',
  },
  ji_hello: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“You exist after all. Sit — no, not that chair; that chair is pledged to the house against an outstanding matter. Stand. Like a caryatid. It suits you.”',
    choices: [
      { t: '“I got your note. You need someone for errands?”', next: 'ji_name' },
      { t: '(Say nothing. Observe him.)', next: 'ji_observe' },
      { t: '“Your bill seems to have its own table.”', next: 'ji_bill' },
    ],
  },
  ji_observe: {
    sp: null, port: 'narrator',
    text: 'Ink on three fingers. A waistcoat tailored for a stouter optimist. The saucers before him are stacked seven high — the café’s method of accountancy.',
    next: 'ji_observe2',
  },
  ji_observe2: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“You observe. Good. The city is a text, and most of its residents are illiterate.”',
    next: 'ji_name',
  },
  ji_bill: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“The bill and I have an understanding: it does not read me, and I do not read it.”',
    next: 'ji_name',
  },
  ji_name: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Joyce. James. Of Dublin — teacher of English by profession, tenor by temperament, and by vocation the finest living writer of English prose. You will have heard of me.”',
    choices: [
      { t: '“No.”', next: 'ji_no' },
      { t: '“Naturally.” (lie)', next: 'ji_lie' },
      { t: '“I’ve heard of your debts.”', next: 'ji_debt' },
    ],
  },
  ji_no: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Splendid. Fame is a species of misunderstanding. I prefer to be understood by nobody and read by posterity.”',
    next: 'ji_job',
  },
  ji_lie: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“You lie promptly and with a straight face. Consider yourself hired twice.”',
    next: 'ji_job',
  },
  ji_debt: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“My debts are famous because they circulate more widely than my work. That is a problem of publishing, not of character.”',
    next: 'ji_job',
  },
  ji_job: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“To business. My typewriter — my instrument, my Aeolian harp — is at present residing at the Monte di Pietà.”',
    choices: [
      { t: '“The Monte di what?”', next: 'ji_monte' },
      { t: '“You pawned it.”', next: 'ji_pawn' },
    ],
  },
  ji_monte: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“The municipal pawnshop — the grey building in the north-west of the quarter, where objects of value rest between engagements. Trieste’s finest lending library. Every good household in this city is partly on its shelves.”',
    next: 'ji_why',
  },
  ji_pawn: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“‘Pawned’ is a grocer’s word. The machine and the Monte have entered into a temporary arrangement between gentlemen, of whom I am the third.”',
    next: 'ji_why',
  },
  ji_why: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“My publisher in Dublin — a coward and a vandal, but the only one still writing to me — demands the pages of my book retyped by Friday. I cannot type without a typewriter. I have tried. The results were longhand.”',
    next: 'ji_ticket',
  },
  ji_ticket: {
    sp: null, port: 'narrator',
    text: 'He searches four pockets, evicts a moth from the fifth, and at last presents a folded paper with enormous ceremony.',
    next: 'ji_ticket2',
  },
  ji_ticket2: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“The ticket. Guard it as you would a relic. The clerk there is a Habsburg of the soul — present this, and he is powerless.”',
    next: 'ji_fee',
  },
  ji_fee: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“You are about to ask about money; everyone does, it is the local catechism. Should funds be wanted — funds are always wanted — apply to my friend Schmitz at the Veneziani paint works, on the riva. Say it is for Literature. He will sigh in Italian and pay in crowns.”',
    choices: [
      { t: '“And what do I get out of this?”', next: 'ji_pay' },
      { t: '(Pocket the ticket and go.)', next: 'ji_done' },
    ],
  },
  ji_pay: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Payment! A handsome figure is at this very moment being finalised by my brother Stanislaus, who manages my treasury — insofar as a desert may be said to be managed. There will also be glory.”',
    choices: [
      { t: '“Glory doesn’t buy bread.”', next: 'ji_pay2' },
      { t: '“The figure had better be handsome.”', next: 'ji_done' },
    ],
  },
  ji_pay2: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Observe.” — he turns out a pocket — “lint, a tram ticket, a button of sentimental value. I am offering you everything I have, which is a future. Most employers offer only a present.”',
    next: 'ji_done',
  },
  ji_done: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Fly, my Macedonian Mercury. The café will hold my table. The table, in a sense, is holding me.”',
    do() { flag('metJoyce', true); addItem('joyceticket'); setStage(1); },
    end: true,
  },

  /* ============ JOYCE — the ticket was a betting slip ============ */

  j_lost1: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Rejected it? The man rejected — show me that. ... Ah. Yes. Hm. This is a different document. The sonnet is good, mind.”',
    choices: [
      { t: '“Where is the REAL ticket?”', next: 'j_lost2' },
      { t: '“You bet four crowns on a horse called Erin’s Pride.”', next: 'j_horse' },
    ],
  },
  j_horse: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“It was a patriotic act, and like most patriotic acts it finished last. The ticket. Yes.”',
    next: 'j_lost2',
  },
  j_lost2: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Tuesday I composed aloud along the canal. The wind participated. Papers passed between me and the city on terms I no longer recall.”',
    next: 'j_lost3',
  },
  j_lost3: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Ask the street. The flower woman by the Ponterosso market sees everything that happens in this city, and the police see everything else — but in German, which hardly counts. Go. Literature is waiting, and it is not patient.”',
    do() { flag('joyceBriefed', true); },
    end: true,
  },

  /* ============ JOYCE — waiting quips ============ */

  j_wait1: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Still here? The Monte is to the north-west. Follow the smell of thrift.”',
    end: true,
  },
  j_wait2: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“No machine yet? I have begun composing in the air. The results are excellent but difficult to post.”',
    end: true,
  },
  j_wait3: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Bring me my harp and I will make this city eternal. Bring me also a small coffee — tell them it is for the eternity account.”',
    end: true,
  },

  /* ============ JOYCE — finale ============ */

  j_fin1: {
    sp: null, port: 'narrator',
    text: 'Joyce rises so fast the saucers ring. He takes the typewriter from you the way other men take a child from a burning house.',
    do() { removeItem('typewriter'); },
    next: 'j_fin2',
  },
  j_fin2: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“My harp! My Aeolus! — you have let the clerk breathe on it — no matter, that polishes out —”',
    next: 'j_fin3',
  },
  j_fin3: {
    sp: null, port: 'narrator',
    text: 'He feeds it a page, types a single line, tears it out, holds it to the light, and reads it the way the clerk read the ticket.',
    next: 'j_fin4',
  },
  j_fin4: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“No. Not yet. But nearer. — Do you know, in this whole city of three hundred thousand souls, you may be the only one today who has done exactly what he said he would do?”',
    choices: [
      { t: '“About my payment.”', next: 'j_payfin' },
      { t: '“It was nothing.”', next: 'j_humble' },
      { t: '“Marija sends rosemary. For memory.”', next: 'j_rosemary',
        if: () => hasItem('rosemary') },
    ],
  },
  j_rosemary: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Rosemary. For remembrance. Nora will accuse me of sentiment, and I shall plead guilty with costs.”',
    do() { removeItem('rosemary'); addRep('lit', 1); },
    next: 'j_payfin',
  },
  j_humble: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Nothing! It was an epic in miniature: a ticket lost, a city interrogated, a bureaucrat defeated. I shall put you in a story. You will outlive every paymaster in Trieste — which is more, I find, than wages do.”',
    next: 'j_payfin2',
  },
  j_payfin: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Yes — your fee.”',
    next: 'j_payfin2',
  },
  j_payfin2: {
    sp: null, port: 'narrator',
    text: 'He retrieves the betting slip, signs the sonnet on the back with a flourish that uses most of the remaining ink, and presents it as though conferring a knighthood.',
    next: 'j_payfin3',
  },
  j_payfin3: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“One day that paper will be worth more than the Monte di Pietà and everything in it. You may additionally have a percentage of the royalties of a book which at present exists chiefly in my head, where the rents are low.”',
    do() { removeItem('bettingslip'); addItem('sonnet'); },
    next: 'j_fin6',
  },
  j_fin6: {
    sp: null, port: 'narrator',
    text: 'The waiter materialises with a note on a silver tray. The silver tray is for irony. Joyce reads it, and his face attempts respectability, briefly.',
    next: 'j_fin7',
  },
  j_fin7: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Hm. The police have written to the school about ‘an Englishman teaching without authorisation’. I am Irish, which makes the charge both libel and geography. ... We may require your discretion again. Very soon. Don’t leave the city — nobody leaves this city. It follows.”',
    do() { addRep('lit', 2); setStage(7); flag('finale', true); },
    end: true,
  },

  j_post: {
    sp: 'James Joyce', port: 'joyce', lang: 'it',
    text: '“Discretion, remember. And availability. Genius keeps irregular hours, and so, therefore, will you.”',
    end: true,
  },

  /* ================= WAITER ================= */

  w_pre: {
    sp: 'The Waiter', port: 'waiter', lang: 'tri',
    text: '“If you are here about the gentleman’s bill, the queue forms outside, past the gas works.”',
    choices: [
      { t: '“Which gentleman?”', next: 'w_pre2' },
      { t: '“I’m looking for the English teacher.”', next: 'w_pre2' },
    ],
  },
  w_pre2: {
    sp: 'The Waiter', port: 'waiter', lang: 'tri',
    text: '“The Irish one. Rear table, conducting an orchestra only he can hear. Mind the saucers — we count them like sins.”',
    end: true,
  },
  w_mid: {
    sp: 'The Waiter', port: 'waiter', lang: 'tri',
    text: '“Seven saucers. An espresso every ninety minutes — that is how a masterpiece is financed, apparently. On credit, like the Empire.”',
    end: true,
  },
  w_done: {
    sp: 'The Waiter', port: 'waiter', lang: 'tri',
    text: '“Did he pay the bill? No. He promised to immortalise it. We are framing it instead.”',
    end: true,
  },

  /* ================= CLERK, Monte di Pietà ================= */

  c_hello_de: {
    sp: 'The Clerk', port: 'clerk', lang: 'de',
    text: '“Guten Tag. Pfandschein und Gebühr, bitte. Ohne Schein keine Auslöse. Paragraph elf.”',
    note: 'You do not speak German. The word “Paragraph”, however, travels badly concealed.',
    next: 'c_hello2',
  },
  c_hello2: {
    sp: null, port: 'narrator',
    text: 'He watches your face do nothing. He removes his pince-nez, polishes it, and descends — visibly, like a man taking a staircase — into Italian.',
    next: 'c_hello3',
  },
  c_hello3: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“Ticket and fee. This is the Monte di Pietà, not a conversation.”',
    choices: [
      { t: '(Present Joyce’s ticket.)', next: 'c_fake1', if: () => hasItem('joyceticket') },
      { t: '“Just looking.”', next: 'c_idle0' },
    ],
  },
  c_idle0: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“The Monte does not deal in curiosity. Curiosity is held by the police, two streets east, also against a fee.”',
    end: true,
  },
  c_lost: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“No ticket, no machine. Paragraph eleven. The street keeps what it finds in this city — ask the street. It is open longer hours than we are.”',
    end: true,
  },
  c_fake1: {
    sp: null, port: 'narrator',
    text: 'He unfolds the paper with two fingers, the way one handles evidence.',
    next: 'c_fake2',
  },
  c_fake2: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“This is a betting slip. Ippodromo di Montebello, third race, four crowns on a horse named —” he holds it further away — “‘Erin’s Pride’. The horse lost.”',
    next: 'c_fake3',
  },
  c_fake3: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“On the reverse: fourteen lines of verse rhyming ‘Trieste’ with ‘celeste’. The Monte di Pietà does not redeem sonnets.”',
    choices: [
      { t: '“There must be a typewriter here, pledged by a Mr Joyce.”', next: 'c_fake4' },
      { t: '“What would it take to release the machine anyway?”', next: 'c_fake4' },
    ],
  },
  c_fake4: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“Pledge No. 1014: one typewriter, much abused. Same gentleman, separately: one overcoat, one pair of curtains, one plaster head of Homer. The machine may be redeemed against the original ticket plus four crowns’ interest. The original ticket. Paragraph eleven is not a mood; it is a paragraph.”',
    do() { transformItem('joyceticket', 'bettingslip'); setStage(2); },
    end: true,
  },
  c_needmoney: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“Ticket No. 1014. Genuine — a pleasant surprise. And four crowns. You are showing me…” he counts without touching, “…fewer. The Monte di Pietà admires optimism. It does not accept it as currency.”',
    do() { setStage(4); },
    end: true,
  },
  c_r1: {
    sp: null, port: 'narrator',
    text: 'You lay ticket No. 1014 and four crowns on the counter. The clerk inspects the ticket against the light, then you, then the ticket again, hoping one of you will confess.',
    next: 'c_r2',
  },
  c_r2: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“Genuine. Astonishing. One moment.”',
    next: 'c_r3',
  },
  c_r3: {
    sp: null, port: 'narrator',
    text: 'Stamps. Form 7, the receipt for the interest. Form 7-a, the receipt for the receipt. A third stamp, possibly ceremonial. Then, from the back room, carried like a reluctant christening: the typewriter.',
    next: 'c_r4',
  },
  c_r4: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“One typewriter, somewhat wounded. The ribbon is his own affair. The Monte di Pietà thanks you — and confidently awaits its return.”',
    do() {
      addMoney(-4); removeItem('ticket1014'); addItem('typewriter');
      setStage(6);
    },
    end: true,
  },
  c_after: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“Was there something else? We have a plaster head of Homer. Slightly chipped. Two crowns, and the dignity of antiquity is yours.”',
    choices: [
      { t: 'Buy the head of Homer. (2 K)', next: 'c_homer',
        if: () => state.money >= 2 && !hasItem('homer') },
      { t: '“Another time.”', next: 'c_bye' },
    ],
  },
  c_homer: {
    sp: null, port: 'narrator',
    text: 'He wraps Homer in yesterday’s Piccolo. “A good home at last,” he says — the only feeling you will ever watch him spend.',
    do() { addMoney(-2); addItem('homer'); },
    end: true,
  },
  c_bye: {
    sp: 'The Clerk', port: 'clerk', lang: 'it',
    text: '“Then good day. The Monte closes at six, and so, in every important respect, do I.”',
    end: true,
  },

  /* ================= MARIJA, flower seller ================= */

  m_pre1: {
    sp: 'Marija', port: 'marija', lang: 'sl',
    text: '“Rože! Carnations, rosemary, young one —”',
    next: 'm_pre2',
  },
  m_pre2: {
    sp: null, port: 'narrator',
    text: 'Slovene. The vowels sit differently, but it is close enough to your Macedonian that the meaning simply walks across.',
    next: 'm_pre3',
  },
  m_pre3: {
    sp: 'Marija', port: 'marija', lang: 'sl',
    text: '“You understand me! In this city the Italians hear nothing and the Germans write down what they didn’t hear. Buy a flower, or just stand there looking hungry — both are free, but one smells better.”',
    do() { flag('metMarija', true); },
    choices: [
      { t: 'Buy a bunch of carnations. (1 K)', next: 'm_buy',
        if: () => state.money >= 1 && !flag('boughtFlowers') },
      { t: '“Another time, mother.”', next: null },
    ],
  },
  m_ticket1: {
    sp: 'Marija', port: 'marija', lang: 'sl',
    text: '“Lost papers? Tuesday. The thin Irishman walked the canal talking to the seagulls — composing, he calls it. The gulls were not persuaded. Papers went everywhere.”',
    next: 'm_ticket2',
  },
  m_ticket2: {
    sp: 'Marija', port: 'marija', lang: 'sl',
    text: '“Anton picked one up by the fish stalls — the big docker, beard like a thundercloud, soft as fresh bread inside. He kept it; he liked the poem on the back, the fool. You’ll find him on the riva, among the crates.”',
    do() { flag('metMarija', true); flag('toldAnton', true); setStage(3); },
    choices: [
      { t: 'Buy a bunch of carnations. (1 K)', next: 'm_buy',
        if: () => state.money >= 1 && !flag('boughtFlowers') },
      { t: '“Thank you, mother.”', next: null },
    ],
  },
  m_buy: {
    sp: null, port: 'narrator',
    text: 'She wraps the carnations in newspaper and tucks in a sprig of rosemary, refusing all argument. “Rosemary, for memory. You will need it — this city is built out of things people are trying to forget.”',
    do() { addMoney(-1); addItem('flowers'); addItem('rosemary'); flag('boughtFlowers', true); },
    end: true,
  },
  m_after: {
    sp: 'Marija', port: 'marija', lang: 'sl',
    text: '“Anton found you? Good. Tell the Irishman: talk to people, not to gulls. Gulls repeat everything.”',
    choices: [
      { t: 'Buy a bunch of carnations. (1 K)', next: 'm_buy',
        if: () => state.money >= 1 && !flag('boughtFlowers') },
      { t: '“I’ll tell him.”', next: null },
    ],
  },

  /* ================= THE WACHMANN ================= */

  p_hello: {
    sp: 'The Wachmann', port: 'polizist', lang: 'de',
    text: '“Halt! Ausweis. Aufenthaltsbewilligung. Arbeitserlaubnis.”',
    note: 'He produces each word like a separate arrest. You understand none of them, and all of them.',
    choices: [
      { t: '“Dobar den?” (try your Macedonian)', next: 'p_slav' },
      { t: '(Hand over your residence paper and smile broadly.)', next: 'p_paper' },
      { t: '(Point urgently at the sea. Look concerned. Leave while he checks.)', next: 'p_sea' },
    ],
  },
  p_slav: {
    sp: 'The Wachmann', port: 'polizist', lang: 'de',
    text: '“Slawisch. Natürlich. Alles hier ist slawisch, italienisch, griechisch — niemand ist österreichisch außer mir und dem Kaiser.”',
    note: 'You catch only “Kaiser”. He appears to feel this proves something.',
    next: 'p_paper',
  },
  p_paper: {
    sp: null, port: 'narrator',
    text: 'He examines your residence paper at arm’s length, rotates it — the paper, not himself — stamps it out of habit, and returns it with a click of the heels. You appear to be, in some small way, more legal than before.',
    do() { flag('metPolizist', true); addRep('auth', 1); },
    end: true,
  },
  p_sea: {
    sp: null, port: 'narrator',
    text: 'He turns to scan the horizon for the emergency you invented. By the time he turns back, you are an honest distance away.',
    do() { flag('metPolizist', true); },
    end: true,
  },
  p_again: {
    sp: 'The Wachmann', port: 'polizist', lang: 'de',
    text: '“Sie schon wieder.”',
    note: 'Even you understand that one.',
    end: true,
  },

  /* ================= ANTON, docker ================= */

  a_pre: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“You want something. Everyone on this riva wants something — usually it’s my crate. The crate stays.”',
    end: true,
  },
  a1: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“The paper? Sì, I have it. The wind paid me and I kept the wages.”',
    next: 'a2',
  },
  a2: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“There’s a poem on the back. It says the sea is the colour of wine. I have drunk wine the colour of this sea, so — the man knows his business.”',
    choices: [
      { t: '“It’s a pawn ticket. A writer needs it back.”', next: 'a4' },
      { t: '“Name your price.”', next: 'a3b' },
    ],
  },
  a3b: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“Price. Listen to him — a week in Trieste and already he talks like the Borsa. No. A trade.”',
    next: 'a4',
  },
  a4: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“Three weeks I carry a letter from my cousin in Beograd. The priest reads letters, but the priest reports to God, and God gossips with my mother. You — you have Slav in your mouth. Read it to me.”',
    choices: [
      { t: '(Take the letter and read.)', next: 'a5' },
    ],
  },
  a5: {
    sp: null, port: 'narrator',
    text: 'The hand is loose and loud, like a man writing while arguing. It is Serbian; it might as well be your own. “Dragi Anton —”',
    next: 'a6',
  },
  a6: {
    sp: null, port: 'narrator', lang: 'sr',
    text: '“Dear Anton. The goat died — the good one. Mother wore black for it longer than she did for grandfather. Send forty dinars for a new goat. Also: when do you marry? A man your size, alone, is a waste of architecture. — Your Miloš.”',
    choices: [
      { t: '(Translate it honestly, word for word.)', next: 'a_honest' },
      { t: '(Soften it. Leave out the forty dinars.)', next: 'a_soft' },
      { t: '(Invent: the goat thrives, and nobody wants money.)', next: 'a_invent' },
    ],
  },
  a_honest: {
    sp: null, port: 'narrator',
    text: 'You give it to him straight: the goat, the mourning, the forty dinars, the architecture. Anton laughs like a cargo door.',
    next: 'a_honest2',
  },
  a_honest2: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“Forty dinars! He thinks it rains silver in Trieste. It rains — but bills. And ‘a waste of architecture’ — that is my mother’s sentence; he only carried it. Good. A letter should sound like the family.”',
    do() { addRep('dock', 2); },
    next: 'a9',
  },
  a_soft: {
    sp: null, port: 'narrator',
    text: 'You give him the goat and the mourning and the architecture, and let the forty dinars fall quietly overboard. Anton squints at you for a long moment.',
    next: 'a_soft2',
  },
  a_soft2: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“You stopped before the part where he asks for money. They always ask for money. You have a kind voice for skipping — keep it for the police, it’s wasted on me.”',
    do() { addRep('dock', 1); },
    next: 'a9',
  },
  a_invent: {
    sp: null, port: 'narrator',
    text: 'You announce that the goat thrives, the family wants nothing, and all of Beograd is proud of him. Anton beams. Then the beam goes out, one lamp at a time.',
    next: 'a_invent2',
  },
  a_invent2: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“The goat thrives. That goat was dying when I left in 1902. Read it straight, friend. The sea forgives lies; family doesn’t.”',
    next: 'a_invent3',
  },
  a_invent3: {
    sp: null, port: 'narrator',
    text: 'You read it again, honestly this time: the goat, the mourning, the forty dinars, the architecture. He nods along like a man taking his medicine, almost pleased by the taste.',
    do() { addRep('dock', 1); },
    next: 'a9',
  },
  a9: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“Here — your paper. Number 1014. Tell your writer: next poem, put a docker in it. We carry this city on our backs; the least it can do is mention us.”',
    do() {
      addItem('ticket1014'); flag('antonDone', true);
      setStage(state.money >= 4 ? 5 : 4);
    },
    end: true,
  },
  a_after: {
    sp: 'Anton', port: 'anton', lang: 'tri',
    text: '“The machine is free? Good. Remember: a docker. In the poem. I’ll know if he doesn’t.”',
    end: true,
  },

  /* ================= SVEVO / SCHMITZ ================= */

  s_cold: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“You’re not here about anti-fouling paint. People here about paint look happier. Come back when you have a story — everyone in Trieste has one eventually. It’s in the water.”',
    end: true,
  },
  s1: {
    sp: null, port: 'narrator',
    text: 'Among ledgers and paint tins sits a mild man with grey at the temples and a cigarette he is visibly pretending is his last.',
    next: 's2',
  },
  s2: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“You’re not here about paint. ... Ah. You have the look. The particular look of a person who has recently conversed with Mr James Joyce.”',
    choices: [
      { t: '“He said to tell you it’s for Literature.”', next: 's3' },
      { t: '“He needs four crowns. For the Monte di Pietà.”', next: 's3b' },
    ],
  },
  s3b: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“Four exactly? He’s getting modest. That worries me more than the sums ever did.”',
    next: 's3',
  },
  s3: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“‘For Literature.’ Once it was the rent — for Literature. Once a dentist — Literature again, by way of the jaw. Last December it was a cinematograph in Dublin. Dublin now has moving pictures, and Jim still has no moving money.”',
    next: 's4',
  },
  s4: {
    sp: null, port: 'narrator',
    text: 'He opens a tin marked CHIODI — nails — and counts out five crowns, in the unhurried way of a man performing a ritual he has long stopped arguing with.',
    next: 's5',
  },
  s5: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“Four for the Monte. One for you — you have the face of a man who last ate on Tuesday. Don’t mention the fifth crown to Jim, or he will regard it as a precedent and found a religion on it.”',
    do() { addMoney(5); flag('svevoGave', true); addRep('lit', 1);
           if (hasItem('ticket1014')) setStage(5); },
    choices: [
      { t: '“Why do you keep paying for him?”', next: 's7' },
      { t: '“Thank you, Signor Schmitz.”', next: 's8' },
    ],
  },
  s7: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“He read me a chapter once, at the table by the window. I didn’t sleep afterwards — partly the prose, partly he stayed till four. When a man writes like that, you keep him alive. It is cheaper than a monument, and you get conversation.”',
    next: 's8',
  },
  s8: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“When the machine is back, tell him — tell him Schmitz is still writing too. He will pretend not to hear. Tell him anyway.”',
    end: true,
  },
  s_after: {
    sp: 'Ettore Schmitz', port: 'svevo', lang: 'it',
    text: '“Did the Monte surrender? Good. The machine will outlast us all — it eats less than its owner and complains in cleaner sentences.”',
    end: true,
  },

  /* ================= YIORGOS, fisherman ================= */

  y1: {
    sp: 'Yiorgos', port: 'yiorgos', lang: 'el',
    text: '“Καλημέρα! Έλα, έλα! Φρέσκες σαρδέλες, μισή ώρα από τη θάλασσα!”',
    note: 'Greek. You understand none of it, but he is holding up a sardine in a manner that crosses all frontiers.',
    choices: [
      { t: '(Accept the sardine solemnly.)', next: 'y2' },
      { t: '(Decline, politely, with gestures.)', next: 'y3' },
    ],
  },
  y2: {
    sp: null, port: 'narrator',
    text: 'He presses it on you wrapped in newsprint, beams, delivers something long and warm of which you understand only “Trieste!”, and shakes your hand with both of his. You now own a sardine.',
    do() { addItem('sardine'); flag('metYiorgos', true); },
    end: true,
  },
  y3: {
    sp: null, port: 'narrator',
    text: 'He looks wounded on behalf of the entire Aegean. Negotiations resume in mime. They conclude swiftly: you now own a sardine.',
    do() { addItem('sardine'); flag('metYiorgos', true); },
    end: true,
  },
  y_again: {
    sp: 'Yiorgos', port: 'yiorgos', lang: 'el',
    text: '“Φίλε μου! Έλα!”',
    note: 'You appear to be friends now. The terms are unclear but seem to involve sardines.',
    end: true,
  },
};

/* ============================================================
   NPCs — sprite + entry logic
   ============================================================ */
const NPCS = [
  {
    id: 'joyce', name: 'James Joyce', map: 'cafe', x: 13, y: 3,
    coat: '#2f2a33', hat: 'boater', skin: '#eed9bd', range: 1.8,
    entry() {
      if (!flag('metJoyce')) return 'joyce_intro';
      if (hasItem('typewriter')) return 'j_fin1';
      if (flag('finale') || state.stage >= 7) return 'j_post';
      if (state.stage === 1) return 'j_wait1';
      if (state.stage === 2 && !flag('joyceBriefed')) return 'j_lost1';
      return (state.tick % 2 === 0) ? 'j_wait2' : 'j_wait3';
    },
  },
  {
    id: 'waiter', name: 'The Waiter', map: 'cafe', x: 4, y: 2,
    coat: '#211d1f', hat: 'none', hair: '#1f1a16', skin: '#eed9bd', range: 1.8,
    entry() {
      if (!flag('metJoyce')) return 'w_pre';
      if (state.stage >= 7) return 'w_done';
      return 'w_mid';
    },
  },
  {
    id: 'clerk', name: 'The Clerk', map: 'pawnshop', x: 5, y: 2,
    coat: '#33302a', hat: 'none', hair: '#4a443c', skin: '#eed9bd', range: 2.6,
    entry() {
      if (state.stage >= 6 || flag('finale')) return 'c_after';
      if (hasItem('ticket1014')) return state.money >= 4 ? 'c_r1' : 'c_needmoney';
      if (!flag('clerkMet')) { flag('clerkMet', true); return 'c_hello_de'; }
      if (hasItem('joyceticket')) return 'c_hello3';
      if (state.stage >= 2) return 'c_lost';
      return 'c_idle0';
    },
  },
  {
    id: 'marija', name: 'Marija', map: 'city', x: 27, y: 17,
    coat: '#7a5a4a', hat: 'scarf', skin: '#e8c9a4', range: 1.8,
    entry() {
      if (state.stage >= 2 && !flag('toldAnton')) return 'm_ticket1';
      if (flag('toldAnton')) return 'm_after';
      return 'm_pre1';
    },
  },
  {
    id: 'polizist', name: 'The Wachmann', map: 'city', x: 38, y: 11,
    coat: '#2c3a4e', hat: 'helmet', skin: '#e8c9a4', range: 1.8,
    entry() { return flag('metPolizist') ? 'p_again' : 'p_hello'; },
  },
  {
    id: 'anton', name: 'Anton', map: 'city', x: 34, y: 31,
    coat: '#6b5440', hat: 'cap', skin: '#d4a878', big: true, range: 1.8,
    entry() {
      if (flag('antonDone')) return 'a_after';
      if (state.stage >= 3) return 'a1';
      return 'a_pre';
    },
  },
  {
    id: 'svevo', name: 'Ettore Schmitz', map: 'office', x: 8, y: 3,
    coat: '#3d4754', hat: 'none', hair: '#6e655a', skin: '#e8c9a4', range: 2.2,
    entry() {
      if (flag('svevoGave')) return 's_after';
      if (flag('metJoyce') && state.stage >= 2) return 's1';
      return 's_cold';
    },
  },
  {
    id: 'yiorgos', name: 'Yiorgos', map: 'city', x: 10, y: 31,
    coat: '#46586b', hat: 'cap', skin: '#d4a878', range: 1.8,
    entry() { return flag('metYiorgos') ? 'y_again' : 'y1'; },
  },
];
