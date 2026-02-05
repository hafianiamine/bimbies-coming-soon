"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const artboardRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const artboard = artboardRef.current;
    const qr = qrRef.current;
    if (!artboard || !qr) return;

    /* ✅ Safari/iPhone stable viewport height */
    const setVHpx = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };

    /* mobile detection */
    const setMode = () => {
      const isMobile =
        window.matchMedia("(max-width: 820px)").matches ||
        window.matchMedia("(orientation: portrait)").matches;
      document.body.classList.toggle("mobile", isMobile);
    };

    /* scaling */
    const fit = () => {
      const isMobile = document.body.classList.contains("mobile");
      const W = isMobile ? 720 : 2048;
      const H = isMobile ? 1600 : 1152;

      const scale = isMobile
        ? Math.min(window.innerWidth / W, window.innerHeight / H) * 1.06
        : Math.min(window.innerWidth / W, window.innerHeight / H);

      artboard.style.transform = `scale(${scale})`;
    };

    /* wait images */
    const waitForImages = async () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          img =>
            new Promise<void>(resolve => {
              // @ts-ignore
              if (img.decode) img.decode().then(resolve).catch(resolve);
              else if ((img as HTMLImageElement).complete) resolve();
              else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }
            })
        )
      );
    };

    /* tab message (you asked earlier) */
    const originalTitle = document.title || "Bimbies - Coming Soon";
    const leaveTitle = "😄 Come back! Better diapers are waiting";
    const onVisibilityChange = () => {
      document.title = document.hidden ? leaveTitle : originalTitle;
    };

    const refresh = () => {
      setVHpx();
      setMode();
      fit();
    };

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    document.addEventListener("visibilitychange", onVisibilityChange);

    qr.addEventListener("click", () => {
      window.open("https://www.facebook.com/BimbiesOfficielle", "_blank", "noopener,noreferrer");
    });

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
    };
  }, []);

  return (
    <>
      {/* PRELOADER */}
      <div className={`preloader ${ready ? "hide" : ""}`}>
        <div className="loaderWrap">
          <div className="spinner" />
          <div className="loadingText">Loading…</div>
        </div>
      </div>

      <div className="viewport">
        <div className="artboard" ref={artboardRef}>
          <div className="leftGroup">
            <img className="logo reveal d1" src="/Bimbies Logo.png" alt="Bimbies" draggable={false} />
            <img className="coming reveal d2" src="/Coming Soon.png" alt="Coming soon" draggable={false} />
            <img className="forme3 reveal d3" src="/Bimbies Forme 3.png" alt="" draggable={false} />
            <img className="qr reveal d6 pulse" ref={qrRef} src="/Qr Code.png" alt="QR code" draggable={false} />
          </div>

          <img className="hero reveal d4 floaty" src="/Light Overlay.png" alt="" draggable={false} />
          <img className="heart reveal d5" src="/Bimbies Forme 2.png" alt="" draggable={false} />
        </div>
      </div>
    </>
  );
}
