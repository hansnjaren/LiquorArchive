"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationValue {
  lat: number;
  lng: number;
  placeName: string;
}

interface Props {
  value?: LocationValue;
  onChange: (loc: LocationValue | null) => void;
}

export default function LocationSelector({ value, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const [keyword, setKeyword] = useState(value?.placeName ?? "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [open, setOpen] = useState(false);

  // ⚠️ 반드시 value 변경 영향 제거 → map & SDK 준비 이후에만 실행
  const initialValueRef = useRef(value);

  // 1. Kakao Maps SDK 로드 및 지도 초기화
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current) return;
    if (map) return;

    const fallbackCenter = { lat: 37.5665, lng: 126.978 };

    function createMap(center: { lat: number; lng: number }) {
      const kakao = window.kakao;

      const mapInstance = new kakao.maps.Map(mapRef.current!, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 3,
      });
      setMap(mapInstance);

      const checkServices = setInterval(() => {
        if (kakao.maps.services) {
          clearInterval(checkServices);
          setSdkReady(true);
          console.log("✅ Kakao Maps SDK 로드 완료");
        }
      }, 50);
    }

    const loadMap = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          if (initialValueRef.current) {
            createMap(initialValueRef.current);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userCenter = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                createMap(userCenter);
                onChange({ ...userCenter, placeName: "" });
              },
              () => createMap(fallbackCenter)
            );
          } else {
            createMap(fallbackCenter);
          }
        });
      }
    };

    loadMap();
  }, [map, onChange]);

  // 2. 마커 위치 반영 (`sdkReady` 이후에만)
  useEffect(() => {
    if (!map || !sdkReady || !value) return;
    if (!window.kakao?.maps?.LatLng) return;

    const coords = new window.kakao.maps.LatLng(value.lat, value.lng);
    map.setCenter(coords);

    if (marker) marker.setMap(null);

    const newMarker = new window.kakao.maps.Marker({
      map,
      position: coords,
    });
    setMarker(newMarker);

    console.log("📍 마커 위치 갱신:", coords);
  }, [map, sdkReady, value]);

  // 3. 장소 검색 기능
  useEffect(() => {
    if (!sdkReady || !keyword.trim() || !map) {
      setSuggestions([]);
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: any[], status: string) => {
      if (
        status === window.kakao.maps.services.Status.OK &&
        data.length > 0
      ) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    });
  }, [sdkReady, keyword, map]);

  // 4. 장소 선택 시
  const handleSelect = (place: any) => {
    if (!map || !window.kakao.maps.LatLng) return;

    const coords = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(coords);

    if (marker) marker.setMap(null);
    const newMarker = new window.kakao.maps.Marker({
      map,
      position: coords,
    });
    setMarker(newMarker);

    setKeyword(place.place_name);
    setSuggestions([]);
    setOpen(false);

    onChange({
      lat: Number(place.y),
      lng: Number(place.x),
      placeName: place.place_name,
    });

    console.log("✅ 장소 선택:", place.place_name);
  };

  // 5. 외부 클릭으로 닫기
  useEffect(() => {
    if (!open && suggestions.length === 0) return;

    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSuggestions([]);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open, suggestions.length]);

  return (
    <div>
      <div className="relative w-full">
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className="w-full border p-2 rounded"
          placeholder="장소 검색"
        />

        {open && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto z-50"
          >
            {suggestions.map((place) => (
              <li
                key={place.id}
                onClick={() => handleSelect(place)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              >
                {place.place_name}
                {place.road_address_name && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({place.road_address_name})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "300px",
          marginTop: 16,
          borderRadius: 12,
          background: "#eee",
        }}
        className="shadow"
      />
    </div>
  );
}
