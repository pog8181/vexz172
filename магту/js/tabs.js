document.addEventListener("DOMContentLoaded", () => {
  const switchers = document.querySelectorAll(".tab-switcher");

  switchers.forEach((switcher) => {
    const buttons = switcher.querySelectorAll(".tab-switcher__btn");

    const accordionInner = switcher.closest(".accordion__content-inner");
    if (!accordionInner) return;

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const target = button.getAttribute("data-tab-target");
        const panels = accordionInner.querySelectorAll(".tab-panel");

        buttons.forEach((btn) => btn.classList.remove("is-active"));
        panels.forEach((panel) => panel.classList.remove("is-active"));

        button.classList.add("is-active");

        const activePanel = accordionInner.querySelector(
          `[data-tab-content="${target}"]`
        );

        if (activePanel) {
          activePanel.classList.add("is-active");
        }
      });
    });
  });
});
