import { userId } from "../constants";
import bottles from "../data/bottle.json";
import purchases from "../data/purchase.json";

const PLACEHOLDER_IMAGE = "/noImage.png";

// 날짜 포맷: yyyy년 mm월 dd일
function formatDateKorean(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}년 ${mm}월 ${dd}일`;
}

export default function BottleListPage() {
  // 구매 병수가 1병 이상인 bottle만 추려서 표시
  const bottlesWithPurchase = bottles.filter((bottle) => {
    const totalQuantity = purchases
      .filter(
        (p) => p.userId === userId && p.bottleId === bottle.id
      )
      .reduce((sum, p) => sum + (p.quantity ?? 0), 0);
    return totalQuantity > 0;
  });

  return (
    <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {bottlesWithPurchase.map((bottle) => {
        // 총 구매 병수
        const totalQuantity = purchases
          .filter(
            (p) => p.userId === userId && p.bottleId === bottle.id
          )
          .reduce((sum, p) => sum + (p.quantity ?? 0), 0);

        // 가장 최근 구매일
        const latestPurchase = purchases
          .filter((p) => p.userId === userId && p.bottleId === bottle.id)
          .sort((a, b) => (a.purchaseDate > b.purchaseDate ? -1 : 1))[0];
        const latestPurchaseDate = latestPurchase
          ? formatDateKorean(latestPurchase.purchaseDate)
          : "-";

        return (
          <div
            key={bottle.id}
            className="border rounded-lg shadow p-4 bg-white flex flex-col gap-2"
          >
            <div className="w-full h-40 mb-2 flex items-center justify-center overflow-hidden rounded">
              <img
                src={bottle.imageUrl ?? PLACEHOLDER_IMAGE}
                alt={bottle.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-lg font-bold">{bottle.name}</div>
            <div>
              <span className="font-semibold">카테고리:</span> {bottle.category}
            </div>
            <div>
              <span className="font-semibold">국가:</span> {bottle.country ?? "-"}
            </div>
            <div>
              <span className="font-semibold">용량:</span> {bottle.volumeMl}ml
            </div>
            <div>
              <span className="font-semibold">도수:</span>{" "}
              {bottle.abv !== null && bottle.abv !== undefined
                ? bottle.abv.toFixed(1) + "%"
                : "-"}
            </div>
            <div>
              <span className="font-semibold">내 구매 병수:</span>{" "}
              <span className="text-blue-600 font-bold">{totalQuantity}병</span>
            </div>
            <div>
              <span className="font-semibold">가장 최근 구매일:</span>{" "}
              <span className="text-green-700 font-semibold">{latestPurchaseDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
