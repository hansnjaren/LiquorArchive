import { useLayoutEffect } from "react";

/**
 * 모달이 열릴 때 body 스크롤을 막아주는 커스텀 훅
 * @param lock true면 스크롤 막기, false면 원복
 */
export default function useLockBodyScroll(lock: boolean = true) {
  useLayoutEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [lock]);
}
