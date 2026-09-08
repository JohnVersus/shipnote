import "./globals.css";

export const metadata = {
  title: "Shipnote",
  description: "A public changelog. Post an update, share a link, embed the latest.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
