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
