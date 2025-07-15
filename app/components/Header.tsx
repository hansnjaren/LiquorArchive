"use client";

import { TabList } from "./TabList";
import { Tab } from "./Tab";
import Link from "next/link";
import { HEADER_HEIGHT, TAB_LIST_COLOR, TITLE, TITLE_COLOR } from "../constants";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { se } from "date-fns/locale";

function DropdownMenu( { username } : { username: string} ) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭하면 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute right-full top-1/2" ref={dropdownRef}>
      {/* 누르는 영역 */}
      <div
        className="text-white cursor-pointer whitespace-nowrap"
        onClick={() => setOpen((prev) => !prev)}
      >
        Hello, {username}
      </div>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className="absolute text-black mt-2 ml-1 bg-white border border-gray-200 rounded shadow-lg z-50 flex flex-col">
          <Link
            className="p-2"
            href="/mypage"
          >My Page</Link>
          
          <button
            className="p-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener
      ? media.addEventListener("change", listener)
      : media.addListener(listener);

    return () =>
      media.removeEventListener
        ? media.removeEventListener("change", listener)
        : media.removeListener(listener);
  }, [query, matches]);

  return matches;
}

export default function Header({ children }: { children: React.ReactNode }) {
  const height = HEADER_HEIGHT;
  const { data: session, status } = useSession();
  const isMd = useMediaQuery("(min-width: 768px)"); // Tailwind md:와 동일
  return (
    <>
      <div 
        id="header" 
        className="fixed w-full opacity-100 z-50 min-w-[400px]"
        style={{ backgroundColor: TAB_LIST_COLOR }}
        >
        <div 
          className="w-full grid md:justify-center md:items-center"
          style={{ backgroundColor: TITLE_COLOR }}
        >
          <Link
            href="/"
            className={`text-4xl p-[8px] md:w-full text-white block md:text-center`}
          >
            {TITLE}
          </Link>
          <div className="text-white absolute right-0 m-4">
            {!session?.user?.name ? 
              <Link
                href="social-login"
              >
                Login
              </Link>
              :
              isMd ? 
                <Link 
                  href="mypage"
                >{`Hello, ${session?.user?.name}`}</Link>
                :
                <DropdownMenu username={session?.user?.name} />
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
            session && isMd ? 
              <div 
                className="absolute top-3/4 right-0 transform -translate-y-1/2 p-8 cursor-pointer"
                onClick={() =>
                  signOut({ callbackUrl: "/" })
                }
              >
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
