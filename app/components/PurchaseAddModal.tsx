import { useEffect, useRef, useState } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import BottleDropdown from "./BottleDropdown";
import { uuidv4 } from "../utils/uuid";
import type { Bottle, Purchase } from "../types";
import { TITLE_COLOR } from "../constants";

function getLocalDateString(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
}
function getLocalTimeString(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return pad(date.getHours()) + ":" + pad(date.getMinutes());
}

interface Props {
  bottles: Bottle[];
  onClose: () => void;
  onSubmit: (purchase: Purchase) => void;
}

export default function PurchaseAddModal({ bottles, onClose, onSubmit }: Props) {
  useLockBodyScroll(true);

  const [bottleSearch, setBottleSearch] = useState("");
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
  const [bottleDropdownOpen, setBottleDropdownOpen] = useState(false);

  const [price, setPrice] = useState("");
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [quantity, setQuantity] = useState("1");

  const now = new Date();
  const [date, setDate] = useState(getLocalDateString(now));
  const [time, setTime] = useState(getLocalTimeString(now));

  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const todayStr = getLocalDateString(now);
  const maxTime =
    date === todayStr
      ? getLocalTimeString(now)
      : undefined;
  const maxDate = todayStr;

  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  // --- 애니메이션 관련 추가 부분 ---
  const [closing, setClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleRequestClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (!closing) return;
    const el = backdropRef.current;
    if (!el) return;
    const handleAnimationEnd = () => {
      onClose();
    };
    el.addEventListener("animationend", handleAnimationEnd);
    return () => {
      el.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [closing, onClose]);
  // --- 끝 ---

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

    const purchaseDateObj = new Date(`${date}T${time}`);
    if (purchaseDateObj.getTime() > Date.now()) {
      alert("미래 시각의 구매 내역은 추가할 수 없습니다.");
      return;
    }
    const fullDate = purchaseDateObj.toISOString();

    const newPurchase: Purchase = {
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

    onSubmit(newPurchase);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && modalRef.current.contains(e.target as Node)) {
      setDragStartedInside(true);
    } else {
      setDragStartedInside(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dragStartedInside) {
      setDragStartedInside(false);
      return;
    }
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleRequestClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${
        closing ? "animate-modal-out" : "animate-modal-in"
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleRequestClose}
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
          {/* 날짜/시간 분리 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              구매일(날짜)
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              max={maxDate}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              구매일(시간)
            </label>
            <input
              type="time"
              className="w-full border rounded px-3 py-2"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              max={maxTime}
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
            className="w-full text-white py-2 rounded cursor-pointer transition font-bold"
            style={{ backgroundColor: `${TITLE_COLOR}`}}
          >
            추가
          </button>
        </form>
      </div>
    </div>
  );
}
