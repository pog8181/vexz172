document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("accountSearchInput");
  const resultBox = document.getElementById("accountSearchResult");
  const dropdown = document.getElementById("accountSearchDropdown");

  if (!input || !resultBox || !dropdown) return;

  const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");

  const state = {
    accounts: [],
    filtered: [],
    activeIndex: -1
  };

  function normalizeAccounts(data) {
    if (!Array.isArray(data)) return [];

    return data
      .filter((item) => item && typeof item.fio === "string" && typeof item.account === "string")
      .map((item) => ({ fio: item.fio.trim(), account: item.account.trim() }));
  }

  async function loadAccounts() {
    // При открытии страницы как file:// fetch к локальному JSON блокируется политикой CORS.
    if (window.location.protocol === "file:") {
      return normalizeAccounts(siteConfig.accounts);
    }

    try {
      const response = await fetch(siteConfig.data.accountsUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load accounts");

      const data = await response.json();
      return normalizeAccounts(data);
    } catch (error) {
      console.error(error);
      return normalizeAccounts(siteConfig.accounts);
    }
  }

  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function renderResult(item) {
    clearChildren(resultBox);

    const card = document.createElement("div");
    card.className = "search-result__card";

    const fioRow = document.createElement("div");
    fioRow.className = "search-result__row";

    const fioLabel = document.createElement("span");
    fioLabel.className = "search-result__label";
    fioLabel.textContent = "ФИО";

    const fioValue = document.createElement("span");
    fioValue.className = "search-result__value";
    fioValue.textContent = item.fio;

    fioRow.append(fioLabel, fioValue);

    const accountRow = document.createElement("div");
    accountRow.className = "search-result__row";

    const accountLabel = document.createElement("span");
    accountLabel.className = "search-result__label";
    accountLabel.textContent = "Лицевой счёт";

    const accountValue = document.createElement("span");
    accountValue.className = "search-result__value search-result__account";
    accountValue.textContent = item.account;

    accountRow.append(accountLabel, accountValue);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "copy-btn";
    copyBtn.setAttribute("data-account", item.account);
    copyBtn.textContent = "Скопировать счёт";

    card.append(fioRow, accountRow, copyBtn);
    resultBox.appendChild(card);
  }

  function renderEmpty() {
    clearChildren(resultBox);

    const card = document.createElement("div");
    card.className = "search-result__card";

    const value = document.createElement("span");
    value.className = "search-result__value";
    value.textContent = "Ничего не найдено";

    card.appendChild(value);
    resultBox.appendChild(card);
  }

  function closeDropdown() {
    dropdown.classList.remove("is-open");
    state.activeIndex = -1;
  }

  function openDropdown() {
    if (!state.filtered.length) {
      closeDropdown();
      return;
    }

    dropdown.classList.add("is-open");
  }

  function highlightActive() {
    const buttons = dropdown.querySelectorAll(".search-dropdown__item");

    buttons.forEach((button, index) => {
      button.classList.toggle("is-active", index === state.activeIndex);
    });
  }

  function selectAccount(item) {
    input.value = item.fio;
    renderResult(item);
    closeDropdown();
  }

  function renderDropdown() {
    clearChildren(dropdown);

    const list = document.createElement("div");
    list.className = "search-dropdown__list";

    state.filtered.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-dropdown__item";
      button.dataset.index = String(index);

      const fio = document.createElement("span");
      fio.className = "search-dropdown__fio";
      fio.textContent = item.fio;

      const account = document.createElement("span");
      account.className = "search-dropdown__account";
      account.textContent = item.account;

      button.append(fio, account);

      button.addEventListener("click", () => {
        selectAccount(item);
      });

      list.appendChild(button);
    });

    dropdown.appendChild(list);
    highlightActive();
    openDropdown();
  }

  function updateSearch() {
    const query = normalize(input.value);

    if (!query) {
      closeDropdown();
      clearChildren(resultBox);
      return;
    }

    state.filtered = state.accounts
      .filter((item) => normalize(item.fio).includes(query))
      .slice(0, 8);

    state.activeIndex = -1;
    renderDropdown();

    const exact = state.accounts.find((item) => normalize(item.fio) === query);
    if (exact) {
      renderResult(exact);
    }
  }

  input.addEventListener("input", updateSearch);

  input.addEventListener("focus", () => {
    if (state.filtered.length) openDropdown();
  });

  input.addEventListener("keydown", (event) => {
    if (!state.filtered.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.activeIndex = Math.min(state.activeIndex + 1, state.filtered.length - 1);
      highlightActive();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      state.activeIndex = Math.max(state.activeIndex - 1, 0);
      highlightActive();
      return;
    }

    if (event.key === "Enter" && state.activeIndex >= 0) {
      event.preventDefault();
      selectAccount(state.filtered[state.activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    if (!target.closest(".search-box")) {
      closeDropdown();
    }

    const btn = target.closest(".copy-btn");
    if (!btn) return;

    const value = btn.getAttribute("data-account") || "";

    navigator.clipboard.writeText(value).then(() => {
      btn.textContent = "Скопировано";
      setTimeout(() => {
        btn.textContent = "Скопировать счёт";
      }, 1100);
    });
  });

  state.accounts = await loadAccounts();
});
