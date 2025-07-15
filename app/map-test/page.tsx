"use client";

import { useRef, useEffect, useState } from "react";

export default function MapTestPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  // 지도 초기화
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.kakao &&
      window.kakao.maps &&
      mapRef.current
    ) {
      const initMap = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      });
      setMap(initMap);
    }
  }, []);

  // 키워드 변경 시 자동완성 검색
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (!value.trim() || !map) {
      setSuggestions([]);
      setSelectedPlace(null);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(value, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    });
    setSelectedPlace(null);
  };

  // 추천 장소 선택
  const handleSelectPlace = (place: any) => {
    const coords = new window.kakao.maps.LatLng(place.y, place.x);

    if (marker) marker.setMap(null);

    const newMarker = new window.kakao.maps.Marker({
      map,
      position: coords,
    });

    setMarker(newMarker);
    map.setCenter(coords);
    setSuggestions([]);
    setKeyword(place.place_name); // input창 업데이트
    setSelectedPlace(place);
  };

  // 확정 버튼 클릭 시
  const handleConfirm = () => {
    if (!selectedPlace) {
      alert("장소를 먼저 선택하세요!");
      return;
    }
    alert(
      `확정된 장소: ${selectedPlace.place_name}\n좌표: (${selectedPlace.y}, ${selectedPlace.x})`
    );
    // (여기에 서버 저장, 상위 전달 등 원하는 로직 추가)
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 p-4">
      <div className="mb-2 w-[300px] relative">
        <input
          value={keyword}
          onChange={handleInputChange}
          placeholder="장소 키워드 검색"
          className="w-full border p-2 rounded"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow z-10 max-h-64 overflow-y-auto">
            {suggestions.map((place) => (
              <li
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              >
                {place.place_name}{" "}
                {!!place.road_address_name && (
                  <span className="text-sm text-gray-500">({place.road_address_name})</span>
                )}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedPlace}
          className="mt-2 w-full px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
        >
          확정
        </button>
      </div>
      <div
        ref={mapRef}
        style={{ width: 400, height: 400, borderRadius: 12 }}
        className="bg-white shadow"
      />
    </div>
  );
}
