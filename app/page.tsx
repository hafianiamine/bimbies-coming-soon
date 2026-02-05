"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function Page() {
  const artboardRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);

  // Put your wallpaper images in /public (no need to rename existing pngs)
  // Example names - you can change/add more:
  const wallpapers = useMemo(
    () => [
      "/wallpaper-1.jpg",
      "/wallpaper-2.jpg",
      "/wallpaper-3.jpg",
    ],
    []
  );

  useEffect(() => {
    const artboard = artboardRef.current;
    const qr = qrRef.current;
    if (!artboard || !qr) return;

    /* ===== Safari-safe VH =====
       Use px-based variable (NOT 1vh trick) to make iPhone/Mac consistent */
    const setVHPX = () => {
      document.documentElement.style.setProperty("--vhpx", `${window.innerHeight}px`);
    };

    /* ===== mobile detection ===== */
    const setMode = () => {
      const isMobile =
        window.matchMedia("(max-width: 820px)").matches ||
        window.matchMedia("(orientation: portrait)").matches;
      document.body.classList.toggle("mobile", isMobile);
    };

    /* ===== scaling ===== */
    const fit = () => {
      const isMobile = document.body.classList.contains("mobile");
      const W = isMobile ? 720 : 2048;
      const H = isMobile ? 1600 : 1152;

      const scaleBase = Math.min(window.innerWidth / W, window.innerHeight / H);
      const scale = isMobile ? scaleBase * 1.06 : scaleBase;

      artboard.style.transform = `scale(${scale})`;
    };

    /* ===== wait images ===== */
    const waitForImages = async () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          img =>
            new Promise<void>(resolve => {
              const el = img as HTMLImageElement;
              // @ts-ignore
              if (el.decode) el.decode().then(resolve).catch(resolve);
              else if (el.complete) resolve();
              else {
                el.onload = () => resolve();
                el.onerror = () => resolve();
              }
            })
        )
      );
    };

    /* ===== funny tab message ===== */
    const originalTitle = document.title || "Bimbies - Coming Soon";
    const leaveTitle = "😄 Come back! Better diapers are waiting";
    const onVisibilityChange = () => {
      document.title = document.hidden ? leaveTitle : originalTitle;
    };

    /* ===== events ===== */
    const refresh = () => {
      setVHPX();
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
  }, [wallpapers]);

  // Background crossfade logic
  useEffect(() => {
    if (!wallpapers.length) return;

    let idx = 0;
    const layerA = document.getElementById("bgA") as HTMLDivElement | null;
    const layerB = document.getElementById("bgB") as HTMLDivElement | null;
    if (!layerA || !layerB) return;

    // init
    layerA.style.backgroundImage = `url("${wallpapers[0]}")`;
    layerA.classList.add("show");
    layerB.classList.remove("show");

    const swap = () => {
      idx = (idx + 1) % wallpapers.length;
      const nextUrl = wallpapers[idx];

      const showingA = layerA.classList.contains("show");
      const showLayer = showingA ? layerB : layerA;
      const hideLayer = showingA ? layerA : layerB;

      showLayer.style.backgroundImage = `url("${nextUrl}")`;
      showLayer.classList.add("show");
      hideLayer.classList.remove("show");
    };

    const timer = window.setInterval(swap, 8000); // change every 8s

    return () => window.clearInterval(timer);
  }, [wallpapers]);

  return (
    <>
      {/* BACKGROUND */}
      <div className="bg" aria-hidden="true">
        <div id="bgA" className="bgLayer" />
        <div id="bgB" className="bgLayer" />
      </div>

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
            <img className="logo reveal d1" src="/Bimbies Logo.png" alt="Bimbies Logo" draggable={false} />
            <img className="coming reveal d2" src="/Coming Soon.png" alt="Coming Soon" draggable={false} />
            <img className="forme3 reveal d3" src="/Bimbies Forme 3.png" alt="" draggable={false} />
            <img className="qr reveal d6 pulse" ref={qrRef} src="/Qr Code.png" alt="QR Code" draggable={false} />
          </div>

          <img className="hero reveal d4 floaty" src="/Light Overlay.png" alt="" draggable={false} />
          <img className="heart reveal d5" src="/Bimbies Forme 2.png" alt="" draggable={false} />
        </div>
      </div>
    </>
  );
}
