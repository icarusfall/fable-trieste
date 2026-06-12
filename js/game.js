/* ============================================================
   The Typewriter of Trieste — engine
   Canvas world, DOM dialogue, and the connective tissue.
   ============================================================ */

'use strict';

/* ---------------- constants ---------------- */
const TILE = 44;
const SAVE_KEY = 'trieste_save_v1';

/* ---------------- state ---------------- */
let state = {
  map: PLAYER_SPAWN.map,
  stage: 0,
  money: 1,
  flags: {},
  items: [],
  reps: { lit: 0, dock: 0, auth: 0 },
  tick: 0,
};

const player = {
  x: (PLAYER_SPAWN.x + 0.5) * TILE,
  y: (PLAYER_SPAWN.y + 0.5) * TILE,
  dir: 's',
  moving: false,
  baseSpeed: 185,
};

let mode = 'title';        // title | intro | play | dialogue | panel | end
let transitioning = false;

/* ---------------- tiny API used by data.js ---------------- */
function flag(k, v) {
  if (v === undefined) return !!state.flags[k];
  state.flags[k] = v;
  save();
  return v;
}
function hasItem(id) { return state.items.includes(id); }
function addItem(id) {
  if (hasItem(id)) return;
  state.items.push(id);
  toast(`Received: ${ITEMS[id].name}`);
  if (id === 'typewriter') setTimeout(() => toast('It is heavier than it looks.'), 1400);
  save();
}
function removeItem(id) {
  const i = state.items.indexOf(id);
  if (i >= 0) state.items.splice(i, 1);
  save();
}
function transformItem(a, b) {
  const i = state.items.indexOf(a);
  if (i >= 0) state.items[i] = b; else state.items.push(b);
  toast(`Re-examined: ${ITEMS[b].name}`);
  save();
}
function addMoney(n) {
  state.money += n;
  toast(n >= 0 ? `+${n} crowns` : `−${-n} crowns`);
  updateHUD();
  save();
}
function addRep(k, n) {
  state.reps[k] = (state.reps[k] || 0) + n;
  toast(`${REPS[k]}: ${n > 0 ? '+' + n : n}`);
  save();
}
function setStage(n) {
  if (n <= state.stage) return;
  state.stage = n;
  toast('Journal updated  (J)');
  save();
}

/* ---------------- save / load ---------------- */
function save() {
  if (mode === 'title') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      state, px: player.x, py: player.y,
    }));
  } catch (e) { /* private browsing — play on, unsaved */ }
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    state = Object.assign(state, d.state);
    player.x = d.px; player.y = d.py;
    return true;
  } catch (e) { return false; }
}
function hasSave() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
}

/* ---------------- canvas ---------------- */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let viewW = 0, viewH = 0, dpr = 1;

function resize() {
  dpr = window.devicePixelRatio || 1;
  viewW = window.innerWidth; viewH = window.innerHeight;
  canvas.width = viewW * dpr; canvas.height = viewH * dpr;
  canvas.style.width = viewW + 'px'; canvas.style.height = viewH + 'px';
}
window.addEventListener('resize', resize);
resize();

/* deterministic per-tile randomness */
function hsh(x, y, s = 0) {
  let n = x * 374761393 + y * 668265263 + s * 69069;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}
function shade(hex, f) {
  const r = Math.min(255, Math.round(parseInt(hex.slice(1, 3), 16) * f));
  const g = Math.min(255, Math.round(parseInt(hex.slice(3, 5), 16) * f));
  const b = Math.min(255, Math.round(parseInt(hex.slice(5, 7), 16) * f));
  return `rgb(${r},${g},${b})`;
}

const ROOF_PALETTE = {
  0: '#8a5a44', 1: '#6e4a3c', 2: '#a9763f', 3: '#9c5a4a',
  4: '#7d7468', 5: '#74795f', 6: '#a8854f',
};

const WALKABLE = (ch) => !SOLID_TILES.has(ch);

/* ---------------- static map cache ---------------- */
const mapCache = {};

function getMapCache(map) {
  if (mapCache[map.id]) return mapCache[map.id];
  const off = document.createElement('canvas');
  off.width = map.w * TILE; off.height = map.h * TILE;
  const c = off.getContext('2d');
  renderMapBase(c, map);
  renderMapDecor(c, map);
  mapCache[map.id] = off;
  return off;
}

function tileAt(map, x, y) {
  if (x < 0 || y < 0 || x >= map.w || y >= map.h) return '#';
  return map.grid[y][x];
}

function renderMapBase(c, map) {
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const ch = map.grid[y][x];
      const px = x * TILE, py = y * TILE;
      switch (ch) {
        case '.': drawCobble(c, px, py, x, y, '#a99877'); break;
        case ',': drawPlaza(c, px, py, x, y); break;
        case 'g': drawGrass(c, px, py, x, y); break;
        case '~': drawWater(c, px, py, x, y, '#2a6b7c'); break;
        case '=': drawWater(c, px, py, x, y, '#2f7472'); break;
        case '+': drawBridge(c, px, py, x, y, map); break;
        case '_': drawPlanks(c, px, py, x, y); break;
        case '#': case 'D':
          if (map.outdoor) drawBuilding(c, map, x, y, ch);
          else drawInteriorWall(c, map, x, y, ch);
          break;
        case 'f': drawFloor(c, px, py, x, y); break;
        case 'c': drawCounter(c, px, py, x, y); break;
        case 's': drawShelves(c, px, py, x, y); break;
        case 't': drawTable(c, px, py, x, y); break;
        case 'p': drawBarrels(c, px, py, x, y); break;
        case 'T': drawGrassOrStreet(c, map, px, py, x, y); break; // base under tree
        case 'L': case 'B': case 'm':
          drawGrassOrStreet(c, map, px, py, x, y); break;       // base under decor
      }
    }
  }
}

