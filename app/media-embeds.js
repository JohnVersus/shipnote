"use client";

import { useEffect } from "react";

export function YoutubeEmbed({ url }) {
  if (!url) return null;
  return (
    <div className="media-frame">
      <iframe
        src={url}
        title="YouTube testimonial"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function TwitterEmbed({ url }) {
  useEffect(() => {
    if (!url || typeof window === "undefined") return;
    const existing = document.querySelector("script[data-shipnote-twitter]");
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.dataset.shipnoteTwitter = "true";
      document.body.appendChild(script);
      script.onload = () => {
        if (window.twttr?.widgets?.load) window.twttr.widgets.load();
      };
    } else if (window.twttr?.widgets?.load) {
      window.twttr.widgets.load();
    }
  }, [url]);

  if (!url) return null;
  return (
    <div className="tweet-embed" onClick={(event) => event.preventDefault()}>
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  );
}
