import Image from "next/image";
import React from "react";

const ItemsAndAuth = () => {
  return (
    <div className="flex items-center md:gap-[.5vw] gap-[1vh]">
      <div aria-label="nav-items" title="github" className="cursor-pointer">
        <Image
          src="/github.avif"
          width={50}
          height={50}
          alt="github"
          loading="lazy"
          className="md:h-[2vw] md:w-[2vw] h-[3.5vh] w-[3.5vh] rounded-lg"
        />
      </div>

      <div aria-label="nav-items" title="linkdin" className="cursor-pointer">
        <Image
          src="/message.avif"
          width={50}
          height={50}
          loading="lazy"
          alt="linkdin"
          className="md:h-[2vw] md:w-[2vw] h-[3.5vh] w-[3.5vh] rounded-lg"
        />
      </div>
    </div>
  );
};

export default ItemsAndAuth;
