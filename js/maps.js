/* ============================================================
   Maps — old-quarter Trieste and three interiors.

   Tile legend:
     '#' building wall      '.' cobbled street    ',' piazza paving
     '~' open sea           '=' canal             '+' bridge
     '_' wooden dock        'g' park grass        'T' tree
     'L' lamp post          'B' bollard/crate     'm' market stall
     'D' door               'f' interior floor    't' table/desk
     'c' counter            's' shelves           'p' paint barrels
   ============================================================ */

const SOLID_TILES = new Set(['#', '~', '=', 'T', 'L', 'B', 'm', 't', 'c', 's', 'p']);

function gridFromStrings(rows) {
  return rows.map(r => r.split(''));
}

/* ---------------- the city ---------------- */
function buildCity() {
  const W = 50, H = 36;
  const g = [], tint = [];
  for (let y = 0; y < H; y++) {
    g.push(new Array(W).fill('.'));
    tint.push(new Array(W).fill(0));
  }

  const rect = (x0, y0, x1, y1, ch, tn) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      g[y][x] = ch;
      if (tn !== undefined) tint[y][x] = tn;
    }
  };

  // sea along the bottom
  rect(0, 30, W - 1, H - 1, '~');
  // frame of buildings: top row + side columns down to the riva
  rect(0, 0, W - 1, 0, '#', 1);
  rect(0, 0, 0, 29, '#', 1);
  rect(W - 1, 0, W - 1, 29, '#', 1);

  // squares
  rect(33, 9, 47, 14, ',');      // the big piazza
  rect(20, 11, 29, 13, ',');     // Ponterosso market square
  // park
  rect(3, 12, 8, 17, 'g');

  // canal (Canal Grande) running to the sea, with two bridges
  rect(23, 14, 25, 29, '=');
  rect(23, 21, 25, 21, '+');
  rect(23, 29, 25, 29, '+');

  // buildings  [tint: 2 ochre, 3 rose, 4 grey, 5 sage, 6 sand]
  rect(3, 2, 12, 8, '#', 4);     // Monte di Pietà
  rect(15, 2, 20, 7, '#', 2);    // Berlitz school
  rect(28, 2, 31, 6, '#', 3);    // tenement
  rect(34, 2, 45, 7, '#', 6);    // Caffè San Marco
  rect(14, 12, 19, 16, '#', 5);  // tenement
  rect(40, 16, 46, 21, '#', 3);  // Teatro
  rect(29, 17, 35, 21, '#', 2);  // Il Piccolo
  rect(3, 23, 11, 27, '#', 5);   // Veneziani paint works

  // doors (functional)
  g[8][8] = 'D';    // Monte di Pietà
  g[7][40] = 'D';   // café
  g[27][7] = 'D';   // Veneziani

  // doors (flavour, locked — drawn as doors, used as hotspots)
  g[7][17] = 'D';   // Berlitz
  g[21][43] = 'D';  // Teatro
  g[21][32] = 'D';  // Il Piccolo

  // wooden docks reaching into the sea
  rect(8, 30, 11, 33, '_');
  rect(32, 30, 35, 33, '_');

  // market stalls (Ponterosso + fish stalls by the riva)
  g[15][26] = 'm'; g[15][27] = 'm'; g[15][28] = 'm';
  g[12][22] = 'm'; g[12][24] = 'm';
  g[28][30] = 'm'; g[28][31] = 'm';

  // trees
  [[4, 13], [7, 15], [5, 17], [20, 16], [20, 19], [20, 23], [20, 26],
   [36, 9], [44, 9]].forEach(([x, y]) => g[y][x] = 'T');

  // lamps
  [[35, 13], [45, 13], [27, 11]].forEach(([x, y]) => g[y][x] = 'L');

  // bollards and crates along the riva
  [[5, 29], [14, 29], [19, 29], [28, 28], [38, 29], [44, 29], [13, 28], [37, 28]]
    .forEach(([x, y]) => { if (g[y][x] === '.') g[y][x] = 'B'; });

  return {
    id: 'city', name: 'Trieste — the old quarter', w: W, h: H,
    grid: g, tint, outdoor: true,
    doors: {
      '8,8':   { map: 'pawnshop', x: 5, y: 7 },
      '40,7':  { map: 'cafe',     x: 7, y: 9 },
      '7,27':  { map: 'office',   x: 5, y: 7 },
    },
    signs: [
      { x: 8,  y: 8,  text: 'MONTE DI PIETÀ' },
      { x: 17, y: 7,  text: 'BERLITZ' },
      { x: 40, y: 7,  text: 'CAFFÈ SAN MARCO' },
      { x: 43, y: 21, text: 'TEATRO' },
      { x: 32, y: 21, text: 'IL PICCOLO' },
      { x: 7,  y: 27, text: 'VENEZIANI · VERNICI' },
    ],
    hotspots: [
      { x: 17, y: 8, name: 'Read the notice', text:
        'BERLITZ SCHOOL — locked. A notice on the door: “Mr Joyce’s English lessons continue at the Caffè San Marco until further notice. Fees in advance. — The Management.”' },
      { x: 43, y: 22, name: 'Read the playbill', text:
        'TEATRO. Tonight: a lecture, “Irredentism and You” — cancelled by order of the police. Tomorrow: cancelled in advance.' },
      { x: 32, y: 22, name: 'Peer through the window', text:
        'IL PICCOLO, the newspaper. Through the glass: men shouting softly at one another, which is journalism.' },
      { x: 24, y: 21, name: 'Look at the canal', text:
        'The Canal Grande. Ships unload Greek currants, Austrian paperwork, and — recently — at least one sonnet.' },
      { x: 30, y: 27, name: 'The fish stalls', text:
        'The morning’s catch reproaches you in several dialects. Tuesday’s wind is still discussed here, respectfully, as a colleague.' },
    ],
  };
}

