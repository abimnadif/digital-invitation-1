# Arya & Senja — Digital Engagement Invitation

A self-contained, mobile-first engagement invitation. Plain HTML + CSS + vanilla
JavaScript — no framework, no build step. Deploys as a static site to Netlify,
Vercel, or GitHub Pages.

```
engagement-digital-invitation/
├── index.html      ← markup / page structure
├── styles.css      ← design system + responsive layout
├── script.js       ← CONFIG object + all behavior
├── images/         ← drop your photos here (see below)
└── README.md
```

---

## 1. Edit the details (one place: `CONFIG`)

Open **`script.js`**. Everything — names, dates, venue, copy, endpoints — lives in
the `CONFIG` object at the very top. Change a value, save, refresh the page.

Key fields:

| Field | What it controls |
|---|---|
| `partnerA` / `partnerB` | The two big names on the hero |
| `startISO` / `endISO` | Event start/end (ISO 8601 **with timezone**, e.g. `+07:00` for WIB). Drives the countdown **and** the calendar file. |
| `dateLong` / `timeRange` | Human-readable date & time shown on the page |
| `venueName` / `venueAddress` | Venue card text |
| `mapsLink` | "Open in Google Maps" button target |
| `hosts`, `dressCode`, `hashtag`, `rsvpBy` | Etiquette / footer details |
| `FORMSPREE_ENDPOINT` | RSVP form endpoint (see §3) |
| `WHATSAPP_NUMBER` | RSVP fallback number, international format, digits only |
| `MUSIC_SRC` | Optional background-music file path |

> **Tip:** If you change the countdown date, update `dateLong` and `timeRange` to
> match — those are display strings, while `startISO`/`endISO` drive the math.

---

## 2. Add your photos

Create an `images/` folder next to `index.html` and drop in:

| File | Used for | Suggested size |
|---|---|---|
| `images/hero.jpg` | Social-share preview (Open Graph) | 1200 × 630 |
| `images/story.jpg` | "Our Story" portrait frame | ~800 × 1000 (4:5 portrait) |

If a photo is missing, the frame gracefully shows a labeled placeholder instead —
so the page never looks broken while you're still gathering images.

To add more photo frames, copy the `.photo-frame` block in `index.html`.

---

## 3. Set up the RSVP endpoint (Formspree)

The form works two ways:

- **With Formspree (recommended):** replies land in your inbox.
  1. Create a free form at <https://formspree.io>.
  2. Copy your endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
  3. Paste it into `CONFIG.FORMSPREE_ENDPOINT` in `script.js`.
- **Without Formspree (fallback):** leave `FORMSPREE_ENDPOINT` as `""`. On submit,
  the form opens **WhatsApp** with a pre-filled RSVP message to `WHATSAPP_NUMBER`;
  the guest just taps send.

Either way the guest sees a friendly confirmation card after submitting.

---

## 4. Optional background music

Set `CONFIG.MUSIC_SRC` to an audio path (e.g. `"./audio/theme.mp3"`). The floating
speaker button then plays/pauses it. It is **off by default and never autoplays
with sound** — browsers block that anyway, and it's the polite default. Leave the
field `""` to keep the button inert.

---

## 5. Deploy as a static site

No build step — just publish the folder.

**Netlify (drag & drop):** go to <https://app.netlify.com/drop> and drop the
project folder. Done.

**Vercel:** `npm i -g vercel` then run `vercel` in this folder (framework preset:
"Other").

**GitHub Pages:**
1. Push the folder to a GitHub repo.
2. Settings → Pages → Source: `main` branch, `/root`.
3. Your invite is live at `https://<user>.github.io/<repo>/`.

Because it's all static files, you can also just open `index.html` locally to
preview.

---

## Customize-before-you-go-live checklist

- [ ] Names, date/time, venue, address in `CONFIG`
- [ ] `startISO` / `endISO` set to the real datetime (correct timezone)
- [ ] Real `mapsLink` (share link from Google Maps)
- [ ] `FORMSPREE_ENDPOINT` set **or** confirm WhatsApp fallback number
- [ ] Add `images/hero.jpg` and `images/story.jpg`
- [ ] Update the social-share `<meta>` tags in `index.html` if you want custom text
- [ ] (Optional) set `MUSIC_SRC`
