import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Birthday from "./Birthday";
import BackgroundMusic from "./backgrounndMusic";
import { Volume2, VolumeX } from "lucide-react";
import firstMetImg from "./assets/first met.jpg";
import secondMetImg from "./assets/second met.jpeg";
import beautifulImg from "./assets/beautiful.jpg";
import crush from "./assets/crush.jpeg";
import loveImg from "./assets/love.jpg";

// Sequence / Best Photos
import best1 from "./assets/best1.jpg";
import best2 from "./assets/best2.jpg";
import best3 from "./assets/best3.jpg";
import best4 from "./assets/best4.jpg";
import best5 from "./assets/best5.jpeg"; // Note: .jpeg extension

// Grid / Carousel Photos
import best6 from "./assets/best6.jpg";
import best7 from "./assets/best7.jpg";
import best8 from "./assets/best8.jpg";
import best9 from "./assets/best9.jpg";
import tour1 from "./assets/tour1.webp";
import tour2 from "./assets/tour2.webp";
import tour3 from "./assets/tour3.webp";
import ramna1 from "./assets/ramna1.jpg";
import ramna2 from "./assets/ramn2.jpg";
import dominos1 from "./assets/dominos1.jpg";
import dominos2 from "./assets/dominos2.jpg";

// Fairies & Specific Moments
import redImg from "./assets/red.PNG";
import blueImg from "./assets/blue.jpeg";
import whiteImg from "./assets/white.PNG";
import goldenImg from "./assets/golden.jpg";
import depressed from "./assets/depressed.jpeg";

import birthdaysong from "./assets/audio/happybirthday.mp3";
import peeloonSong from "./assets/audio/Khudajaane.mp3";
import khudajaaneSong from "./assets/audio/PeeLoon.mp3";
// ============== ASSETS CONFIGURATION ==============
// Replace these URLs with your actual image and audio paths
const ASSETS = {
  images: {
    firstMet: firstMetImg,
    reallyMet: secondMetImg,
    beautiful: beautifulImg,
    crush: crush,
    ramna1: ramna1,
    ramna2: ramna2,
    dominos1: dominos1,
    dominos2: dominos2,
    tour1: tour1,
    tour2: tour2,
    tour3: tour3,
    best1: best1,
    best2: best2,
    best3: best3,
    best4: best4,
    best5: best5,
    best6: best6,
    best7: best7,
    best8: best8,
    best9: best9,
    redFairy: redImg,
    blueFairy: blueImg,
    sleepingFairy: depressed,
    whiteFairy: whiteImg,
    goldenFairy: goldenImg,
    cake: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600",
    finalCouple: loveImg,
  },
  audio: {
    birthdaysong: birthdaysong,
    peeloonSong: peeloonSong,
    khudajaaneSong: khudajaaneSong,
  },
};

const CelebrationBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* ✨ Sparkles */}
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={`sparkle-${i}`}
        className="absolute w-1.5 h-1.5 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5 + Math.random(),
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}

    {/* 🎉 Confetti */}
    {[...Array(100)].map((_, i) => (
      <motion.div
        key={`confetti-${i}`}
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: ["#ffd166", "#ff7aa2", "#b388ff", "#72ddf7", "#caffbf"][
            i % 5
          ],
          left: `${Math.random() * 100}%`,
          top: `-10%`,
        }}
        animate={{
          y: ["0%", "120%"],
          rotate: [0, 360],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "linear",
        }}
      />
    ))}
  </div>
);
// ============== AUDIO CONTROLLER HOOK ==============
const useAudioController = (chapters) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef([]);
  const fadingOut = useRef(null);

  useEffect(() => {
    audioRefs.current = Object.values(ASSETS.audio).map((src, i) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      return audio;
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  useEffect(() => {
    if (isMuted) return;

    const fadeIn = (audio, duration = 1000) => {
      const steps = 20;
      const volumeStep = 1 / steps;
      const timeStep = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(currentStep * volumeStep, 1);
        if (currentStep >= steps) clearInterval(interval);
      }, timeStep);
    };

    const fadeOut = (audio, duration = 1000) => {
      const steps = 20;
      const volumeStep = audio.volume / steps;
      const timeStep = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(audio.volume - volumeStep, 0);
        if (currentStep >= steps) {
          clearInterval(interval);
          audio.pause();
          audio.currentTime = 0;
        }
      }, timeStep);
    };

    audioRefs.current.forEach((audio, i) => {
      if (i === currentChapter) {
        audio.play().catch((e) => console.log("Audio play failed:", e));
        fadeIn(audio);
      } else if (audio.volume > 0) {
        fadeOut(audio);
      }
    });
  }, [currentChapter, isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      audioRefs.current.forEach((audio) => {
        if (newMuted) {
          audio.volume = 0;
          audio.pause();
        }
      });
      return newMuted;
    });
  };

  return { currentChapter, setCurrentChapter, isMuted, toggleMute };
};

