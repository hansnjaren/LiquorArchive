// components/BottleSkeletonCard.tsx

import { TAB_LIST_COLOR } from "../constants";

export function BottleSkeletonCard() {
  return (
    <div className="animate-pulse border rounded-xl shadow p-4 bg-gray-100 flex flex-col gap-3 h-[366px]">
        <div className="w-full h-40 bg-gray-300 rounded-lg"></div>
        <div className="h-7 bg-gray-300 rounded w-3/4 py-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 py-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 py-2"></div>
        <div className="h-6 bg-gray-300 rounded w-2/3 py-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3 py-2"></div>
    </div>
  );
}
