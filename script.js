/* =================================================================
   Arya & Senja — Engagement Invitation
   ─────────────────────────────────────────────────────────────────
   EVERYTHING you need to customize lives in the CONFIG object below.
   Edit it, save, and refresh. No build step required.
   ================================================================= */

const CONFIG = {
  /* ---------- The couple ---------- */
  partnerA: "Arya",
  partnerB: "Senja",
  signOff: "Arya & Senja",                       // footer signature
  eventType: "Engagement Celebration · Tunangan",

  /* ---------- The invitation copy ---------- */
  announcement:
    "Together with their families, we joyfully invite you to celebrate our engagement",
  storyOne:
    "What began as a chance meeting over shared cups of coffee slowly grew into a friendship, and then into something neither of us could have imagined.",
  storyTwo:
    "Three years, countless adventures, and a thousand little ordinary moments later, we're ready to begin our forever — and we'd love for you to be there as it starts.",
  closingNote:
    "Your presence is the only gift we need. We can't wait to share this moment with you.",

  /* ---------- When & where ---------- */
  // Event start/end as ISO with timezone offset (WIB = UTC+7).
  startISO: "2026-08-22T16:00:00+07:00",
  endISO:   "2026-08-22T20:00:00+07:00",
  dateLong: "Saturday, 22 August 2026",
  timeRange: "4:00 PM – 8:00 PM (WIB)",

  venueName: "The Glasshouse at Sentul",
  venueAddress:
    "Jl. Babakan Madang No. 12, Sentul City, Bogor, West Java 16810",
  // Replace with a real Google Maps share/place link before going live.
  mapsLink: "https://maps.google.com/?q=The+Glasshouse+at+Sentul",

  /* ---------- People & etiquette ---------- */
  hosts: "Mr. & Mrs. Budi Pratama  •  Mr. & Mrs. Hadi Maharani",
  dressCode: "Garden Formal — soft dusty rose, sage, and cream tones encouraged",
  hashtag: "#AryaMeetsSenja",
  rsvpBy: "8 August 2026",

  /* ---------- RSVP delivery ---------- */
  // 1) Preferred: paste your Formspree form endpoint here, e.g.
  //    "https://formspree.io/f/abcdwxyz". Leave "" to fall back to WhatsApp.
  FORMSPREE_ENDPOINT: "",
  // 2) Fallback: WhatsApp number in international format, digits only.
  WHATSAPP_NUMBER: "6281234567890",

  /* ---------- Optional background music ---------- */
  // Drop an audio file path here (e.g. "./audio/theme.mp3"). Leave ""
  // to hide nothing — the button stays but does nothing until set.
  MUSIC_SRC: "",

  /* ---------- Calendar event title ---------- */
  calendarTitle: "Arya & Senja — Engagement Celebration",
};

/* =================================================================
   Helpers
   ================================================================= */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =================================================================
   1. Inject CONFIG text into the page
   ================================================================= */
function hydrateContent() {
  // Map each [data-config="key"] element to CONFIG[key]
  $$("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (CONFIG[key] != null) el.textContent = CONFIG[key];
  });

  // Document title + hero name fallbacks
  document.title = `${CONFIG.partnerA} & ${CONFIG.partnerB} — Engagement`;

  // Maps link
  const maps = $("#mapsLink");
  if (maps) maps.href = CONFIG.mapsLink;

  // Audio source (only if provided)
  const audio = $("#bgAudio");
  if (audio && CONFIG.MUSIC_SRC) audio.src = CONFIG.MUSIC_SRC;
}

/* =================================================================
   2. Live countdown
   ================================================================= */
