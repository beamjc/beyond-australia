import { useEffect, useState } from "react";

/**
 * Phones/tablets only (below the lg breakpoint): true while the visitor is
 * scrolling down through content, false when they scroll up, are near the top,
 * or reach the bottom of the page. Used to keep the floating LINE/Facebook
 * buttons from covering numbers and controls. Always false on desktop.
 */
export function useHideOnScrollDown(threshold = 12): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(max-width: 1023.98px)");
    if (!mq) return;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const nearTop = y < 200;
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80;
      if (!mq.matches || nearTop || nearBottom) setHidden(false);
      else if (y - lastY > threshold) setHidden(true);
      else if (lastY - y > threshold) setHidden(false);
      if (Math.abs(y - lastY) > threshold) lastY = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onChange = () => { if (!mq.matches) setHidden(false); };

    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener?.("change", onChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener?.("change", onChange);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return hidden;
}
