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
  const [keyword, setKeyword] = useState(value?.placeName || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  // 최초 로딩: value가 있으면 그 위치, 없으면 geolocation(현재위치), fallback(서울)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.kakao &&
      window.kakao.maps &&
      mapRef.current
    ) {
      if (map) return;

      let center;
      if (value) {
        center = new window.kakao.maps.LatLng(value.lat, value.lng);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const cent = new window.kakao.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            const newMap = new window.kakao.maps.Map(mapRef.current, {
              center: cent,
              level: 3,
            });
            setMap(newMap);
          },
          () => {
            center = new window.kakao.maps.LatLng(37.5665, 126.9780); // 서울
            setMap(
              new window.kakao.maps.Map(mapRef.current, {
                center,
                level: 3,
              }),
            );
          }
        );
        return;
      } else {
        center = new window.kakao.maps.LatLng(37.5665, 126.9780); // 서울
      }

      setMap(
        new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        }),
      );
    }
    // eslint-disable-next-line
  }, [window.kakao, value, mapRef.current]);

  // value가 바뀌면 지도·마커 위치 갱신
  useEffect(() => {
    if (
      map &&
      value &&
      value.lat &&
      value.lng
    ) {
      const coords = new window.kakao.maps.LatLng(value.lat, value.lng);
      map.setCenter(coords);
      if (marker) marker.setMap(null);
      const mk = new window.kakao.maps.Marker({ map, position: coords });
      setMarker(mk);
    }
    // eslint-disable-next-line
  }, [value, map]);

  // 장소 검색 (입력)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);

    if (
      !val.trim() ||
      !window.kakao ||
      !window.kakao.maps.services ||
      !map
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

  // 결과 중 하나 선택
  const handleSelect = (place: any) => {
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

  return (
    <div>
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
      <div
        ref={mapRef}
        style={{
          width: 400,
          height: 300,
          borderRadius: 12,
          marginTop: 16,
          background: "#eee",
        }}
        className="shadow"
      />
    </div>
  );
}
