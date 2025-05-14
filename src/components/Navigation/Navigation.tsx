'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AuthButton } from '../AuthButton/AuthButton';
import { signOut, useSession } from 'next-auth/react';

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav
      className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 py-4`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-green-700">
              Ana Gaming
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/sports"
              className={`text-sm font-medium ${
                isActive('/sports')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Esportes
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/tools')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ferramentas
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/calculators')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calculadoras
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/bets')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Apostas
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/academy')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Academia
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="ml-4">
              <AuthButton />
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-4">
              <Link
                href="/sports"
                className={`text-sm font-medium py-2 ${
                  isActive('/sports')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Esportes
              </Link>
              <Link
                href="/tools"
                className={`text-sm font-medium py-2 ${
                  isActive('/tools')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ferramentas
              </Link>
              <Link
                href="/calculators"
                className={`text-sm font-medium py-2 ${
                  isActive('/calculators')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Calculadoras
              </Link>
              <Link
                href="/bets"
                className={`text-sm font-medium py-2 ${
                  isActive('/bets')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apostas
              </Link>
              <Link
                href="/academy"
                className={`text-sm font-medium py-2 ${
                  isActive('/academy')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Academia
              </Link>

              {session ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Olá, {session.user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <span className="text-green-600">🇧🇷</span>
                    <span className="text-green-600">BR</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.location.href = '/auth/signin';
                    }}
                    className="bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium"
                  >
                    Cadastre-se
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
