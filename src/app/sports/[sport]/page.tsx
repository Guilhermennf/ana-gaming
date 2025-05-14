'use client';

import { ArrowLeftCircleIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Game } from '@/lib/api';
import { formatDate } from '@/tools/formats';
import { useSports, useSportOdds } from '@/lib/queries';

export default function SportPage({ params }: { params: { sport: string } }) {
  const [error, setError] = useState<string | null>(null);

  const { data: sports = [], isLoading: loadingSports } = useSports();
  const sportInfo = sports.find((s) => s.key === params.sport);

  const { data: gamesData = [], isLoading: loadingOdds } = useSportOdds(
    params.sport,
    'eu,us,uk',
    'h2h,spreads,totals'
  );

  const games = useMemo(() => {
    return [...gamesData].sort((a, b) => {
      return (
        new Date(a.commence_time).getTime() -
        new Date(b.commence_time).getTime()
      );
    });
  }, [gamesData]);

  const loading = loadingSports || loadingOdds;

  if (!loading && !sportInfo && !error) {
    setError('Esporte não encontrado');
  }

  const groupGamesByTournament = () => {
    const tournaments: Record<string, Game[]> = {};

    games.forEach((game) => {
      const tournamentName = game.sport_title;

      if (!tournaments[tournamentName]) {
        tournaments[tournamentName] = [];
      }

      tournaments[tournamentName].push(game);
    });

    return tournaments;
  };

  const groupedGames = groupGamesByTournament();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sports" className="text-green-600 hover:text-green-800">
            <ArrowLeftCircleIcon className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            {loading
              ? 'Carregando...'
              : sportInfo
                ? sportInfo.title
                : 'Esporte não encontrado'}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : games.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Não há jogos disponíveis para este esporte no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(groupedGames).map(
              ([tournament, tournamentGames]) => (
                <div
                  key={tournament}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                        {tournament}
                      </h2>
                      <p className="text-gray-600">
                        {tournamentGames.length} jogos disponíveis
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-medium mb-3 text-green-700">
                      Próximos Jogos
                    </h3>
                    <div className="space-y-4">
                      {tournamentGames.map((game) => (
                        <Link
                          key={game.id}
                          href={`/match/${game.id}`}
                          className="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-gray-600">
                                {formatDate(game.commence_time)}
                              </div>
                              <div className="font-medium text-gray-600">
                                {game.home_team} vs {game.away_team}
                              </div>
                            </div>
                            <div className="text-green-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
