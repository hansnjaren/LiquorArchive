// services/user.service.ts
import { createUserInDB } from "@/repositories/user.repository";
import { findUserByEmail } from "@/repositories/user.repository";
import { UserCreateInput } from "@/types/user.types";
import bcrypt from "bcrypt"; // 예: 패스워드 해시화에 사용

export async function createUser(data: UserCreateInput) {
  // 이메일 중복 체크
  const email = data.email.toLowerCase(); // 대소문자 구분 없이 처리
  data.email = email; // 데이터에 소문자 이메일 저장

  const existing = await findUserByEmail(data.email);
  if (existing) {
    const err = new Error("이미 사용 중인 이메일입니다.");
    err.name = "이미 사용 중인 이메일입니다.";
    throw err;
  }

  // 예: 일반 로그인이라면 BCrypt로 패스워드 해시화도 가능
  let password = data.password;
  if (password) {
    password = await hashPassword(password);
  }
  return await createUserInDB({
    ...data,
    password, // 해시된 패스워드 또는 undefined
  });
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
