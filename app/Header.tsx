"use client"

import { TabList } from "./TabList";
import { Tab } from "./Tab";
import Link from "next/link";
import { HEADER_HEIGHT, TITLE } from "./constants"

export default function Header({ children }: { children: React.ReactNode }) {
    const height = HEADER_HEIGHT
    return (
        <>
            <div id="header" className="fixed w-full bg-white opacity-100 z-50">
                <Link href="/" className="text-4xl p-[8px] w-full block border border-black text-center">{TITLE}</Link>
                <TabList>
                    <Tab text="Tab 1" dir="tab1" />
                    <Tab text="Tab 2" dir="tab2" />
                    <Tab text="Tab 3" dir="tab3" />
                    <Tab text="Tab 4" dir="tab4" />
                </TabList>
            </div>
            <div style={{ height: height }}></div>
            <main>
                {children}
            </main>
        </>
    );
}
