"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-compass-fraunces",
  display: "swap",
});

interface CompassIntroProps {
  locale: "en" | "es";
  logoUrl?: string;
}

const STORAGE_KEY = "pce_intro_seen";
const SKIP_ATTR = "data-pce-intro-skip";
const OUTRO_START_MS = 4400;
const TOTAL_DURATION_MS = 5200;
const COORDS_DELAY_MS = 2000;
const COORDS_DURATION_MS = 1200;
const LAT_TARGET = 18.5601;
const LNG_TARGET = 68.3725;

// Inline blocking script. Runs synchronously before the overlay paints.
// Must execute before the first frame so repeat visitors / reduced-motion
// users never see a flash of the intro. Sets a data attribute on <html>;
// CSS hides the overlay instantly when the attribute is present.
const BOOT_SCRIPT = `(function(){try{var k="${STORAGE_KEY}",a="${SKIP_ATTR}";var seen=sessionStorage.getItem(k)==="1";var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(seen||reduced){document.documentElement.setAttribute(a,"1");if(reduced){try{sessionStorage.setItem(k,"1")}catch(e){}}}else{document.documentElement.style.overflow="hidden"}}catch(e){}})();`;

const MONO_STACK =
  'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';

export function CompassIntro({ locale, logoUrl }: CompassIntroProps) {
  const [unmounting, setUnmounting] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  const outroTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coordsStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coordsRafRef = useRef<number | null>(null);

  const completeRemoval = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore — private mode / storage disabled
    }
    document.documentElement.setAttribute(SKIP_ATTR, "1");
    document.documentElement.style.overflow = "";
    setRemoved(true);
  }, []);

  const dismiss = useCallback(() => {
    if (outroTimerRef.current) clearTimeout(outroTimerRef.current);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (coordsStartTimerRef.current) clearTimeout(coordsStartTimerRef.current);
    if (coordsRafRef.current) cancelAnimationFrame(coordsRafRef.current);
    setUnmounting(true);
    finishTimerRef.current = setTimeout(completeRemoval, 800);
  }, [completeRemoval]);

  useEffect(() => {
    const skip =
      document.documentElement.getAttribute(SKIP_ATTR) === "1";
    if (skip) {
      // Boot script already hid the overlay via CSS; drop the DOM nodes too.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemoved(true);
      return;
    }

    // Belt-and-braces scroll lock: the boot script handles the initial SSR
    // load, but on SPA navigation back to /en the script doesn't re-execute.
    document.documentElement.style.overflow = "hidden";

    outroTimerRef.current = setTimeout(() => setUnmounting(true), OUTRO_START_MS);
    finishTimerRef.current = setTimeout(completeRemoval, TOTAL_DURATION_MS);

    return () => {
      if (outroTimerRef.current) clearTimeout(outroTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      document.documentElement.style.overflow = "";
    };
  }, [completeRemoval]);

  useEffect(() => {
    if (removed) return;
    if (document.documentElement.getAttribute(SKIP_ATTR) === "1") return;

    coordsStartTimerRef.current = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / COORDS_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCoords({ lat: LAT_TARGET * eased, lng: LNG_TARGET * eased });
        if (progress < 1) {
          coordsRafRef.current = requestAnimationFrame(tick);
        }
      };
      coordsRafRef.current = requestAnimationFrame(tick);
    }, COORDS_DELAY_MS);

    return () => {
      if (coordsStartTimerRef.current) clearTimeout(coordsStartTimerRef.current);
      if (coordsRafRef.current) cancelAnimationFrame(coordsRafRef.current);
    };
  }, [removed]);

  useEffect(() => {
    if (removed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [removed, dismiss]);

  if (removed) return null;

  const countryName =
    locale === "es" ? "República Dominicana" : "Dominican Republic";
  const subtitle =
    locale === "es"
      ? "RESERVADO PARA QUIENES BUSCAN LO MEJOR"
      : "RESERVED FOR GUESTS WHO WANT THE VERY BEST";

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <div
        role="dialog"
        aria-label="Welcome to Punta Cana Private Excursions"
        className={`compass-intro ${fraunces.variable}${unmounting ? " compass-intro--out" : ""}`}
      >
        <button
          type="button"
          onClick={dismiss}
          className="compass-intro__skip"
          aria-label="Skip intro"
        >
          SKIP ↗
        </button>

        <div className="compass-intro__compass-wrap" aria-hidden="true">
          <span className="compass-intro__north">N</span>
          <svg
            viewBox="0 0 140 140"
            width="140"
            height="140"
            aria-hidden="true"
            className="compass-intro__svg"
          >
            <circle
              cx="70"
              cy="70"
              r="65"
              fill="none"
              stroke="#d4a04a"
              strokeWidth="1"
              className="compass-intro__ring"
            />
            <line
              x1="70"
              y1="5"
              x2="70"
              y2="135"
              stroke="#f5d086"
              strokeWidth="1"
              className="compass-intro__crosshair"
            />
            <line
              x1="5"
              y1="70"
              x2="135"
              y2="70"
              stroke="#f5d086"
              strokeWidth="1"
              className="compass-intro__crosshair"
            />
            <circle
              cx="70"
              cy="70"
              r="5"
              fill="#f5a623"
              className="compass-intro__pin"
            />
          </svg>
        </div>

        <p className="compass-intro__coords">
          {coords.lat.toFixed(4)}° N · {coords.lng.toFixed(4)}° W
        </p>

        <h1 className="compass-intro__place">
          <em className="compass-intro__place-name">Punta Cana</em>, {countryName}
        </h1>

        <p className="compass-intro__subtitle">{subtitle}</p>

        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt=""
            aria-hidden="true"
            className="compass-intro__logo"
          />
        )}
      </div>

      <style>{`
        .compass-intro {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          background: radial-gradient(ellipse at center, #142d3a 0%, #070b10 100%);
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .compass-intro--out {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }
        html[${SKIP_ATTR}="1"] .compass-intro {
          display: none !important;
        }

        .compass-intro__skip {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          font-family: ${MONO_STACK};
          font-size: 11px;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.4);
          background: transparent;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .compass-intro__skip:hover,
        .compass-intro__skip:focus-visible {
          color: rgba(255, 255, 255, 0.8);
        }
        .compass-intro__skip:focus-visible {
          outline: 1px solid rgba(255, 255, 255, 0.3);
          outline-offset: 2px;
        }

        .compass-intro__compass-wrap {
          position: relative;
          width: 140px;
          height: 140px;
        }
        .compass-intro__svg {
          display: block;
        }
        .compass-intro__ring {
          stroke-dasharray: 408.4;
          stroke-dashoffset: 408.4;
          transform: rotate(-90deg);
          transform-origin: 70px 70px;
          animation: compass-ring-draw 1.8s cubic-bezier(0.3, 0.8, 0.3, 1) 0s forwards;
        }
        .compass-intro__crosshair {
          opacity: 0;
          animation: compass-fade 0.6s ease-out 1.4s forwards;
        }
        .compass-intro__pin {
          opacity: 0;
          transform: translateY(-20px) scale(0.5);
          transform-origin: 70px 70px;
          animation: compass-pin-drop 0.6s cubic-bezier(0.5, 1.6, 0.5, 1) 1.6s forwards;
        }
        .compass-intro__north {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
          font-family: ${MONO_STACK};
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #d4a04a;
          opacity: 0;
          animation: compass-fade 0.4s ease-out 1.6s forwards;
        }
        .compass-intro__coords {
          margin: 28px 0 0;
          font-family: ${MONO_STACK};
          font-size: 12px;
          letter-spacing: 0.25em;
          color: #7ab8d4;
          opacity: 0;
          transform: translateY(10px);
          animation: compass-rise 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) 2.0s forwards;
        }
        .compass-intro__place {
          margin: 24px 0 0;
          font-family: var(--font-compass-fraunces), Georgia, serif;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          font-size: clamp(26px, 5vw, 52px);
          color: #ffffff;
          text-align: center;
        }
        .compass-intro__place-name {
          font-style: italic;
          color: #f5a623;
        }
        .compass-intro__subtitle {
          margin: 18px 0 0;
          font-family: ${MONO_STACK};
          font-size: 10px;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          opacity: 0;
          animation: compass-fade 0.6s ease-out 2.8s forwards;
        }
        .compass-intro__logo {
          margin-top: 32px;
          width: 80px;
          height: auto;
          opacity: 0;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
          animation: compass-fade 0.6s ease-out 3.4s forwards;
        }

        @keyframes compass-ring-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes compass-fade {
          to { opacity: 1; }
        }
        @keyframes compass-rise {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes compass-pin-drop {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 640px) {
          .compass-intro__compass-wrap {
            width: 110px;
            height: 110px;
          }
          .compass-intro__svg {
            width: 110px;
            height: 110px;
          }
          .compass-intro__coords {
            font-size: 10px;
            letter-spacing: 0.2em;
          }
          .compass-intro__subtitle {
            font-size: 9px;
            letter-spacing: 0.25em;
          }
          .compass-intro__logo {
            width: 64px;
          }
        }
      `}</style>
    </>
  );
}
