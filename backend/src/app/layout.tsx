export const metadata = {
  title: 'Lumi API',
  description: 'Backend API for the Lumi wellness app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