function drawGrassOrStreet(c, map, px, py, x, y) {
  // what would naturally be underfoot here
  let n = tileAt(map, x, y - 1);
  if (n === 'g' || tileAt(map, x, y + 1) === 'g') drawGrass(c, px, py, x, y);
  else if (n === ',' || tileAt(map, x, y + 1) === ',') drawPlaza(c, px, py, x, y);
  else drawCobble(c, px, py, x, y, '#a99877');
}

function drawCobble(c, px, py, x, y, base) {
  c.fillStyle = shade(base, 0.96 + hsh(x, y) * 0.08);
  c.fillRect(px, py, TILE, TILE);
  c.fillStyle = 'rgba(80,66,46,0.18)';
  for (let i = 0; i < 4; i++) {
    const rx = px + hsh(x, y, i + 1) * (TILE - 8);
    const ry = py + hsh(y, x, i + 5) * (TILE - 6);
    c.fillRect(rx, ry, 5 + hsh(x, y, i + 9) * 4, 3);
  }
}
function drawPlaza(c, px, py, x, y) {
  c.fillStyle = shade('#c2b28e', 0.97 + hsh(x, y) * 0.06);
  c.fillRect(px, py, TILE, TILE);
  c.strokeStyle = 'rgba(120,100,70,0.25)';
  c.lineWidth = 1;
  c.strokeRect(px + 0.5, py + 0.5, TILE, TILE);
  if ((x + y) % 2 === 0) {
    c.fillStyle = 'rgba(120,100,70,0.07)';
    c.fillRect(px, py, TILE, TILE);
  }
}
function drawGrass(c, px, py, x, y) {
  c.fillStyle = shade('#7d9461', 0.95 + hsh(x, y) * 0.1);
  c.fillRect(px, py, TILE, TILE);
  c.fillStyle = 'rgba(60,90,48,0.35)';
  for (let i = 0; i < 5; i++) {
    const rx = px + hsh(x, y, i + 2) * (TILE - 4);
    const ry = py + hsh(y, x, i + 7) * (TILE - 4);
    c.fillRect(rx, ry, 2, 4);
  }
}
function drawWater(c, px, py, x, y, base) {
  c.fillStyle = shade(base, 0.95 + hsh(x, y) * 0.08);
  c.fillRect(px, py, TILE, TILE);
}
function drawBridge(c, px, py, x, y, map) {
  c.fillStyle = shade('#9b8a6d', 0.97 + hsh(x, y) * 0.06);
  c.fillRect(px, py, TILE, TILE);
  // rails along the walkway edges
  c.fillStyle = 'rgba(90,75,55,0.5)';
  c.fillRect(px, py, TILE, 4);
  c.fillRect(px, py + TILE - 4, TILE, 4);
}
function drawPlanks(c, px, py, x, y) {
  c.fillStyle = shade('#8a6b4a', 0.95 + hsh(x, y) * 0.1);
  c.fillRect(px, py, TILE, TILE);
  c.strokeStyle = 'rgba(70,50,30,0.45)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const ly = py + (i + 0.5) * (TILE / 3);
    c.beginPath(); c.moveTo(px, ly); c.lineTo(px + TILE, ly); c.stroke();
  }
}
function drawFloor(c, px, py, x, y) {
  c.fillStyle = shade('#9c7a52', 0.95 + hsh(x, y) * 0.09);
  c.fillRect(px, py, TILE, TILE);
  c.strokeStyle = 'rgba(110,82,50,0.5)';
  c.lineWidth = 1;
  const ly = py + TILE * (0.3 + hsh(x, y) * 0.4);
  c.beginPath(); c.moveTo(px, ly); c.lineTo(px + TILE, ly); c.stroke();
}

function drawBuilding(c, map, x, y, ch) {
  const px = x * TILE, py = y * TILE;
  const tn = (map.tint && map.tint[y][x]) || 0;
  const roof = ROOF_PALETTE[tn] || ROOF_PALETTE[0];
  const south = tileAt(map, x, y + 1);
  const facade = WALKABLE(south) || south === 'D';

  if (facade && WALKABLE(south)) {
    // facade tile: upper roof sliver + wall face
    c.fillStyle = shade(roof, 0.85);
    c.fillRect(px, py, TILE, TILE * 0.3);
    const wall = shade(roof, 1.25);
    c.fillStyle = wall;
    c.fillRect(px, py + TILE * 0.3, TILE, TILE * 0.7);
    c.fillStyle = 'rgba(0,0,0,0.18)';
    c.fillRect(px, py + TILE * 0.3, TILE, 3);

    if (ch === 'D') {
      // a real door
      c.fillStyle = '#3a2a1c';
      c.fillRect(px + TILE * 0.22, py + TILE * 0.38, TILE * 0.56, TILE * 0.62);
      c.fillStyle = '#553e29';
      c.fillRect(px + TILE * 0.27, py + TILE * 0.43, TILE * 0.46, TILE * 0.57);
      c.fillStyle = '#caa84e';
      c.beginPath(); c.arc(px + TILE * 0.64, py + TILE * 0.72, 2.2, 0, 7); c.fill();
    } else if (hsh(x, y, 3) > 0.35) {
      // a window
      c.fillStyle = '#42505c';
      c.fillRect(px + TILE * 0.28, py + TILE * 0.42, TILE * 0.44, TILE * 0.42);
      c.strokeStyle = '#e3d8bd'; c.lineWidth = 2;
      c.strokeRect(px + TILE * 0.28, py + TILE * 0.42, TILE * 0.44, TILE * 0.42);
      c.beginPath();
      c.moveTo(px + TILE * 0.5, py + TILE * 0.42); c.lineTo(px + TILE * 0.5, py + TILE * 0.84);
      c.stroke();
    }
  } else {
    // roof tile
    c.fillStyle = shade(roof, 0.92 + hsh(x, y) * 0.1);
    c.fillRect(px, py, TILE, TILE);
    c.fillStyle = 'rgba(0,0,0,0.07)';
    if (hsh(x, y, 7) > 0.5) c.fillRect(px, py + TILE * 0.5, TILE, 2);
    // edge highlights where roof meets sky/street
    if (WALKABLE(tileAt(map, x, y - 1))) {
      c.fillStyle = shade(roof, 1.18);
      c.fillRect(px, py, TILE, 4);
    }
  }
}

