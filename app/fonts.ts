import { Roboto_Condensed } from 'next/font/google';

export const robotoCondensed = Roboto_Condensed({
  weight: ['400', '700'],   // 원하는 굵기
  style: ['normal', 'italic'], // 원하는 스타일
  subsets: ['latin'],       // 필요한 subset
  display: 'swap',          // 폰트 표시 방식
});
