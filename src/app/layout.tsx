export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hooks like useContext, useState, etc., can only go *inside* this function body.
  return (
    <html>
      <body>
        {/* Your content */}
        {children}
      </body>
    </html>
  );
}