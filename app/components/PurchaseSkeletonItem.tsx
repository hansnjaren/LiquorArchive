// components/PurchaseSkeletonItem.tsx
export default function PurchaseSkeletonItem() {
  return (
    <li className="animate-pulse border rounded-xl shadow p-4 bg-gray-100 flex gap-4 items-center h-[162px]">
      <div className="w-24 h-24 bg-gray-300 rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </li>
  );
}
