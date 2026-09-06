# EditForge Canvas · scroll-craft brief

**Status:** Self-authored under explicit creative delegation.
The instruction was: install Nate Herk's scroll-craft skill and use it on EditForge.
No interview was run. Authored decisions are labeled. Nothing below is a fabricated quotation.

Brand evidence (from `tdveal74-cell/EditForge` SKILL.md and house UI, not invented):
- Navy `#0A1628`, amber `#D4A017`, cream paper.
- IBM Plex Sans / IBM Plex Mono.
- Doctrine: protect the image rather than restage it. Rubric before master.
- Five checks: grade, sound hierarchy, intentional ending, minimal titles, protect existing quality.
- Paid-run gate. Consent for clones. No silent auto-ship.

---

## Eight topics

1. **Vibe (authored):** quiet, editorial, studio, held, amber-sparse.
   References (mediums, not sites): a cutting-room at lunch, a contact sheet on a light table, the last still of a scene that does not fade.

2. **Scroll journey (authored):**
   First they see two rooms of the same studio, create and finish, held at 50/50.
   Then they feel the cost of restaging.
   Then a still leaves the graph and sits on the timeline. That is the one they remember.
   Then the rubric fills, quietly.
   Last thing: the finish room takes the frame, and the only action is Open Canvas.

3. **Energy curve (authored):** held and low at the open. A little colder in the cost beat. Peak is not loud; it is precise. The rubric is quieter than the peak. The close holds.

4. **Feeling, stage by stage (authored):**
   - Recognition: orientation. Two rooms, both real.
   - Tension: unease. Restaging named as the enemy.
   - Peak: click of recognition. The plate lands.
   - Substance: stern calm. The law is visible.
   - Close: resolve. The last frame is a decision.

   **Peak sentence a visitor would say:** "The still actually dropped onto the cut."
   Lives in act 3, The drop.

5. **One thing no site they have seen does (authored from the product):**
   A generated still physically travels from the create column onto a timeline track in the finish column. Not a wipe. Not a crossfade. A plate changing rooms.

6. **Range (authored):** premium-minimal, because that is the house. Not brutalist, not loud.

7. **World vs scenes (authored):** distinct scenes. Two rooms in tension, not one unbroken flight. Hard grounds, no drift interpolation.

8. **Assets already in hand:** seven photographic stills from this Canvas build (`/stills/*.jpg`), EditForge mark, navy/amber tokens. No KIE key. No new generation this pass.

---

## Feeling curve (before the score)

| Act | Emotion | What on screen causes it |
|---|---|---|
| 1 Recognition | Orientation, held | Two columns at 50/50. Create is navy and plates. Finish is paper and a track. Both headlines readable at once. |
| 2 Tension | Unease, colder | Hard cut of copy in the create room. The finish room holds a captioned still and does not sell. |
| 3 The drop (PEAK) | Recognition, precise | The still leaves its node and sits in a timeline slot. Largest span. Quiet before it. |
| 4 Law | Stern calm | Five rubric lines wipe into the finish room. No counters. |
| 5 Close | Resolve | Divider travels. Finish takes the frame. Open Canvas holds. |

**Peak:** act 3. "The still actually dropped onto the cut."
**Tell-someone sentence:** It's the site where a still falls out of the graph onto the cut.
**Authored silence:** half a beat of no copy between tension and the drop, so the plate has room to move. Not dead scroll: the plate is the change.

---

## What this is, who it is for, belief, next action

- **What:** EditForge Canvas, the Create department of the post-production Studio OS.
- **Who:** operators who already cut picture and are tired of generative tools restaging the frame.
- **Must believe:** generation is a plate. The cut still has to earn the master.
- **Next action, one label:** Open Canvas.

---

## Grammar decision

**Split stage.** Create vs finish for the whole page, resolved when the divider collapses.

Why the other seven lost:
- Filmic one-shot: default trap, marketing carry, not a tool argument.
- Chaptered editorial: title-page-with-no-media fights a media studio.
- Live surface: would be the Canvas route itself; the landing has to argue, then hand off.
- Continuous world: not a geography.
- Typographic poster: we have real plates. Using them is the point.
- Gallery: options are not the question. The question is generate vs finish.
- Rhythmic cutlist: house law is restraint. Pulse would lie.

**Nav:** no marketing bar. The divider is the chrome (CREATE / FINISH) plus a wordmark in the rule.
**Hero:** the split already in view, both headlines readable, layered plates, no full-bleed scrub.
**Close:** collapse. Finish takes the width. CTA is a plain control in the winning column. No magnet, no spotlight.

**Signature move:** The plate drop. A still translates from the create node to a timeline slot, driven from `--sc-p` in page CSS. Engine untouched.

**Fingerprint gate:** registry empty. First build. Nothing to clear.

---

## Score

| Beat | Device family | Span | Why |
|---|---|---|---|
| 1 Recognition | `pin` + `parallax` | 2.2vh | Split established. Planes move independently in each room. |
| 2 Tension | `flow` + `in` | document | Hard cut. Copy, not a pin. Adjacent to pin so families do not repeat. |
| 3 The drop (peak) | `pin` + custom `--sc-p` | 3.4vh | Largest span. Signature lives here. Quiet before it. |
| 4 Law | `reveal` | 1.8vh (flow with wipe) | State change: the law appears. Not another pin. |
| 5 Close | `pin` | 1.4vh | Collapse and hold. Last cues are one-value. Footer inside the stage. |

Families used: pin, parallax, flow, reveal. Four. No family twice in a row.
Scrub acts: zero (split stage bans more than one, and the stills are plates not clips).
No drift. Grounds painted per column.
No magnet, no spotlight.
Total ~8.8vh plus one flow. Outside the 6–7 act / 13.6vh band.

Aesthetic family: premium-minimal, earned by the house, not by taste default.
