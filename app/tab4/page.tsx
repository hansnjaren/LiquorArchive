import userData from "../data/user.json"; // 유저 정보(JSON)
import purchases from "../data/purchase.json"; // 구매 내역(JSON)
import { userId } from "../constants";

export default function MyPage() {
  // 유저 정보 가져오기
  const user = userData.find((u) => u.id === userId);

  // 해당 유저의 구매 내역만 필터링
  const userPurchases = purchases.filter((p) => p.userId === userId);

  // 총 병 수 및 총 지출 금액 계산
  const totalQuantity = userPurchases.reduce(
    (sum, p) => sum + (p.quantity ?? 0),
    0
  );
  const totalSpent = userPurchases.reduce(
    (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0),
    0
  );

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">마이페이지</h2>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user?.image ?? "/noImage.png"}
          alt={user?.name ?? "프로필"}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-bold">{user?.name ?? "알 수 없음"}</div>
          <div className="text-gray-600">{user?.email ?? "이메일 미등록"}</div>
        </div>
      </div>
      <div className="bg-gray-50 rounded p-4 mb-6 flex gap-8">
        <div>
          <div className="text-gray-500 text-sm">총 구입 병 수</div>
          <div className="text-xl font-bold text-blue-700">
            {totalQuantity}병
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">총 지출 금액</div>
          <div className="text-xl font-bold text-red-700">
            {totalSpent.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
}
