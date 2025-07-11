"use client"

import { usePathname, useRouter } from "next/navigation"

export default function Home() {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <div>
            <div>Hello, this is { pathname }</div>
            <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
            홈으로 이동
            </button>
        </div>
    )
}