// ============== TYPEWRITER COMPONENT ==============
const Typewriter = ({ text, delay = 100 }) => {
  const [displayText, setDisplayText] = useState("");
  const isInView = useInView(useRef(null), { once: true });

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay, isInView]);

  return <span>{displayText}</span>;
};

function SlideInText({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

// // ============== CHAPTER OBSERVER ==============
// const ChapterObserver = ({ chapterIndex, onChapterChange, children }) => {
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           onChapterChange(chapterIndex);
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [chapterIndex, onChapterChange]);

//   return <div ref={ref}>{children}</div>;
// };

// ============== BLOOM IMAGE COMPONENT ==============
const BloomImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 2.5, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[150vh]">
      <motion.div
        style={{ scale, opacity }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
};

// ============== PARALLAX IMAGE COMPONENT ==============
const ParallaxImage = ({ src, alt, direction = "left" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? [-200, 100] : [200, -100]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ x, opacity }}
        className="w-3/4 max-w-2xl rounded-2xl shadow-2xl"
      />
    </div>
  );
};

function ScrollRevealImage({ src, alt, className, zoom = false }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    zoom ? [1.2, 1] : [0.95, 1]
  );

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      style={{ opacity, y, scale }}
      className={className}
    />
  );
}

// ============== 3D TILT IMAGE ==============
const TiltImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 15]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="h-screen flex items-center justify-center perspective-1000"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ rotateY, opacity }}
        className="w-3/4 max-w-2xl rounded-2xl shadow-2xl"
      />
    </div>
  );
};

// ============== STAGGERED GRID ==============
const StaggeredGrid = ({ images }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-3 gap-4 max-w-4xl mx-auto px-4">
      {images.map((img, i) => (
        <motion.img
          key={i}
          src={img}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          className="w-full aspect-square object-cover rounded-xl shadow-lg"
        />
      ))}
    </div>
  );
};

