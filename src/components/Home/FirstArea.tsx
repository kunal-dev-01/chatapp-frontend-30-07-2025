import React from "react";
import Image from "next/image";

const FirstArea = () => {
  return (
    <div className="w-full flex md:flex-row flex-col select-none">
      <div className="flex-1/2 transform md:translate-y-[10vw] translate-y-[4vh]">
        <h1 className="md:text-[3vw] tracking-tight leading-none text-[4vh] font-semibold">
          Chat faster feel <br /> closer stay connected <br />
          with{" "}
          <span className="inline-block font-prime text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
            Sova
          </span>{" "}
          today
        </h1>
      </div>

      <div className="flex-1/2 mt-[9vh] md:mt-0">
        <Image
          src="/main-banner.webp"
          width={4000}
          height={4000}
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
