import { BottleCard } from "./BottleCard";
import type { Bottle, Purchase } from "../types";

export function BottleGrid({
  bottles,
  purchases,
  userId,
}: {
  bottles: Bottle[];
  purchases: Purchase[];
  userId: string;
}) {
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
        <BottleCard key={bottle.id} bottle={bottle} purchases={purchases} userId={userId} />
      ))}
    </>
  );
}
