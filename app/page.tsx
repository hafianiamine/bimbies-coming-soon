"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  const artboardRef = useRef<HTMLDivElement | null>(null);
  const preloaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const artboard = artboardRef.current;
    const preloader = preloaderRef.current;
    const qr = document.getElementById("qr") as HTMLImageElement | null;

    if (!artboard || !preloader || !qr) return;

    function setVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    function setMode() {
      const isMobile =
        window.matchMedia("(max-width: 820px)").matches ||
        window.matchMedia("(orientation: portrait)").matches;
      document.body.classList.toggle("mobile", isMobile);
    }

    function getBoardWH() {
      const isMobile = document.body.classList.contains("mobile");
      return isMobile ? { W: 720, H: 1600 } : { W: 2048, H: 1152 };
    }

    function fit() {
      const el = artboardRef.current; // ✅ always safe
      if (!el) return;

      const { W, H } = getBoardWH();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const isMobile = document.body.classList.contains("mobile");
      const scale = isMobile
        ? Math.min(vw / W, vh / H) * 1.06
        : Math.min(vw / W, vh / H);

      el.style.transform = `translateZ(0) scale(${scale})`;
    }

    function waitForImages() {
      const imgs = Array.from(document.querySelectorAll("img"));
      return Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              // @ts-ignore
              if (img.decode) img.decode().then(resolve).catch(resolve);
              else if ((img as HTMLImageElement).complete) resolve();
              else {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              }
            })
        )
      );
    }

    function refreshAll() {
      setVH();
      setMode();
      fit();
    }

    const onResize = () => refreshAll();
    const onOrientation = () => refreshAll();

    // QR click
    const onQrClick = () => {
      window.open(
        "https://www.facebook.com/BimbiesOfficielle",
        "_blank",
        "noopener,noreferrer"
      );
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    qr.addEventListener("click", onQrClick);

    refreshAll();

    (async () => {
      await waitForImages();
      document.body.classList.add("ready");
      setTimeout(() => preloader.classList.add("hide"), 180);
    })();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      qr.removeEventListener("click", onQrClick);
    };
  }, []);

  return (
    <>
      <div className="preloader" id="preloader" ref={preloaderRef}>
        <div className="loaderWrap">
          <div className="spinner" />
          <div className="loadingText">Loading…</div>
        </div>
      </div>

      <div className="viewport">
        <div className="artboard" id="artboard" ref={artboardRef}>
          <div className="leftGroup">
            <img className="logo reveal d1" src="/Bimbies Logo.png" alt="Bimbies Logo" />
            <img className="coming reveal d2" src="/Coming Soon.png" alt="Coming Soon" />
            <img className="forme3 reveal d3" src="/Bimbies Forme 3.png" alt="Decoration" />
            <img className="qr reveal d6 pulse" id="qr" src="/Qr Code.png" alt="QR Code" />
          </div>

          <img className="hero reveal d4" src="/Light Overlay.png" alt="Baby Hero" />
          <img className="heart reveal d5" src="/Bimbies Forme 2.png" alt="Heart" />
        </div>
      </div>
    </>
  );
}
