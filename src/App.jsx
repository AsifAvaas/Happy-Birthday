import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
import pinkCandidate from "./assets/IMG_9461.webp";
import whiteImg from "./assets/white.PNG";
import cakeCandidate from "./assets/dominos1.jpg";
import goldenImg from "./assets/golden.jpg";
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
    pinkFairy: pinkCandidate,
    sleepingFairy: whiteImg,
    cake: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600",
    finalCouple:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
  },
  audio: {
    track1: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    track2: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    track3: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    track4: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    track5: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
};

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

// ============== CHAPTER OBSERVER ==============
const ChapterObserver = ({ chapterIndex, onChapterChange, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onChapterChange(chapterIndex);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [chapterIndex, onChapterChange]);

  return <div ref={ref}>{children}</div>;
};

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

// ============== MAIN APP ==============
export default function App() {
  const { currentChapter, setCurrentChapter, isMuted, toggleMute } =
    useAudioController(5);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Audio Control Button */}
      <button
        onClick={toggleMute}
        className="fixed top-8 right-8 z-50 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 transition-colors"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* CHAPTER 1: The Hook */}
      <ChapterObserver chapterIndex={0} onChapterChange={setCurrentChapter}>
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="text-6xl md:text-8xl font-light mb-8 text-center"
          >
            <Typewriter text="Hello pretty girl" delay={150} />
          </motion.h1>

          {/* New line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-2xl md:text-3xl text-gray-300 text-center mb-2"
          >
            Hey pretty girl
          </motion.p>

          {/* Existing line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="text-xl md:text-2xl text-gray-400 text-center"
          >
            I made a little something for you
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="mt-16 text-gray-500 animate-bounce"
          >
            ↓ scroll to begin ↓
          </motion.div>
        </section>
      </ChapterObserver>

      {/* CHAPTER 2: The Celebration */}
      <ChapterObserver chapterIndex={1} onChapterChange={setCurrentChapter}>
        <section
          className="min-h-screen flex items-center justify-center relative overflow-hidden
    bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-600"
        >
          {/* Soft glow overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          {/* Text */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.3, type: "spring", bounce: 0.5 }}
            viewport={{ once: true }}
            className="text-center relative z-10"
          >
            {/* HAPPY */}
            <h2
              className="text-7xl md:text-9xl mb-6 font-[cursive]
        bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200
        bg-clip-text text-transparent
        drop-shadow-[0_0_35px_rgba(255,255,255,0.8)]"
            >
              {["H", "A", "P", "P", "Y"].map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 90, rotate: -12 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: i * 0.18,
                    duration: 0.8,
                    type: "spring",
                  }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h2>

            {/* BIRTHDAY */}
            <h2
              className="text-7xl md:text-9xl font-[cursive]
        bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200
        bg-clip-text text-transparent
        drop-shadow-[0_0_45px_rgba(255,255,255,0.9)]"
            >
              {["B", "I", "R", "T", "H", "D", "A", "Y"].map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 90, rotate: 12 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: (i + 5) * 0.18,
                    duration: 0.8,
                    type: "spring",
                  }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </motion.div>

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
                background: [
                  "#ffd166",
                  "#ff7aa2",
                  "#b388ff",
                  "#72ddf7",
                  "#caffbf",
                ][i % 5],
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
        </section>
      </ChapterObserver>

      {/* CHAPTER 3: The Journey */}
      <ChapterObserver chapterIndex={2} onChapterChange={setCurrentChapter}>
        <section className="bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
          {/* Texts close together */}
          <div className="min-h-56 flex flex-col items-center justify-center gap-6 px-4">
            <SlideInText className="text-4xl md:text-6xl text-center font-serif tracking-wide">
              How far have we come, huh?
            </SlideInText>

            <SlideInText className="text-3xl md:text-5xl text-gray-300 text-center italic">
              From the day we first met
            </SlideInText>
          </div>

          {/* First image – gentle memory rise */}
          <div className="min-h-7 flex items-center justify-center">
            <ScrollRevealImage
              src={ASSETS.images.firstMet}
              alt="First met"
              className="max-w-4xl w-full rounded-2xl
          shadow-2xl shadow-purple-500/30"
            />
          </div>

          {/* Second text */}
          <div className="min-h-56 flex items-center justify-center px-4">
            <SlideInText className="text-3xl md:text-5xl text-gray-300 text-center italic">
              Or the day we really met
            </SlideInText>
          </div>

          {/* Second image – emotional zoom */}
          <div className="min-h-56 flex items-center justify-center">
            <ScrollRevealImage
              src={ASSETS.images.reallyMet}
              alt="Really met"
              zoom
              className="max-w-4xl w-full rounded-2xl
          shadow-[0_0_80px_rgba(180,140,255,0.35)]"
            />
          </div>

          {/* Final line */}
          <div className="min-h-screen flex items-center justify-center px-4">
            <SlideInText className="text-3xl md:text-5xl text-center font-serif tracking-wide">
              Who thought we would come this far?
            </SlideInText>
          </div>
        </section>
      </ChapterObserver>

      {/* CHAPTER 4: The Impact */}
      <ChapterObserver chapterIndex={3} onChapterChange={setCurrentChapter}>
        <section className="bg-gradient-to-b from-black to-purple-900">
          <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-red-600 via-pink-500 to-purple-700 overflow-hidden">
            {/* Floating angry emojis */}
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
                  x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
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

            {/* Center text */}
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

          <div className="min-h-screen flex items-center justify-center">
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
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>

          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 relative overflow-hidden px-4">
            {/* Image at center */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 120 }}
              viewport={{ once: false, amount: 0.3 }}
              className="w-2/3 md:w-1/2 max-w-xl rounded-2xl shadow-2xl z-10"
            >
              <img
                src={ASSETS.images.crush}
                alt="Beautiful"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* Rotated text in top-left */}
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
              className="text-3xl md:text-5xl font-serif text-white z-20 absolute top-28 left-8"
            >
              and be my first crush
            </motion.p>
          </div>
          <div className="min-h-96 flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, type: "spring", stiffness: 120 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
            >
              Then slowly made me fall for you
            </motion.p>
          </div>
          <div className="py-32 space-y-24 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 overflow-x-visible">
            {/* First text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
            >
              From this
            </motion.p>

            {/* Two images side by side, overlapping slightly */}
            {/* 1. Change the wrapper from <div> to <motion.div> */}
            <motion.div
              className="relative flex justify-center items-center overflow-x-visible"
              // 2. The PARENT handles the detection
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              {/* Left image */}
              <motion.img
                src={ASSETS.images.ramna1}
                alt="Left"
                // 3. Child uses variants to know what to do
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

              {/* Right image */}
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

            {/* Next text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-3xl md:text-5xl text-center px-4 font-serif text-purple-900 drop-shadow-lg"
            >
              to this
            </motion.p>

            {/* Two images side by side, overlapping slightly */}
            {/* 1. Change the wrapper from <div> to <motion.div> */}
            <motion.div
              className="relative flex justify-center items-center overflow-x-visible"
              // 2. The PARENT handles the detection
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              {/* Left image */}
              <motion.img
                src={ASSETS.images.dominos1}
                alt="Left"
                // 3. Child uses variants to know what to do
                variants={{
                  hidden: { x: -100, rotate: -12.5, opacity: 0 },
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
                className="w-1/2 max-w-[180px] sm:w-5/12 md:w-1/3 rounded-xl shadow-lg z-10"
              />

              {/* Right image */}
              <motion.img
                src={ASSETS.images.dominos2}
                alt="Right"
                variants={{
                  hidden: { x: 100, rotate: 12.5, opacity: 0 },
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
            {/* TRIFECTA SECTION */}
            {/* 1. Parent Wrapper handles the viewport trigger */}
            <motion.div
              className="relative flex justify-center items-center h-64 sm:h-80 overflow-x-visible"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              {/* --- Left Image (Rotated Left) --- */}
              <motion.img
                src={ASSETS.images.tour1}
                alt="Left"
                variants={{
                  hidden: { x: -80, y: 20, rotate: -20, opacity: 0 },
                  visible: {
                    x: 20, // Moves slightly right to overlap center
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
                // z-10 puts it behind the center image
                className="w-1/3 max-w-[160px] rounded-xl shadow-lg z-10 border-2 border-white/50"
              />

              {/* --- Center Image (Straight & Front) --- */}
              <motion.img
                src={ASSETS.images.tour2}
                alt="Center"
                variants={{
                  hidden: { y: 100, opacity: 0, scale: 0.8 },
                  visible: {
                    y: -20, // Pops up slightly higher than the others
                    opacity: 1,
                    scale: 1.1, // Slightly larger
                    transition: {
                      duration: 1.2,
                      delay: 0.1,
                      type: "spring",
                      stiffness: 120,
                    },
                  },
                }}
                // z-20 ensures it sits ON TOP of the left/right images
                className="w-1/3 max-w-[160px] rounded-xl shadow-2xl z-20 border-4 border-white"
              />

              {/* --- Right Image (Rotated Right) --- */}
              <motion.img
                src={ASSETS.images.tour3}
                alt="Right"
                variants={{
                  hidden: { x: 80, y: 20, rotate: 20, opacity: 0 },
                  visible: {
                    x: -20, // Moves slightly left to overlap center
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
                // z-10 puts it behind the center image
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
          {/* "Best Years" Section with Continuous Carousel */}
          <div className="py-24 bg-gradient-to-b from-purple-300 via-indigo-300 to-blue-300 overflow-hidden">
            {/* Text Section */}
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

            {/* Continuous Carousel */}
            <div className="relative w-full overflow-hidden">
              {/* We use a transparent gradient mask on the left and right 
            to make the images fade in/out smoothly at the edges 
          */}
              <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-indigo-300/50 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-blue-300/50 to-transparent z-10" />

              {/* The Moving Track */}
              <motion.div
                className="flex gap-4 sm:gap-8 w-max"
                // We animate x from 0% to -50%.
                // Because we duplicated the images below, -50% is the exact point
                // where the second set begins, creating a seamless loop.
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25, // Adjust speed: Lower = Faster, Higher = Slower
                }}
              >
                {/* We map the images TWICE ([...images, ...images]) to create the loop */}
                {[
                  ASSETS.images.best1,
                  ASSETS.images.best2,
                  ASSETS.images.best3,
                  ASSETS.images.best4,
                  ASSETS.images.best5,
                  ASSETS.images.best6,
                  ASSETS.images.best7, // Duplicating starts here
                  ASSETS.images.best8,
                  ASSETS.images.best9,
                  // ASSETS.images.best4,
                  // ASSETS.images.best5,
                  // ASSETS.images.best6,
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

      {/* CHAPTER 5: The Finale */}
      <ChapterObserver chapterIndex={4} onChapterChange={setCurrentChapter}>
        {/* Changed Background to a Deep Royal Night Gradient for the Finale */}
        <section className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pb-32 overflow-x-hidden text-white">
          {/* Intro Title */}
          <div className="min-h-96 flex items-center justify-center">
            <motion.h3
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              // "Beautiful font" - Serif, italic, tracking wide, distinct color
              className="text-5xl md:text-7xl text-center px-4 font-serif italic tracking-wider text-purple-200 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            >
              So finally, I want to say
            </motion.h3>
          </div>

          {/* The Fairy "Zig-Zag" Section */}
          <div className="flex flex-col items-center gap-32 max-w-2xl mx-auto px-4 my-32">
            {[
              { img: ASSETS.images.redFairy, text: "To my red fairy" },
              { img: ASSETS.images.blueFairy, text: "Blue fairy" },
              { img: ASSETS.images.pinkFairy, text: "Pink fairy" },
              { img: ASSETS.images.sleepingFairy, text: "Sleeping fairy" },
            ].map((fairy, index) => {
              // Logic: Even numbers (0, 2) come from Right. Odd numbers (1, 3) come from Left.
              const comesFromRight = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  // Dynamic Initial State based on direction
                  initial={{
                    opacity: 0,
                    x: comesFromRight ? 100 : -100, // 100 is Right, -100 is Left
                    rotate: comesFromRight ? 5 : -5, // Slight tilt for style
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    rotate: 0,
                  }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  viewport={{ once: false, amount: 0.5 }} // Triggers as you scroll to each one
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="relative group">
                    {/* Glowing effect behind image */}
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

          {/* Happy Birthday Section */}
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

          {/* Final Request & Button */}
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

            <motion.a
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              // Updated button style to match the dark theme
              className="mt-8 px-12 py-6 bg-white/10 backdrop-blur-md border border-white/30 text-white text-2xl font-bold rounded-full hover:bg-white hover:text-purple-900 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              And finally...
            </motion.a>
          </div>
        </section>
      </ChapterObserver>
    </div>
  );
}
