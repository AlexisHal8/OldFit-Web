import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      // Estado inicial: invisible y 20px más abajo
      initial={{ opacity: 0, y: 20 }} 
      // Estado final: totalmente visible y en su posición original
      animate={{ opacity: 1, y: 0 }} 
      // Configuración de la animación: dura medio segundo, movimiento suave
      transition={{ duration: 0.5, ease: "easeOut" }} 
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;