import { motion as Motion } from 'framer-motion';
import { useRef } from 'react';

export const RevealOnScroll = ({ children, className = "" }) => {
  const ref = useRef(null);
  
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 75 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className={className}
    >
      {children}
    </Motion.div>
  );
};

export default RevealOnScroll;
