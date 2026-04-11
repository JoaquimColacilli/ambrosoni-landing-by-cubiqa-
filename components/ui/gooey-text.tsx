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
  const measureRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    // Arrancamos en el índice 0, no en length-1, así la primera palabra
    // visible es texts[0] sin tener que morfear desde la última.
    let textIndex = 0;
    let time = new Date();
    let morph = 0;
    // cooldown = 0 elimina el "cooldown fantasma" inicial: el primer morph
    // arranca en el primer frame del animate().
    let cooldown = 0;
    let rafId = 0;

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        fraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      }
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "100%";
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "0%";
      }
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

    function animate() {
      rafId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    // Init inmediato: la primera palabra visible al mount es texts[0],
    // ya sólida y legible, sin tener que esperar ningún ciclo de animación.
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[textIndex % texts.length];
      text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
      text1Ref.current.style.opacity = "100%";
      text1Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "0%";
      text2Ref.current.style.filter = "";
      // Seteamos cooldown en cooldownTime para que la primera palabra
      // quede estable el tiempo configurado antes de empezar a morfear.
      cooldown = cooldownTime;
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [texts, morphTime, cooldownTime]);

  // Encontrar el texto más largo para reservar ancho estable
  const longestText = React.useMemo(
    () => texts.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [texts]
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

      {/* Spacer invisible: ocupa el ancho del texto más largo para que el
          layout no salte entre palabras. Usa la misma tipografía heredada. */}
      <span
        aria-hidden="true"
        ref={measureRef}
        className={cn("invisible inline-block whitespace-nowrap", textClassName)}
      >
        {longestText}
      </span>

      {/* Contenedor del efecto gooey, superpuesto sobre el spacer */}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ filter: "url(#threshold)" }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block whitespace-nowrap select-none",
            textClassName
          )}
        >
          {texts[0]}
        </span>
        <span
          ref={text2Ref}
          aria-hidden="true"
          className={cn(
            "absolute inline-block whitespace-nowrap select-none",
            textClassName
          )}
        >
          {texts[1 % texts.length]}
        </span>
      </span>
    </span>
  );
}