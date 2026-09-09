import "./globals.css";

export const metadata = {
  title: "Shipnote",
  description: "Collect a testimonial, show a public wall, and embed it.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
