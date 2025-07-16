"use client";

import { useEffect, useState } from "react";
import purchases from "./data/purchase.json";
import { userId } from "./constants";
import { BodySection } from "./components/BodySection";
import { useSession } from "next-auth/react";
import KakaoMapMarkers from "./components/KakaoMapMarkers";
import { merriweather } from "./fonts";
import Link from "next/link";
import Script from "next/script";

function formatDate(dateStr: string): string {
  if (!dateStr) return "구입 내역 없음";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "구입 내역 없음";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy} / ${mm} / ${dd}`;
}

export default function Home() {
  const now = new Date();
  const userPurchases = purchases.filter((p) => p.userId === userId);
  const latestPurchaseDateStr = userPurchases.length
    ? userPurchases
        .map((p) => p.purchaseDate)
        .sort((a, b) => (a > b ? -1 : 1))[0]
    : "";

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const recentPurchases = userPurchases.filter(
    (p) => new Date(p.purchaseDate) >= thirtyDaysAgo
  );

  const recentTotalQuantity = recentPurchases.reduce(
    (sum, p) => sum + (p.quantity ?? 0),
    0
  );

  const recentTotalSpent = recentPurchases.reduce(
    (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0),
    0
  );

  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [kakaoReady, setKakaoReady] = useState(false);

  // ✅ Script onLoad에서 kakaoReady true (최초 Script 로드)
  const handleKakaoScriptLoad = () => {
    if (
      window.kakao &&
      window.kakao.maps &&
      typeof window.kakao.maps.load === "function"
    ) {
      window.kakao.maps.load(() => {
        setKakaoReady(true);
      });
    }
  };

  // ✅ SPA 재진입(마이페이지 등) 시 이미 SDK가 있다면 바로 kakaoReady true
  useEffect(() => {
    if (
      !kakaoReady &&
      window.kakao &&
      window.kakao.maps &&
      typeof window.kakao.maps.Map === "function"
    ) {
      setKakaoReady(true);
    }
  }, []);

  // 기록 데이터 불러오기 (로그인 시)
  useEffect(() => {
    if (status !== "authenticated") {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/drinkingLogs/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [status]);

  // 로그인한 경우 logs에서 center 지정
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!logs || logs.length === 0) return;
    if (center) return;
    const first = logs.find(
      (log) => log.locationLat && log.locationLng
    );
    if (first) {
      setCenter({
        lat: Number(first.locationLat),
        lng: Number(first.locationLng),
      });
    }
  }, [status, logs]);

  // 비로그인 시 현재 위치
  useEffect(() => {
    if (status === "authenticated") return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter({ lat: 37.5665, lng: 126.978 })
    );
  }, [status]);

  return (
    <div className="grid place-items-center w-full">
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={handleKakaoScriptLoad}
      />


      <BodySection
        videoSrc="title.mp4"
        latestPurchaseDateStr={latestPurchaseDateStr}
        recentTotalQuantity={recentTotalQuantity}
        recentTotalSpent={recentTotalSpent}
        formatDate={formatDate}
      />

      <div id="footer" className="w-full md:w-[60%] p-4">
        <div className="h-[40vh] flex flex-col items-center justify-center">
          <span className="text-5xl">Check where did you drink</span>
          <span className={`text-9xl ${merriweather.className}`}>&#8595;</span>
        </div>
        <div className="h-[90vh] relative flex items-center justify-center">
          {!loading && center && kakaoReady ? (
            <KakaoMapMarkers
              logs={logs}
              center={center}
              isLoggedIn={status === "authenticated"}
              mapKey={`${status}-${center?.lat}-${center?.lng}-${logs.length}`}
            />
          ) : null}

          {status !== "authenticated" && (
            <Link href="/social-login">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <span className="text-5xl text-white">
                  Login to access data.
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
