"use client";

import { robotoCondensed } from "./fonts";

export function Block({ title, data }: { title: string; data: string }) {
  return (
    <div className="w-[150px] h-[150px] bg-gray-900/75 ml-[20px] mt-[20px] flex flex-col justify-center items-center rounded">
      <div
        className={`text-center text-white w-full text-2xl m-[8px] ${robotoCondensed.className}`}
      >
        {title}
      </div>
      <div
        className={`text-center text-white w-full text-xl ${robotoCondensed.className}`}
      >
        {data}
      </div>
    </div>
  );
}
