import { BottleCard } from "./BottleCard";

export function BottleGrid({ bottles }: { bottles: any[] }) {
  if (bottles.length === 0) {
    return (
      <div className="col-span-3 text-gray-500 text-center py-12">
        검색 결과가 없습니다.
      </div>
    );
  }
  return (
    <>
      {bottles.map(bottle => (
        <BottleCard key={bottle.id} bottle={bottle} />
      ))}
    </>
  );
}
