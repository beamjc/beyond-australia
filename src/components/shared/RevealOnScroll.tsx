'use client'

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const RevealOnScroll = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={REVEAL_VARIANTS}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
