"use client";

import { TabList } from "./TabList";
import { Tab } from "./Tab";
import Link from "next/link";
import { HEADER_HEIGHT, TITLE } from "../constants";

export default function Header({ children }: { children: React.ReactNode }) {
  const height = HEADER_HEIGHT;
  return (
    <>
      <div id="header" className="fixed w-full bg-white opacity-100 z-50">
        <Link
          href="/"
          className="text-4xl p-[8px] w-full block border border-black text-center"
        >
          {TITLE}
        </Link>
        <TabList>
          <Tab text="Collections" dir="tab1" />
          <Tab text="Purchase List" dir="tab2" />
          <Tab text="Log Calendar" dir="tab3" />
          <Tab text="My Page" dir="tab4" />
        </TabList>
      </div>
      <div style={{ height: height }}></div>
      <main>{children}</main>
    </>
  );
}
