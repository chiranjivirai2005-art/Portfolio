import { motion } from 'framer-motion'

const variants = {
  initial: {
    opacity: 0,
    rotateY: -10,
    x: 24,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    x: 0,
  },
  exit: {
    opacity: 0,
    rotateY: 10,
    x: -24,
  },
}

function PageTransition({ children }) {
  return (
    <motion.section
      className="page-shell"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}

export default PageTransition