// ============== HORIZONTAL SCROLL SECTION ==============
const HorizontalScroll = ({ images }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -1000]);

  return (
    <div ref={ref} className="h-screen overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center">
        <motion.div style={{ x }} className="flex gap-8 px-8">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-96 w-80 object-cover rounded-2xl shadow-2xl flex-shrink-0"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
const TRACK_LIST = [
  ASSETS.audio.birthdaysong, // Index 0: Happy Birthday Section
  ASSETS.audio.peeloonSong, // Index 1: The Journey -> Best Years
  ASSETS.audio.khudajaaneSong, // Index 2: Finale ("So finally...")
];

const ChapterObserver = ({ children, chapterIndex, onChapterChange }) => {
  const ref = useRef(null);
  // amount: 0.1 means "Trigger when 10% of this section is visible"
  const isInView = useInView(ref, { amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      // console.log("Switching to Chapter:", chapterIndex); // Debugging
      onChapterChange(chapterIndex);
    }
  }, [isInView, chapterIndex, onChapterChange]);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
};
// ============== MAIN APP ==============
export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showFinalLetter, setShowFinalLetter] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);

  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => setCanScroll(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted]);

  // MUSIC CONFIGURATION
  // Index 0: Happy Birthday (Default start)
  // Index 1: Pee Loon (Journey & Impact sections)
  // Index 2: Khuda Jaane (Finale)
  // const trackList = [
  //   ASSETS.audio.birthdaysong,
  //   ASSETS.audio.peeloonSong,
  //   ASSETS.audio.khudajaaneSong,
  // ];

  // If final button clicked, render the Birthday Page (Simulating route '/birthday')
  if (showFinalLetter) {
    return <Birthday />;
  }

  return (
    <div
      className={`min-h-screen bg-slate-900 text-white font-sans ${
        !canScroll
          ? "h-screen overflow-hidden"
          : "overflow-y-auto overflow-x-hidden"
      }`}
    >
      {/* MUSIC CONTROLLER */}
      <BackgroundMusic
        tracks={TRACK_LIST}
        trackIndex={currentChapter}
        isPlaying={hasStarted}
        isMuted={isMuted}
      />

      <div className="bg-black text-white overflow-x-hidden">
        {/* Audio Control Button */}
        <button
          onClick={toggleMute}
          className="fixed top-8 right-8 z-50 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 transition-colors"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <AnimatePresence mode="wait">
          {/* ==================== STAGE 1: INTRO ==================== */}
          {!hasStarted && (
            <motion.section
              key="intro"
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 1 }}
              className="h-screen flex flex-col items-center justify-center px-4 bg-slate-900 z-50 relative"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="text-6xl md:text-8xl font-light mb-8 text-center"
              >
                <Typewriter text="Hello pretty girl" delay={150} />
              </motion.h1>

              <div className="flex flex-col items-center justify-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] mb-6 text-center px-4"
                >
                  Hey pretty girl
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 1 }}
                  className="text-xl md:text-3xl text-purple-100/80 font-light tracking-[0.2em] text-center"
                >
                  I made a little something for you
                </motion.p>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.5, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasStarted(true)}
                className="mt-16 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-2xl font-bold shadow-[0_0_30px_rgba(236,72,153,0.5)] border border-white/20 hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] transition-all cursor-pointer"
              >
                Open Your Gift 🎁
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ==================== STAGE 2: MAIN CONTENT ==================== */}
        {hasStarted && (
          <>
            {/* CHAPTER 0: HAPPY BIRTHDAY 
               (Default currentChapter = 0, so 'birthdaysong' plays here)
            */}
            <section className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-600">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <CelebrationBackground />

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
                className="text-center relative z-10"
              >
                <h2 className="text-7xl md:text-9xl mb-6 font-[cursive] bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,255,255,0.8)]">
                  {["H", "A", "P", "P", "Y"].map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 100, rotate: -20 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.8,
                        type: "spring",
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </h2>
                <h2 className="text-7xl md:text-9xl font-[cursive] bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(255,255,255,0.9)]">
                  {["B", "I", "R", "T", "H", "D", "A", "Y"].map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 100, rotate: 20 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{
                        delay: (i + 5) * 0.1,
                        duration: 0.8,
                        type: "spring",
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </h2>
              </motion.div>

              {canScroll && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-10 left-0 right-0 text-center text-white/80 animate-bounce"
                >
                  <p className="text-lg mb-2">The journey begins below</p>
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
              )}
            </section>

            {/* CHAPTER 1: THE JOURNEY (Index 1)
               Plays 'peeloonSong'
            */}
            <ChapterObserver
              chapterIndex={1}
              onChapterChange={setCurrentChapter}
            >
              <section className="bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
                <div className="min-h-56 flex flex-col items-center justify-center gap-6 px-4 pt-20">
                  <SlideInText className="text-4xl md:text-6xl text-center font-serif tracking-wide">
                    How far have we come, huh?
                  </SlideInText>
                  <SlideInText className="text-3xl md:text-5xl text-gray-300 text-center italic">
                    From the day we first met
                  </SlideInText>
                </div>
                <div className="min-h-7 flex items-center justify-center py-12">
                  <ScrollRevealImage
                    src={ASSETS.images.firstMet}
                    alt="First met"
                    className="max-w-4xl w-full rounded-2xl shadow-2xl shadow-purple-500/30 px-4"
                  />
                </div>
                <div className="min-h-56 flex items-center justify-center px-4">
                  <SlideInText className="text-3xl md:text-5xl text-gray-300 text-center italic">
                    Or the day we really met
                  </SlideInText>
                </div>
                <div className="min-h-56 flex items-center justify-center py-12">
                  <ScrollRevealImage
                    src={ASSETS.images.reallyMet}
                    alt="Really met"
                    zoom
                    className="max-w-4xl w-full rounded-2xl shadow-[0_0_80px_rgba(180,140,255,0.35)] px-4"
                  />
                </div>
                <div className="min-h-screen flex items-center justify-center px-4">
                  <SlideInText className="text-3xl md:text-5xl text-center font-serif tracking-wide">
                    Who thought we would come this far?
                  </SlideInText>
                </div>
              </section>
            </ChapterObserver>

            {/* CHAPTER 1 (CONTINUED): THE IMPACT
               We keep chapterIndex={1} so 'peeloonSong' continues playing.
            */}
            <ChapterObserver
              chapterIndex={1}
              onChapterChange={setCurrentChapter}
            >
              <section className="bg-gradient-to-b from-black to-purple-900">
                <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-red-600 via-pink-500 to-purple-700 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-3xl md:text-5xl"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [
                          0,
                          Math.random() * 80 + 20,
                          -(Math.random() * 80 + 20),
                          0,
                        ],
                        x: [
                          0,
                          Math.random() * 50 - 25,
                          Math.random() * 50 - 25,
                          0,
                        ],
                        rotate: [0, 360, 720],
                      }}
                      transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                    >
                      😡
                    </motion.div>
                  ))}
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl text-center px-4 z-10 font-bold text-white drop-shadow-lg font-serif"
                  >
                    Thinking back, it's all your fault
                  </motion.h3>
                </div>

                <div className="min-h-[60vh] flex items-center justify-center">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl text-center px-4 font-serif text-white drop-shadow-lg"
                  >
                    You have no rights to be this beautiful
                  </motion.p>
                </div>

                <div className="min-h-screen flex items-center justify-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-3/4 max-w-2xl"
                  >
                    <img
                      src={ASSETS.images.beautiful}
                      alt="Beautiful"
                      className="rounded-2xl shadow-2xl w-full"
                    />
                  </motion.div>
                </div>

                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 relative overflow-hidden px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 120 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="w-2/3 md:w-1/2 max-w-xl rounded-2xl shadow-2xl z-10"
                  >
                    <img
                      src={ASSETS.images.crush}
                      alt="Crush"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -30 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: -30 }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 120,
                      delay: 0.2,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-3xl md:text-5xl font-serif text-white z-20 absolute top-32 left-4 md:left-20"
                  >
                    and be my first crush
                  </motion.p>
                </div>

                <div className="min-h-96 flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300">
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1.2,
                      type: "spring",
                      stiffness: 120,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
                  >
                    Then slowly made me fall for you
                  </motion.p>
                </div>

                <div className="py-32 space-y-24 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 overflow-x-visible">
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
                  >
                    From this
                  </motion.p>

                  {/* Sequence Images */}
                  <motion.div
                    className="relative flex justify-center items-center overflow-x-visible"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    <motion.img
                      src={ASSETS.images.ramna1}
                      alt="Left"
                      variants={{
                        hidden: { x: -100, rotate: -12.5, opacity: 0 },
                        visible: {
                          x: 0,
                          rotate: -12.5,
                          opacity: 1,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/2 max-w-[180px] sm:w-5/12 md:w-1/3 rounded-xl shadow-lg z-10"
                    />
                    <motion.img
                      src={ASSETS.images.ramna2}
                      alt="Right"
                      variants={{
                        hidden: { x: 100, rotate: 12.5, opacity: 0 },
                        visible: {
                          x: 0,
                          rotate: 12.5,
                          opacity: 1,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/2 max-w-[180px] sm:w-5/12 md:w-1/3 rounded-xl shadow-lg z-20"
                    />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
                  >
                    to this
                  </motion.p>

                  <motion.div
                    className="relative flex justify-center items-center overflow-x-visible"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    <motion.img
                      src={ASSETS.images.dominos1}
                      alt="Left"
                      variants={{
                        hidden: { x: -100, rotate: -12.5, opacity: 0 },
                        visible: {
                          x: 0,
                          rotate: -12.5,
                          opacity: 1,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/2 max-w-[180px] sm:w-5/12 md:w-1/3 rounded-xl shadow-lg z-10"
                    />
                    <motion.img
                      src={ASSETS.images.dominos2}
                      alt="Right"
                      variants={{
                        hidden: { x: 100, rotate: 12.5, opacity: 0 },
                        visible: {
                          x: 0,
                          rotate: 12.5,
                          opacity: 1,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/2 max-w-[180px] sm:w-5/12 md:w-1/3 rounded-xl shadow-lg z-20"
                    />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
                  >
                    to this
                  </motion.p>

                  <motion.div
                    className="relative flex justify-center items-center h-64 sm:h-80 overflow-x-visible"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    <motion.img
                      src={ASSETS.images.tour1}
                      alt="Left"
                      variants={{
                        hidden: { x: -80, y: 20, rotate: -20, opacity: 0 },
                        visible: {
                          x: 20,
                          y: 0,
                          rotate: -15,
                          opacity: 1,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/3 max-w-[160px] rounded-xl shadow-lg z-10 border-2 border-white/50"
                    />
                    <motion.img
                      src={ASSETS.images.tour2}
                      alt="Center"
                      variants={{
                        hidden: { y: 100, opacity: 0, scale: 0.8 },
                        visible: {
                          y: -20,
                          opacity: 1,
                          scale: 1.1,
                          transition: {
                            duration: 1.2,
                            delay: 0.1,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/3 max-w-[160px] rounded-xl shadow-2xl z-20 border-4 border-white"
                    />
                    <motion.img
                      src={ASSETS.images.tour3}
                      alt="Right"
                      variants={{
                        hidden: { x: 80, y: 20, rotate: 20, opacity: 0 },
                        visible: {
                          x: -20,
                          y: 0,
                          rotate: 15,
                          opacity: 1,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            stiffness: 120,
                          },
                        },
                      }}
                      className="w-1/3 max-w-[160px] rounded-xl shadow-lg z-10 border-2 border-white/50"
                    />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
                  >
                    You slowly consumed my heart
                  </motion.p>
                </div>

                {/* CAROUSEL SECTION */}
                <div className="py-24 bg-gradient-to-b from-purple-300 via-indigo-300 to-blue-300 overflow-hidden">
                  <div className="flex items-center justify-center mb-12">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                      className="text-3xl md:text-5xl text-center px-4 font-serif text-white drop-shadow-md"
                    >
                      And then you started the best years of my life
                    </motion.p>
                  </div>
                  <div className="relative w-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-indigo-300/50 to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-blue-300/50 to-transparent z-10" />
                    <motion.div
                      className="flex gap-4 sm:gap-8 w-max"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 25,
                      }}
                    >
                      {[
                        ASSETS.images.best1,
                        ASSETS.images.best2,
                        ASSETS.images.best3,
                        ASSETS.images.best4,
                        ASSETS.images.best5,
                        ASSETS.images.best6,
                        ASSETS.images.best7,
                        ASSETS.images.best8,
                        ASSETS.images.best9,
                        ASSETS.images.best1,
                        ASSETS.images.best2,
                        ASSETS.images.best3,
                        ASSETS.images.best4,
                        ASSETS.images.best5,
                        ASSETS.images.best6,
                        ASSETS.images.best7,
                        ASSETS.images.best8,
                        ASSETS.images.best9,
                      ].map((img, index) => (
                        <div
                          key={index}
                          className="relative w-48 h-64 sm:w-72 sm:h-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border-4 border-white/30"
                        >
                          <img
                            src={img}
                            alt={`Memory ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </section>
            </ChapterObserver>

            {/* CHAPTER 2: THE FINALE (Index 2)
               Plays 'khudajaaneSong'
            */}
            <ChapterObserver
              chapterIndex={2}
              onChapterChange={setCurrentChapter}
            >
              <section className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pb-32 overflow-x-hidden text-white">
                <div className="min-h-96 flex items-center justify-center">
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl text-center px-4 font-serif italic tracking-wider text-purple-200 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  >
                    So finally, I want to say
                  </motion.h3>
                </div>

                <div className="flex flex-col items-center gap-32 max-w-2xl mx-auto px-4 my-32">
                  {[
                    { img: ASSETS.images.redFairy, text: "To my লাল পরী" },
                    { img: ASSETS.images.blueFairy, text: "নীল পরী" },
                    { img: ASSETS.images.whiteFairy, text: "সাদা পরী" },
                    { img: ASSETS.images.goldenFairy, text: "সোনালি পরী" },
                    { img: ASSETS.images.sleepingFairy, text: "ঘুমন্ত পরী" },
                  ].map((fairy, index) => {
                    const comesFromRight = index % 2 === 0;
                    return (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: comesFromRight ? 100 : -100,
                          rotate: comesFromRight ? 5 : -5,
                        }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{
                          duration: 1,
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                        }}
                        viewport={{ once: false, amount: 0.5 }}
                        className="flex flex-col items-center text-center w-full"
                      >
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                          <img
                            src={fairy.img}
                            alt={fairy.text}
                            className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl border-2 border-white/20"
                          />
                        </div>
                        <p className="mt-6 text-3xl font-serif text-purple-100">
                          {fairy.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="min-h-screen flex flex-col items-center justify-center gap-8 md:gap-12">
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
                    viewport={{ once: true }}
                    className="text-6xl md:text-9xl text-center font-serif font-black italic tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-purple-300 to-indigo-300 drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]"
                  >
                    Happy <br className="md:hidden" /> Birthday
                  </motion.h2>
                  <motion.img
                    initial={{ opacity: 0, y: 100, rotate: -10 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 1, type: "spring" }}
                    viewport={{ once: true }}
                    src={ASSETS.images.cake}
                    alt="Cake"
                    className="w-72 md:w-96 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] border-4 border-white/10"
                  />
                </div>

                <div className="min-h-screen flex flex-col items-center justify-center gap-12 px-4 pb-20">
                  <motion.p
                    initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl text-center font-serif italic tracking-wide leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  >
                    Always remain with me like this
                  </motion.p>
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: true }}
                    src={ASSETS.images.finalCouple}
                    alt="Us"
                    className="w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10"
                  />

                  {/* BUTTON TO "ROUTE" TO BIRTHDAY PAGE */}
                  <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    onClick={() => setShowFinalLetter(true)}
                    className="mt-8 px-12 py-6 bg-white/10 backdrop-blur-md border border-white/30 text-white text-2xl font-bold rounded-full hover:bg-white hover:text-purple-900 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                  >
                    And finally...
                  </motion.button>
                </div>
              </section>
            </ChapterObserver>
          </>
        )}
      </div>
    </div>
  );
}
