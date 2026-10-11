# Style guide: Wabi 2.0 launch-film grammar

**Reference:** Wabi 2.0 launch video (x.com/wabi/status/2104721766690222087). 80.5 s, 1920 × 1080, 60 fps.
**Source studied:** `refs/frames/f_001.jpg … f_161.jpg`, one frame every 0.5 s (frame `f_NNN` = second `(NNN − 1) × 0.5`). The 10 fps difference curve and the scene detection were run on the original MP4.
**Scope:** this file records the reference's *grammar*: rhythm, transitions, camera, type behaviour, colour logic. Its copy, characters, objects, product UI and logo are **not** ours to reuse. The "Propiedad Conecta translation" column in each section says how we apply each rule with our own assets.

Values marked *measured* were sampled from the frames with a script. Values marked *est.* are read off the frames by eye.

---

## 1. The film in one paragraph

The film is a **one-take feeling on a white page, bookended by two short abstract 3D-gradient worlds**. The opening gradient (0–6.4 s) blooms into pure white. From then on the film alternates **one-line text card → UI demo → one-line text card**, almost never cutting, until a single hard cut drops back into the gradient for the logo (71.8–80.5 s). The film has only **three hard cuts in 80 s**. Everything else is a continuous move, morph, dissolve or reveal on the same canvas.

---

## 2. Palette

### 2.1 Reference palette (*measured*, hex)