function drawInteriorWall(c, map, x, y, ch) {
  const px = x * TILE, py = y * TILE;
  c.fillStyle = '#473a2e';
  c.fillRect(px, py, TILE, TILE);
  c.fillStyle = '#52443a';
  c.fillRect(px, py, TILE, TILE * 0.55);
  if (ch === 'D') {
    c.fillStyle = '#2a2018';
    c.fillRect(px + TILE * 0.18, py, TILE * 0.64, TILE);
    c.fillStyle = '#8a6b4a';
    c.fillRect(px + TILE * 0.24, py + TILE * 0.08, TILE * 0.52, TILE * 0.9);
    c.fillStyle = '#caa84e';
    c.beginPath(); c.arc(px + TILE * 0.66, py + TILE * 0.55, 2.4, 0, 7); c.fill();
  }
}

function drawCounter(c, px, py, x, y) {
  drawFloor(c, px, py, x, y);
  c.fillStyle = '#4a3320';
  c.fillRect(px, py + TILE * 0.18, TILE, TILE * 0.72);
  c.fillStyle = '#6e5436';
  c.fillRect(px, py + TILE * 0.08, TILE, TILE * 0.2);
  c.fillStyle = 'rgba(255,235,200,0.12)';
  c.fillRect(px, py + TILE * 0.08, TILE, 3);
}
function drawShelves(c, px, py, x, y) {
  c.fillStyle = '#3a2f26';
  c.fillRect(px, py, TILE, TILE);
  for (let i = 0; i < 2; i++) {
    const sy = py + TILE * (0.3 + i * 0.36);
    c.fillStyle = '#5d4a35';
    c.fillRect(px + 2, sy, TILE - 4, 5);
    // knick-knacks
    for (let j = 0; j < 3; j++) {
      const r = hsh(x, y, i * 5 + j);
      c.fillStyle = ['#9c3325', '#4a6741', '#b08a3e', '#7a8a99', '#e3d8bd'][Math.floor(r * 5)];
      c.fillRect(px + 5 + j * (TILE / 3.4), sy - 8 - r * 5, 7, 8 + r * 5);
    }
  }
}
function drawTable(c, px, py, x, y) {
  drawFloor(c, px, py, x, y);
  c.fillStyle = 'rgba(0,0,0,0.18)';
  c.beginPath(); c.ellipse(px + TILE / 2, py + TILE * 0.62, TILE * 0.38, TILE * 0.18, 0, 0, 7); c.fill();
  c.fillStyle = '#6e5436';
  c.beginPath(); c.ellipse(px + TILE / 2, py + TILE * 0.46, TILE * 0.4, TILE * 0.26, 0, 0, 7); c.fill();
  c.fillStyle = '#7d6240';
  c.beginPath(); c.ellipse(px + TILE / 2, py + TILE * 0.43, TILE * 0.36, TILE * 0.22, 0, 0, 7); c.fill();
  if (hsh(x, y) > 0.4) { // a cup, or several saucers
    c.fillStyle = '#e8dcc0';
    c.beginPath(); c.ellipse(px + TILE * 0.42, py + TILE * 0.4, 5, 3.4, 0, 0, 7); c.fill();
    c.fillStyle = '#fff4dd';
    c.beginPath(); c.ellipse(px + TILE * 0.42, py + TILE * 0.38, 3.6, 2.4, 0, 0, 7); c.fill();
  }
}
function drawBarrels(c, px, py, x, y) {
  drawFloor(c, px, py, x, y);
  for (const [ox, oy] of [[0.3, 0.45], [0.68, 0.6]]) {
    c.fillStyle = '#5d6b73';
    c.beginPath(); c.arc(px + TILE * ox, py + TILE * oy, TILE * 0.21, 0, 7); c.fill();
    c.strokeStyle = '#3e474d'; c.lineWidth = 2;
    c.beginPath(); c.arc(px + TILE * ox, py + TILE * oy, TILE * 0.21, 0, 7); c.stroke();
    c.fillStyle = '#3e474d';
    c.fillRect(px + TILE * ox - 6, py + TILE * oy - 1.5, 12, 3);
  }
}

