"use client";

import { useEffect, useRef } from "react";

type DrinkLog = {
  locationName?: string;
  locationLat?: number | string;
  locationLng?: number | string;
  date: string;
  note?: string;
  drinks: {
    drinkType: { name: string; abv: number; standardMl: number };
    amountMl: number | string;
  }[];
};

type KakaoMapMarkersProps = {
  logs?: DrinkLog[];
  center?: { lat: number; lng: number };
  isLoggedIn?: boolean;
  mapKey?: string | number;
};

export default function KakaoMapMarkers({
  logs = [],
  center = { lat: 37.5665, lng: 126.978 },
  isLoggedIn = false,
  mapKey,
}: KakaoMapMarkersProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let retryCount = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function tryCreateMap() {
      // ⭐ 1. ref/DOM을 못 찾으면 재시도
      if (!mapRef.current) {
        if (retryCount < 20) {
          console.log("지도 생성 시도. current:", mapRef.current)
          retryCount++;
          timer = setTimeout(tryCreateMap, 200);
        }
        return;
      }

      // ⭐ 2. kakao SDK & center & Map 준비 확인
      if (
        !window.kakao ||
        !window.kakao.maps ||
        !window.kakao.maps.Map ||
        !center
      ) {
        if (retryCount < 20) {
          retryCount++;
          timer = setTimeout(tryCreateMap, 200);
        }
        return;
      }

      // ⭐ 3. (상위 레이아웃 때문일 수도 있기에) div 사이즈 0 아닐 때만!
      if (
        mapRef.current.offsetWidth === 0 ||
        mapRef.current.offsetHeight === 0
      ) {
        if (retryCount < 20) {
          retryCount++;
          timer = setTimeout(tryCreateMap, 200);
        }
        return;
      }

      // === 여기까지 왔으면 진짜로 "한 번만" 생성 ===
      mapRef.current.innerHTML = "";

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 5,
      });

      // 아래부터는 기존 코드 그대로
      const markerGroups: Record<string, DrinkLog[]> = {};
      const bounds = new window.kakao.maps.LatLngBounds();
      const validPositions: kakao.maps.LatLng[] = [];

      logs.forEach((log) => {
        const lat = Number(log.locationLat);
        const lng = Number(log.locationLng);
        if (
          isFinite(lat) &&
          isFinite(lng) &&
          lat >= 33 &&
          lat <= 39 &&
          lng >= 124 &&
          lng <= 132
        ) {
          const pos = new window.kakao.maps.LatLng(lat, lng);
          validPositions.push(pos);
          bounds.extend(pos);

          const key = `${lat},${lng}`;
          markerGroups[key] = markerGroups[key] || [];
          markerGroups[key].push(log);
        }
      });

      let openedInfoWindow: any = null;

      window.kakao.maps.event.addListener(map, "click", () => {
        if (openedInfoWindow) {
          openedInfoWindow.close();
          openedInfoWindow = null;
        }
      });

      Object.entries(markerGroups).forEach(([key, group]) => {
        const [lat, lng] = key.split(",").map(Number);
        const position = new window.kakao.maps.LatLng(lat, lng);

        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(map);

        const content = `
            <div style="min-width:220px;max-height:200px;overflow-y:auto;padding:12px 14px 18px 14px;margin:0 0 2px 0;box-sizing:border-box;background:#fff;border-radius:6px;">
              <div style="font-weight:bold;font-size:16px;margin-bottom:6px;">
                ${group[0].locationName || "알 수 없음"}
              </div>
              <div style="font-size:14px;color:#232323;margin-bottom:10px;">
                총 ${group.length}회 방문
              </div>
              ${group
                .map(
                  (log, idx) => `
                    ${idx !== 0
                      ? `<hr style="margin:2px 0;border:none;border-top:1px solid #e5e7eb;" />`
                      : ""}
                    <div style="font-size:13px;padding:4px 0;margin:0;display:flex;flex-direction:column;gap:2px;line-height:1.7;word-break:keep-all;">
                      <span style="color:#918a7d;">
                        <span style="margin-right:3px;">🕓</span>
                        ${log.date?.slice(0, 16).replace("T", " ") ?? "-"}
                      </span>
                      <span style="color:#918a7d;">
                        <span style="margin-right:3px;">🍺</span>
                        <span style="color:#232323;">
                          ${log.drinks
                            ?.map((d) => `${d.drinkType.name} ${d.amountMl}ml`)
                            .join(", ") ?? "기록 없음"}
                        </span>
                      </span>
                      ${
                        log.note
                          ? `<span style="color:#918a7d;"><span style="margin-right:3px;">💬</span><span style="color:#232323;">${log.note}</span></span>`
                          : ""
                      }
                    </div>
                  `
                )
                .join("")}
            </div>
          `;

        const infoWindow = new window.kakao.maps.InfoWindow({ content });

        window.kakao.maps.event.addListener(marker, "click", () => {
          if (openedInfoWindow) {
            openedInfoWindow.close();
          }
          infoWindow.open(map, marker);
          openedInfoWindow = infoWindow;
        });
      });

      if (isLoggedIn && validPositions.length >= 2) {
        map.setBounds(bounds);
      } else if (isLoggedIn && validPositions.length === 1) {
        map.setCenter(validPositions[0]);
        map.setLevel(4);
      } else {
        map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
        map.setLevel(7);
      }
    }

    tryCreateMap();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [logs, center, isLoggedIn, mapKey]);

  return <div ref={mapRef} className="absolute inset-0 w-full h-full" />;
}
