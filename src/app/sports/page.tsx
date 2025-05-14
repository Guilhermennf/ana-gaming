'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OddsSport } from '@/lib/api';
import { getSportIcon } from '@/components/Sidebar/Sidebar';
import { useActiveSports } from '@/lib/queries';

export default function SportsPage() {
  const {
    data: sports = [],
    isLoading: loading,
    error: queryError,
  } = useActiveSports();
  const [error] = useState<string | null>(
    queryError
      ? 'Não foi possível carregar os esportes no momento. Tente novamente mais tarde.'
      : null
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Esportes Disponíveis
        </h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sports.map((sport) => (
              <Link
                key={sport.key}
                href={`/sports/${sport.key}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getSportIcon(sport.key)}</span>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-600">
                      {sport.title}
                    </h2>
                    <p className="text-gray-600">
                      {sport.description || sport.group}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
