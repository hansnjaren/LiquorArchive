// types/user.types.ts
export type UserCreateInput = {
  email: string;
  name: string;
  gender: "MALE" | "FEMALE";
  password?: string;
};
