/* =================================================================
   Ayu & Naufal — Engagement Invitation
   ─────────────────────────────────────────────────────────────────
   EVERYTHING you customize lives in the CONFIG object below.
   Edit it, save, refresh. No build step.
   ================================================================= */

const CONFIG = {
  /* ---------- The couple ---------- */
  partnerA: "Ayu",
  partnerB: "Naufal",
  signOff: "Ayu and Naufal",
  eventType: "Engagement Celebration",

  /* ---------- Copy (note: no em dashes anywhere) ---------- */
  announcement:
    "Together with their families, Ayu and Naufal invite you to celebrate the beginning of their forever.",
  storyOne:
    "It started quietly, the way the best things often do, with a conversation that simply did not want to end.",
  storyTwo:
    "Years later, through ordinary mornings and small adventures, that same conversation is still going. Now we are ready to begin the next chapter, and we would love for you to be there as it opens.",
  closingNote:
    "Your presence means everything to us. We would love to share this quiet, joyful moment with the people we hold closest.",

  /* ---------- When & where ---------- */
  // ISO with timezone offset (WIB = UTC+7). Drives countdown AND calendar.
  startISO: "2026-08-22T16:00:00+07:00",
  endISO:   "2026-08-22T20:00:00+07:00",
  dateLong: "Saturday, 22 August 2026",
  timeRange: "4:00 PM to 8:00 PM (WIB)",

  venueName: "The Glasshouse at Sentul",
  venueAddress: "Jl. Babakan Madang No. 12, Sentul City, Bogor, West Java 16810",
  // Replace with a real Google Maps place/share link before going live.
  mapsLink: "https://maps.google.com/?q=The+Glasshouse+at+Sentul",

  /* ---------- People & etiquette ---------- */
  hosts: "Mr. and Mrs. Pratama  and  Mr. and Mrs. Maharani",
  dressCode: "Minimal Chic. Soft neutrals, white, grey, and monochrome tones encouraged.",
  hashtag: "#NAUnikahinAYU",
  rsvpBy: "8 August 2026",

  /* ---------- RSVP delivery ---------- */
  // Paste your Formspree endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  // Leave "" to fall back to a pre-filled WhatsApp message.
  FORMSPREE_ENDPOINT: "",
  WHATSAPP_NUMBER: "6281234567890", // international format, digits only

  /* ---------- Optional background music ---------- */
  MUSIC_SRC: "", // e.g. "./audio/ambient.mp3". Leave "" to keep the button inert.

  /* ---------- Calendar title ---------- */
  calendarTitle: "Ayu and Naufal, Engagement Celebration",
};

/* =================================================================
   Helpers
   ================================================================= */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const smooth = reduceMotion ? "auto" : "smooth";

/* =================================================================
   Inject CONFIG text into the page
   ================================================================= */
function hydrateContent() {
  $$("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (CONFIG[key] != null) el.textContent = CONFIG[key];
  });
  document.title = `${CONFIG.partnerA} & ${CONFIG.partnerB} — Engagement`;
  const maps = $("#mapsLink");
  if (maps) maps.href = CONFIG.mapsLink;
  const audio = $("#bgAudio");
  if (audio && CONFIG.MUSIC_SRC) audio.src = CONFIG.MUSIC_SRC;
}

/* =================================================================
   0. Intro loader (resolves into the hero, under ~2s)
   ================================================================= */
function initLoader() {
  const loader = $("#loader");
  const bar = $("#loaderBar");
  if (!loader) return;

  const finish = () => {
    loader.classList.add("is-done");
    document.body.style.overflow = "";
    window.setTimeout(() => loader.remove(), 900);
  };

  if (reduceMotion) {
    if (bar) bar.style.width = "100%";
    window.setTimeout(finish, 350);
    return;
  }

  document.body.style.overflow = "hidden"; // lock scroll during the brief intro
  let progress = 0;
  const tick = () => {
    progress += Math.random() * 16 + 6;
    if (bar) bar.style.width = `${Math.min(progress, 100)}%`;
    if (progress < 100) {
      window.setTimeout(tick, 130);
    } else {
      window.setTimeout(finish, 320);
    }
  };
  window.setTimeout(tick, 480); // let the names fade in first
}

