import React, { useEffect, useState } from "react";
import Image from "next/image";

function SpinningSova() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  const text = "sova • sova • sova • sova •";
  const letters = text.split("");
  const radius = 60;
  const diameter = radius * 2;

  return (
    <div
      className="relative"
      style={{
        width: diameter,
        height: diameter,
        animation: "spin 10s linear infinite",
      }}
    >
      {/* 🔵 Bigger Center Circle */}
      <div
        className="absolute bg-gradient-to-br from-purple-400 to-blue-400 rounded-full 
                   border border-violet-400 shadow-md"
        style={{
          width: radius * 0.9,
          height: radius * 0.9,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      />

      {/* 🔠 Circular Text */}
      {letters.map((letter, index) => {
        const angle = (360 / letters.length) * index;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius + radius;
        const y = Math.sin(rad) * radius + radius;

        return (
          <span
            key={index}
            className="absolute text-zinc-700 dark:text-zinc-200 text-[0.85vw] font-medium"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
              transformOrigin: "center",
              whiteSpace: "pre",
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
}

const FirstArea = () => {
  return (
    <div className="w-full flex md:flex-row flex-col select-none">
      <div className="flex-1/2 flex-col transform md:translate-y-[10vw] translate-y-[4vh]">
        <h1 className="md:text-[3vw] tracking-tight leading-none text-[4vh] font-semibold">
          Chat faster feel <br /> closer stay connected <br />
          with{" "}
          <span className="inline-block font-prime text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
            Sova
          </span>{" "}
          today
        </h1>

        <div className="hidden md:flex md:mt-[2vw]">
          <p className="md:text-[1vw] w-[30vw]">
            Sova brings the future of messaging to your fingertips. Fast,
            private, and beautifully designed for real-life conversations.
            Whether it&apos;s one-on-one chats or everyday groups, Sova keeps you
            close, with zero hassle and full focus.
          </p>

          <div className="ml-5">
            <SpinningSova />
          </div>
        </div>
      </div>

      <div className="flex-1/2 mt-[9vh] md:mt-[2vw]">
        <Image
          src="/main-banner.webp"
          width={2000}
          height={2000}
          alt="main-banner"
          loading="eager"
          priority
          className="md:w-[40vw] w-full object-contain"
        />
      </div>
    </div>
  );
};

export default FirstArea;
