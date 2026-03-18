import "./globals.css";

export const metadata = {
  title: "Beyond The Body | Luxury Fragrances",
  description: "You don't wear a fragrance. You become it. Discover the signature collection from Beyond The Body.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen overflow-x-hidden grain">
        {children}
      </body>
    </html>
  );
}
