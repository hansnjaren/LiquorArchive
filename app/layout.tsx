import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { TITLE } from "./constants";
import { montserrat } from "./fonts";

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
      <body className={montserrat.className}>
        <Header>{children}</Header>
      </body>
    </html>
  );
}
