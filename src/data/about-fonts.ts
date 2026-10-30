import { Mrs_Saint_Delafield, Playfair_Display } from "next/font/google";

export const headingFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const signatureFont = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});