"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 0.6,
  cooldownTime = 1.2,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  // Gooey blur morph effect — SVG threshold filter + blur, RAF-driven.
  // Runs on all devices (user confirmed no lag on mobile).
  React.useEffect(() => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    if (!text1 || !text2) return;

    if (
      texts.length <= 1 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      text1.textContent = texts[0];
      text1.style.opacity = "100%";
      text1.style.filter = "";
      text2.style.opacity = "0%";
      return;
    }

    let textIndex = 0;
    let time = new Date();
    let morph = 0;
    let cooldown = 0;
    let rafId = 0;

    const setMorph = (fraction: number) => {
      text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      text2.style.filter = "";
      text2.style.opacity = "100%";
      text1.style.filter = "";
      text1.style.opacity = "0%";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          text1.textContent = texts[textIndex % texts.length];
          text2.textContent = texts[(textIndex + 1) % texts.length];
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    text1.textContent = texts[textIndex % texts.length];
    text2.textContent = texts[(textIndex + 1) % texts.length];
    text1.style.opacity = "100%";
    text1.style.filter = "";
    text2.style.opacity = "0%";
    text2.style.filter = "";
    cooldown = cooldownTime;

    animate();

    return () => cancelAnimationFrame(rafId);
  }, [texts, morphTime, cooldownTime]);

  const longestText = React.useMemo(
    () => texts.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [texts],
  );

  return (
    <span className={cn("relative inline-block align-baseline", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      {/* Invisible spacer reserves width of the longest word */}
      <span
        aria-hidden="true"
        className={cn("invisible inline-block whitespace-nowrap", textClassName)}
      >
        {longestText}
      </span>

      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ filter: "url(#threshold)" }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block whitespace-nowrap select-none will-change-transform",
            textClassName,
          )}
        >
          {texts[0]}
        </span>
        <span
          ref={text2Ref}
          aria-hidden="true"
          className={cn(
            "absolute inline-block whitespace-nowrap select-none will-change-transform",
            textClassName,
          )}
        >
          {texts[1 % texts.length]}
        </span>
      </span>
    </span>
  );
}
