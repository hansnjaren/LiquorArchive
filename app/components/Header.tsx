"use client";

import { TabList } from "./TabList";
import { Tab } from "./Tab";
import Link from "next/link";
import { HEADER_HEIGHT, TAB_LIST_COLOR, TITLE, TITLE_COLOR } from "../constants";

export default function Header({ children }: { children: React.ReactNode }) {
  const height = HEADER_HEIGHT;
  return (
    <>
      <div 
        id="header" 
        className={`fixed w-full opacity-100 z-50`}
        style={{ backgroundColor: `${TAB_LIST_COLOR}`}}
        >
        <Link
          href="/"
          className={`text-4xl p-[8px] w-full text-white block text-center`}
          style={{ backgroundColor: `${TITLE_COLOR}`}}
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
