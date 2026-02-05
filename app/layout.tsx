import "./globals.css";

export const metadata = {
  title: "Bimbies - Coming Soon",
  description: "Bimbies – Better diapers are coming soon",
  icons: {
    icon: [{ url: "/bimbies-logo.png", type: "image/png" }],
    apple: [{ url: "/bimbies-logo.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#B61E73" />
      </head>
      <body>{children}</body>
    </html>
  );
}