/* ---------------- Caffè San Marco ---------------- */
function buildCafe() {
  const rows = [
    '################',
    '#cccccccc......#',
    '#..............#',
    '#..t..t..t..tf.#',
    '#..............#',
    '#..t..t..t..t..#',
    '#..............#',
    '#..t..t........#',
    '#..............#',
    '#..............#',
    '#######D########',
  ];
  const g = gridFromStrings(rows).map(r => r.map(c => c === '.' ? 'f' : c));
  return {
    id: 'cafe', name: 'Caffè San Marco', w: 16, h: 11,
    grid: g, outdoor: false,
    doors: { '7,10': { map: 'city', x: 40, y: 8 } },
    signs: [],
    hotspots: [
      { x: 13, y: 4, name: 'The saucers', text:
        'Joyce’s table. Seven saucers, a dictionary of two languages, and a bill that has begun to develop its own marginalia.' },
    ],
  };
}

/* ---------------- Monte di Pietà ---------------- */
function buildPawnshop() {
  const rows = [
    '############',
    '#ssssssssss#',
    '#..........#',
    '#cccccccccc#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#####D######',
  ];
  const g = gridFromStrings(rows).map(r => r.map(c => c === '.' ? 'f' : c));
  return {
    id: 'pawnshop', name: 'Monte di Pietà', w: 12, h: 9,
    grid: g, outdoor: false,
    doors: { '5,8': { map: 'city', x: 8, y: 9 } },
    signs: [],
    hotspots: [
      { x: 2, y: 2, name: 'The shelves', text:
        'A violin. Six christening spoons. Somebody’s medals. A pair of curtains, an overcoat of literary cut, and a plaster head of Homer, waiting for redemption like everyone else.' },
    ],
  };
}

/* ---------------- Veneziani paint works ---------------- */
function buildOffice() {
  const rows = [
    '############',
    '#pp......ss#',
    '#..........#',
    '#...t..t...#',
    '#..........#',
    '#pp........#',
    '#..........#',
    '#..........#',
    '#####D######',
  ];
  const g = gridFromStrings(rows).map(r => r.map(c => c === '.' ? 'f' : c));
  return {
    id: 'office', name: 'Veneziani Paint Works', w: 12, h: 9,
    grid: g, outdoor: false,
    doors: { '5,8': { map: 'city', x: 7, y: 28 } },
    signs: [],
    hotspots: [
      { x: 1, y: 5, name: 'The paint barrels', text:
        'Anti-fouling paint for the hulls of half the navies of Europe. The formula is secret; the smell is not.' },
    ],
  };
}

const MAPS = {
  city: buildCity(),
  cafe: buildCafe(),
  pawnshop: buildPawnshop(),
  office: buildOffice(),
};

const PLAYER_SPAWN = { map: 'city', x: 41, y: 27 };
