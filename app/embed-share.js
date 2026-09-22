"use client";

import { useEffect, useState } from "react";

export default function EmbedShare({ path = "/embed" }) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(""), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const iframe = `<iframe src="${url}" title="Shipnote testimonials" loading="lazy" style="width:100%;max-width:380px;height:520px;border:0;border-radius:22px;overflow:hidden;"></iframe>`;

  async function copy(kind, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="share-stack">
      <div className="embed-box embed-actions">
        <button type="button" onClick={() => copy("iframe", iframe)}>
          {copied === "iframe" ? "Copied" : "Copy iframe code"}
        </button>
        <button type="button" onClick={() => copy("url", url)}>
          {copied === "url" ? "Copied" : "Copy embed URL"}
        </button>
      </div>
    </div>
  );
}
