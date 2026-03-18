const closeTimers = new WeakMap();
const CLOSE_FALLBACK_MS = 260;

function clearCloseTimer(accordion) {
  const timer = closeTimers.get(accordion);
  if (!timer) return;

  window.clearTimeout(timer);
  closeTimers.delete(accordion);
}

function finishClosing(accordion) {
  accordion.classList.remove("is-closing");
  clearCloseTimer(accordion);
}

function openAccordion(accordion) {
  clearCloseTimer(accordion);
  accordion.classList.remove("is-closing");
  accordion.classList.add("is-open");
}

function closeAccordion(accordion) {
  if (!accordion.classList.contains("is-open")) return;

  clearCloseTimer(accordion);
  accordion.classList.remove("is-open");
  accordion.classList.add("is-closing");

  const contentInner = accordion.querySelector(".accordion__content-inner");

  if (contentInner) {
    const onAnimationEnd = (event) => {
      if (event.target !== contentInner || event.animationName !== "accordionOut") return;
      contentInner.removeEventListener("animationend", onAnimationEnd);
      finishClosing(accordion);
    };

    contentInner.addEventListener("animationend", onAnimationEnd);
  }

  const timer = window.setTimeout(() => {
    finishClosing(accordion);
  }, CLOSE_FALLBACK_MS);

  closeTimers.set(accordion, timer);
}

document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach((accordion) => {
    const header = accordion.querySelector(".accordion__header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isOpen = accordion.classList.contains("is-open");

      accordions.forEach((item) => {
        if (item !== accordion) closeAccordion(item);
      });

      if (isOpen) {
        closeAccordion(accordion);
      } else {
        openAccordion(accordion);
      }
    });
  });
});
