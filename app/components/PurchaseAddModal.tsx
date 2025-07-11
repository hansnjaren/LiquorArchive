import { useState } from "react";
import BottleDropdown from "./BottleDropdown";
import { uuidv4 } from "../utils/uuid";
import { getNowISOStringWithMs } from "../utils/date";
import type { Bottle, Purchase } from "../types";

interface Props {
  bottles: Bottle[];
  onClose: () => void;
}
export default function PurchaseAddModal({ bottles, onClose }: Props) {
  const [bottleSearch, setBottleSearch] = useState("");
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
  const [bottleDropdownOpen, setBottleDropdownOpen] = useState(false);

  const [price, setPrice] = useState("");
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  });

  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const validatePrice = (val: string) => {
    if (/^\d+$/.test(val) && Number(val) >= 0) return "";
    return "가격은 0 이상의 정수만 입력 가능합니다.";
  };
  const validateQuantity = (val: string) => {
    if (/^\d+$/.test(val) && Number(val) >= 1) return "";
    return "병 수는 1 이상의 자연수만 입력 가능합니다.";
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
    setPriceError(validatePrice(e.target.value));
  };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    setQuantityError(validateQuantity(e.target.value));
  };

  const handleBottleSelect = (id: string, name: string) => {
    setSelectedBottleId(id);
    setBottleSearch(name);
    setBottleDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceErr = validatePrice(price);
    const quantityErr = validateQuantity(quantity);
    setPriceError(priceErr);
    setQuantityError(quantityErr);

    if (!selectedBottleId) {
      alert("병을 선택하세요.");
      return;
    }
    if (priceErr || quantityErr) return;

    const now = new Date();
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    const fullDate =
      purchaseDate.length === 16
        ? `${purchaseDate}:00.${ms}Z`
        : getNowISOStringWithMs();

    const newPurchase = {
      id: uuidv4(),
      userId: "user-001",
      bottleId: selectedBottleId,
      purchaseDate: fullDate,
      price: Number(price),
      place: place || null,
      memo: memo || null,
      createdAt: fullDate,
      updatedAt: fullDate,
      quantity: Number(quantity),
    };

    alert("구매 내역 추가 정보:\n" + JSON.stringify(newPurchase, null, 2));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">구매 내역 추가</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 병 선택 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              병 선택 (이름 검색)
            </label>
            <BottleDropdown
              bottles={bottles}
              search={bottleSearch}
              setSearch={setBottleSearch}
              selectedBottleId={selectedBottleId}
              setSelectedBottleId={handleBottleSelect}
              open={bottleDropdownOpen}
              setOpen={setBottleDropdownOpen}
            />
          </div>
          {/* 구매일 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              구매일(분 단위까지)
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>
          {/* 가격 */}
          <div>
            <label className="block text-sm font-semibold mb-1">가격(원)</label>
            <input
              type="number"
              className={`w-full border rounded px-3 py-2 ${
                priceError ? "border-red-500" : ""
              }`}
              min={0}
              value={price}
              onChange={handlePriceChange}
              required
            />
            {priceError && (
              <div className="text-xs text-red-500 mt-1">{priceError}</div>
            )}
          </div>
          {/* 장소 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              장소(선택)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
          {/* 메모 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              메모(선택)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
          {/* 병 수 */}
          <div>
            <label className="block text-sm font-semibold mb-1">병 수</label>
            <input
              type="number"
              className={`w-full border rounded px-3 py-2 ${
                quantityError ? "border-red-500" : ""
              }`}
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              required
            />
            {quantityError && (
              <div className="text-xs text-red-500 mt-1">{quantityError}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
          >
            추가
          </button>
        </form>
      </div>
    </div>
  );
}
