import React from 'react';
import { motion } from 'framer-motion';

const VideoLoader = () => {
  return (
    <motion.div
      // La animación de "salida" (cuando React destruye el componente)
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 overflow-hidden"
    >
      {/* Etiqueta de Video HTML5 */}
      <video 
        autoPlay 
        muted 
        playsInline 
        className="absolute w-full h-full object-cover opacity-40"
      >
        <source src="/intro-oldfit.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      {/* Contenido sobre el video (Opcional) */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white tracking-widest mb-4">
          Old-Fit
        </h1>
        {/* Un pequeño spinner de Tailwind para dar feedback de carga */}
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </motion.div>
  );
};

export default VideoLoader;