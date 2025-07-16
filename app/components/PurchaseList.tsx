import PurchaseListItem from "./PurchaseListItem";
import type { Bottle, Purchase } from "../types";

export default function PurchaseList({
  purchases,
  bottles,
  onItemClick,
}: {
  purchases: Purchase[];
  bottles: Bottle[];
  onItemClick: (purchase: Purchase) => void;
}) {
  const getBottle = (id: string) => bottles.find((b) => b.id === id);
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {purchases.map((purchase) => (
        <PurchaseListItem
          key={purchase.id}
          purchase={purchase}
          bottle={getBottle(purchase.bottleId)}
          onClick={() => onItemClick(purchase)}
        />
      ))}
    </ul>
  );
}

