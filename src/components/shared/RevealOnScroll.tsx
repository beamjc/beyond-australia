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

  // Fade in as the section's top edge moves from the bottom of the screen to
  // 75% of the way up, then stay fully opaque. Progress is tied to the top
  // edge only (not the whole section), so tall sections — e.g. the Study
  // tools on mobile — never render partly transparent while being read.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 75%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  // Reduced motion: a CSS override (!important beats framer's inline styles)
  // keeps sections static and fully visible. Toggling the style prop from JS
  // after hydration left framer's initial inline opacity: 0 in place.
  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`motion-reduce:!opacity-100 motion-reduce:!transform-none ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
