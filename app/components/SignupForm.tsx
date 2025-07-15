// components/SignupForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    name: "",
    gender: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.status === 201 || res.status === 200) {
      router.push("/social-login");
      return;
    } else if (res.status === 409) {
      setError("이미 가입된 이메일입니다.");
    } else if (res.status === 400) {
      const data = await res.json();
      setError("입력값이 유효하지 않습니다.");
    } else {
      setError("일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto border rounded p-6 mt-20 flex flex-col gap-4 bg-white shadow">
      <h2 className="text-2xl font-bold text-center mb-3">회원가입</h2>
      <label>
        <span className="font-semibold">이메일</span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded p-2 w-full mt-1"
          required
        />
      </label>
      <label>
        <span className="font-semibold">이름</span>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="border rounded p-2 w-full mt-1"
          required
        />
      </label>
      <label>
        <span className="font-semibold">성별</span>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border rounded p-2 w-full mt-1"
          required
        >
          <option value="" disabled>선택</option>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>
      </label>
      <label>
        <span className="font-semibold">비밀번호</span>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="border rounded p-2 w-full mt-1"
          minLength={6}
          required
        />
      </label>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded font-bold disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? "가입 중..." : "가입하기"}
      </button>
    </form>
  );
}
