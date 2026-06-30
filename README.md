# Ayu & Naufal — Digital Engagement Invitation

A self-contained, mobile-first engagement invitation built as a minimalist,
motion-driven, strictly monochrome one-page experience. Plain HTML, CSS, and
vanilla JavaScript. No framework, no build step. Deploys as a static site to
Netlify, Vercel, or GitHub Pages.

```
engagement-digital-invitation/
├── index.html      markup / page structure
├── styles.css      design system + responsive layout + motion
├── script.js       CONFIG object + all behavior (canvas, countdown, RSVP)
├── images/         drop your photos here
└── README.md
```

## What is inside

- Intro loader that resolves into the hero in under two seconds.
- Ambient canvas particle background in greyscale. It caps the frame rate,
  pauses when the tab is hidden, lowers density on small screens, and turns off
  entirely under reduced motion.
- Hero names with a blur to focus reveal.
- Live countdown with softly animating numbers.
- Scroll reveals on every section, subtle parallax, optional desktop cursor dot.
- Add to Calendar (.ics), Google Maps button, RSVP via Formspree or WhatsApp.

---

## 1. Edit the details (one place: `CONFIG`)

Open **`script.js`**. Everything lives in the `CONFIG` object at the very top.
Change a value, save, refresh.

| Field | Controls |
|---|---|
| `partnerA` / `partnerB` | The two big names on the hero |
| `startISO` / `endISO` | Event start/end, ISO 8601 **with timezone** (`+07:00` = WIB). Drives the countdown **and** the calendar file. |
| `dateLong` / `timeRange` | Human-readable date & time shown on the page |
| `venueName` / `venueAddress` | Venue details |
| `mapsLink` | "Open in Google Maps" button target |
| `hosts`, `dressCode`, `hashtag`, `rsvpBy` | Etiquette / footer text |
| `FORMSPREE_ENDPOINT` | RSVP endpoint (see §3) |
| `WHATSAPP_NUMBER` | RSVP fallback number, international format, digits only |
| `MUSIC_SRC` | Optional background-music file path |

If you change the countdown date, update `dateLong` and `timeRange` to match.
Those are display strings, while `startISO` / `endISO` drive the math.

---

## 2. Add your photos

Create an `images/` folder next to `index.html` and drop in:

| File | Used for | Suggested size |
|---|---|---|
| `images/hero.jpg` | Social-share preview (Open Graph) | 1200 × 630 |
| `images/story.jpg` | "Our Story" portrait frame | ~800 × 1000 (4:5 portrait) |

If a photo is missing, the frame shows a clean labeled placeholder instead, so
the page never looks broken while you gather images.

---

## 3. Set up the RSVP endpoint (Formspree)

- **With Formspree (recommended):** replies land in your inbox.
  1. Create a free form at <https://formspree.io>.
  2. Copy your endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
  3. Paste it into `CONFIG.FORMSPREE_ENDPOINT`.
- **Without Formspree (fallback):** leave `FORMSPREE_ENDPOINT` as `""`. On submit
  the form opens **WhatsApp** with a pre-filled RSVP to `WHATSAPP_NUMBER`; the
  guest just taps send.

Either way the guest sees a calm confirmation state after submitting.

---

## 4. Optional background music

Set `CONFIG.MUSIC_SRC` to an audio path (e.g. `"./audio/ambient.mp3"`). The
floating speaker button then plays and pauses it. It is **off by default and
never autoplays with sound**. Leave the field `""` to keep the button inert.

---

## 5. Deploy as a static site

No build step, just publish the folder.

- **Netlify:** drag the folder onto <https://app.netlify.com/drop>.
- **Vercel:** `npm i -g vercel`, then run `vercel` in this folder (preset: Other).
- **GitHub Pages:** push to a repo, then Settings, Pages, Source: `main` / root.

You can also just open `index.html` locally to preview.

---

## Customize-before-you-go-live checklist

- [ ] Names, date/time, venue, address in `CONFIG`
- [ ] `startISO` / `endISO` set to the real datetime (correct timezone)
- [ ] Real `mapsLink` (share link from Google Maps)
- [ ] `FORMSPREE_ENDPOINT` set **or** confirm the WhatsApp fallback number
- [ ] Add `images/hero.jpg` and `images/story.jpg`
- [ ] Update the social-share `<meta>` tags in `index.html` if you want custom text
- [ ] (Optional) set `MUSIC_SRC`