/* decor pass: things taller than a tile */
function renderMapDecor(c, map) {
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const ch = map.grid[y][x];
      const px = x * TILE, py = y * TILE;
      if (ch === 'T') {
        c.fillStyle = 'rgba(0,0,0,0.2)';
        c.beginPath(); c.ellipse(px + TILE / 2, py + TILE * 0.8, TILE * 0.38, TILE * 0.14, 0, 0, 7); c.fill();
        c.fillStyle = '#5d4126';
        c.fillRect(px + TILE * 0.44, py + TILE * 0.35, TILE * 0.12, TILE * 0.45);
        c.fillStyle = '#46603a';
        c.beginPath(); c.arc(px + TILE / 2, py + TILE * 0.22, TILE * 0.42, 0, 7); c.fill();
        c.fillStyle = '#567548';
        c.beginPath(); c.arc(px + TILE * 0.42, py + TILE * 0.14, TILE * 0.27, 0, 7); c.fill();
        c.fillStyle = '#618253';
        c.beginPath(); c.arc(px + TILE * 0.6, py + TILE * 0.26, TILE * 0.2, 0, 7); c.fill();
      } else if (ch === 'L') {
        c.fillStyle = 'rgba(0,0,0,0.18)';
        c.beginPath(); c.ellipse(px + TILE / 2, py + TILE * 0.86, 8, 3.4, 0, 0, 7); c.fill();
        c.fillStyle = '#33312c';
        c.fillRect(px + TILE * 0.46, py - TILE * 0.3, TILE * 0.09, TILE * 1.14);
        c.fillStyle = '#23211d';
        c.fillRect(px + TILE * 0.36, py - TILE * 0.42, TILE * 0.3, TILE * 0.16);
        c.fillStyle = '#e8c779';
        c.fillRect(px + TILE * 0.4, py - TILE * 0.38, TILE * 0.22, TILE * 0.1);
      } else if (ch === 'B') {
        if (hsh(x, y) > 0.5) { // crate
          c.fillStyle = '#8a6b4a';
          c.fillRect(px + 6, py + 8, TILE - 12, TILE - 14);
          c.strokeStyle = '#5d4126'; c.lineWidth = 2;
          c.strokeRect(px + 6, py + 8, TILE - 12, TILE - 14);
          c.beginPath();
          c.moveTo(px + 6, py + 8); c.lineTo(px + TILE - 6, py + TILE - 6);
          c.moveTo(px + TILE - 6, py + 8); c.lineTo(px + 6, py + TILE - 6);
          c.stroke();
        } else { // bollard
          c.fillStyle = 'rgba(0,0,0,0.2)';
          c.beginPath(); c.ellipse(px + TILE / 2, py + TILE * 0.72, 9, 4, 0, 0, 7); c.fill();
          c.fillStyle = '#3e3a35';
          c.fillRect(px + TILE * 0.38, py + TILE * 0.26, TILE * 0.24, TILE * 0.44);
          c.beginPath(); c.arc(px + TILE / 2, py + TILE * 0.27, TILE * 0.13, 0, 7); c.fill();
        }
      } else if (ch === 'm') {
        // market stall: counter + striped awning
        c.fillStyle = '#6e5436';
        c.fillRect(px + 3, py + TILE * 0.42, TILE - 6, TILE * 0.5);
        c.fillStyle = '#7d6240';
        c.fillRect(px + 3, py + TILE * 0.38, TILE - 6, TILE * 0.14);
        // produce
        for (let j = 0; j < 3; j++) {
          const r = hsh(x, y, j + 11);
          c.fillStyle = ['#c95f70', '#d9b14a', '#7a9a4a', '#b8b2a6'][Math.floor(r * 4)];
          c.beginPath(); c.arc(px + 10 + j * 12, py + TILE * 0.42, 4.5, 0, 7); c.fill();
        }
        // awning
        const colA = hsh(x, y, 2) > 0.5 ? '#9c3325' : '#3f6b56';
        for (let s = 0; s < 6; s++) {
          c.fillStyle = s % 2 ? '#e8dcc0' : colA;
          c.fillRect(px + s * (TILE / 6), py - TILE * 0.18, TILE / 6 + 1, TILE * 0.34);
        }
        c.fillStyle = 'rgba(0,0,0,0.15)';
        c.fillRect(px, py + TILE * 0.14, TILE, 3);
      }
    }
  }
  // a steamer at anchor (city only)
  if (map.id === 'city') drawSteamer(c, 40 * TILE, 31.2 * TILE);
  // signs above doors
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const s of map.signs) {
    const cx = (s.x + 0.5) * TILE, cy = s.y * TILE - 9;
    c.font = 'bold 10px Georgia';
    const w = c.measureText(s.text).width + 14;
    c.fillStyle = '#2e2620';
    c.fillRect(cx - w / 2, cy - 8, w, 16);
    c.strokeStyle = '#b08a3e'; c.lineWidth = 1;
    c.strokeRect(cx - w / 2, cy - 8, w, 16);
    c.fillStyle = '#e8dcc0';
    c.fillText(s.text, cx, cy + 0.5);
  }
}

function drawSteamer(c, px, py) {
  c.fillStyle = 'rgba(0,0,0,0.25)';
  c.beginPath(); c.ellipse(px + 90, py + 46, 95, 9, 0, 0, 7); c.fill();
  c.fillStyle = '#33333b';
  c.beginPath();
  c.moveTo(px, py + 20); c.lineTo(px + 180, py + 20);
  c.lineTo(px + 168, py + 44); c.lineTo(px + 14, py + 44); c.closePath(); c.fill();
  c.fillStyle = '#8a3a30';
  c.fillRect(px + 4, py + 34, 168, 5);
  c.fillStyle = '#d9d2c0';
  c.fillRect(px + 30, py + 4, 110, 16);
  c.fillStyle = '#3e3a35';
  c.fillRect(px + 78, py - 18, 16, 24);
  c.fillStyle = '#8a3a30';
  c.fillRect(px + 78, py - 18, 16, 6);
  c.strokeStyle = '#2a2a30'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(px + 30, py + 4); c.lineTo(px + 16, py - 30); c.stroke();
  c.beginPath(); c.moveTo(px + 140, py + 4); c.lineTo(px + 160, py - 26); c.stroke();
}

