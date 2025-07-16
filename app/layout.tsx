import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { TITLE } from "./constants";
import { SessionWrapper } from "./SessionWrapper";
import { montserrat } from "./fonts";
import Script from "next/script";

export const metadata: Metadata = {
  title: TITLE,
  description: "Record your liquor and drinks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services`}
        ></script> */}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={montserrat.className}>
        <SessionWrapper>
          <Header>{children}</Header>
        </SessionWrapper>
      </body>
    </html>
  );
}