/* =================================================================
   Ambient motion background: drifting fine particles (canvas)
   Performance: rAF, capped FPS, paused when hidden, fewer dots on
   mobile, disabled under prefers-reduced-motion.
   ================================================================= */
function initBackground() {
  const canvas = $("#bgCanvas");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");

  let w, h, dpr, particles, running = true;
  const FPS = 30, frameGap = 1000 / FPS;
  let last = 0;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Density scales with area, lighter on small screens.
    const base = w < 640 ? 0.00007 : 0.00011;
    const count = Math.round(w * h * base);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      a: Math.random() * 0.35 + 0.08,
    }));
  }

  function draw(t) {
    if (!running) return;
    requestAnimationFrame(draw);
    if (t - last < frameGap) return;
    last = t;

    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5) p.x = w + 5; else if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5; else if (p.y > h + 5) p.y = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(154,154,154,${p.a})`; // --mid-grey, soft
      ctx.fill();
    }
  }

  size();
  requestAnimationFrame((t) => { last = t; draw(t); });

  // Verification/debug hook: allows pausing the loop (e.g. for screenshots).
  window.__bgStop = () => { running = false; };
  window.__bgStart = () => { if (!running) { running = true; requestAnimationFrame((t) => { last = t; draw(t); }); } };

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(size, 200);
  });

  // Pause when the tab is hidden to save battery / CPU.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      requestAnimationFrame((t) => { last = t; draw(t); });
    }
  });
}

/* =================================================================
   2. Live countdown with soft number animation
   ================================================================= */
function initCountdown() {
  const target = new Date(CONFIG.startISO).getTime();
  const els = { days: $("#cd-days"), hours: $("#cd-hours"), mins: $("#cd-mins"), secs: $("#cd-secs") };
  const pad = (n) => String(n).padStart(2, "0");
  const prev = {};

  function set(el, val) {
    if (!el) return;
    if (prev[el.id] === val) return;
    prev[el.id] = val;
    el.textContent = val;
    if (!reduceMotion) {
      el.classList.remove("is-tick");
      void el.offsetWidth; // restart animation
      el.classList.add("is-tick");
    }
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach((el) => el && (el.textContent = "00"));
      const wrap = $("#countdownTimer");
      if (wrap && !wrap.dataset.done) {
        wrap.dataset.done = "1";
        wrap.insertAdjacentHTML("afterend", '<p class="hero__announce" style="margin-top:1.6rem">The day has arrived. Welcome.</p>');
      }
      return;
    }
    set(els.days,  pad(Math.floor(diff / 86400000)));
    set(els.hours, pad(Math.floor((diff % 86400000) / 3600000)));
    set(els.mins,  pad(Math.floor((diff % 3600000) / 60000)));
    set(els.secs,  pad(Math.floor((diff % 60000) / 1000)));
  }
  tick();
  setInterval(tick, 1000);
}

/* =================================================================
   3. Scroll-reveal (IntersectionObserver)
   ================================================================= */
function initReveal() {
  const items = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => io.observe(el));
}

/* =================================================================
   Subtle parallax on [data-parallax] elements
   ================================================================= */
function initParallax() {
  const items = $$("[data-parallax]");
  if (reduceMotion || !items.length) return;
  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    for (const el of items) {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
      el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* =================================================================
   Scroll progress bar + floating RSVP button
   ================================================================= */
function initScrollUI() {
  const bar = $("#progressBar");
  const fab = $("#rsvpFab");
  const rsvpSection = $("#rsvp");

  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.width = `${Math.min(scrolled * 100, 100)}%`;
    if (fab && rsvpSection) {
      const rsvpTop = rsvpSection.getBoundingClientRect().top;
      const past = h.scrollTop > window.innerHeight * 0.9;
      const atForm = rsvpTop < window.innerHeight * 0.6;
      fab.classList.toggle("is-visible", past && !atForm);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (fab) fab.addEventListener("click", () => $("#rsvp").scrollIntoView({ behavior: smooth }));
}

/* =================================================================
   4. Add to Calendar (.ics download)
   ================================================================= */
function initCalendar() {
  const btn = $("#addToCalendar");
  if (!btn) return;
  const toICS = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  btn.addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AyuNaufal//Engagement//EN",
      "BEGIN:VEVENT", `UID:${Date.now()}@ayu-naufal`,
      `DTSTAMP:${toICS(new Date().toISOString())}`,
      `DTSTART:${toICS(CONFIG.startISO)}`, `DTEND:${toICS(CONFIG.endISO)}`,
      `SUMMARY:${CONFIG.calendarTitle}`, `DESCRIPTION:${CONFIG.announcement}`,
      `LOCATION:${CONFIG.venueName}, ${CONFIG.venueAddress}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "ayu-naufal-engagement.ics";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
}

