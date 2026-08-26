'use client'

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const RevealOnScroll = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Tracks this section's journey through the viewport: 0 as its top edge
  // reaches the bottom of the screen (about to enter), 1 as its bottom edge
  // reaches the top of the screen (about to fully exit). Opacity ramps up
  // over the first stretch (fade in, entering from the bottom), holds at 1
  // while it's the main content on screen, then ramps back down over the
  // last stretch (fade out, as it scrolls away past the top) — so it keeps
  // fading in and out continuously as the user scrolls, not just once.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [40, 0, 0, -40]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
