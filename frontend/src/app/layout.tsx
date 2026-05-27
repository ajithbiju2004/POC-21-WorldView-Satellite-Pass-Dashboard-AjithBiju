import "./globals.css";

export const metadata = {
  title: "WorldView Dashboard",
  description: "Satellite Pass Intelligence Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#030712] text-white">
        {children}
      </body>
    </html>
  );
}