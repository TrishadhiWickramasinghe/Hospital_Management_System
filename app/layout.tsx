import type { Metadata } from 'next';
import { AuthProvider } from '@/app/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Hospital Management System',
  description: 'A comprehensive hospital management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="p-8">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
