"use client";

import { useEffect, useRef, useState } from "react";

export const EMBED_LAYOUTS = [
  {
    id: "masonry",
    label: "Freestyle Wall",
    tag: "Masonry",
    desc: "Multi-column masonry with natural heights and zero gaps — matches the landing page wall.",
    path: "/embed?layout=masonry",
    width: "100%",
    maxWidth: "880px",
    height: "540px",
    previewHeight: "420px",
  },
  {
    id: "stack",
    label: "Stacked Feed",
    tag: "Sidebar",
    desc: "Clean vertical card list — perfect for sidebars, landing page quotes, and compact widgets.",
    path: "/embed?layout=stack",
    width: "100%",
    maxWidth: "380px",
    height: "520px",
    previewHeight: "420px",
  },
  {
    id: "row",
    label: "Carousel Strip",
    tag: "Row",
    desc: "Horizontal scroll card row with smooth snap scrolling — great under hero headers and across banners.",
    path: "/embed?layout=row",
    width: "100%",
    maxWidth: "100%",
    height: "270px",
    previewHeight: "270px",
  },
  {
    id: "grid",
    label: "Uniform Grid",
    tag: "Grid",
    desc: "Balanced multi-column card grid — structured and neat for wide section embeds.",
    path: "/embed?layout=grid",
    width: "100%",
    maxWidth: "880px",
    height: "540px",
    previewHeight: "420px",
  },
];

function EmbedCustomizerContent() {
  const [selectedId, setSelectedId] = useState("masonry");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(""), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const current = EMBED_LAYOUTS.find((l) => l.id === selectedId) || EMBED_LAYOUTS[0];
  const fullUrl = origin ? `${origin}${current.path}` : current.path;

  const iframeCode = `<iframe src="${fullUrl}" title="Shipnote testimonials" loading="lazy" style="width:100%;${current.maxWidth !== "100%" ? `max-width:${current.maxWidth};` : ""}height:${current.height};border:0;border-radius:22px;overflow:hidden;"></iframe>`;

  async function copy(kind, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="embed-modal-body">
      {/* Layout Tabs */}
      <div className="embed-layout-tabs" role="tablist" aria-label="Embed layout options">
        {EMBED_LAYOUTS.map((layout) => {
          const isActive = layout.id === selectedId;
          return (
            <button
              key={layout.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`embed-layout-btn${isActive ? " active" : ""}`}
              onClick={() => setSelectedId(layout.id)}
            >
              {layout.label}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p className="embed-layout-desc">
        <strong>{current.label}:</strong> {current.desc}
      </p>

      {/* Live Preview */}
      {origin ? (
        <div className="embed-preview-container">
          <div className="embed-preview-header">
            <span>
              Live Preview · <code>{current.path}</code>
            </span>
            <a href={current.path} target="_blank" rel="noreferrer" className="embed-preview-link">
              Open standalone ↗
            </a>
          </div>
          <iframe
            key={current.id}
            src={fullUrl}
            title={`Shipnote ${current.label} embed preview`}
            loading="lazy"
            className="embed-preview-iframe"
            style={{
              width: "100%",
              maxWidth: current.maxWidth,
              height: current.previewHeight,
            }}
          />
        </div>
      ) : null}

      {/* Copy Actions */}
      <div className="embed-actions-row">
        <button
          type="button"
          className="button"
          onClick={() => copy("iframe", iframeCode)}
        >
          {copied === "iframe" ? "✓ Copied" : "Copy iframe code"}
        </button>
        <button
          type="button"
          className="button-ghost"
          onClick={() => copy("url", fullUrl)}
        >
          {copied === "url" ? "✓ Copied" : "Copy embed URL"}
        </button>
      </div>
    </div>
  );
}

export default function EmbedModal() {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
    // showModal() gives us native backdrop + focus trap + Escape key for free
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
    setOpen(false);
  }

  // Sync close when user presses Escape (dialog fires 'close' natively)
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    function onClose() { setOpen(false); }
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  // Close on backdrop click
  function onDialogClick(e) {
    if (e.target === dialogRef.current) closeModal();
  }

  return (
    <>
      <button
        id="open-embed-modal"
        type="button"
        className="button embed-open-btn"
        onClick={openModal}
        aria-haspopup="dialog"
      >
        Customize &amp; copy embed →
      </button>

      <dialog
        ref={dialogRef}
        className="embed-modal"
        aria-label="Embed customizer"
        aria-modal="true"
        onClick={onDialogClick}
      >
        <div className="embed-modal-inner">
          <div className="embed-modal-header">
            <div>
              <p className="kicker" style={{ margin: 0 }}>Embed</p>
              <h2 className="embed-modal-title">Customize your embed</h2>
            </div>
            <button
              type="button"
              className="embed-modal-close"
              aria-label="Close customizer"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          {open ? <EmbedCustomizerContent /> : null}
        </div>
      </dialog>
    </>
  );
}
