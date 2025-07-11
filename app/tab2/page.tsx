"use client";
import { useState } from "react";
import bottles from "../data/bottle.json";
import purchases from "../data/purchase.json";
import { userId } from "../constants";
import PurchaseList from "../components/PurchaseList";
import PurchaseAddModal from "../components/PurchaseAddModal";
import PurchaseDetailModal from "../components/PurchaseDetailModal";

export default function UserPurchaseListPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  const userPurchases = purchases
    .filter((p) => p.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          내 구매 내역 ({userPurchases.length})
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          구매 내역 추가
        </button>
      </div>
      {userPurchases.length === 0 ? (
        <div className="text-gray-500">구매 내역이 없습니다.</div>
      ) : (
        <PurchaseList
          purchases={userPurchases}
          bottles={bottles}
          onItemClick={(purchase) => {
            setSelectedPurchase(purchase);
            setShowDetailModal(true);
          }}
        />
      )}
      {showAddModal && (
        <PurchaseAddModal
          bottles={bottles}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showDetailModal && selectedPurchase && (
        <PurchaseDetailModal
          purchase={selectedPurchase}
          bottle={bottles.find((b) => b.id === selectedPurchase.bottleId)}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}

// "use client";

// import { useState, useRef } from "react";
// import { userId } from "../constants";
// import bottles from "../data/bottle.json";
// import purchases from "../data/purchase.json";

// // UUID 생성 함수 (간단 예시)
// function uuidv4() {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0,
//       v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// // ISO 문자열(밀리초 포함)
// function getNowISOStringWithMs() {
//   const now = new Date();
//   const ms = String(now.getMilliseconds()).padStart(3, "0");
//   return now.toISOString().replace("Z", `.${ms}Z`).replace(/\.\d{3}\./, ".");
// }

// export default function UserPurchaseListPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [bottleSearch, setBottleSearch] = useState("");
//   const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
//   const [bottleDropdownOpen, setBottleDropdownOpen] = useState(false);
//   const bottleInputRef = useRef<HTMLInputElement>(null);

//   const [price, setPrice] = useState("");
//   const [place, setPlace] = useState("");
//   const [memo, setMemo] = useState("");
//   const [quantity, setQuantity] = useState("1");
//   const [purchaseDate, setPurchaseDate] = useState(() => {
//     const now = new Date();
//     now.setSeconds(0, 0);
//     return now.toISOString().slice(0, 16);
//   });

//   // 드래그 시작점이 모달 안인지 추적
//   const [dragStartedInsideModal, setDragStartedInsideModal] = useState(false);

//   // 에러 상태
//   const [priceError, setPriceError] = useState("");
//   const [quantityError, setQuantityError] = useState("");

//   // 상세 모달 상태
//   const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);

//   // 병 검색
//   const filteredBottles = bottles.filter((b) =>
//     b.name.toLowerCase().includes(bottleSearch.toLowerCase())
//   );

//   // 유저 구매 내역
//   const userPurchases = purchases
//     .filter((p) => p.userId === userId)
//     .sort(
//       (a, b) =>
//         new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
//     );

//   const getBottle = (bottleId: string) =>
//     bottles.find((b) => b.id === bottleId);

//   // 구매 내역 추가 버튼
//   const handleAddClick = () => {
//     setShowModal(true);
//     setBottleSearch("");
//     setSelectedBottleId(null);
//     setBottleDropdownOpen(false);
//     setPrice("");
//     setPlace("");
//     setMemo("");
//     setQuantity("1");
//     setPurchaseDate(() => {
//       const now = new Date();
//       now.setSeconds(0, 0);
//       return now.toISOString().slice(0, 16);
//     });
//     setPriceError("");
//     setQuantityError("");
//   };

//   const handleCloseModal = () => setShowModal(false);

//   // 실시간 유효성 검사
//   const validatePrice = (val: string) => {
//     if (/^\d+$/.test(val) && Number(val) >= 0) return "";
//     return "가격은 0 이상의 정수만 입력 가능합니다.";
//   };
//   const validateQuantity = (val: string) => {
//     if (/^\d+$/.test(val) && Number(val) >= 1) return "";
//     return "병 수는 1 이상의 자연수만 입력 가능합니다.";
//   };

//   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPrice(e.target.value);
//     setPriceError(validatePrice(e.target.value));
//   };
//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuantity(e.target.value);
//     setQuantityError(validateQuantity(e.target.value));
//   };

//   // 구매 내역 추가
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const priceErr = validatePrice(price);
//     const quantityErr = validateQuantity(quantity);
//     setPriceError(priceErr);
//     setQuantityError(quantityErr);

//     if (!selectedBottleId) {
//       alert("병을 선택하세요.");
//       return;
//     }
//     if (priceErr || quantityErr) return;

//     // purchaseDate: yyyy-MM-ddTHH:mm → ISO + ms
//     const now = new Date();
//     const ms = String(now.getMilliseconds()).padStart(3, "0");
//     const fullDate =
//       purchaseDate.length === 16
//         ? `${purchaseDate}:00.${ms}Z`
//         : getNowISOStringWithMs();

//     const newPurchase = {
//       id: uuidv4(),
//       userId,
//       bottleId: selectedBottleId,
//       purchaseDate: fullDate,
//       price: Number(price),
//       place: place || null,
//       memo: memo || null,
//       createdAt: fullDate,
//       updatedAt: fullDate,
//       quantity: Number(quantity),
//     };

//     alert("구매 내역 추가 정보:\n" + JSON.stringify(newPurchase, null, 2));
//     setShowModal(false);
//   };

//   // 병 선택 드롭다운 관련
//   const handleBottleInputClick = () => setBottleDropdownOpen(true);
//   const handleBottleInputFocus = () => setBottleDropdownOpen(true);
//   const handleBottleInputBlur = () => {
//     setTimeout(() => setBottleDropdownOpen(false), 100);
//   };
//   const handleBottleSelect = (bottleId: string, bottleName: string) => {
//     setSelectedBottleId(bottleId);
//     setBottleSearch(bottleName);
//     setBottleDropdownOpen(false);
//     bottleInputRef.current?.blur();
//   };

//   // 모달 드래그 관련
//   const handleModalMouseDown = () => setDragStartedInsideModal(true);
//   const handleOverlayMouseUp = () => setDragStartedInsideModal(false);
//   const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     // 바깥에서 드래그 시작 시 false로 초기화
//     if (e.target === e.currentTarget) setDragStartedInsideModal(false);
//   };
//   const handleOverlayMouseUpFinal = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (dragStartedInsideModal) {
//       setDragStartedInsideModal(false); // 드래그 시작이 모달 안: 닫지 않음
//     } else {
//       setShowModal(false); // 드래그 시작이 모달 밖: 닫음
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold">
//           내 구매 내역 ({userPurchases.length})
//         </h2>
//         <button
//           onClick={handleAddClick}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           구매 내역 추가
//         </button>
//       </div>
//       {userPurchases.length === 0 ? (
//         <div className="text-gray-500">구매 내역이 없습니다.</div>
//       ) : (
//         <ul className="space-y-4">
//           {userPurchases.map((purchase) => {
//             const bottle = getBottle(purchase.bottleId);

//             return (
//               <li
//                 key={purchase.id}
//                 className="border rounded-lg shadow p-4 bg-white flex gap-4 items-center cursor-pointer"
//                 onClick={() => {
//                   setSelectedPurchase(purchase);
//                   setShowDetailModal(true);
//                 }}
//               >
//                 <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
//                   <img
//                     src={bottle?.imageUrl ?? "/noImage.png"}
//                     alt={bottle?.name ?? "알 수 없음"}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-lg font-bold">
//                     {bottle?.name ?? "알 수 없음"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     카테고리: {bottle?.category ?? "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     구매일: {purchase.purchaseDate?.slice(0, 16).replace('T', ' ') ?? "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     가격:{" "}
//                     {purchase.price
//                       ? `${purchase.price.toLocaleString()}원`
//                       : "-"}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     장소: {purchase.place ?? "-"}
//                   </div>
//                   <div className="text-sm text-blue-700 font-semibold">
//                     병 수: {purchase.quantity ?? 1}병
//                   </div>
//                   {purchase.memo && (
//                     <div className="text-xs text-gray-400 mt-1">
//                       메모: {purchase.memo}
//                     </div>
//                   )}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       {/* 구매 내역 추가 모달 */}
//       {showModal && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onMouseDown={handleOverlayMouseDown}
//           onMouseUp={handleOverlayMouseUpFinal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//             onMouseDown={handleModalMouseDown}
//           >
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
//               aria-label="닫기"
//             >
//               ×
//             </button>
//             <h3 className="text-xl font-bold mb-4 text-center">
//               구매 내역 추가
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* 병 선택 (검색 드롭다운) */}
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   병 선택 (이름 검색)
//                 </label>
//                 <div className="relative">
//                   <input
//                     ref={bottleInputRef}
//                     type="text"
//                     className="w-full border rounded px-3 py-2 mb-2"
//                     placeholder="병 이름을 입력하세요"
//                     value={bottleSearch}
//                     onChange={(e) => {
//                       setBottleSearch(e.target.value);
//                       setSelectedBottleId(null);
//                       setBottleDropdownOpen(true);
//                     }}
//                     onClick={() => setBottleDropdownOpen(true)}
//                     onFocus={() => setBottleDropdownOpen(true)}
//                     onBlur={() => setTimeout(() => setBottleDropdownOpen(false), 100)}
//                     autoComplete="off"
//                   />
//                   {bottleDropdownOpen && (
//                     <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded bg-white z-10 shadow">
//                       {filteredBottles.length === 0 ? (
//                         <div className="p-2 text-gray-400 text-sm">
//                           검색 결과가 없습니다.
//                         </div>
//                       ) : (
//                         filteredBottles.map((bottle) => (
//                           <div
//                             key={bottle.id}
//                             className={`p-2 cursor-pointer hover:bg-blue-100 ${
//                               selectedBottleId === bottle.id ? "bg-blue-200 font-bold" : ""
//                             }`}
//                             onMouseDown={() => handleBottleSelect(bottle.id, bottle.name)}
//                           >
//                             {bottle.name}
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* 구매일(분 단위까지) */}
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   구매일(분 단위까지)
//                 </label>
//                 <input
//                   type="datetime-local"
//                   className="w-full border rounded px-3 py-2"
//                   value={purchaseDate}
//                   onChange={(e) => setPurchaseDate(e.target.value)}
//                   required
//                 />
//               </div>
//               {/* 가격 */}
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   가격(원)
//                 </label>
//                 <input
//                   type="number"
//                   className={`w-full border rounded px-3 py-2 ${
//                     priceError ? "border-red-500" : ""
//                   }`}
//                   min={0}
//                   value={price}
//                   onChange={handlePriceChange}
//                   required
//                 />
//                 {priceError && (
//                   <div className="text-xs text-red-500 mt-1">{priceError}</div>
//                 )}
//               </div>
//               {/* 장소 */}
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   장소(선택)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border rounded px-3 py-2"
//                   value={place}
//                   onChange={(e) => setPlace(e.target.value)}
//                 />
//               </div>
//               {/* 메모 */}
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   메모(선택)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border rounded px-3 py-2"
//                   value={memo}
//                   onChange={(e) => setMemo(e.target.value)}
//                 />
//               </div>
//               {/* 병 수 */}
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   병 수
//                 </label>
//                 <input
//                   type="number"
//                   className={`w-full border rounded px-3 py-2 ${
//                     quantityError ? "border-red-500" : ""
//                   }`}
//                   min={1}
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   required
//                 />
//                 {quantityError && (
//                   <div className="text-xs text-red-500 mt-1">{quantityError}</div>
//                 )}
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
//               >
//                 추가
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 상세 모달 */}
//       {showDetailModal && selectedPurchase && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={() => {
//             setShowDetailModal(false);
//             setSelectedPurchase(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
//             onClick={e => e.stopPropagation()}
//           >
//             <button
//               onClick={() => {
//                 setShowDetailModal(false);
//                 setSelectedPurchase(null);
//               }}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
//               aria-label="닫기"
//             >
//               ×
//             </button>
//             <h3 className="text-xl font-bold mb-4 text-center">
//               구매 내역 상세
//             </h3>
//             <div className="space-y-2">
//               <div>
//                 <strong>병 이름:</strong> {getBottle(selectedPurchase.bottleId)?.name ?? "알 수 없음"}
//               </div>
//               <div>
//                 <strong>카테고리:</strong> {getBottle(selectedPurchase.bottleId)?.category ?? "-"}
//               </div>
//               <div>
//                 <strong>구매일:</strong> {selectedPurchase.purchaseDate?.slice(0, 16).replace('T', ' ') ?? "-"}
//               </div>
//               <div>
//                 <strong>가격:</strong> {selectedPurchase.price ? `${selectedPurchase.price.toLocaleString()}원` : "-"}
//               </div>
//               <div>
//                 <strong>장소:</strong> {selectedPurchase.place ?? "-"}
//               </div>
//               <div>
//                 <strong>병 수:</strong> {selectedPurchase.quantity ?? 1}병
//               </div>
//               {selectedPurchase.memo && (
//                 <div>
//                   <strong>메모:</strong> {selectedPurchase.memo}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

