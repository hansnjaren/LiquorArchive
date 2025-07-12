import { Roboto_Condensed, Merriweather, Lora, Montserrat, Roboto } from "next/font/google";

export const robotoCondensed = Roboto_Condensed({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const merriweather = Merriweather({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const lora = Lora({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const montserrat  = Montserrat({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const fontList = [
  { name: "Roboto Condensed", font: robotoCondensed },
  { name: "Merriweather", font: merriweather },
  { name: "Lora", font: lora },
  { name: "Montserrat", font: montserrat },
  { name: "Roboto", font: roboto },
]
