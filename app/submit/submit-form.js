"use client";

import { useState } from "react";
import { UploadButton } from "../../lib/uploadthing";
import { submitTestimonial } from "./actions.js";

export default function SubmitForm({ error }) {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  return (
    <form className="composer" action={submitTestimonial}>
      <p className="kicker">Add a testimonial</p>
      <p className="composer-hint">No account. Optional image or short video (up to 128 MB).</p>
      <label className="sr" htmlFor="quote">Quote</label>
      <textarea
        id="quote"
        name="quote"
        required
        rows={7}
        maxLength={800}
        placeholder="Write the quote"
      />
      <div className="who">
        <label className="sr" htmlFor="name">Name</label>
        <input id="name" name="name" required maxLength={80} placeholder="Name" />
        <label className="sr" htmlFor="detail">Detail</label>
        <input id="detail" name="detail" maxLength={80} placeholder="Role, optional" />
      </div>
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="videoUrl" value={videoUrl} />
      <div className="media-row">
        <div>
          <p className="media-label">Image, optional</p>
          <UploadButton
            endpoint="testimonialImage"
            onClientUploadComplete={(res) => {
              const file = res?.[0];
              const url = file?.ufsUrl || file?.url || file?.serverData?.url || "";
              setImageUrl(url);
              setUploadError("");
            }}
            onUploadError={(err) => setUploadError(err.message)}
          />
          {imageUrl ? <p className="media-ok">Image ready</p> : null}
        </div>
        <div>
          <p className="media-label">Short video, optional · 128 MB</p>
          <UploadButton
            endpoint="testimonialVideo"
            onClientUploadComplete={(res) => {
              const file = res?.[0];
              const url = file?.ufsUrl || file?.url || file?.serverData?.url || "";
              setVideoUrl(url);
              setUploadError("");
            }}
            onUploadError={(err) => setUploadError(err.message)}
          />
          {videoUrl ? <p className="media-ok">Video ready</p> : null}
        </div>
      </div>
      <div className="composer-bar">
        <span>Quote and name. Media optional.</span>
        <button type="submit">Add a testimonial</button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      {uploadError ? <p className="error">{uploadError}</p> : null}
    </form>
  );
}