| Role | Hex | Where |
|---|---|---|
| Night base (opener, bottom) | `#0F061E` `#130A23` | f_001 |
| Deep violet | `#4A2C91` `#6E47AD` | f_004 horizon band |
| Magenta violet | `#AD53A5` | f_001 |
| Ember orange | `#D5673D` `#BF523B` | f_001–f_004 horizon glow |
| Blush | `#D2979C` | f_001 |
| Lilac haze | `#C5AECD` | f_004 sky |
| Peach mist | `#DCBAA4` `#DBC2B5` | f_004–f_007 |
| Periwinkle sky (end of the opener's colour shift) | `#7188CB` `#959FD1` | f_009 |
| Warm fog (last gradient before white) | `#E3DAD5` `#E4CEC6` | f_012 |
| Outro indigo / plum / magenta | `#010056` `#3F0657` `#89207F` | f_145–f_147 |
| Outro rose / apricot | `#CF718E` `#E9A275` `#EA9561` | f_145 |
| Outro desaturated studio grey | `#9E9FA8` → `#DEDEDE` | f_149–f_151 |
| **Canvas** | `#FFFFFF` | every white-world frame (σ ≈ 0.05: pure white, no texture) |
| **Ink** (all body/headline text) | `#171717` | f_016, f_115, f_142 |
| **Pending word** (next word before it "lands") | `#B9B9B9`–`#C4C4C4` | f_074, f_078, f_142 |
| UI surface (bubbles, cards) | `#F3F3F3`–`#F4F4F4` | f_062, f_134 |
| Hairline / bezel / dividers | `#E8E8E8` | f_028 |

### 2.2 Colour logic

1. **Two worlds, strictly separated.** Saturated gradients exist *only* in the bookends. The middle 65 s is achromatic: white canvas, near-black ink, grey UI. All colour in the middle comes from inside the product screenshots.
2. **The gradient is never flat.** Three or four hues blend vertically and drift during the shot. The opener goes warm to cool (ember → periwinkle). The outro goes saturated to grey before the logo.
3. **Ink is never pure black.** It is `#171717`.
4. **Grey means "not yet" or "leaving."** An incoming word is grey and turns ink when it lands. A line about to leave turns grey first.

### 2.3 Propiedad Conecta translation

| Reference role | PC value | Source |
|---|---|---|
| Gradient bookends | Bosque `#142A22` → Conecta `#4DA22D` → Brote `#92CE58` → Marfil `#FAF9F5`, plus one warm accent so the gradient does not go flat: dawn light `#F6F2E9` | Brand palette in `anuncios/reel-publica-tu-busqueda/02-guion-tecnico.md` |
| Outro desaturation | Gradient eases into Marfil `#FAF9F5` (not grey); the logo is only allowed on white/ivory | `04-ia-vs-edicion-y-logo.md`, logo rule 4 |
| Canvas | `#FFFFFF` | — |
| Ink | `#142A22` (Bosque: the brand's text colour, and as dark as the reference's `#171717`) | — |
| Pending word | `#B9C2BE` (Bosque at ~30 % on white) | — |
| UI surface | Whatever the real screenshots contain. Never recoloured. | — |
| Accent | Brote `#92CE58`, used at most once, for the CTA moment | — |

---

## 3. Typography

### 3.1 Reference (*est.* unless noted)

| Property | Value |
|---|---|
| Family | Neo-grotesque sans (Inter Display / SF Pro class: double-storey `a`, single-storey `g`, angled `t` terminal). One family for everything, including the UI. |
| Weights | **Regular–Medium (400–500)** for all headline cards. **Light/Regular** for the typed opener line. **Semibold** for the giant list words (f_081–f_088). Nothing heavier. |
| Tracking | Tight: about **−1 % to −2 %** on headlines, slightly looser (0) on the small typed line. Words in a list stack are tighter still (~−3 %). |
| Case | Sentence case. Short statements end with a period ("X. Y."). No ALL CAPS, no italics, no underlines. |
| Headline size | **~90 px on 1080p** (*measured*: one line with ascender and descender = 108 px tall, f_016). |
| Typed opener size | ~55–60 px, white over the gradient. |
| Tinted opener words | ~150 px, filled with a gradient sampled from the background (peach → violet; f_012). |
| List-stack words | Active word ~130 px ink, inactive words ~110 px in `#C4C4C4` behind the device (f_081–f_088). |
| Caption above device | ~36 px ink, top centre, ~8 % from the top edge (f_132–f_139). |
| Line length | **One line, 2–5 words.** Never a second line on a text card. |
| Position | Optical centre (y ≈ 50 %), horizontally centred. **The line is laid out at its final, centred position from the first word on.** Words fill in place, and the line never re-centres as it grows (f_014 vs f_016, f_074 vs f_075). |

### 3.2 Propiedad Conecta translation

- **Family: Outfit** (brand font, OFL, already in `anuncios/reel-publica-tu-busqueda/animatic/fuentes/Outfit-Variable.ttf`). It is geometric rather than neo-grotesque, but it matches the logo wordmark. Keep it at **400/500** so it stays as quiet as the reference. Use 600 only for the list stack.
- Tracking: **−0.02 em** on headlines, **−0.03 em** on the list stack, **0** on the typed line.
- Copy in Spanish (Ecuador), sentence case, ending with a period.

---

## 4. Shot lengths and rhythm

### 4.1 Measured beat map (reference)

| t (s) | Dur. | Beat type | Frames |
|---|---|---|---|
| 0.0–6.4 | 6.4 | Gradient opener: object + typed line + tinted words | f_001–f_013 |
| 6.4–9.0 | 2.6 | Text card (word-by-word) | f_014–f_018 |
| 9.0–17.5 | 8.5 | UI demo: bubbles on white → device draws in → push to detail | f_019–f_035 |
| 17.5–20.5 | 3.0 | Text card that turns into an image (words split, avatars arrive) | f_036–f_042 |
| 20.5–27.5 | 7.0 | UI demo: chat → pull-back → map | f_043–f_055 |
| 27.5–30.5 | 3.0 | Text card (glyph scramble) | f_056–f_061 |
| 30.5–36.5 | 6.0 | UI demo: conversation → result screen | f_062–f_073 |
| 36.5–40.0 | 3.5 | Two text cards back-to-back | f_074–f_080 |
| 40.0–43.8 | 3.8 | List stack: giant words behind device, screen changes per word | f_081–f_088 |
| 43.8–55.5 | 11.7 | UI demo (longest beat) | f_089–f_111 |
| 55.5–61.5 | 6.0 | Two text cards, the first dissolves into the second | f_112–f_123 |
| 61.5–69.5 | 8.0 | UI → 3D carousel of widgets around the device, caption on top | f_124–f_139 |
| 69.5–71.8 | 2.3 | Text card (append: "A." → "A. B.") | f_140–f_144 |
| 71.8–75.5 | 3.7 | Gradient outro: abstract objects → desaturate → logo tile | f_145–f_151 |
| 75.5–80.5 | 5.0 | End card: inline icon lockup → name → domain | f_152–f_161 |

### 4.2 Rules

- **Text cards: 2.3–3.5 s.** About 0.8 s of reveal, a **1.5–2 s hold** on the complete line, then ~0.3 s of exit.
- **UI beats: 6–12 s** at full length. Each UI beat shows **one** action and its result.
- **Strict alternation:** text → UI → text. Two text cards in a row only when the second completes the first.
- **Bookends ≈ 8 % (opener) and 11 % (outro + end card)** of runtime.
- Holds are real: once a line is complete, nothing else moves except a very slow drift (or nothing at all).

**For 15 s:** the reference's proportions compress to one opener (~2.2 s), two text cards (~1.6–2.2 s each), one UI beat (~3.5 s), one list stack (~1.8 s) and an outro + end card (~3.4 s).

---

## 5. Transitions

Only **3 hard cuts in 80 s** (scene detection: 43.8 s, 69.45 s, 71.8 s), and each one lands on a clean, mostly white frame. Every other change is one of these:

| # | Transition | How it behaves | Reference |
|---|---|---|---|
| T1 | **Bloom to white** | Gradient overexposes to pure white in **~0.25 s** (luma 207 → 253). The white page becomes the new world. | 6.2–6.5 s, f_013→f_014 |
| T2 | **Burst out** | Many small objects fly outward from centre, defocused, ~0.5 s. Leaves a single UI element on white. | 9.0–9.5 s, f_019–f_020 |
| T3 | **UI first, frame later** | UI elements appear alone on white. A thin hairline device frame then draws in around them and the camera pulls back. | 13–17.5 s, f_026–f_029 |
| T4 | **Element hand-off (match morph)** | An element from a text card (one avatar) stays put while the card dissolves. It becomes part of the next UI shot. | 20–21 s, f_041–f_043 |
| T5 | **Pull-back + lateral slide** | Device shrinks and slides off-centre, clearing space for the next element. | 23.5–26 s, f_047–f_053 |
| T6 | **Blur-to-sharp load** | A card inside the UI arrives as a soft blurred block, then resolves (~0.5 s). | 24.5–25.5 s, f_050–f_052; 47–48 s |
| T7 | **Text behind device** | Text in a rolling vertical list sits *behind* the device; the device occludes it. Screen content changes with each new active word. | 40–43.5 s, f_081–f_088 |
| T8 | **Widgets lift out** | Elements lift off the screen into 3D and orbit the device in an arc. | 64–69 s, f_130–f_139 |
| T9 | **Desaturate into logo** | Outro gradient drains to studio grey, abstract objects converge into the logo tile. | 73.5–75.5 s, f_148–f_151 |
| T10 | **Hard cut** (rare) | From white to white (a new UI on a clean page), or white → gradient for the outro. | 43.8, 69.45, 71.8 s |

**Easing:** **expo/quart-out** everywhere. The difference curves peak in the first 0.1–0.2 s and decay over 0.6–1.0 s. Camera moves (opener crane, pull-backs) use **ease-in-out** with the peak in the middle. There is **no overshoot or bounce**, except the reaction particles.

---

## 6. Camera

All moves are virtual. The camera is never handheld, never shakes, never tilts off level and never rack-focuses.

| Move | Use | Speed |
|---|---|---|
| **Locked off** | Every text card | — |
| **Slow crane up** | Opener: the horizon slides down out of frame while the colour shifts warm → cool | 6 s, ease-in-out |
| **Push-in** | Onto a UI detail, from full device to a single card | ~1.00 → 1.12 scale over ~2 s |
| **Pull-back** | From a UI detail out to the full device frame | ~1.15 → 1.00 over ~1.5 s |
| **Lateral truck** | Device slides left/right to make room | ~0.6 s, expo-out |
| **Scroll inside device** | Content scrolls; the frame stays still | ~0.5–0.8 s per scroll step |
| **Orbit / carousel** | 3D elements rotate around a still device | slow, constant speed |

Depth comes from **defocus**: foreground objects are blurred (f_019, f_038–f_040). Fast movers get **motion blur** (avatars flying out, f_040). The UI is always tack sharp.

---

## 7. Texture and grain

- **No grain, no film texture, no vignette, no light leaks.** High-pass noise σ ≈ **0.2–0.3 / 255** in the gradients (encoding level) and **0.05** on white (*measured*). It is a clean digital finish.
- Gradients are smooth and band-free. Render at 10-bit or add ±0.5 LSB dither on export so 8-bit H.264 does not band.
- **Shadows:** only under the device and floating cards. Very large blur (~60–80 px at 1080p), ~8–12 % opacity, slightly offset downwards. No hard shadows.
- **Device frame:** hairline outline (~2–3 px) in `#E8E8E8`, white body, no realistic hardware rendering.
- Corner radii are generous and consistent (bubbles ~20 px, cards ~24 px, device ~60 px at 1080p).

---

## 8. How text enters and exits

### Entries

| # | Entry | Mechanics | Reference |
|---|---|---|---|
| E1 | **Typewriter + caret** (opener only) | ~70 ms per character (~14 chars/s), thin caret `|` blinks while typing and disappears ~0.5 s after the last character. | f_005–f_010 |
| E2 | **Word-by-word, grey → ink** (default) | Each word appears in place at pending grey, with a 4–6 px blur that clears, and settles to ink in ~0.25 s. About **0.15 s between words**. The line is laid out at its final position. | f_014–f_016, f_074–f_076, f_113–f_114 |
| E3 | **Blur-in, gradient-tinted** (opener only) | Large words fade up from ~20 px blur, filled with the background's own gradient. | f_011–f_013 |
| E4 | **Glyph scramble** | Some letters start as other glyphs and resolve into the real letters over ~0.5 s. | f_057–f_059 |
| E5 | **Append** | A complete statement holds, then a second statement types on after it on the same line (E2 mechanics). The line was set for its final length from the start. | f_140–f_143 |
| E6 | **Caption with device** | Small caption fades in at the top (~0.3 s, no movement) as the device settles below. | f_132 |

### Exits

| # | Exit | Mechanics | Reference |
|---|---|---|---|
| X1 | **Fade to grey, then gone** | Whole line goes ink → pending grey (~0.2 s), then out (~0.15 s). | f_080 |
| X2 | **Dither dissolve** | Selected words break into a stochastic pixel/noise pattern and evaporate, right to left, while the remaining words hold. ~0.4 s. | f_116 |
| X3 | **Blur-out** | Words defocus to ~20 px and fade (~0.3 s), sometimes leaving one word behind. | f_117–f_118 |
| X4 | **Tracking spread** | Words drift apart horizontally (tracking grows), then exit with motion blur while new elements fill the gaps. | f_036–f_040 |
| X5 | **Drop-out to lockup** | In the end card, words either side of the icon fade out, leaving icon + name; the name is then swapped for the domain (E2/X1). | f_157–f_161 |

### Never

Text never slides in from off-screen, bounces, scales up from zero, uses outlines, shadows, highlight boxes or underlines, or sits on top of busy imagery in the white world.

---

## 9. What we take and what we leave

| Take (grammar) | Leave (their content) |
|---|---|
| Gradient bookends around a white world | The glass orb, the curved-horizon set, the three-sphere logo and its colours |
| Bloom-to-white, UI-first/frame-later, blur-to-sharp, text-behind-device, dither dissolve, inline-icon end card | Their chat copy, characters/avatars, 3D emoji objects, hearts, pets, maps, finance screens |
| One-line word-by-word cards, grey → ink | Their headline lines and wording |
| Hairline device frame, soft shadows, no grain | Their phone UI and app icons |
| Strict text → UI → text alternation, three cuts at most | Their runtime and section order |
