import "./globals.css";

export const metadata = {
  title: "Bimbies - Coming Soon",
  description: "Bimbies – Better diapers are coming soon",
  icons: {
    icon: [{ url: "/Bimbies Logo.png", type: "image/png" }],
    apple: [{ url: "/Bimbies Logo.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#B61E73" />
      </head>
      <body>{children}</body>
    </html>
  );
}
