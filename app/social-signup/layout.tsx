// app/social-signup/layout.tsx
import { ReactNode, Suspense } from "react";

export default function SocialSignupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense fallback={<div>로딩 중...</div>}>{children}</Suspense>;
}