/* ---------------- people ---------------- */
function drawPerson(c, px, py, o, t) {
  const s = o.big ? 1.18 : 1;
  c.save();
  c.translate(px, py);
  c.scale(s, s);
  // shadow
  c.fillStyle = 'rgba(0,0,0,0.25)';
  c.beginPath(); c.ellipse(0, 14, 11, 4.4, 0, 0, 7); c.fill();
  // legs
  c.fillStyle = shade(o.coat, 0.6);
  const step = o.walk ? Math.sin(t * 11) * 3.4 : 0;
  c.fillRect(-6, 4 + Math.max(0, step), 5, 10 - Math.max(0, step));
  c.fillRect(1, 4 + Math.max(0, -step), 5, 10 - Math.max(0, -step));
  // body
  c.fillStyle = o.coat;
  c.beginPath();
  c.moveTo(-9, 8); c.quadraticCurveTo(-10, -8, 0, -9);
  c.quadraticCurveTo(10, -8, 9, 8); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.10)';
  c.fillRect(-9, -6, 18, 3);
  // head
  c.fillStyle = o.skin;
  c.beginPath(); c.arc(0, -15, 7.2, 0, 7); c.fill();
  // hat / hair
  switch (o.hat) {
    case 'cap':
      c.fillStyle = '#3e3a32';
      c.beginPath(); c.arc(0, -18, 7, Math.PI, 0); c.fill();
      c.fillRect(-8, -19, 16, 3);
      break;
    case 'boater':
      c.fillStyle = '#2c2620';
      c.beginPath(); c.ellipse(0, -20, 10, 3.4, 0, 0, 7); c.fill();
      c.fillStyle = '#3a322a';
      c.fillRect(-5.5, -26, 11, 7);
      break;
    case 'helmet':
      c.fillStyle = '#23314a';
      c.beginPath(); c.arc(0, -18, 7.4, Math.PI, 0); c.fill();
      c.fillRect(-8.4, -19, 16.8, 3.4);
      c.fillStyle = '#c9a648';
      c.beginPath(); c.arc(0, -22, 1.8, 0, 7); c.fill();
      break;
    case 'scarf':
      c.fillStyle = '#9c3325';
      c.beginPath(); c.arc(0, -16, 8.2, Math.PI * 0.85, Math.PI * 0.15); c.fill();
      c.fillRect(-8, -17, 16, 5);
      break;
    default:
      c.fillStyle = o.hair || '#3a2d20';
      c.beginPath(); c.arc(0, -17.5, 6.6, Math.PI, 0); c.fill();
  }
  c.restore();
}

/* gulls */
const gulls = Array.from({ length: 5 }, (_, i) => ({
  x: Math.random() * 50 * TILE,
  y: (29 + Math.random() * 5) * TILE,
  vx: 16 + Math.random() * 26,
  ph: Math.random() * 7,
}));

/* ---------------- camera & render ---------------- */
function currentMap() { return MAPS[state.map]; }

function camera() {
  const map = currentMap();
  const mw = map.w * TILE, mh = map.h * TILE;
  let cx = player.x - viewW / 2;
  let cy = player.y - viewH / 2;
  cx = mw <= viewW ? (mw - viewW) / 2 : Math.max(0, Math.min(mw - viewW, cx));
  cy = mh <= viewH ? (mh - viewH) / 2 : Math.max(0, Math.min(mh - viewH, cy));
  return { cx, cy };
}

function render(t) {
  const map = currentMap();
  const { cx, cy } = camera();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = map.outdoor ? '#1d3a42' : '#241c14';
  ctx.fillRect(0, 0, viewW, viewH);
  ctx.translate(-cx, -cy);

  ctx.drawImage(getMapCache(map), 0, 0);

  // animated water shimmer
  const x0 = Math.max(0, Math.floor(cx / TILE)), x1 = Math.min(map.w - 1, Math.ceil((cx + viewW) / TILE));
  const y0 = Math.max(0, Math.floor(cy / TILE)), y1 = Math.min(map.h - 1, Math.ceil((cy + viewH) / TILE));
  ctx.strokeStyle = 'rgba(210,236,228,0.35)';
  ctx.lineWidth = 1.6;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const ch = map.grid[y][x];
      if (ch !== '~' && ch !== '=') continue;
      const r = hsh(x, y, 4);
      if (r < 0.55) continue;
      const ph = t * 1.4 + r * 9;
      const a = (Math.sin(ph) + 1) / 2;
      if (a < 0.35) continue;
      ctx.globalAlpha = a * 0.6;
      const wx = x * TILE + 6 + r * 14, wy = y * TILE + TILE * (0.3 + 0.4 * hsh(y, x, 6));
      ctx.beginPath();
      ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 7, wy - 2.6, wx + 14, wy);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // steamer smoke
  if (map.id === 'city') {
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.25 + i * 0.33) % 1;
      ctx.fillStyle = `rgba(200,200,195,${0.35 * (1 - ph)})`;
      ctx.beginPath();
      ctx.arc(40 * TILE + 86 + ph * 50, 31.2 * TILE - 22 - ph * 46, 4 + ph * 9, 0, 7);
      ctx.fill();
    }
  }

  // entities, y-sorted
  const ents = [];
  for (const n of NPCS) {
    if (n.map !== state.map) continue;
    const bob = Math.sin(t * 1.7 + n.x * 3) * 1.2;
    ents.push({ y: n.y * TILE + TILE / 2, draw: () => drawPerson(ctx, (n.x + 0.5) * TILE, n.y * TILE + TILE / 2 + bob, n, t) });
  }
  ents.push({
    y: player.y,
    draw: () => drawPerson(ctx, player.x, player.y,
      { coat: '#5b4a37', hat: 'cap', skin: '#d4a878', walk: player.moving }, t),
  });
  ents.sort((a, b) => a.y - b.y);
  for (const e of ents) e.draw();

  // gulls over the sea
  if (map.id === 'city') {
    ctx.strokeStyle = 'rgba(245,245,238,0.9)';
    ctx.lineWidth = 2;
    for (const g of gulls) {
      const gy = g.y + Math.sin(t * 1.3 + g.ph) * 14;
      const flap = Math.sin(t * 9 + g.ph) * 3.4;
      ctx.beginPath();
      ctx.moveTo(g.x - 6, gy);
      ctx.quadraticCurveTo(g.x - 3, gy - 4 - flap, g.x, gy);
      ctx.quadraticCurveTo(g.x + 3, gy - 4 - flap, g.x + 6, gy);
      ctx.stroke();
    }
  }
}

