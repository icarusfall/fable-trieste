/* ============================================================
   Portraits — flat vector busts, c. 1909.
   Each is an SVG string keyed by character id.
   ============================================================ */

(function () {
  const NS = 'xmlns="http://www.w3.org/2000/svg"';

  // helper: wrap body in a framed bust
  function bust(bg, body) {
    return `<svg viewBox="0 0 100 100" ${NS}>
      <rect width="100" height="100" fill="${bg}"/>
      <rect width="100" height="100" fill="url(#none)" opacity="0"/>
      ${body}
    </svg>`;
  }

  // common pieces
  const SKIN = '#e8c9a4';
  const SKIN_PALE = '#eed9bd';
  const SKIN_TAN = '#d4a878';

  function shoulders(color) {
    return `<path d="M14 100 Q22 72 50 72 Q78 72 86 100 Z" fill="${color}"/>`;
  }
  function head(skin, cy = 46) {
    return `<ellipse cx="50" cy="${cy}" rx="16.5" ry="19" fill="${skin}"/>
            <path d="M33.5 ${cy} q0 14 7 17 l19 0 q7 -3 7 -17" fill="rgba(0,0,0,0.06)"/>`;
  }
  function eyes(dx = 0, color = '#33271c') {
    return `<circle cx="${43 + dx}" cy="45" r="1.8" fill="${color}"/>
            <circle cx="${57 + dx}" cy="45" r="1.8" fill="${color}"/>`;
  }
  function brows() {
    return `<path d="M39 40 q4 -2.5 8 -0.5" stroke="#3a2d20" stroke-width="1.6" fill="none" stroke-linecap="round"/>
            <path d="M53 39.5 q4 -2 8 0.5" stroke="#3a2d20" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }
  function nose() {
    return `<path d="M50 46 l-1.5 7 l3 0 Z" fill="rgba(120,80,50,0.45)"/>`;
  }
  function mouth() {
    return `<path d="M45 59 q5 3 10 0" stroke="#7a4636" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }
  function moustache(color = '#3a2d20', w = 1) {
    return `<path d="M${50 - 9 * w} 57 q9 ${5 * w} ${9 * w} 2 q${9 * w} ${3 * w} ${9 * w} -2 q-4 5 -${9 * w} 3.4 q-${5 * w} -1.6 -${9 * w} -3.4 Z"
            transform="translate(0,-1)" fill="${color}"/>`;
  }

  window.PORTRAITS = {

    /* you — young, watchful, a cap from another country */
    player: bust('#3e5a52',
      shoulders('#5b4a37') +
      `<path d="M30 100 l8 -22 4 6 Z" fill="#4a3c2d"/>` +
      head(SKIN_TAN) +
      `<path d="M32 38 q18 -16 36 0 l-2 -8 q-16 -12 -32 0 Z" fill="#2e2a24"/>
       <path d="M31 37 q19 -7 38 0 l0 4 q-19 -6 -38 0 Z" fill="#3c372f"/>` +
      eyes() + brows() + nose() + mouth()),

    /* James Joyce — round spectacles, hat at an irresponsible angle */
    joyce: bust('#4a3550',
      shoulders('#2f2a33') +
      `<path d="M40 78 l20 0 l-3 8 l-14 0 Z" fill="#efe6d2"/>
       <path d="M46 78 l8 0 l-4 9 Z" fill="#7a2330"/>` +  // waistcoat + loose tie
      head(SKIN_PALE) +
      // hat, tilted
      `<g transform="rotate(-7 50 30)">
        <ellipse cx="50" cy="31" rx="22" ry="5.5" fill="#241f1a"/>
        <path d="M36 31 q1 -13 14 -13 q13 0 14 13 Z" fill="#332b23"/>
        <rect x="36" y="27" width="28" height="4" rx="2" fill="#1c1814"/>
       </g>` +
      eyes(0, '#4a6a7a') + brows() + nose() +
      // round spectacles
      `<circle cx="43" cy="45" r="5.5" fill="rgba(210,230,235,0.30)" stroke="#8c7a4e" stroke-width="1.4"/>
       <circle cx="57" cy="45" r="5.5" fill="rgba(210,230,235,0.30)" stroke="#8c7a4e" stroke-width="1.4"/>
       <path d="M48.5 45 l3 0" stroke="#8c7a4e" stroke-width="1.4"/>` +
      `<path d="M44 57.5 q6 3.5 12 0 q-3 4 -6 4 q-3 0 -6 -4 Z" fill="#4a3424"/>` + // slight moustache
      `<path d="M46 62 q4 2.5 8 0" stroke="#7a4636" stroke-width="1.4" fill="none" stroke-linecap="round"/>`),

    /* Italo Svevo (Ettore Schmitz) — kind, tired, permanently smoking */
    svevo: bust('#39505e',
      shoulders('#3d4754') +
      `<rect x="44" y="76" width="12" height="10" fill="#efe6d2"/>
       <path d="M47 76 l6 0 l-3 9 Z" fill="#28323c"/>` +
      head(SKIN) +
      // receding hair, grey at temples
      `<path d="M34 38 q3 -12 16 -12 q13 0 16 12 q-6 -7 -16 -7 q-10 0 -16 7 Z" fill="#6e655a"/>
       <path d="M33 42 q-1 -5 3 -8 l1 6 Z" fill="#8d857a"/>
       <path d="M67 42 q1 -5 -3 -8 l-1 6 Z" fill="#8d857a"/>` +
      eyes() +
      `<path d="M38.5 40 q4.5 -3 9 -0.6" stroke="#564a3c" stroke-width="2" fill="none" stroke-linecap="round"/>
       <path d="M52.5 39.4 q4.5 -2.4 9 0.6" stroke="#564a3c" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      nose() +
      moustache('#5d5246', 1.1) +
      // cigarette + curl of smoke
      `<rect x="58" y="59" width="11" height="2.2" rx="1" fill="#efe6d2" transform="rotate(14 58 59)"/>
       <circle cx="69.5" cy="61.8" r="1.4" fill="#d96a2b"/>
       <path d="M70 59 q3 -4 0 -8 q-3 -4 1 -8" stroke="rgba(220,220,220,0.55)" stroke-width="1.6" fill="none"/>`),

    /* Clerk of the Monte di Pietà — pince-nez and paragraph eleven */
    clerk: bust('#56503c',
      shoulders('#33302a') +
      `<rect x="42" y="74" width="16" height="8" fill="#efe6d2"/>
       <ellipse cx="50" cy="79" rx="3" ry="4" fill="#1f1c18"/>` + // high collar, black cravat
      head(SKIN_PALE) +
      `<path d="M35 36 q5 -9 15 -9 q10 0 15 9 q-7 -4 -15 -4 q-8 0 -15 4 Z" fill="#4a443c"/>` +
      eyes(0, '#3c3c3c') +
      `<path d="M39 39.5 l9 0" stroke="#3a2d20" stroke-width="1.8" stroke-linecap="round"/>
       <path d="M52 39.5 l9 0" stroke="#3a2d20" stroke-width="1.8" stroke-linecap="round"/>` + // flat suspicious brows
      nose() +
      // pince-nez on a chain
      `<circle cx="43.5" cy="45" r="4.6" fill="rgba(210,230,235,0.30)" stroke="#9a9a9a" stroke-width="1.3"/>
       <circle cx="56.5" cy="45" r="4.6" fill="rgba(210,230,235,0.30)" stroke="#9a9a9a" stroke-width="1.3"/>
       <path d="M48 45 l4 0" stroke="#9a9a9a" stroke-width="1.6"/>
       <path d="M61 46 q8 6 6 16" stroke="#9a9a9a" stroke-width="0.9" fill="none"/>` +
      `<path d="M45.5 59.5 l9 0" stroke="#7a4636" stroke-width="1.5" stroke-linecap="round"/>`), // a mouth that has said "no" professionally

    /* Anton — docker, big as a wardrobe */
    anton: bust('#5a4632',
      `<path d="M8 100 Q18 66 50 66 Q82 66 92 100 Z" fill="#6b5440"/>
       <rect x="40" y="70" width="20" height="8" fill="#8a7358"/>` +
      head(SKIN_TAN, 44) +
      // flat cap
      `<path d="M32 34 q4 -11 18 -11 q14 0 18 11 l3 2 q-21 -7 -42 0 Z" fill="#3e3a32"/>
       <rect x="31" y="34" width="38" height="3.5" rx="1.6" fill="#2c2924"/>` +
      eyes() +
      `<path d="M38 39 q5 -3.5 10 -0.5" stroke="#2e241a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
       <path d="M52 38.5 q5 -3 10 0.5" stroke="#2e241a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
      nose() +
      // full beard
      `<path d="M34 48 q0 18 16 18 q16 0 16 -18 q-2 14 -16 14 q-14 0 -16 -14 Z" fill="#4a3826"/>
       <path d="M36 50 q2 12 14 12 q12 0 14 -12 q-3 9 -14 9 q-11 0 -14 -9 Z" fill="#3a2c1e"/>
       <path d="M44 57 q6 3 12 0 q-3 3.5 -6 3.5 q-3 0 -6 -3.5 Z" fill="#3a2c1e"/>`),

    /* Marija — flowers, headscarf, hears everything */
    marija: bust('#4f6246',
      shoulders('#7a5a4a') +
      `<path d="M30 100 q-4 -16 8 -18 l4 8 Z" fill="#5d8a52"/>
       <circle cx="33" cy="84" r="3.2" fill="#c95f70"/>
       <circle cx="38" cy="80" r="3.2" fill="#d9b14a"/>
       <circle cx="30" cy="78" r="3" fill="#b86a9e"/>` + // basket of flowers at shoulder
      head(SKIN) +
      // headscarf
      `<path d="M32 50 q-4 -26 18 -26 q22 0 18 26 q2 -20 -18 -20 q-20 0 -18 20 Z" fill="#9c3325"/>
       <path d="M33 33 q17 -10 34 0 l1 9 q-18 -9 -36 0 Z" fill="#9c3325"/>
       <path d="M32 47 l-4 10 l8 -3 Z" fill="#7e2a1e"/>` +
      eyes() + brows() + nose() +
      `<path d="M45 58.5 q5 3.5 10 0" stroke="#7a4636" stroke-width="1.7" fill="none" stroke-linecap="round"/>
       <circle cx="38" cy="54" r="2.6" fill="rgba(201,95,112,0.35)"/>
       <circle cx="62" cy="54" r="2.6" fill="rgba(201,95,112,0.35)"/>`),

    /* The Wachmann — Austro-Hungarian police, magnificent whiskers */
    polizist: bust('#2e3d52',
      shoulders('#2c3a4e') +
      `<circle cx="50" cy="80" r="2.6" fill="#c9a648"/>
       <circle cx="50" cy="90" r="2.6" fill="#c9a648"/>` + // brass buttons
      head(SKIN) +
      // shako-style cap with badge
      `<path d="M33 33 l34 0 l-2 -12 q-15 -6 -30 0 Z" fill="#23314a"/>
       <rect x="31" y="32" width="38" height="4" rx="2" fill="#16233a"/>
       <circle cx="50" cy="26" r="3" fill="#c9a648"/>` +
      eyes(0, '#3c4a55') +
      `<path d="M38.5 40 q4.5 -2 9 0" stroke="#4a3a26" stroke-width="2.2" fill="none" stroke-linecap="round"/>
       <path d="M52.5 40 q4.5 -2 9 0" stroke="#4a3a26" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
      nose() +
      // enormous regulation moustache
      `<path d="M50 55 q-12 -2 -17 4 q6 5 14 1.5 q2 -1 3 -2.5 q1 1.5 3 2.5 q8 3.5 14 -1.5 q-5 -6 -17 -4 Z" fill="#6b4f2e"/>`),

    /* Waiter at the San Marco — has seen everything, been paid for some of it */
    waiter: bust('#43383a',
      shoulders('#211d1f') +
      `<path d="M40 76 l20 0 l-4 16 l-12 0 Z" fill="#efe6d2"/>
       <path d="M45 77 l10 0 l-2.5 3 l-5 0 Z" fill="#1c1814"/>` + // white front, black bow tie
      head(SKIN_PALE) +
      `<path d="M34 38 q2 -12 16 -12 q14 0 16 12 q-8 -6 -16 -6 q-8 0 -16 6 Z" fill="#1f1a16"/>
       <path d="M34 38 q16 -8 32 0 l0 2 q-16 -7 -32 0 Z" fill="#332b23"/>` + // slicked hair
      eyes() +
      `<path d="M39 40 q4 -1.5 8 -0.5" stroke="#3a2d20" stroke-width="1.5" fill="none" stroke-linecap="round"/>
       <path d="M53 39.5 q4 -1 8 0.5" stroke="#3a2d20" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
      nose() +
      `<path d="M44 58 q6 2 12 0 q-2.5 2.6 -6 2.6 q-3.5 0 -6 -2.6 Z" fill="#2e241c"/>
       <path d="M46 61.5 q4 1.5 8 0" stroke="#7a4636" stroke-width="1.3" fill="none" stroke-linecap="round"/>`),

    /* Yiorgos — Greek fisherman, friend to all sardines */
    yiorgos: bust('#33575e',
      shoulders('#46586b') +
      `<path d="M36 78 q14 6 28 0 l0 6 q-14 6 -28 0 Z" fill="#3a4a5c"/>` +
      head(SKIN_TAN, 45) +
      // fisherman's cap
      `<path d="M33 35 q3 -12 17 -12 q14 0 17 12 q-17 -6 -34 0 Z" fill="#27313d"/>
       <rect x="32" y="34" width="36" height="4" rx="2" fill="#1b2330"/>` +
      eyes() +
      `<path d="M37.5 39.5 q5 -3 10 -0.5" stroke="#dadada" stroke-width="2.2" fill="none" stroke-linecap="round"/>
       <path d="M52.5 39 q5 -2.5 10 0.5" stroke="#dadada" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + // white brows
      nose() +
      // big grey beard
      `<path d="M34 47 q-1 20 16 20 q17 0 16 -20 q-2 15 -16 15 q-14 0 -16 -15 Z" fill="#b8b2a6"/>
       <path d="M37 50 q2 11 13 11 q11 0 13 -11 q-3 8 -13 8 q-10 0 -13 -8 Z" fill="#9a948a"/>
       <path d="M44 56 q6 3.5 12 0 q-3 4 -6 4 q-3 0 -6 -4 Z" fill="#9a948a"/>`),

    /* narration — the typewriter itself */
    narrator: bust('#1d3a42',
      `<g transform="translate(0,6)">
        <rect x="26" y="52" width="48" height="20" rx="4" fill="#33414a"/>
        <rect x="30" y="46" width="40" height="10" rx="3" fill="#41525c"/>
        <circle cx="38" cy="60" r="2.2" fill="#cdbf9f"/><circle cx="46" cy="60" r="2.2" fill="#cdbf9f"/>
        <circle cx="54" cy="60" r="2.2" fill="#cdbf9f"/><circle cx="62" cy="60" r="2.2" fill="#cdbf9f"/>
        <circle cx="42" cy="66" r="2.2" fill="#cdbf9f"/><circle cx="50" cy="66" r="2.2" fill="#cdbf9f"/>
        <circle cx="58" cy="66" r="2.2" fill="#cdbf9f"/>
        <rect x="34" y="38" width="32" height="6" rx="3" fill="#22303a"/>
        <rect x="40" y="22" width="20" height="18" fill="#efe6d2"/>
        <path d="M43 27 l14 0 M43 31 l14 0 M43 35 l9 0" stroke="#b3a584" stroke-width="1.4"/>
      </g>`),
  };

  /* small title-screen typewriter, brass on dark */
  window.TITLE_ART = `<svg viewBox="0 0 200 140" ${NS}>
    <ellipse cx="100" cy="126" rx="78" ry="8" fill="rgba(0,0,0,0.35)"/>
    <rect x="40" y="88" width="120" height="34" rx="8" fill="#3a4a52"/>
    <rect x="40" y="88" width="120" height="6" rx="3" fill="#4a5d66"/>
    <rect x="52" y="72" width="96" height="22" rx="5" fill="#46575f"/>
    <g fill="#cdbf9f">
      <circle cx="66" cy="102" r="4"/><circle cx="80" cy="102" r="4"/><circle cx="94" cy="102" r="4"/>
      <circle cx="108" cy="102" r="4"/><circle cx="122" cy="102" r="4"/><circle cx="136" cy="102" r="4"/>
      <circle cx="73" cy="112" r="4"/><circle cx="87" cy="112" r="4"/><circle cx="101" cy="112" r="4"/>
      <circle cx="115" cy="112" r="4"/><circle cx="129" cy="112" r="4"/>
    </g>
    <rect x="58" y="58" width="84" height="12" rx="6" fill="#2c3940"/>
    <circle cx="52" cy="64" r="6" fill="#b08a3e"/>
    <circle cx="148" cy="64" r="6" fill="#b08a3e"/>
    <rect x="74" y="18" width="52" height="44" fill="#f3e9d2"/>
    <path d="M80 26 l40 0 M80 33 l40 0 M80 40 l40 0 M80 47 l26 0" stroke="#b3a584" stroke-width="2.4"/>
    <path d="M100 62 l0 8" stroke="#22303a" stroke-width="2"/>
  </svg>`;
})();
