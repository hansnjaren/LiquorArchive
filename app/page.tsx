"use client"

import Image from "next/image";
import { Block } from "./components";
import { useEffect, useRef, useState } from "react";
import { TabList } from "./TabList";
import { Tab } from "./Tab";

export default function Home() {
  const takanashiHoshino = "/32.jpg"
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.getBoundingClientRect().height)
    }
  }, []);

  return (
    <div className="grid justify-center w-full">
      <div id="header" ref={divRef} className="fixed w-full bg-white opacity-100">
        <div className="text-4xl p-[8px] border border-black text-center">Website Title</div>
        <TabList>
          <Tab text="Tab 1" dir="tab1"/>
          <Tab text="Tab 2" dir="tab2"/>
          <Tab text="Tab 3" dir="tab3"/>
          <Tab text="Tab 3" dir="tab4"/>
        </TabList>

      </div>
      <div id="headerPadding" style={{ height: height }}></div>
      <div id="body">
        <div className="relative h-[50vh] w-[60vw] grid place-items-center bg-gray-500 overflow-hidden">
          <video className="absolute top-0 left-0 w-full h-full object-cover object-center" src="title.mp4" autoPlay loop muted playsInline></video>
          <div className="relative z-10 w-[340px] h-[120px] bg-gray-700 flex rounded">
            <Block text="111"></Block>
            <Block text="222"></Block>
            <Block text="333"></Block>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="text-5xl">Placeholder</div>
        <div className="text-4xl">Smoooooooooooooth Operatooooor</div>
        <Image src={takanashiHoshino} width={0} height={0} alt="23.jpg" style={{ width: '100%', height: 'auto' }} sizes="100vw"></Image>
      </div>
    </div>
  )
}
