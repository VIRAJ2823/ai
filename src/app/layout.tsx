import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/navigation/Navbar';

export const metadata: Metadata = {
  title: 'AI Career Platform',
  description:
    'Comprehensive platform combining realistic AI interview proctoring with client-side computer vision, an intelligent AI Career Guidance Agent, and a performance-driven resume builder.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
        <AuthProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
