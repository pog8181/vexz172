(function () {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const isChromium = document.documentElement.classList.contains("is-chromium");

  if (isChromium) {
    canvas.style.display = "none";
    return;
  }

  const perfProfile = {
    maxDpr: 2,
    densityMobile: 0.000038,
    densityDesktop: 0.000055,
    minNodesMobile: 20,
    minNodesDesktop: 32,
    maxNodesMobile: 42,
    maxNodesDesktop: 72,
    maxDistMobile: 150,
    maxDistDesktop: 200,
    lineWidthMobile: 1,
    lineWidthDesktop: 1.2,
    dotShadowMobile: 4,
    dotShadowDesktop: 6,
    fpsMobile: 30,
    fpsDesktop: 40
  };

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    nodes: [],
    rafId: 0,
    running: true,
    lastTime: 0,
    fpsInterval: isMobile ? 1000 / perfProfile.fpsMobile : 1000 / perfProfile.fpsDesktop
  };

  function isDarkTheme() {
    return document.documentElement.classList.contains("theme-dark");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function makeNode() {
    const speed = isMobile ? 0.42 : 0.62;
    return {
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() * 2 - 1) * speed,
      vy: (Math.random() * 2 - 1) * speed,
      r: isMobile ? 1 + Math.random() * 1 : 1.2 + Math.random() * 1.4
    };
  }

  function resize() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.dpr = clamp(window.devicePixelRatio || 1, 1, perfProfile.maxDpr);

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const density = isMobile ? perfProfile.densityMobile : perfProfile.densityDesktop;
    const targetCount = clamp(
      Math.floor(state.width * state.height * density),
      isMobile ? perfProfile.minNodesMobile : perfProfile.minNodesDesktop,
      isMobile ? perfProfile.maxNodesMobile : perfProfile.maxNodesDesktop
    );

    state.nodes = Array.from({ length: targetCount }, makeNode);

    drawStatic();
  }

  function updateNodes() {
    for (let i = 0; i < state.nodes.length; i += 1) {
      const n = state.nodes[i];

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -20) n.x = state.width + 20;
      if (n.x > state.width + 20) n.x = -20;
      if (n.y < -20) n.y = state.height + 20;
      if (n.y > state.height + 20) n.y = -20;
    }
  }

  function drawConnections() {
    const maxDist = isMobile ? perfProfile.maxDistMobile : perfProfile.maxDistDesktop;
    const maxDistSq = maxDist * maxDist;
    const darkTheme = isDarkTheme();

    for (let i = 0; i < state.nodes.length; i += 1) {
      const a = state.nodes[i];
      for (let j = i + 1; j < state.nodes.length; j += 1) {
        const b = state.nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > maxDistSq) continue;

        const alphaBase = darkTheme ? (isMobile ? 0.35 : 0.45) : (isMobile ? 0.5 : 0.62);
        const alpha = (1 - distSq / maxDistSq) * alphaBase;
        const lineColor = darkTheme ? "76, 122, 236" : "72, 118, 232";

        ctx.strokeStyle = `rgba(${lineColor}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = isMobile ? perfProfile.lineWidthMobile : perfProfile.lineWidthDesktop;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  function drawDots() {
    const darkTheme = isDarkTheme();

    for (let i = 0; i < state.nodes.length; i += 1) {
      const n = state.nodes[i];
      ctx.shadowBlur = isMobile ? perfProfile.dotShadowMobile : perfProfile.dotShadowDesktop;
      ctx.shadowColor = darkTheme ? "rgba(78, 124, 238, 0.4)" : "rgba(64, 106, 219, 0.48)";
      ctx.fillStyle = darkTheme
        ? (isMobile ? "rgba(67, 114, 232, 0.75)" : "rgba(67, 114, 232, 0.82)")
        : (isMobile ? "rgba(61, 104, 220, 0.88)" : "rgba(61, 104, 220, 0.94)");
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, state.width, state.height);
    const t = performance.now() * 0.00042;
    const driftX = Math.sin(t) * (isMobile ? 4.5 : 6.8);
    const driftY = Math.cos(t * 1.14) * (isMobile ? 3.2 : 5.1);

    ctx.save();
    ctx.translate(driftX, driftY);
    drawConnections();
    drawDots();
    ctx.restore();
  }

  function tick(timestamp) {
    if (!state.running) return;

    if (!state.lastTime) state.lastTime = timestamp;
    const elapsed = timestamp - state.lastTime;

    if (elapsed >= state.fpsInterval) {
      state.lastTime = timestamp;

      if (!reducedMotion) {
        updateNodes();
      }

      drawStatic();
    }

    state.rafId = window.requestAnimationFrame(tick);
  }

  function handleVisibility() {
    if (document.hidden) {
      state.running = false;
      if (state.rafId) window.cancelAnimationFrame(state.rafId);
      state.rafId = 0;
      return;
    }

    if (!state.running) {
      state.running = true;
      state.lastTime = 0;
      state.rafId = window.requestAnimationFrame(tick);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);

  resize();
  state.rafId = window.requestAnimationFrame(tick);
})();
