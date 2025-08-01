"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center dark:bg-black">
      <div className="flex gap-2">
        <span className="loader-dot"></span>
        <span className="loader-dot delay-150"></span>
        <span className="loader-dot delay-300"></span>
      </div>
    </div>
  );
}
