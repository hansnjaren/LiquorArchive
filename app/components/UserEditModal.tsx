"use client";

import { useEffect, useRef, useState } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { TITLE_COLOR } from "../constants";

// 커스텀 파일 업로드 입력
function CustomFileInput({
  file,
  previewUrl,
  setFile,
  setPreviewUrl,
}: {
  file: File | null;
  previewUrl: string | null;
  setFile: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        type="button"
        className="text-white py-2 px-4 rounded cursor-pointer"
        style={{ backgroundColor: TITLE_COLOR }}
        onClick={() => inputRef.current?.click()}
      >
        파일 선택
      </button>
      <input
        ref={inputRef}
        id="profile-upload"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <span className="text-gray-700 text-sm">
        {file ? file.name : "선택된 파일 없음"}
      </span>
    </div>
  );
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserEditModal({ onClose, onSuccess }: Props) {
  useLockBodyScroll(true);

  const [closing, setClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  // 상태
  const [form, setForm] = useState({ name: "", gender: "" });
  const [email, setEmail] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // 기존 프로필 URL
  const [imageFile, setImageFile] = useState<File | null>(null); // 새로 고른 파일
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 base64
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 유저 정보 초기 fetch
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setForm({
        name: data.name ?? "",
        gender: data.gender ?? "",
      });
      setCurrentImageUrl(data.image ?? "");
      setEmail(data.email ?? "");
      setPreviewUrl(null); // 편집 재진입 시 미리보기 리셋
      setImageFile(null);
    };
    getUser();
  }, []);

  // 모달 닫기 애니메이션
  const handleRequestClose = () => setClosing(true);

  useEffect(() => {
    if (!closing) return;
    const el = backdropRef.current;
    if (!el) return;
    const handleAnimationEnd = () => onClose();
    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, [closing, onClose]);

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

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("gender", form.gender);
      if (imageFile) {
        formData.append("file", imageFile);
      }

      const res = await fetch("/api/user/me", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("수정이 완료되었습니다.");
        setCurrentImageUrl(result.image ?? ""); // 최신 이미지 반영
        setPreviewUrl(null);
        setImageFile(null);
        onSuccess();
        handleRequestClose();
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
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-semibold mb-1">이메일</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          {/* 이름 */}
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
          {/* 성별 */}
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
          {/* 프로필 이미지 비교 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              프로필 이미지 비교
            </label>
            <div className="flex gap-6 items-center">
              {/* 현재 이미지 */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">
                  현재 이미지
                </span>
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="현재 프로필"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              {/* 새로 올린 사진(미리보기) */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">
                  업로드 예정
                </span>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="업로드 미리보기"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400">
                    No Preview
                  </div>
                )}
              </div>
            </div>
            {/* 파일 업로드 (항상 노출) */}
            <CustomFileInput
              file={imageFile}
              previewUrl={previewUrl}
              setFile={setImageFile}
              setPreviewUrl={setPreviewUrl}
            />
          </div>
          {/* 완료 버튼/메세지 */}
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
