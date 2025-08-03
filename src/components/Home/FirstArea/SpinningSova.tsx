import { useEffect, useState } from "react";

export default function SpinningSova() {
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
        className="absolute bg-gradient-to-br from-purple-400 to-blue-400 rounded-full border border-violet-400 shadow-md"
        style={{
          width: radius * 1.2,
          height: radius * 1.2,
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