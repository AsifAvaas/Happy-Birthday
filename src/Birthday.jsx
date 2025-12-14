import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// --- ASSETS IMPORT ---
import bd1 from "./assets/bd/bd1.png";
import bd2 from "./assets/bd/bd2.png";
import bd3 from "./assets/bd/bd3.gif";
import bd4 from "./assets/bd/bd4.gif";
import bdMain from "./assets/bd/bdMain.webp"; // <--- VERIFY THIS NAME
import partySong from "./assets/audio/awww-happy.mp3";

const Assets = {
  bd1,
  bd2,
  bd3,
  bd4,
  bdMain,
};

// ... (Helper components FloatingImage and Confetti remain the same) ...
const FloatingImage = ({ src, delay, initialX, initialY }) => {
  return (
    <motion.img
      src={src}
      alt="Decoration"
      className="absolute w-32 md:w-48 object-contain z-0"
      initial={{ x: initialX, y: initialY, opacity: 0 }}
      animate={{
        x: [initialX, initialX + 100, initialX - 100, initialX],
        y: [initialY, initialY - 100, initialY + 100, initialY],
        rotate: [0, 45, -45, 0],
        scale: [1, 1.2, 0.8, 1],
        opacity: 1,
      }}
      transition={{
        duration: 5 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

const Confetti = () => {
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default function Birthday() {
  const audioRef = useRef(null);

  // DEBUGGING: Check if image loaded
  useEffect(() => {
    console.log("BdMain Image Path:", Assets.bdMain);
    if (!Assets.bdMain) console.error("IMAGE NOT FOUND: Check import path!");
  }, []);

  // Auto-play music on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay failed (User interaction needed):", error);
        });
      }
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative flex items-center justify-center">
      <audio ref={audioRef} src={partySong} loop style={{ display: "none" }} />

      <Confetti />

      <FloatingImage
        src={Assets.bd1}
        delay={0}
        initialX={-150}
        initialY={-150}
      />
      <FloatingImage
        src={Assets.bd2}
        delay={1}
        initialX={150}
        initialY={-150}
      />
      <FloatingImage
        src={Assets.bd3}
        delay={0.5}
        initialX={-150}
        initialY={150}
      />
      <FloatingImage
        src={Assets.bd4}
        delay={1.5}
        initialX={150}
        initialY={150}
      />

      <div className="relative z-20 flex flex-col items-center justify-center">
        <motion.div
          className="absolute bg-yellow-300 rounded-full blur-3xl opacity-50"
          style={{ width: "300px", height: "300px" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            scale: { duration: 0.5, type: "spring" },
            default: { duration: 0.4, repeat: Infinity, repeatType: "mirror" },
          }}
          className="relative"
        >
          {/* If image fails, this gray circle will show */}
          <div className="w-64 md:w-80 h-64 md:h-80 rounded-full bg-gray-200 border-8 border-yellow-400 absolute inset-0 z-0 flex items-center justify-center">
            <span className="text-xs text-gray-500">Image Failed</span>
          </div>

          <img
            src={Assets.bdMain}
            alt="Birthday Main"
            // Add error handling directly to the image tag
            onError={(e) => {
              e.target.style.display = "none"; // Hide if broken
              console.error("Error loading image:", e.target.src);
            }}
            className="w-64 md:w-80 h-64 md:h-80 object-cover rounded-full border-8 border-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.6)] relative z-10"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-sm text-center font-[cursive] z-30"
        >
          HAPPY BIRTHDAY!
        </motion.h1>

        <motion.p
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-2xl mt-4 text-pink-600 font-bold z-30"
        >
          ❤️ For You ❤️
        </motion.p>
      </div>
    </div>
  );
}
