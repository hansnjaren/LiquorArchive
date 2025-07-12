import type { Bottle } from "../types";

interface Props {
  bottles: Bottle[];
  search: string;
  setSearch: (val: string) => void;
  selectedBottleId: string | null;
  setSelectedBottleId: (id: string, name: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
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
  const filtered = bottles.filter((b) => b.name.includes(search));
  return (
    <div className="relative">
      <input
        className="w-full border rounded px-3 py-2"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="병 이름을 입력하세요"
      />
      {open && (
        <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-auto">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-500">검색 결과 없음</li>
          ) : (
            filtered.map((bottle) => (
              <li
                key={bottle.id}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => setSelectedBottleId(bottle.id, bottle.name)}
              >
                {bottle.name} ({bottle.category})
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
