"use client";

import { TabList } from "./TabList";
import { Tab } from "./Tab";
import Link from "next/link";
import { HEADER_HEIGHT, TAB_LIST_COLOR, TITLE, TITLE_COLOR } from "../constants";
import { signOut, useSession } from "next-auth/react";

export default function Header({ children }: { children: React.ReactNode }) {
  const height = HEADER_HEIGHT;
  const { data: session, status } = useSession();
  return (
    <>
      <div 
        id="header" 
        className="fixed w-full opacity-100 z-50 min-w-[600px]"
        style={{ backgroundColor: TAB_LIST_COLOR }}
        >
        <div 
          className="grid justify-center items-center"
          style={{ backgroundColor: TITLE_COLOR }}
        >
          <Link
            href="/"
            className={`text-4xl p-[8px] w-full text-white block text-center`}
          >
            {TITLE}
          </Link>
          <div className="text-white absolute right-0 m-4">
            {session?.user?.name ? 
              <Link 
                href="mypage"
              >{`Hello, ${session?.user?.name}`}</Link>
               : 
              <Link
              href="social-login"
              >
                Login
              </Link>
            }
          </div>
        </div>
        <div>
          <TabList>
            <Tab text="Purchase List" dir="purchase-list" />
            <Tab text="Collections" dir="collections" />
            <Tab text="Log Calendar" dir="log-calendar" />
          </TabList>
          {
            session ? 
              <div 
                className="absolute top-3/4 right-0 transform -translate-y-1/2 p-8 cursor-pointer"
                onClick={() =>
                  signOut({ callbackUrl: "/" })
                }>
                Logout
              </div> : 
              <></>
          }
        </div>
      </div>
      <div style={{ height: height }}></div>

      <main>{children}</main>
    </>
  );
}
