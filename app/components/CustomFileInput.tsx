import React, { useRef } from "react";

interface CustomFileInputProps {
  file: File | null;
  previewUrl: string | null;
  setFile: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
}

export default function CustomFileInput({
  file,
  previewUrl,
  setFile,
  setPreviewUrl,
}: CustomFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] ?? null;
    setFile(newFile);

    if (newFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(newFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleButtonClick = () => inputRef.current?.click();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-white py-2 px-4 rounded cursor-pointer"
          style={{ backgroundColor: "#891a24" }}
          onClick={handleButtonClick}
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
      {previewUrl && (
        <img
          src={previewUrl}
          alt="사진 미리보기"
          className="rounded w-32 h-32 object-cover border mx-auto"
          style={{ background: "#f9f9f9" }}
        />
      )}
    </div>
  );
}
