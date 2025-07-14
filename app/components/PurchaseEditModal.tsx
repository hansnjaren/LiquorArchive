import { useEffect, useRef, useState } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import BottleDropdown from "./BottleDropdown";
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
  purchase: Purchase;
  bottles: Bottle[];
  onClose: () => void;
  onSubmit: (updated: Purchase) => void;
}

export default function PurchaseEditModal({ purchase, bottles, onClose, onSubmit }: Props) {
  useLockBodyScroll(true);

  const initialBottle = bottles.find(b => b.id === purchase.bottleId);
  const [bottleSearch, setBottleSearch] = useState(initialBottle?.name ?? "");
  const [selectedBottleId] = useState<string | null>(purchase.bottleId); // bottleId는 수정 불가
  const [bottleDropdownOpen] = useState(false);

  const [price, setPrice] = useState(String(purchase.price));
  const [place, setPlace] = useState(purchase.place ?? "");
  const [memo, setMemo] = useState(purchase.memo ?? "");
  const [quantity, setQuantity] = useState(String(purchase.quantity));

  const purchaseDateObj = new Date(purchase.purchaseDate);
  const [date, setDate] = useState(getLocalDateString(purchaseDateObj));
  const [time, setTime] = useState(getLocalTimeString(purchaseDateObj));

  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const now = new Date();
  const todayStr = getLocalDateString(now);
  const maxTime =
    date === todayStr
      ? getLocalTimeString(now)
      : undefined;
  const maxDate = todayStr;

  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

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

    const newDateObj = new Date(`${date}T${time}`);
    if (newDateObj.getTime() > Date.now()) {
      alert("미래 시각의 구매 내역은 수정할 수 없습니다.");
      return;
    }
    const fullDate = newDateObj.toISOString();

    onSubmit({
      ...purchase,
      purchaseDate: fullDate,
      price: Number(price),
      place: place || undefined,
      memo: memo || undefined,
      quantity: Number(quantity),
    });
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
        <h3 className="text-xl font-bold mb-4 text-center">구매 내역 수정</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              병 이름
            </label>
            <div className="w-full border rounded px-3 py-2">{initialBottle?.name}</div>
          </div>
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
          <div>
            <label className="block text-sm font-semibold mb-1">
              장소(선택)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={place}
              onChange={e => setPlace(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              메모(선택)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={memo}
              onChange={e => setMemo(e.target.value)}
            />
          </div>
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
            저장
          </button>
        </form>
      </div>
    </div>
  );
}