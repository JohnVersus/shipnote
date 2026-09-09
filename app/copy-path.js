"use client";

import { useEffect, useState } from "react";

export default function CopyPath({ path, label = "Link" }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(path);

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="embed-box">
      <span>{label}</span>
      <code>{url}</code>
      <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
    </div>
  );
}
