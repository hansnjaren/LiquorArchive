import { useEffect, useRef, useCallback } from "react";
import type { DrinkType } from "../types";

interface Props {
  bottles: DrinkType[];
  value: string;
  search: string;
  setSearch: (v: string) => void;
  onSelect: (id: string, name: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function DrinkTypeDropdown({
  bottles,
  value,
  search,
  setSearch,
  onSelect,
  open,
  setOpen,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = bottles.filter((bottle) =>
    bottle.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // 외부 클릭 감지 함수 (useCallback으로 고정)
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    },
    [setOpen]
  );

  // ✅ open 상태일 때만 외부 클릭 감지 등록
  useEffect(() => {
    if (!open) return;

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        className="border rounded w-full h-10 px-3"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="술 이름 검색"
        autoComplete="off"
      />
      {open && (
        <ul
          className="absolute z-10 left-0 right-0 bg-white border rounded shadow max-h-48 overflow-y-auto mt-1"
          // onMouseDown={(e) => e.stopPropagation()} // 필요시 사용
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-gray-400">검색 결과 없음</li>
          )}
          {filtered.map((bottle) => (
            <li
              key={bottle.id}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                bottle.id === value ? "bg-blue-50" : ""
              }`}
              onClick={() => {
                onSelect(bottle.id, bottle.name);
                setOpen(false);
                inputRef.current?.blur();
              }}
            >
              {bottle.name} {bottle.abv ? `(${bottle.abv}%)` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
