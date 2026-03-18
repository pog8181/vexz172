document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-page-ready");

  function startHeroTitleCycle(el, fullTitle) {
    if (!el) return;

    const source = String(fullTitle || "").trim();
    if (!source) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.textContent = source;
      return;
    }

    const parts = source.split(/\s+/);
    const wordA = parts.length >= 2 ? parts.slice(0, -1).join(" ") : source;
    const wordB = parts.length >= 2 ? parts[parts.length - 1] : source;

    if (!wordA || !wordB || wordA === wordB) {
      el.textContent = source;
      return;
    }

    const sequence = [wordA, wordB];
    const typeDelayMs = 102;
    const eraseDelayMs = 72;
    const holdDelayMs = 1280;
    const preErasePauseMs = 280;
    const betweenWordsPauseMs = 340;

    let seqIndex = 0;
    let charIndex = 0;
    let mode = "typing";

    el.classList.add("is-cycling", "is-typing");
    el.textContent = "";

    function tick() {
      const currentWord = sequence[seqIndex];

      if (mode === "typing") {
        charIndex += 1;
        el.textContent = currentWord.slice(0, charIndex);

        if (charIndex < currentWord.length) {
          window.setTimeout(tick, typeDelayMs);
          return;
        }

        mode = "hold";
        el.classList.remove("is-typing");
        window.setTimeout(tick, holdDelayMs);
        return;
      }

      if (mode === "hold") {
        mode = "erasing";
        el.classList.add("is-typing");
        window.setTimeout(tick, preErasePauseMs);
        return;
      }

      charIndex -= 1;
      el.textContent = currentWord.slice(0, Math.max(0, charIndex));

      if (charIndex > 0) {
        window.setTimeout(tick, eraseDelayMs);
        return;
      }

      mode = "typing";
      seqIndex = (seqIndex + 1) % sequence.length;
      window.setTimeout(tick, betweenWordsPauseMs);
    }

    tick();
  }

  document.querySelectorAll("[data-site-logo]").forEach((img) => {
    img.src = siteConfig.university.logo;
    img.alt = siteConfig.university.shortName;
  });

  document.querySelectorAll("[data-site-short-name]").forEach((el) => {
    el.textContent = siteConfig.university.shortName;
  });

  document.querySelectorAll("[data-site-full-name]").forEach((el) => {
    el.textContent = siteConfig.university.fullName;
  });

  document.querySelectorAll("[data-site-year-title]").forEach((el) => {
    startHeroTitleCycle(el, siteConfig.university.yearTitle);
  });

  document.querySelectorAll("[data-chat-link]").forEach((link) => {
    const key = link.getAttribute("data-chat-link");
    const url = siteConfig.chatLinks[key];

    if (!url) {
      link.setAttribute("href", "#");
      return;
    }

    link.setAttribute("href", url);
  });

  document.querySelectorAll("[data-download-key]").forEach((link) => {
    const key = link.getAttribute("data-download-key");
    if (!key) return;

    const downloads = siteConfig.downloads || {};
    const secondCourseDownloads = downloads.secondCourse || {};
    const href = secondCourseDownloads[`${key}Path`];
    const fileName = secondCourseDownloads[`${key}FileName`];

    if (!href) return;

    link.setAttribute("href", href);

    if (fileName) {
      link.setAttribute("download", fileName);
    }
  });

  document.querySelectorAll(".course-card[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;

      event.preventDefault();
      link.classList.add("is-pressed");
      document.body.classList.add("is-page-leaving");

      window.setTimeout(() => {
        window.location.href = href;
      }, 260);
    });
  });
});
