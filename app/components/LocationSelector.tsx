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
  const [keyword, setKeyword] = useState(value?.placeName ?? "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [debugState, setDebugState] = useState<any>({});

  useEffect(() => {
    const getDebugInfo = (label = "") => ({
      label,
      kakao: typeof window !== "undefined" && !!window.kakao,
      kakaoMaps: typeof window !== "undefined" && !!window.kakao?.maps,
      mapRef: !!mapRef.current,
      offsetWidth: mapRef.current?.offsetWidth,
      offsetHeight: mapRef.current?.offsetHeight,
      value,
      map: !!map,
      marker: !!marker,
    });

    setDebugState(getDebugInfo("mounted"));

    if (
      typeof window === "undefined" ||
      !window.kakao ||
      !window.kakao.maps ||
      !mapRef.current ||
      map
    )
      return;

    window.kakao.maps.load(() => {
      setDebugState(getDebugInfo("kakao.maps.load 실행됨"));

      const fallbackCenter = new window.kakao.maps.LatLng(37.5665, 126.9780);

      const createMapWithCenter = (center: any) => {
        const instance = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });
        setMap(instance);

        setTimeout(() => {
          instance.relayout();
          instance.setCenter(center);
        }, 300);
      };

      // 1. value가 있으면 해당 좌표로 시작
      if (value) {
        const center = new window.kakao.maps.LatLng(value.lat, value.lng);
        createMapWithCenter(center);
      }
      // 2. 현재 위치 사용 (geolocation)
      else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const center = new window.kakao.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            createMapWithCenter(center);

            // ✅ 위치가 선택되지 않은 상태일 때, 현재 위치를 선택값으로 설정
            onChange({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              placeName: "", // 장소 이름은 빈 값이지만 좌표는 셋업됨
            });
          },
          () => {
            createMapWithCenter(fallbackCenter);
          }
        );
      }
      // 3. geolocation 지원 안되면 fallback
      else {
        createMapWithCenter(fallbackCenter);
      }
    });
  }, [value]);

  // value 변경 → 마커 이동
  useEffect(() => {
    if (!map || !value || !window.kakao?.maps) return;

    const coords = new window.kakao.maps.LatLng(value.lat, value.lng);
    map.setCenter(coords);
    if (marker) marker.setMap(null);
    const mk = new window.kakao.maps.Marker({ map, position: coords });
    setMarker(mk);
  }, [value, map]);

  // 장소 검색
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);

    if (
      !val.trim() ||
      !map ||
      !window.kakao?.maps?.services
    ) {
      setSuggestions([]);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(val, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    });
  };

  // 장소 선택
  const handleSelect = (place: any) => {
    if (!window.kakao?.maps || !map) return;

    const coords = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(coords);
    if (marker) marker.setMap(null);

    const mk = new window.kakao.maps.Marker({ map, position: coords });
    setMarker(mk);
    setKeyword(place.place_name);
    setSuggestions([]);

    onChange({
      lat: Number(place.y),
      lng: Number(place.x),
      placeName: place.place_name,
    });
  };

  // 디버깅 출력
  useEffect(() => {
    console.log("🧪 지도 디버깅:", debugState);
  }, [debugState]);

  return (
    <div>
      {/* 검색 입력 */}
      <div className="relative w-full">
        <input
          value={keyword}
          onChange={handleInputChange}
          placeholder="장소 검색"
          className="w-full border p-2 rounded"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 z-10 bg-white border rounded shadow max-h-60 overflow-y-auto">
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

      {/* 지도 */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "300px",
          borderRadius: 12,
          marginTop: 16,
          background: "#eee",
        }}
        className="shadow"
      />
    </div>
  );
}
