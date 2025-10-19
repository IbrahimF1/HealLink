import React from 'react';
import { motion } from 'framer-motion';

export const Card = React.forwardRef(({ children, className = "", ...props }, ref) => (
  <motion.div 
    ref={ref}
    className={"rounded-2xl shadow-sm border bg-white p-5 dark:bg-neutral-900 dark:border-neutral-800 " + className}
    {...props} // Pass framer-motion props
  >
    {children}
  </motion.div>
));