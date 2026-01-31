import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import AnimationProvider from '@/components/AnimationProvider';
import ToastProvider from '@/components/ToastProvider';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StartupBenefits - Exclusive Deals for Startups',
  description:
    'Discover and claim exclusive deals, partnerships, and benefits for your startup. Access tools, services, and resources to grow your business.',
  keywords:
    'startup benefits, startup deals, business tools, SaaS discounts, startup partnerships',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ParticleBackground />
          <NextTopLoader
            color="#10B981"
            height={3}
            showSpinner={false}
            crawl={false}
            easing="ease"
            speed={300}
          />
          <ToastProvider />
          <div className="min-h-screen flex flex-col bg-[#0B0F14]">
            <Navbar />
            <AnimationProvider>
              <main className="flex-1">{children}</main>
            </AnimationProvider>
            <footer className="bg-[#0B0F14] text-white py-8 mt-auto">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3">StartupBenefits</h3>
                    <p className="text-gray-400 text-sm">
                      Exclusive deals and partnerships for startups to accelerate growth.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>
                        <a href="/deals" className="hover:text-white transition-colors">
                          Browse Deals
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="hover:text-white transition-colors">
                          Dashboard
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Contact</h4>
                    <p className="text-sm text-gray-400">
                      support@startupbenefits.com
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
                  <p>
                    &copy; {new Date().getFullYear()} StartupBenefits. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}