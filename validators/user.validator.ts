// validators/user.validator.ts
import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.email(),
  name: z.string().min(1, "이름은 필수입니다."),
  gender: z.enum(["MALE", "FEMALE"]),
  password: z.string().min(6, "비밀번호는 최소 6자 이상").optional(), // 소셜 로그인 고려
});
