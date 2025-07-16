"use client";

import { useRef, useEffect, useState } from "react";
import { BottleCard } from "../components/BottleCard";
import { useSession } from "next-auth/react";
import { CARD_COLOR, TAB_LIST_COLOR } from "../constants";
import { BottleSkeletonCard } from "../components/BottleSkeletonCard";
import { lora, merriweather, montserrat, roboto, robotoCondensed } from "../fonts";

export default function MapTestPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const { data: session } = useSession()

  return (
    <>
      <span className={`text-9xl ${robotoCondensed.className}`}>&#8595;</span>
      <span className={`text-9xl ${merriweather.className}`}>&#8595;</span>
      <span className={`text-9xl ${lora.className}`}>&#8595;</span>
      <span className={`text-9xl ${montserrat.className}`}>&#8595;</span>
      <span className={`text-9xl ${roboto.className}`}>&#8595;</span>
    </>

  );
}