/* ---------------- input ---------------- */
const keys = {};
window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
  keys[k] = true;
  if (e.repeat) return;
  handleKey(k);
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

function handleKey(k) {
  if (mode === 'title' || mode === 'end') return;
  if (mode === 'intro') {
    if (['e', 'enter', ' '].includes(k)) introNext();
    return;
  }
  if (mode === 'dialogue') {
    if (['e', 'enter', ' '].includes(k)) dlgAdvance();
    if (/^[1-9]$/.test(k)) dlgChoose(parseInt(k, 10) - 1);
    if (k === 'escape') { /* dialogue cannot be escaped — manners */ }
    return;
  }
  if (mode === 'panel') {
    if (['escape', 'j', 'i'].includes(k)) closePanels();
    return;
  }
  // play
  if (['e', 'enter', ' '].includes(k)) tryInteract();
  if (k === 'j') openJournal();
  if (k === 'i') openInventory();
}

document.getElementById('btn-journal').addEventListener('click', () => {
  if (mode === 'play') openJournal(); else if (mode === 'panel') closePanels();
});
document.getElementById('btn-inventory').addEventListener('click', () => {
  if (mode === 'play') openInventory(); else if (mode === 'panel') closePanels();
});

/* ---------------- movement & update ---------------- */
function passable(px, py) {
  const map = currentMap();
  const r = 9;
  for (const [ox, oy] of [[-r, -r], [r, -r], [-r, r * 0.6], [r, r * 0.6]]) {
    const tx = Math.floor((px + ox) / TILE), ty = Math.floor((py + oy) / TILE);
    if (SOLID_TILES.has(tileAt(map, tx, ty))) return false;
  }
  return true;
}

function update(dt, t) {
  if (mode !== 'play' || transitioning) { player.moving = false; return; }

  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;
  player.moving = !!(dx || dy);
  if (player.moving) {
    const len = Math.hypot(dx, dy);
    const speed = hasItem('typewriter') ? player.baseSpeed * 0.66 : player.baseSpeed;
    const nx = player.x + (dx / len) * speed * dt;
    const ny = player.y + (dy / len) * speed * dt;
    if (passable(nx, player.y)) player.x = nx;
    if (passable(player.x, ny)) player.y = ny;
  }

  // door?
  const map = currentMap();
  const tx = Math.floor(player.x / TILE), ty = Math.floor(player.y / TILE);
  const door = map.doors[`${tx},${ty}`];
  if (door) travel(door);

  // gulls drift
  for (const g of gulls) {
    g.x += g.vx * dt;
    if (g.x > 51 * TILE) { g.x = -TILE; g.y = (29 + Math.random() * 5) * TILE; }
  }

  updatePrompt();
}

function travel(door) {
  transitioning = true;
  hidePrompt();
  const fader = document.getElementById('fader');
  fader.classList.add('active');
  setTimeout(() => {
    state.map = door.map;
    player.x = (door.x + 0.5) * TILE;
    player.y = (door.y + 0.5) * TILE;
    updateHUD();
    save();
    fader.classList.remove('active');
    setTimeout(() => { transitioning = false; }, 250);
  }, 350);
}

/* ---------------- interaction ---------------- */
let promptTarget = null;

function findTarget() {
  const map = currentMap();
  let best = null, bestD = Infinity;
  for (const n of NPCS) {
    if (n.map !== state.map) continue;
    const d = Math.hypot((n.x + 0.5) * TILE - player.x, (n.y + 0.5) * TILE - player.y);
    const max = (n.range || 1.6) * TILE;
    if (d < max && d < bestD) { best = { kind: 'npc', npc: n }; bestD = d; }
  }
  for (const h of map.hotspots) {
    // people take precedence over scenery: hotspots carry a half-tile penalty
    const d = Math.hypot((h.x + 0.5) * TILE - player.x, (h.y + 0.5) * TILE - player.y) + TILE * 0.55;
    if (d < 1.5 * TILE + TILE * 0.55 && d < bestD) { best = { kind: 'hotspot', hot: h }; bestD = d; }
  }
  return best;
}

function updatePrompt() {
  const tgt = findTarget();
  promptTarget = tgt;
  const el = document.getElementById('prompt');
  if (!tgt) { el.classList.add('hidden'); return; }
  el.innerHTML = tgt.kind === 'npc'
    ? `<kbd>E</kbd> Talk to ${tgt.npc.name}`
    : `<kbd>E</kbd> ${tgt.hot.name}`;
  el.classList.remove('hidden');
}
function hidePrompt() {
  promptTarget = null;
  document.getElementById('prompt').classList.add('hidden');
}

