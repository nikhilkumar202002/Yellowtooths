import type { Metadata } from 'next';
import { Providers } from './components/providers';
import NavBar from './components/common/NavBar'; 
import Footer from './components/common/Footer';
import Preloader from './components/common/Preloader';
import FloatingActionMenu from './components/common/FloatingActionMenu';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yellowtooths',
  description: 'Your site description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-geist">
        <Providers>
           <Preloader waveDirection="top" />
           
           <div className="relative">
             <div className="absolute z-50">
                <NavBar /> 
             </div>
             {children}
             <FloatingActionMenu />
           </div>
           <Footer />
           <Toaster position="top-center" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}