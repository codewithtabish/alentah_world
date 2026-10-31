// src/components/site/pages/write-for-us/text-styles.ts
// Your global <p> style overrides normal utilities (font, size, line height,
// alignment). The trailing "!" makes these utilities important so they win.

export const pBase =
  "font-sans! text-start! hyphens-none! wrap-normal! break-normal! text-pretty mb-0!";

export const pBody = `${pBase} text-[14px]! leading-[1.7]! text-muted-foreground`;

export const pSmall = `${pBase} text-[12.5px]! leading-[1.6]! text-muted-foreground`;