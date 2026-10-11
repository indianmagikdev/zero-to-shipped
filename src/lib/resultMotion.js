// Motion helpers for the results screen. Vanilla on purpose: the count-up and
// the ring animation are DOM/effects work, not render work.

export const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 in the SVG

// Drives a number from 0 to `target` over `duration` with an ease-out cubic,
// writing into a DOM node. Returns a stop function; the second callback lets
// the caller cancel from outside (React effect cleanup).
export function countUp(el, target, shouldStop, duration = 1200) {
  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (p < 1 && !shouldStop()) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return () => {};
}