/* =================================================================
   6. RSVP — Formspree POST, else WhatsApp deep link
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
    if (viaWhatsApp) successMsg.textContent = "We have opened WhatsApp with your reply. Just tap send to confirm. Thank you.";
    success.scrollIntoView({ behavior: smooth, block: "center" });
  }

  function buildWhatsAppURL(d) {
    const lines = [
      `RSVP, ${CONFIG.calendarTitle}`,
      `Name: ${d.name}`, `Attending: ${d.attending}`, `Guests: ${d.guests}`,
      d.message ? `Note: ${d.message}` : "",
    ].filter(Boolean);
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hint.classList.remove("is-error");
    hint.textContent = "";

    const d = {
      name: $("#guestName").value.trim(),
      guests: $("#guestCount").value,
      attending: form.querySelector('input[name="attending"]:checked').value,
      message: $("#guestMessage").value.trim(),
    };
    if (!d.name) {
      hint.textContent = "Please let us know your name.";
      hint.classList.add("is-error");
      $("#guestName").focus();
      return;
    }

    if (CONFIG.FORMSPREE_ENDPOINT) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending";
      try {
        const res = await fetch(CONFIG.FORMSPREE_ENDPOINT, {
          method: "POST", headers: { Accept: "application/json" }, body: new FormData(form),
        });
        if (!res.ok) throw new Error("bad response");
        showSuccess(false);
      } catch (err) {
        hint.textContent = "Connection issue. Opening WhatsApp instead.";
        hint.classList.add("is-error");
        window.open(buildWhatsAppURL(d), "_blank", "noopener");
        setTimeout(() => showSuccess(true), 600);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
      }
      return;
    }

    window.open(buildWhatsAppURL(d), "_blank", "noopener");
    showSuccess(true);
  });
}

/* =================================================================
   Background music toggle (default OFF, never autoplays sound)
   ================================================================= */
function initMusic() {
  const btn = $("#musicToggle");
  const audio = $("#bgAudio");
  if (!btn || !audio) return;
  btn.addEventListener("click", async () => {
    if (!CONFIG.MUSIC_SRC) { console.info("Set CONFIG.MUSIC_SRC to enable background music."); return; }
    if (audio.paused) {
      try {
        await audio.play();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Pause background music");
      } catch (err) { console.warn("Audio playback blocked:", err); }
    } else {
      audio.pause();
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play background music");
    }
  });
}

/* =================================================================
   Custom cursor dot (desktop pointer devices only)
   ================================================================= */
function initCursor() {
  const dot = $("#cursorDot");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!dot || !finePointer || reduceMotion) return;

  document.body.classList.add("has-cursor");
  let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, run = true;
  window.__cursorStop = () => { run = false; };

  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function follow() {
    if (!run) return;
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  // Grow over interactive elements.
  $$("a, button, input, select, textarea, label").forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => dot.classList.remove("is-hover"));
  });
}

/* =================================================================
   Boot
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  hydrateContent();
  initLoader();
  initBackground();
  initCountdown();
  initReveal();
  initParallax();
  initScrollUI();
  initCalendar();
  initRSVP();
  initMusic();
  initCursor();
});
