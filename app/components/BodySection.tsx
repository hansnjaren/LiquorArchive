// components/BodySection.tsx
"use client"

import { useSession } from "next-auth/react";
import { OVERLAY_BG_LIGHT, OVERLAY_BG_DARK } from "../constants";
import { useEffect, useState } from "react";
import { HomeStat } from "@/types/homeStat.types";
import Link from "next/link";

interface BodySectionProps {
  videoSrc: string;
  latestPurchaseDateStr: string;
  recentTotalQuantity: number;
  recentTotalSpent: number;
  formatDate: (dateStr: string) => string;
}

export function BodySection({
  videoSrc,
  latestPurchaseDateStr,
  recentTotalQuantity,
  recentTotalSpent,
  formatDate,
}: BodySectionProps) {
  const [stats, setStats] = useState<HomeStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/homeStats");
        if (!res.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }
        const data: HomeStat = await res.json();
        setStats(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // if (!stats && !loading) return <div>데이터 없음</div>;
  // if (error) return <div>에러 발생: {error}</div>;

  return (
    <div id="body" className="w-full">
      <div className="relative h-[50vh] w-full grid place-items-center bg-gray-500 overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div
          className="relative z-10 flex rounded-xl"
          style={{ backgroundColor: OVERLAY_BG_LIGHT }}
        >
          {loading ? (
            <div
              className="flex mx-[5px] md:mx-0">
              <BlockSkeleton title="🗓️" />
              <BlockSkeleton title="🍾" />
              <BlockSkeleton title="🍻" />
            </div>
          ) : stats ? (
            <div
              className="flex mx-[5px] md:mx-0">
              <Block
                title="🗓️"
                data={formatDate(stats.recentPurchaseDate)}
              />
              <Block
                title="🍾"
                data={stats.recentPurchaseBottleName}
              />
              <Block
                title="🍻"
                data={`${stats.drinkingDaysLast30.toString()} 일`}
              />
            </div>
          ) : (
            <Link
              href="/social-login"
              className="w-[420px] h-[140px] md:w-[660px] md:h-[220px] relative z-10 flex justify-center items-center rounded-xl"
            >
              <div 
                className="text-3xl md:text-5xl"
              >Login to access Data. </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Block({ title, data }: { title: string; data: string }) {
  return (
    <div
      className="w-[120px] md:w-[200px] h-[120px] md:h-[200px] mx-[5px] my-[10px] md:m-[10px] relative rounded-lg"
      style={{ backgroundColor: OVERLAY_BG_DARK }}
    >
      {/* Title: 중앙 기준 위쪽 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] text-white text-2xl text-center w-full p-2">
        {title}
      </div>
      {/* Data: 중앙 기준 아래쪽 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white text-md md:text-xl text-center w-full p-2">
        {data}
      </div>
    </div>
  );
}

function BlockSkeleton({ title }: { title: string }) {
  return (
    <div
      className="w-[120px] md:w-[200px] h-[120px] md:h-[200px] mx-[5px] my-[10px] md:m-[10px] relative rounded-lg"
      style={{ backgroundColor: OVERLAY_BG_DARK }}
    >
      {/* Title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] text-white text-2xl text-center w-full p-2">
        {title}
      </div>
      {/* Skeleton Placeholder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded bg-gray-400 opacity-25 animate-pulse p-2" />
    </div>
  );
}
