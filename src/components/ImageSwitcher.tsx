import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface SlideImagesProps {
  largeImage01?: string;
  largeImage02?: string;
  largeImage03?: string;
  smallImage01?: string;
  smallImage02?: string;
  smallImage03?: string;
}

export default function ImageSwitcher({
  largeImage01 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  largeImage02 = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  largeImage03 = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
  smallImage01 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80",
  smallImage02 = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
  smallImage03 = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=150&q=80",
}: SlideImagesProps) {
  // Estado para controlar cuál imagen está seleccionada (0, 1 o 2)
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const slides = [
    {
      large: largeImage01,
      small: smallImage01,
      heading: "ESTRUCTURA\nVISCERAL",
      description: "EXPLORA LA ARMONÍA DE LAS LÍNEAS ARQUITECTÓNICAS Y LA TEXTURA. CADA ESPACIO CAPTURADO EN ULTRA ALTA DEFINICIÓN."
    },
    {
      large: largeImage02,
      small: smallImage02,
      heading: "SENSACIÓN\nORGÁNICA",
      description: "UNA INTERACCIÓN ENTRE ARTE DIGITAL Y DISEÑO BIOFÍLICO, REVELANDO NUEVAS PERSPECTIVAS SOBRE LA ILUMINACIÓN Y EL ESPACIO."
    },
    {
      large: largeImage03,
      small: smallImage03,
      heading: "SÍNTESIS\nCROMÁTICA",
      description: "UNA EXPLORACIÓN MEDITATIVA DE TEXTURAS DIGITALES Y BUCLES RÍTMICOS PROFUNDOS CAPTURADOS EN RESOLUCIÓN MÁXIMA."
    }
  ];

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div
      id="main-image-switcher-container"
      className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] min-h-[500px] md:min-h-[650px] lg:min-h-[750px] flex flex-col md:flex-row items-center justify-center border border-white/20 rounded-3xl overflow-hidden relative bg-black mx-auto shadow-2xl"
    >
      {/* Área de imagen grande (Sección Izquierda de Fondo) */}
      <div
        id="large-image-area"
        className="w-full h-full relative overflow-hidden flex-1"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            id={`large-image-${activeIndex}`}
            src={slides[activeIndex].large}
            alt={`Large Image 0${activeIndex + 1}`}
            width={1200}
            height={800}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_top]"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              mass: 1,
              stiffness: 70,
            }}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {/* Dark subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 z-1 pointer-events-none" />
      </div>

      {/* Panel Flotante de Miniaturas (Thumbnails) */}
      <div
        id="thumbnail-panel"
        className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-10 md:left-10 lg:bottom-12 lg:left-12 flex flex-row md:flex-col justify-center md:justify-start gap-3 z-10 w-[calc(100%-3rem)] md:w-[120px]"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;
          const opacity = isActive ? 1.0 : 0.6;
          // Responsive dimensions for height
          const heightClass = isActive ? "h-20 md:h-[140px]" : "h-16 md:h-[120px]";
          const widthClass = isActive ? "w-24 md:w-full" : "w-20 md:w-full";

          return (
            <motion.div
              key={index}
              id={`thumbnail-wrapper-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`rounded-xl border border-white/40 cursor-pointer overflow-hidden backdrop-blur-md ${heightClass} ${widthClass} transition-all duration-300 shadow-lg`}
              animate={{ opacity }}
              whileHover={{ scale: 1.05, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={slide.small}
                alt={`Thumbnail 0${index + 1}`}
                width={150}
                height={150}
                loading="lazy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Título de Texto en la esquina superior izquierda */}
      <div
        id="heading-text"
        className="absolute top-6 left-6 md:top-10 md:left-10 lg:top-12 lg:left-12 z-10 font-sans text-white pointer-events-none"
        style={{
          WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
          maskImage: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="whitespace-pre font-black leading-[0.9] tracking-[-0.04em] text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[100px] uppercase"
          >
            {slides[activeIndex].heading}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Descripción de Texto en la esquina inferior derecha / arriba de miniaturas en movil */}
      <div
        id="description-text"
        className="absolute bottom-[115px] md:bottom-10 md:right-10 lg:bottom-12 lg:right-12 left-6 right-6 md:left-auto max-w-[calc(100%-3rem)] md:max-w-[40%] z-10 font-sans text-white pointer-events-none text-center md:text-right"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed opacity-90 drop-shadow-md max-w-md md:ml-auto">
              {slides[activeIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
