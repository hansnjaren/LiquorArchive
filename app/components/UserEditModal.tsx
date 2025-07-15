"use client";

import { useEffect, useRef, useState } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { TITLE_COLOR } from "../constants";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserEditModal({ onClose, onSuccess }: Props) {
  useLockBodyScroll(true);

  // 모달 close 애니메이션 관련 상태
  const [closing, setClosing] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  // 유저 정보 상태
  const [form, setForm] = useState({ name: "", gender: "", image: "" });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 데이터 fetch
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setForm({
        name: data.name ?? "",
        gender: data.gender ?? "",
        image: data.image ?? "",
      });
      setEmail(data.email ?? "");
    };
    getUser();
  }, []);

  // 닫기 핸들러
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

  // 바깥 클릭 닫기 관련
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current?.contains(e.target as Node)) {
      setDragStartedInside(true);
    } else {
      setDragStartedInside(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!modalRef.current?.contains(e.target as Node) && !dragStartedInside) {
      handleRequestClose();
    }
    setDragStartedInside(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("수정이 완료되었습니다.");
        onSuccess(); // 외부에 알림
        handleRequestClose(); // 닫기
      } else {
        setMessage(result.error || "오류가 발생했습니다.");
      }
    } catch (err: any) {
      setMessage(err.message || "네트워크 오류 발생");
    } finally {
      setLoading(false);
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
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleRequestClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">회원 정보 수정</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">이메일</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">성별</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">선택</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              프로필 이미지 주소
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 rounded font-bold transition"
            style={{ backgroundColor: TITLE_COLOR }}
          >
            {loading ? "저장 중..." : "저장"}
          </button>
          {message && (
            <div className="text-center text-sm text-blue-600 mt-2">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
