import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

const itemVariants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const iconContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const iconVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

export const MatchLoadingAnimation = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-neutral-950/80"
    >
      <motion.div 
        className="text-center p-8 rounded-2xl"
        variants={itemVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="flex items-center justify-center space-x-4 mb-6"
          variants={iconContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={iconVariants} className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <motion.div variants={iconVariants}>
            <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
          </motion.div>
          <motion.div variants={iconVariants} className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
            <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.8 } }}
        >
          Finding your best match...
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-neutral-400 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1 } }}
        >
          Our AI is analyzing your profile to connect you with a mentor who truly understands your journey.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};