import Image from "next/image";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Layouts/Skeleton";

const SpinningSova = dynamic(() => import('./SpinningSova'), {
  ssr: false,
});

const GetStarted = dynamic(() => import('./GetStarted'), {
  ssr: false,
  loading: () => <Skeleton className="rounded-lg" width="w-full md:w-[10vw]" height="md:h-[3vw] h-[5.5vh]" animation="shimmer"/>,
});

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
            Whether it&apos;s one-on-one chats or everyday groups, Sova keeps
            you close, with zero hassle and full focus.
          </p>

          <div className="ml-5">
            <SpinningSova />
          </div>
        </div>

        <div className="">
          <GetStarted />
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
