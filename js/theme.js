(function () {
  const STORAGE_KEY = "site-theme";
  const DARK = "dark";
  const LIGHT = "light";
  const THEME_COVER_MS = 420;
  const THEME_FADE_MS = 180;

  let isAnimating = false;

  function getSavedTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === DARK || value === LIGHT) return value;
    } catch (error) {
      // ignore localStorage errors
    }
    return LIGHT;
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // ignore localStorage errors
    }
  }

  function isReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isChromiumBrowser() {
    const ua = navigator.userAgent || "";
    const vendor = navigator.vendor || "";
    return /Chrome|Chromium|Edg|OPR|Brave/i.test(ua) && /Google Inc\.|Chromium/i.test(vendor);
  }

  function getWipeBackground(theme) {
    if (theme === DARK) {
      return "radial-gradient(circle at 20% 20%, #1b2130 0%, #141920 48%, #0f1319 100%)";
    }

    return "radial-gradient(circle at 20% 20%, #eef3ff 0%, #e0e8fa 52%, #d7e2f7 100%)";
  }

  function setButtonIcon(button) {
    button.innerHTML = `
      <span class="theme-toggle__glyph" aria-hidden="true">
        <svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="theme-toggle__sun-core" cx="12" cy="12" r="4.1" stroke="currentColor" stroke-width="1.7" />
          <g class="theme-toggle__sun-rays" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <path d="M12 2.8V5" />
            <path d="M12 19V21.2" />
            <path d="M2.8 12H5" />
            <path d="M19 12H21.2" />
            <path d="M5.55 5.55L7.1 7.1" />
            <path d="M16.9 16.9L18.45 18.45" />
            <path d="M18.45 5.55L16.9 7.1" />
            <path d="M7.1 16.9L5.55 18.45" />
          </g>
        </svg>
        <svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7 2.9C10.05 3.55 6.45 7.55 6.45 12.36C6.45 17.63 10.72 21.9 15.99 21.9C18.2 21.9 20.24 21.14 21.85 19.86C17.05 20.06 13.06 16.2 13.06 11.42C13.06 8.16 14.85 5.31 17.49 3.82C16.62 3.24 15.67 2.96 14.7 2.9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
  }

  function applyTheme(theme) {
    const isDark = theme === DARK;
    document.documentElement.classList.toggle("theme-dark", isDark);

    const button = document.getElementById("themeToggleBtn");
    if (button) {
      button.classList.toggle("is-dark", isDark);
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Светлая тема" : "Тёмная тема");
    }
  }

  function createWipe(x, y, nextTheme) {
    const wipe = document.createElement("span");
    wipe.className = "theme-wipe";
    wipe.style.setProperty("--wipe-x", `${Math.round(x)}px`);
    wipe.style.setProperty("--wipe-y", `${Math.round(y)}px`);
    wipe.style.setProperty("--wipe-bg", getWipeBackground(nextTheme));
    document.body.appendChild(wipe);

    requestAnimationFrame(() => {
      wipe.classList.add("is-active");
    });

    return wipe;
  }

  function animateThemeSwitch(button, nextTheme) {
    if (isAnimating) return;

    if (isReducedMotion()) {
      applyTheme(nextTheme);
      saveTheme(nextTheme);
      return;
    }

    isAnimating = true;

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const wipe = createWipe(x, y, nextTheme);

    button.classList.add("is-animating");

    window.setTimeout(() => {
      applyTheme(nextTheme);
      saveTheme(nextTheme);
      wipe.classList.add("is-fade");
    }, THEME_COVER_MS - 35);

    window.setTimeout(() => {
      button.classList.remove("is-animating");
      wipe.remove();
      isAnimating = false;
    }, THEME_COVER_MS + THEME_FADE_MS);
  }

  function ensureToggleButton() {
    if (document.getElementById("themeToggleBtn")) return;

    const button = document.createElement("button");
    button.id = "themeToggleBtn";
    button.type = "button";
    button.className = "theme-toggle";
    button.title = "Переключить тему";

    setButtonIcon(button);

    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.classList.contains("theme-dark") ? LIGHT : DARK;
      animateThemeSwitch(button, nextTheme);
    });

    document.body.appendChild(button);
  }

  document.documentElement.classList.toggle("is-chromium", isChromiumBrowser());
  applyTheme(getSavedTheme());

  document.addEventListener("DOMContentLoaded", () => {
    ensureToggleButton();
    applyTheme(getSavedTheme());
  });
})();