function tryInteract() {
  if (!promptTarget) return;
  if (promptTarget.kind === 'npc') {
    state.tick++;
    const id = promptTarget.npc.entry();
    if (id) openDialogue(id);
  } else {
    openNarration(promptTarget.hot.text);
  }
}

/* ---------------- dialogue ---------------- */
const dlgEl = document.getElementById('dialogue');
const dlgText = document.getElementById('dlg-text');
const dlgName = document.getElementById('dlg-name');
const dlgLang = document.getElementById('dlg-lang');
const dlgPortrait = document.getElementById('dlg-portrait');
const dlgChoices = document.getElementById('dlg-choices');
const dlgContinue = document.getElementById('dlg-continue');

let dlgNode = null;
let typeTimer = null;
let typing = false;

function openDialogue(id) {
  mode = 'dialogue';
  hidePrompt();
  dlgEl.classList.remove('hidden');
  showNode(id);
}

function openNarration(text) {
  mode = 'dialogue';
  hidePrompt();
  dlgEl.classList.remove('hidden');
  dlgNode = { sp: null, port: 'narrator', text, end: true };
  renderNode();
}

function showNode(id) {
  const node = DIALOGUES[id];
  if (!node) { endDialogue(); return; }
  dlgNode = node;
  if (node.do) node.do();
  renderNode();
}

function renderNode() {
  const node = dlgNode;
  // portrait
  if (node.port && PORTRAITS[node.port]) {
    dlgPortrait.innerHTML = PORTRAITS[node.port];
    dlgPortrait.classList.remove('empty');
  } else {
    dlgPortrait.classList.add('empty');
  }
  // name + language chip
  if (node.sp) {
    dlgName.textContent = node.sp;
    const L = node.lang ? LANGS[node.lang] : null;
    if (L) {
      dlgLang.textContent = L.label;
      dlgLang.className = 'lang-chip ' + L.cls;
      dlgLang.style.display = '';
    } else dlgLang.style.display = 'none';
  } else {
    dlgName.textContent = '· · ·';
    dlgLang.style.display = 'none';
  }
  // text styling
  dlgText.className = '';
  if (!node.sp) dlgText.classList.add('narration');
  if (node.lang && UNKNOWN_LANGS.has(node.lang)) dlgText.classList.add('foreign');

  dlgChoices.innerHTML = '';
  dlgContinue.classList.add('hidden');

  // typewriter effect
  clearInterval(typeTimer);
  const full = node.text;
  let i = 0;
  typing = true;
  dlgText.textContent = '';
  typeTimer = setInterval(() => {
    i += 2;
    dlgText.textContent = full.slice(0, i);
    if (i >= full.length) finishTyping();
  }, 14);
}

