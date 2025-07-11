import { userId } from "../constants";
import bottles from "../data/bottle.json";
import purchases from "../data/purchase.json";

export default function UserPurchaseListPage() {
  // 해당 유저의 구매 내역만 필터링
  const userPurchases = purchases
  .filter((p) => p.userId === userId)
  .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  // bottleId로 병 정보 매칭
  const getBottle = (bottleId: string) => bottles.find((b) => b.id === bottleId);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        내 구매 내역 ({userPurchases.length})
      </h2>
      {userPurchases.length === 0 ? (
        <div className="text-gray-500">구매 내역이 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {userPurchases.map((purchase) => {
            const bottle = getBottle(purchase.bottleId);

            return (
              <li
                key={purchase.id}
                className="border rounded-lg shadow p-4 bg-white flex gap-4 items-center"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={bottle?.imageUrl ?? "/noImage.png"}
                    alt={bottle?.name ?? "알 수 없음"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold">
                    {bottle?.name ?? "알 수 없음"}
                  </div>
                  <div className="text-sm text-gray-600">
                    카테고리: {bottle?.category ?? "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    구매일: {purchase.purchaseDate?.slice(0, 10) ?? "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    가격: {purchase.price ? `${purchase.price.toLocaleString()}원` : "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    장소: {purchase.place ?? "-"}
                  </div>
                  <div className="text-sm text-blue-700 font-semibold">
                    병 수: {purchase.quantity ?? 1}병
                  </div>
                  {purchase.memo && (
                    <div className="text-xs text-gray-400 mt-1">
                      메모: {purchase.memo}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
