# The Typewriter of Trieste

A small comic mystery-adventure set in Trieste, 1909, in which Mr James Joyce
has done it again. Act I, Scene I: *The Pawned Typewriter* — the complete
vertical slice of the larger game pitch.

You are a young refugee from Ottoman Macedonia, newly arrived with three
languages, one coat, and a talent for noticing things. A note signed only "J."
leads you to the Caffè San Marco, and from there into the orbit of the city's
most brilliant and least solvent English teacher.

## How to run

It's a plain browser game — no build step, no install, no dependencies.

**Easiest:** double-click `index.html` (everything is inline; it works from
`file://`).

**Or serve it** (avoids any browser quirks):

```
python -m http.server 8631
# then open http://localhost:8631
```

## Controls

| Key | Action |
| --- | --- |
| WASD / arrow keys | walk |
| E / Enter / Space | talk, interact, advance dialogue |
| 1–9 | pick a dialogue choice |
| J | journal (objectives + faction reputation) |
| I | pockets (inventory) |
| Esc | close panels |

Progress autosaves to `localStorage`; the title screen offers **Continue**
if a save exists.

## The slice

The full prototype mission from the design pitch:

1. Meet Joyce at the Caffè San Marco. He needs his typewriter; his publisher
   wants pages by Friday. He hands you "the ticket".
2. The clerk at the Monte di Pietà (the municipal pawnshop) identifies it as
   a betting slip — Erin's Pride, third race, lost — with a sonnet on the back.
3. Ask the street. The Wachmann is incomprehensible (German); Marija the
   flower seller is *comprehensible* (Slovene is close enough to your
   Macedonian) — the language system as level design.
4. Anton the docker has the ticket, and a letter from Belgrade he can't read.
   Translate it — honestly, gently, or creatively. Your Serbian is the favour.
5. Four crowns are wanting. "Apply to Schmitz at the Veneziani paint works.
   Say it is for Literature." Italo Svevo sighs in Italian and pays in crowns.
6. Redeem the machine (Form 7, Form 7-a, a third stamp, possibly ceremonial),
   carry it back — it is heavier than it looks, and slows you down — and
   collect your fee: a signed sonnet, possibly valuable by 1950.

Optional: carnations and rosemary from Marija, a sardine from Yiorgos the
Greek fisherman (the language system, comic variant), a residence-paper
stamping from the Wachmann, and a plaster head of Homer, slightly chipped.

## Systems in the slice (from the larger pitch)

- **Language gating** — every line is tagged with its language. Slovene and
  Serbian are open to you; Italian and Triestino you manage; German and Greek
  render untranslated with a red chip. Quest information routes around the
  languages you know.
- **Faction reputation** — Literary Circle, Riva & Docks, the Authorities;
  earned through choices, shown in the journal and the end card.
- **No combat** — problems are solved by observation, conversation,
  translation, and four crowns.

## Code layout

| File | Contents |
| --- | --- |
| `index.html` | shell + DOM for HUD, dialogue, panels, overlays |
| `style.css` | paper-and-brass UI theme |
| `js/portraits.js` | flat-vector SVG character busts + title art |
| `js/data.js` | languages, items, factions, journal stages, **all dialogue**, NPC entry logic |
| `js/maps.js` | the city (built programmatically) + three interiors, doors, signs, hotspots |
| `js/game.js` | canvas renderer (cached tile layer + animated water/gulls/steamer), movement & collision, dialogue engine, journal/inventory, save/load, title/intro/end screens |

Adding a scene is mostly writing: new nodes in `DIALOGUES`, an `entry()`
function on an NPC, and a journal line in `QUEST_STAGES`. The engine doesn't
need to change.

## Next scenes (per the pitch)

- **The Arrest** — Joyce detained; the police letter at the end of this scene
  is the hook already planted.
- **The Missing Manuscript** — with Isabel Burton and the orientalist papers.
- The pomodoro-beret irredentists, the Berlitz school interior, Nora.