function initCountdown() {
  const target = new Date(CONFIG.startISO).getTime();
  const els = {
    days:  $("#cd-days"),
    hours: $("#cd-hours"),
    mins:  $("#cd-mins"),
    secs:  $("#cd-secs"),
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach((el) => (el.textContent = "00"));
      const wrap = $("#countdownTimer");
      if (wrap && !wrap.dataset.done) {
        wrap.dataset.done = "1";
        wrap.insertAdjacentHTML(
          "afterend",
          '<p class="section__subtitle" style="margin-top:1.4rem">The day is here — welcome!</p>'
        );
      }
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent  = pad(d);
    els.hours.textContent = pad(h);
    els.mins.textContent  = pad(m);
    els.secs.textContent  = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* =================================================================
   3. Scroll-reveal (IntersectionObserver)
   ================================================================= */
function initReveal() {
  const items = $$(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* =================================================================
   4. Scroll progress bar + floating RSVP button
   ================================================================= */
function initScrollUI() {
  const bar = $("#progressBar");
  const fab = $("#rsvpFab");
  const rsvpSection = $("#rsvp");

  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.width = `${Math.min(scrolled * 100, 100)}%`;

    // Show floating RSVP after hero, hide once the RSVP section is in view
    if (fab && rsvpSection) {
      const rsvpTop = rsvpSection.getBoundingClientRect().top;
      const showAfter = window.innerHeight * 0.9;
      const past = h.scrollTop > showAfter;
      const atForm = rsvpTop < window.innerHeight * 0.6;
      fab.classList.toggle("is-visible", past && !atForm);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (fab) {
    fab.addEventListener("click", () => {
      $("#rsvp").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
}

/* =================================================================
   5. Add to Calendar (.ics download)
   ================================================================= */
function initCalendar() {
  const btn = $("#addToCalendar");
  if (!btn) return;

  const toICSDate = (iso) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  btn.addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AryaSenja//Engagement//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@arya-senja`,
      `DTSTAMP:${toICSDate(new Date().toISOString())}`,
      `DTSTART:${toICSDate(CONFIG.startISO)}`,
      `DTEND:${toICSDate(CONFIG.endISO)}`,
      `SUMMARY:${CONFIG.calendarTitle}`,
      `DESCRIPTION:${CONFIG.announcement}`,
      `LOCATION:${CONFIG.venueName}, ${CONFIG.venueAddress}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arya-senja-engagement.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

/* =================================================================
   6. RSVP form — Formspree POST, else WhatsApp deep link
   ================================================================= */
function initRSVP() {
  const form = $("#rsvpForm");
  const hint = $("#rsvpHint");
  const success = $("#rsvpSuccess");
  const successMsg = $("#rsvpSuccessMsg");
  const submitBtn = $("#rsvpSubmit");
  if (!form) return;

  function showSuccess(viaWhatsApp) {
    form.hidden = true;
    success.hidden = false;
    if (viaWhatsApp) {
      successMsg.textContent =
        "We've opened WhatsApp with your reply — just hit send to confirm. Thank you!";
    }
    success.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  }

  function buildWhatsAppURL(data) {
    const lines = [
      `RSVP — ${CONFIG.calendarTitle}`,
      `Name: ${data.name}`,
      `Attending: ${data.attending}`,
      `Guests: ${data.guests}`,
      data.message ? `Message: ${data.message}` : "",
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hint.classList.remove("is-error");
    hint.textContent = "";

    const data = {
      name: $("#guestName").value.trim(),
      guests: $("#guestCount").value,
      attending: form.querySelector('input[name="attending"]:checked').value,
      message: $("#guestMessage").value.trim(),
    };

    if (!data.name) {
      hint.textContent = "Please let us know your name.";
      hint.classList.add("is-error");
      $("#guestName").focus();
      return;
    }

    // --- Path A: Formspree endpoint configured ---
    if (CONFIG.FORMSPREE_ENDPOINT) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      try {
        const res = await fetch(CONFIG.FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          showSuccess(false);
        } else {
          throw new Error("Bad response");
        }
      } catch (err) {
        hint.textContent = "Something went wrong — opening WhatsApp instead…";
        hint.classList.add("is-error");
        window.open(buildWhatsAppURL(data), "_blank", "noopener");
        setTimeout(() => showSuccess(true), 600);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
      }
      return;
    }

    // --- Path B: WhatsApp fallback ---
    window.open(buildWhatsAppURL(data), "_blank", "noopener");
    showSuccess(true);
  });
}

/* =================================================================
   7. Background music toggle (default OFF, never autoplays sound)
   ================================================================= */
function initMusic() {
  const btn = $("#musicToggle");
  const audio = $("#bgAudio");
  if (!btn || !audio) return;

  btn.addEventListener("click", async () => {
    if (!CONFIG.MUSIC_SRC) {
      // No track configured yet — give a gentle nudge in the console.
      console.info("Set CONFIG.MUSIC_SRC to enable background music.");
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Pause background music");
      } catch (err) {
        console.warn("Audio playback blocked:", err);
      }
    } else {
      audio.pause();
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play background music");
    }
  });
}

/* =================================================================
   Boot
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  hydrateContent();
  initCountdown();
  initReveal();
  initScrollUI();
  initCalendar();
  initRSVP();
  initMusic();
});
