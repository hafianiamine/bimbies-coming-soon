import "./globals.css";

export const metadata = {
  title: "Bimbies - Coming Soon",
  icons: { icon: "/Bimbies Logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}
