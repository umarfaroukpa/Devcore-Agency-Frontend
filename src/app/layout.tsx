import './globals.css';
import { Header } from '../component/Header'
import  Footer from '../component/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Header />
        <Footer />
        </body>
    </html>
  );
}