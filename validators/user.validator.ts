// validators/user.validator.ts
import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.email(),
  name: z.string().min(1, "이름은 필수입니다."),
  gender: z.enum(["MALE", "FEMALE"]),
  password: z.string().min(6, "비밀번호는 최소 6자 이상"),
});

export const socialUserCreateSchema = z.object({
  email: z.email(),
  name: z.string().min(1, "이름은 필수입니다."),
  gender: z.enum(["MALE", "FEMALE"]),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "비밀번호는 최소 6자 이상"),
});
