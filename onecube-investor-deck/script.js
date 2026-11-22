(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const total = slides.length;
  let current = 0;

  function show(index) {
    const next = Math.max(0, Math.min(total - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === next);
      slide.classList.toggle("prev", i < next);
    });
    current = next;
    counter.textContent = `${current + 1} / ${total}`;
    progressBar.style.width = `${((current + 1) / total) * 100}%`;
    if (location.hash !== `#${current + 1}`) history.replaceState(null, "", `#${current + 1}`);
  }

  const next = () => show(current + 1);
  const prev = () => show(current - 1);

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  // Buttons
  document.getElementById("nextBtn").addEventListener("click", next);
  document.getElementById("prevBtn").addEventListener("click", prev);
  document.getElementById("fsBtn").addEventListener("click", toggleFullscreen);

  // Keyboard
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight": case "PageDown": case " ": case "Enter":
        e.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp": case "Backspace":
        e.preventDefault(); prev(); break;
      case "Home": show(0); break;
      case "End": show(total - 1); break;
      case "f": case "F": toggleFullscreen(); break;
      case "p": case "P": document.body.classList.toggle("hide-fill"); break;
    }
  });

  // Touch swipe
  let startX = null;
  document.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    startX = null;
  });

  // Deep link: index.html#5 opens slide 5
  const slideFromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? n - 1 : 0;
  };
  window.addEventListener("hashchange", () => show(slideFromHash()));
  show(slideFromHash());
})();
