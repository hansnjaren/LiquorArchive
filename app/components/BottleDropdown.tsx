import { useRef } from "react";
import type { Bottle } from "../types";
interface Props {
  bottles: Bottle[];
  search: string;
  setSearch: (v: string) => void;
  selectedBottleId: string | null;
  setSelectedBottleId: (id: string, name: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}
export default function BottleDropdown({
  bottles,
  search,
  setSearch,
  selectedBottleId,
  setSelectedBottleId,
  open,
  setOpen,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredBottles = bottles.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="병 이름을 입력하세요"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedBottleId("", "");
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        autoComplete="off"
      />
      {open && (
        <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded bg-white z-10 shadow">
          {filteredBottles.length === 0 ? (
            <div className="p-2 text-gray-400 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredBottles.map((bottle) => (
              <div
                key={bottle.id}
                className={`p-2 cursor-pointer hover:bg-blue-100 ${
                  selectedBottleId === bottle.id ? "bg-blue-200 font-bold" : ""
                }`}
                onMouseDown={() => {
                  setSelectedBottleId(bottle.id, bottle.name);
                  setOpen(false);
                  inputRef.current?.blur();
                }}
              >
                {bottle.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