function finishTyping() {
  clearInterval(typeTimer);
  typing = false;
  const node = dlgNode;
  dlgText.textContent = node.text;
  if (node.note) {
    const sp = document.createElement('span');
    sp.className = 'untrans-note';
    sp.textContent = node.note;
    dlgText.appendChild(sp);
  }
  const visible = (node.choices || []).filter(c => !c.if || c.if());
  if (visible.length) {
    visible.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'dlg-choice';
      b.innerHTML = `<span class="ch-num">${i + 1}</span>${escapeHtml(c.t)}`;
      b.addEventListener('click', () => dlgChoose(i));
      dlgChoices.appendChild(b);
    });
    dlgNode._visible = visible;
  } else {
    dlgContinue.classList.remove('hidden');
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function dlgAdvance() {
  if (!dlgNode) return;
  if (typing) { finishTyping(); return; }
  if (dlgNode._visible && dlgNode._visible.length) return; // must choose
  if (dlgNode.next) showNode(dlgNode.next);
  else endDialogue();
}

function dlgChoose(i) {
  if (!dlgNode || typing) return;
  const visible = dlgNode._visible;
  if (!visible || !visible[i]) return;
  const c = visible[i];
  dlgNode._visible = null;
  if (c.do) c.do();
  if (c.next) showNode(c.next);
  else endDialogue();
}

dlgEl.addEventListener('click', (e) => {
  if (e.target.closest('.dlg-choice')) return;
  dlgAdvance();
});

function endDialogue() {
  dlgNode = null;
  clearInterval(typeTimer);
  dlgEl.classList.add('hidden');
  mode = 'play';
  updateHUD();
  if (flag('finale') && !flag('endShown')) {
    flag('endShown', true);
    setTimeout(showEndCard, 900);
  }
}

/* ---------------- panels ---------------- */
function openJournal() {
  mode = 'panel';
  hidePrompt();
  const wrap = document.getElementById('journal-entries');
  wrap.innerHTML = '';
  for (let i = 0; i <= Math.min(state.stage, QUEST_STAGES.length - 1); i++) {
    const div = document.createElement('div');
    div.className = 'j-entry' + (i < state.stage ? ' done' : ' current');
    div.textContent = QUEST_STAGES[i];
    wrap.appendChild(div);
  }
  const reps = document.getElementById('journal-reps');
  reps.innerHTML = '';
  for (const k of Object.keys(REPS)) {
    const v = state.reps[k] || 0;
    if (!v) continue;
    const chip = document.createElement('span');
    chip.className = 'rep-chip';
    chip.innerHTML = `${REPS[k]}: <b>${v > 0 ? '+' + v : v}</b>`;
    reps.appendChild(chip);
  }
  if (!reps.children.length) {
    reps.innerHTML = '<span class="rep-chip">No faction has yet formed an opinion of you. This will not last.</span>';
  }
  document.getElementById('journal').classList.remove('hidden');
}

function openInventory() {
  mode = 'panel';
  hidePrompt();
  const wrap = document.getElementById('inv-items');
  wrap.innerHTML = '';
  const money = document.createElement('div');
  money.className = 'inv-item';
  money.innerHTML = `<span class="inv-name">${state.money} crown${state.money === 1 ? '' : 's'}</span>
    <span class="inv-desc">Austro-Hungarian, and therefore reliable until further notice.</span>`;
  wrap.appendChild(money);
  for (const id of state.items) {
    const it = ITEMS[id];
    if (!it) continue;
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.innerHTML = `<span class="inv-name">${it.name}</span><span class="inv-desc">${it.desc}</span>`;
    wrap.appendChild(div);
  }
  document.getElementById('inventory').classList.remove('hidden');
}

function closePanels() {
  document.getElementById('journal').classList.add('hidden');
  document.getElementById('inventory').classList.add('hidden');
  mode = 'play';
}

/* ---------------- toasts & HUD ---------------- */
function toast(msg) {
  const wrap = document.getElementById('toasts');
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  wrap.appendChild(div);
  setTimeout(() => div.classList.add('fade-out'), 2300);
  setTimeout(() => div.remove(), 3000);
}

function updateHUD() {
  document.getElementById('hud-place').textContent = currentMap().name;
  document.getElementById('hud-money').textContent =
    `${state.money} crown${state.money === 1 ? '' : 's'}`;
}

/* ---------------- overlay screens ---------------- */
const overlay = document.getElementById('overlay');

function showTitle() {
  mode = 'title';
  document.getElementById('hud').classList.add('hidden');
  overlay.innerHTML = `
    <div class="screen">
      <div class="kicker">Trieste · 1909</div>
      <div class="title-art">${TITLE_ART}</div>
      <h1>The Typewriter of Trieste</h1>
      <div class="subtitle">A small comedy of languages, debts, and literature,
        in which Mr James Joyce has done it again.</div>
      <div class="menu">
        <button id="btn-new">New Game</button>
        ${hasSave() ? '<button id="btn-continue" class="secondary">Continue</button>' : ''}
      </div>
      <div class="controls-hint">
        <kbd>WASD</kbd>/<kbd>↑↓←→</kbd> walk &nbsp;·&nbsp; <kbd>E</kbd> talk / interact
        &nbsp;·&nbsp; <kbd>J</kbd> journal &nbsp;·&nbsp; <kbd>I</kbd> pockets
      </div>
    </div>`;
  document.getElementById('btn-new').addEventListener('click', () => {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    startIntro();
  });
  const cont = document.getElementById('btn-continue');
  if (cont) cont.addEventListener('click', () => {
    loadSave();
    startPlay();
  });
}

let introIdx = 0;
function startIntro() {
  mode = 'intro';
  introIdx = 0;
  renderIntroCard();
}
function renderIntroCard() {
  overlay.innerHTML = `
    <div class="screen">
      <div class="intro-card">${INTRO_CARDS[introIdx]}</div>
      <div class="next-hint">▸ E / click to continue</div>
    </div>`;
  overlay.querySelector('.screen').addEventListener('click', introNext);
}
function introNext() {
  introIdx++;
  if (introIdx >= INTRO_CARDS.length) startPlay();
  else renderIntroCard();
}

function startPlay() {
  overlay.innerHTML = '';
  document.getElementById('hud').classList.remove('hidden');
  mode = 'play';
  updateHUD();
  save();
}

function showEndCard() {
  mode = 'end';
  hidePrompt();
  const mementos = state.items.map(id => ITEMS[id] && ITEMS[id].name).filter(Boolean);
  const extra = [];
  if (hasItem('sardine')) extra.push('You still own a sardine.');
  if (hasItem('homer')) extra.push('Homer has, at last, found a good home.');
  if (!flag('boughtFlowers')) extra.push('You never did buy the carnations. Marija forgives you, loudly.');
  const repLines = Object.keys(REPS)
    .filter(k => state.reps[k])
    .map(k => `${REPS[k]}: <b>${state.reps[k] > 0 ? '+' + state.reps[k] : state.reps[k]}</b>`)
    .join(' &nbsp;·&nbsp; ');
  overlay.innerHTML = `
    <div class="screen">
      <div class="kicker">Act I · Scene I — complete</div>
      <h1>The Typewriter, Recovered</h1>
      <div class="subtitle">Trieste continues — its factions sharpening, its police filing,
        its writer typing. The next disaster is already drafting itself.</div>
      <div class="end-stats">
        Crowns remaining: <b>${state.money}</b><br>
        ${repLines || 'Reputation: politely unnoticed'}<br>
        Pockets: ${mementos.length ? mementos.join(', ') : 'empty, but experienced'}<br>
        ${extra.join('<br>')}
      </div>
      <div class="menu">
        <button id="btn-wander">Keep wandering Trieste</button>
        <button id="btn-restart" class="secondary">Start over</button>
      </div>
    </div>`;
  document.getElementById('btn-wander').addEventListener('click', () => {
    overlay.innerHTML = '';
    mode = 'play';
  });
  document.getElementById('btn-restart').addEventListener('click', () => {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  });
}

/* ---------------- main loop ---------------- */
let lastT = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  const t = now / 1000;
  update(dt, t);
  render(t);
  requestAnimationFrame(frame);
}

showTitle();
updateHUD();
requestAnimationFrame(frame);
