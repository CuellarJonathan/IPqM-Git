import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IPqM Dashboard - SAASS Management',
  description: 'Sistema de gestão de SAASS, componentes e lançamentos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
            <footer className="bg-white border-t px-6 py-4 text-sm text-gray-500">
              <p>IPqM Dashboard &copy; {new Date().getFullYear()} - Sistema de Gestão de SAASS</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}
