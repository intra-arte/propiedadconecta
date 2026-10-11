# Shot list: Propiedad Conecta launch film (15 s, 16:9)

**Style:** the grammar in [`style_guide.md`](style_guide.md) (white world between two gradient bookends, one-line word-by-word cards, UI first and frame later, expo-out easing, no grain).
**Message:** the existing campaign concept, *«Deja de perseguir anuncios. Publica lo que buscas.»*, closing on the CTA *«Publica gratis tu búsqueda»* (see `anuncios/reel-publica-tu-busqueda/01-concepto-y-voz-en-off.md`).
**Spec:** 1920 × 1080, 60 fps (the reference's frame rate; needed for smooth blur/word reveals), 15.00 s, Spanish (Ecuador).

---

## Assets (real, from the site; nothing redrawn)

| Asset | File | Notes |
|---|---|---|
| Horizontal logo | `anuncios/reel-publica-tu-busqueda/marca/logo-horizontal-transparente.png` (1208 × 431) | Only on white/ivory, uniform scale, ≤ 100 %, no effects, parts never animated (logo rules in `04-ia-vs-edicion-y-logo.md`). |
| Isotipo | `…/marca/isotipo-transparente.png` (465 × 431) | Inline icon on the CTA card. |
| Form: "¿Qué estás buscando?" filled | `video/assets/que-lleno.png` | Comprar una propiedad · Departamento |
| Form: Ubicación empty → filled | `video/assets/ubicacion-vacio.png` → `ubicacion-lleno.png` | Pichincha · Quito · Cumbayá |
| Form: Presupuesto empty → filled | `video/assets/presupuesto-vacio.png` → `presupuesto-lleno.png` | 120000 – 160000 USD |
| Form: Características filled | inside `video/assets/page.png` | Amoblado ✓ · Seguridad ✓ |
| "Publicar solicitud" button | `video/assets/publicar.png` | |
| Page header with logo | `video/assets/header.png` | Real site header, used inside the window frame. |
| Font | `…/animatic/fuentes/Outfit-Variable.ttf` | 400/500 (600 for the list stack). |

> **Source captures:** 1440 × 900 screenshots of the form in `anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440/`, cropped by `video/prep.py` without redrawing (Lanczos to 3 px per world unit, so the browser scales down). The red development badge sits outside the page column and never appears. A capture of the live site at 2× would be sharper still; re-run `prep.py` if the layout is unchanged.

---

## Timeline

| # | In → Out (s) | Dur. | Picture | On-screen text (ES · EN gloss) | Camera | Transition in / out | Text in / out |
|---|---|---|---|---|---|---|---|
| **1** | 0.00 → 2.20 | 2.20 | **Gradient opener.** Full-frame vertical gradient Bosque `#142A22` (bottom) → Conecta `#4DA22D` → Brote `#92CE58` → dawn light `#F6F2E9` (top), with a soft curved horizon of lighter green across the lower third. Two **matte, flat-shaded discs** (one Bosque, one Brote) rest just above the horizon, spaced like the two heads in the isotipo. They are not glass, have no reflections and are not lit like spheres. Over the shot the gradient brightens and the horizon sinks out of frame. | *«Deja de perseguir anuncios.»* · Stop chasing listings. Typed in Marfil `#FAF9F5`, Outfit 400, ~56 px, centred at y = 50 %. | **Slow crane up**, ease-in-out over the full 2.2 s (horizon moves ~35 % of frame height down). | In: from black, 6 frames. Out: **T1 bloom to white**, 2.05 → 2.30 s. | In: **E1 typewriter**, ~55 ms/char (27 chars ≈ 1.5 s, slightly faster than the reference's 70 ms to fit 15 s), caret blinks, caret off at 1.80 s. Out: dissolves inside the bloom. |
| **2** | 2.20 → 4.00 | 1.80 | **White card.** `#FFFFFF`, nothing but the line. | *«Publica lo que buscas.»* · Post what you're looking for. Ink `#142A22`, Outfit 500, ~90 px, tracking −0.02 em, laid out at its final centred position. | Locked off. | In: from bloom. Out: text-only exit, the canvas stays. | In: **E2 word-by-word**, grey `#B9C2BE` → ink, 0.15 s apart, 2.35 → 3.05 s; hold 3.05 → 3.65 s. Out: **X2 dither dissolve** on «Publica lo que» (3.65 → 3.95 s), then **X3 blur-out** on «buscas.» (3.80 → 4.00 s). |
| **3a** | 4.00 → 5.90 | 1.90 | **UI first, no frame.** Real form cards float on white, centred, ~1000 px wide, with a soft shadow (blur 70 px, 10 %). In order: `que-lleno` arrives; `ubicacion-vacio` arrives below and crossfades to `ubicacion-lleno` (0.25 s); `presupuesto-vacio` arrives and crossfades to `presupuesto-lleno`. Earlier cards scroll up to make room. | — (the screenshot text is the text) | Very slow push-in 1.00 → 1.04. | In: from white. Each card: **T6 blur-to-sharp** (12 px → 0, 0.35 s) + 24 px rise, expo-out, 0.45 s apart. | — |
| **3b** | 5.90 → 7.60 | 1.70 | **Frame draws in.** A hairline browser-window outline (`#E8E8E8`, 2 px, radius 28 px, white body, no browser chrome, no URL bar) draws around the stack, with `cabecera.png` (real site header + logo) settling into its top edge. The camera pulls back to show the whole window. The content scrolls once to reveal `caracteristicas-lleno` with its Amoblado / Seguridad checkboxes. | — | **Pull-back** 1.04 → 0.86, ease-in-out, 5.90 → 6.90 s; then one **in-window scroll**, 0.6 s, expo-out. | In: **T3 UI first, frame later**. Out: continuous into 4. | — |
| **4** | 7.60 → 9.40 | 1.80 | **List stack behind the window.** The window (now showing the Características card) truck-slides to centre and holds. Behind it, a vertical list of the form's real feature names scrolls upward. The window occludes the middle of each word. | Rolling words: *Amoblado · Ascensor · Piscina · Seguridad* (the four real checkbox labels). Active word Outfit 600, ~130 px, ink, above the window; the others ~110 px in `#C9D1CD` behind it. | Window locked; the list scrolls in steps on the music's beat (8.00 / 8.40 / 8.80 s, 0.40 s per word, expo-out). | In: **T7 text behind device**; list fades up at 7.60 s. Out: list blurs out; window slides down out of frame, 9.20 → 9.40 s. | In: each new active word goes grey → ink as it reaches the top slot. Out: **X3 blur-out**. |
| **5** | 9.40 → 11.60 | 2.20 | **White card.** The `publicar.png` button (real «Publicar solicitud») sits small, ~520 px wide, centred at y = 68 %. Above it, the line. | *«Si un agente tiene algo para ti, puede contactarte.»* · If an agent has something for you, they can contact you. Ink, Outfit 500, ~64 px (smaller than shot 2 so it fits on one line), centred at y = 44 %. | Locked off. | In: button **T6 blur-to-sharp**, 9.40 → 9.75 s. Out: **X1 fade to grey**, then gone. | In: **E2 word-by-word**, 10 words at 0.11 s, 9.55 → 10.65 s; hold to 11.30 s. Out: **X1**, 11.30 → 11.60 s (line and button together). |
| **6** | 11.60 → 12.40 | 0.80 | **Gradient outro.** The opener's green gradient returns at once and immediately drains to Marfil `#FAF9F5` (not grey: the logo is only allowed on white/ivory). The two discs drift in from the edges and converge on the exact positions the isotipo's two circles will take in shot 7. | — | Slow push-in 1.00 → 1.06. | In: **hard cut** (the film's only one). Out: **T9 desaturate into logo**; at 12.30 s the discs **crossfade (6 frames)** into the real isotipo file, which never animates itself. | — |
| **7a** | 12.40 → 13.70 | 1.30 | **Inline-icon CTA card** on Marfil. The isotipo (~120 px tall, uniform scale) sits inside the line, between the words. | *«Publica gratis [isotipo] tu búsqueda»* · Post your search for free. Ink, Outfit 500, ~84 px; line set at its final width from the start. | Locked off. | In: from shot 6, the isotipo is already in place. | In: **E2**, words grey → ink, 0.15 s apart, 12.45 → 12.95 s; «gratis» lands in Brote `#92CE58` (the film's single accent), then settles to ink by 13.30 s. Out: **X5 drop-out**, words either side fade, 13.45 → 13.70 s. |
| **7b** | 13.70 → 15.00 | 1.30 | **End card.** The isotipo crossfades (6 frames, positions matched) into `logo-horizontal-transparente.png` at ~800 px wide (66 % of the file). Below it, the domain. | *propiedadconecta.com* · Ink, Outfit 400, ~40 px, 56 px under the logo. | Locked off. | In: logo fade + uniform scale **96 → 100 % in 12 frames** (the only logo animation the brand rules allow). Out: hold to 15.00 s; no fade-out (looping placements cut cleanly). | In: domain **E2**, grey → ink, 14.00 → 14.30 s. Hold 0.7 s. |

**Totals:** 2 gradient shots (3.0 s · 20 %), 3 text cards (5.3 s), 2 UI beats (5.4 s), 1 end card (1.3 s). There is **one hard cut** (shot 6); everything else is continuous on the white page, as in the reference.

---

## What is borrowed and what is ours

| From the reference (grammar only) | Ours |
|---|---|
| Gradient bookends around a white world; bloom to white | Brand greens and ivory; flat discs taken from our own isotipo's two heads, not the reference's glass orb or set |
| Typewriter opener, word-by-word grey → ink cards, dither and blur exits | Our Spanish copy from the approved campaign concept |
| UI first, frame later; blur-to-sharp cards; text behind device | Real Propiedad Conecta form screenshots in a hairline *browser window* (the product is a website, so no phone) |
| Inline-icon end card → name → domain | Isotipo inline, real horizontal logo file, `propiedadconecta.com` |
| Not used | No people, avatars, emoji, hearts, 3D objects, chat bubbles, phone, or any of the reference's lines or logo |

## Claim check (against `07-verificacion-de-producto.md`)

| Line or picture | Status |
|---|---|
| «Deja de perseguir anuncios.» / «Publica lo que buscas.» | ✅ Approved concept; an invitation, not a result. |
| Form cards and the feature words | ✅ Real captures and real checkbox labels; test data only. |
| «Si un agente tiene algo para ti, puede contactarte.» | ✅ Approved wording: it describes a possibility and claims neither that agents exist nor how many. ⚠️ Still depends on open question 1 (are agents active in Quito today?). |
| «Publica gratis…» | ✅ The page says «Es gratis publicar.» ⚠️ Open question 6 (free with no limit or later charges?) should be answered before paid media. |
| Not shown | What happens after «Publicar solicitud» (unverified), and the 1 / 3 / 5 agent limit (effect unverified). |

## Soundtrack

Original, synthesised in code (`video/music/compose.py`): no samples or licensed audio. 150 BPM played half-time (feels like 75), D major, −14 LUFS, peak about −4 dBFS.

| t (s) | Picture | Music |
|---|---|---|
| 0.00–2.40 | Gradient opener, typing | Dark filtered Bm9 pad, sub drone, one soft key click per character; reversed swell peaking at the bloom (2.30) |
| 2.40 | White world | Downbeat: pad opens to Dmaj9, plucked arpeggio starts |
| 3.65–3.95 | Dither dissolve | Sparse high grains |
| 4.00 | Cards | Half-time groove enters (kick, clap on 3, hats); a tick per card and per fill |
| 5.90 / 6.95 | Frame draws / scroll | Short riser / swish |
| 7.60–8.80 | Feature words | One bell per word, on the beat, rising |
| 9.15 / 9.40 | Window drops / button | Down-whoosh / tick |
| 10.80–11.60 | Agent line | Riser and 16th-hat fill into the cut |
| 11.60 | Hard cut | Everything stops dead; low boom and a dark Gmaj9 under the discs |
| 12.40–14.00 | CTA | Groove back, Asus2 → A; a bell when «gratis» lands (12.60) |
| 14.00–15.00 | Logo | Resolves to Dmaj9 with an arpeggiated bell chord; fades from 14.55 |

No voice-over in this cut.
