'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  if (loading) {
    return (
      <button className="bg-gray-200 text-gray-500 py-2 px-4 rounded-md text-sm font-medium">
        Carregando...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
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
    );
  }

  return (
    <button
      onClick={() => router.push('/auth/signin')}
      className="bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700"
    >
      Entrar
    </button>
  );
}
