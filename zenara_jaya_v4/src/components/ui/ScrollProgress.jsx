'use client';

import { motion as Motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <Motion.div
      className="fixed top-0 left-0 right-0 h-[4px] bg-(--link-hover-color) z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
