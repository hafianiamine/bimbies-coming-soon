"use client";

import { useEffect, useRef, useState } from "react";

const FB_URL = "https://www.facebook.com/BimbiesOfficielle";

export default function Page() {
  const artboardRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const artboard = artboardRef.current;
    if (!artboard) return;

    // ---------- FIX: Safari-safe viewport height ----------
    const setVH = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
    };

    // ---------- Mobile detection ----------
    const setMode = () => {
      const isMobile =
        window.matchMedia("(max-width: 820px)").matches ||
        window.matchMedia("(orientation: portrait)").matches;

      document.body.classList.toggle("mobile", isMobile);
      return isMobile;
    };

    // ---------- Scaling ----------
    const fit = () => {
      const isMobile = document.body.classList.contains("mobile");
      const W = isMobile ? 720 : 2048;
      const H = isMobile ? 1600 : 1152;

      const scaleBase = Math.min(window.innerWidth / W, window.innerHeight / H);
      const scale = isMobile ? scaleBase * 1.06 : scaleBase;

      artboard.style.transform = `scale(${scale})`;
    };

    // ---------- Wait images ----------
    const waitForImages = async () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              const el = img as HTMLImageElement;

              // decode() is great when available
              // @ts-ignore
              if (el.decode) {
                // @ts-ignore
                el.decode().then(resolve).catch(resolve);
                return;
              }

              if (el.complete) return resolve();
              el.onload = () => resolve();
              el.onerror = () => resolve();
            })
        )
      );
    };

    // ---------- Tab title ----------
    const originalTitle = document.title || "Bimbies - Coming Soon";
    const leaveTitle = "😄 Come back! Better diapers are waiting";

    const onVisibilityChange = () => {
      document.title = document.hidden ? leaveTitle : originalTitle;
    };

    // ---------- Click handler (use delegation, no ref needed) ----------
    const onQrClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.classList.contains("qr")) {
        window.open(FB_URL, "_blank", "noopener,noreferrer");
      }
    };

    // ---------- Refresh ----------
    const refresh = () => {
      setVH();
      setMode();
      fit();
    };

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("click", onQrClick);

    refresh();

    (async () => {
      await waitForImages();
      document.body.classList.add("ready");
      setReady(true);
    })();

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("click", onQrClick);
    };
  }, []);

  return (
    <>
      {/* PRELOADER */}
      <div className={`preloader ${ready ? "hide" : ""}`} aria-hidden={ready}>
        <div className="loaderWrap">
          <div className="spinner" />
          <div className="loadingText">Loading…</div>
        </div>
      </div>

      <main className="viewport">
        <div className="artboard" ref={artboardRef}>
          <div className="leftGroup">
            <img className="logo reveal d1" src="/bimbies-logo.png" alt="Bimbies logo" draggable={false} />
            <img className="coming reveal d2" src="/coming-soon.png" alt="Coming soon" draggable={false} />
            <img className="forme3 reveal d3" src="/bimbies-forme-3.png" alt="" draggable={false} />
            <img className="qr reveal d6 pulse" src="/qr-code.png" alt="QR code" draggable={false} />
          </div>

          <img className="hero reveal d4 floaty" src="/light-overlay.png" alt="" draggable={false} />
          <img className="heart reveal d5" src="/bimbies-forme-2.png" alt="" draggable={false} />
        </div>
      </main>
    </>
  );
}
