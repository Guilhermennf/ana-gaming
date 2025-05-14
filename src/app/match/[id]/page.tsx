'use client';

import { ArrowLeftCircleIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Bookmaker } from '@/lib/api';
import { formatDate } from '@/tools/formats';
import { useGameById } from '@/lib/queries';
import { convertAmericanToDecimal } from '@/tools/formats';
import { Table, TableColumn } from '@/components/Table/Table';

export default function MatchPage({ params }: { params: { id: string } }) {
  const [error, setError] = useState<string | null>(null);

  const { data: game, isLoading: loading, isError } = useGameById(params.id);

  if (isError && !error) {
    setError(
      'Não foi possível carregar os detalhes desta partida. Tente novamente mais tarde.'
    );
  }

  if (!loading && !game && !error) {
    setError('Partida não encontrada');
  }

  const getMoneylineOdds = (bookmakers: Bookmaker[]) => {
    const oddsObj: {
      home: number[];
      away: number[];
      draw?: number[];
    } = {
      home: [],
      away: [],
      draw: [],
    };

    bookmakers.forEach((bookmaker) => {
      const h2hMarket = bookmaker.markets.find(
        (market) => market.key === 'h2h'
      );
      if (h2hMarket && game) {
        h2hMarket.outcomes.forEach((outcome) => {
          if (outcome.name === game.home_team) {
            oddsObj.home.push(convertAmericanToDecimal(outcome.price));
          } else if (outcome.name === game.away_team) {
            oddsObj.away.push(convertAmericanToDecimal(outcome.price));
          } else {
            if (oddsObj.draw) {
              oddsObj.draw.push(convertAmericanToDecimal(outcome.price));
            }
          }
        });
      }
    });

    return oddsObj;
  };

  const calculateAverageOdds = (oddsList: number[]): number => {
    if (oddsList.length === 0) return 0;
    const sum = oddsList.reduce((acc, curr) => acc + curr, 0);
    return +(sum / oddsList.length).toFixed(2);
  };

  const allOdds = useMemo(() => {
    if (!game?.bookmakers) return { home: [], away: [], draw: [] };
    return getMoneylineOdds(game.bookmakers);
  }, [game]);

  const averageOdds = useMemo(() => {
    return {
      home: calculateAverageOdds(allOdds.home),
      draw:
        allOdds.draw && allOdds.draw.length > 0
          ? calculateAverageOdds(allOdds.draw)
          : null,
      away: calculateAverageOdds(allOdds.away),
    };
  }, [allOdds]);

  const getOddsColumns = (): TableColumn<Bookmaker>[] => {
    const columns: TableColumn<Bookmaker>[] = [
      {
        header: 'Casa de Apostas',
        accessor: 'title',
        cellClassName: 'text-left',
      },
      {
        header: game?.home_team,
        accessor: (bookmaker) => {
          const h2hMarket = bookmaker.markets.find(
            (market) => market.key === 'h2h'
          );
          if (!h2hMarket) return '-';

          const homeOutcome = h2hMarket.outcomes.find(
            (outcome) => outcome.name === game?.home_team
          );

          return homeOutcome
            ? convertAmericanToDecimal(homeOutcome.price)
            : '-';
        },
        cellClassName: 'text-center',
      },
    ];

    // Adiciona coluna de empate apenas se existir
    if (averageOdds.draw !== null) {
      columns.push({
        header: 'Empate',
        accessor: (bookmaker) => {
          const h2hMarket = bookmaker.markets.find(
            (market) => market.key === 'h2h'
          );
          if (!h2hMarket) return '-';

          const drawOutcome = h2hMarket.outcomes.find(
            (outcome) =>
              outcome.name !== game?.home_team &&
              outcome.name !== game?.away_team
          );

          return drawOutcome
            ? convertAmericanToDecimal(drawOutcome.price)
            : '-';
        },
        cellClassName: 'text-center',
      });
    }

    // Adiciona colunas restantes
    columns.push(
      {
        header: game?.away_team,
        accessor: (bookmaker) => {
          const h2hMarket = bookmaker.markets.find(
            (market) => market.key === 'h2h'
          );
          if (!h2hMarket) return '-';

          const awayOutcome = h2hMarket.outcomes.find(
            (outcome) => outcome.name === game?.away_team
          );

          return awayOutcome
            ? convertAmericanToDecimal(awayOutcome.price)
            : '-';
        },
        cellClassName: 'text-center',
      },
      {
        header: 'Última Atualização',
        accessor: (bookmaker) => {
          return new Date(bookmaker.last_update).toLocaleString('pt-BR');
        },
        cellClassName: 'text-center text-xs',
      }
    );

    return columns;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Partida não encontrada'}
          </div>
          <Link
            href="/sports"
            className="mt-4 inline-block text-green-600 hover:text-green-800"
          >
            Voltar para Esportes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/sports/${game.sport_key}`}
            className="text-green-600 hover:text-green-800"
          >
            <ArrowLeftCircleIcon className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            Detalhes da Partida
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {game.sport_title}
            </h2>
            <p className="text-gray-600">{formatDate(game.commence_time)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-500">
                {game.home_team}
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {averageOdds.home}
              </p>
            </div>
            {averageOdds.draw !== null ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-500">
                  Empate
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {averageOdds.draw}
                </p>
              </div>
            ) : (
              <div className="text-center hidden md:block"></div>
            )}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-500">
                {game.away_team}
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {averageOdds.away}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 text-green-700">
              Comparação de Odds
            </h3>
            <Table
              data={game.bookmakers}
              columns={getOddsColumns()}
              keyExtractor={(bookmaker) => bookmaker.key}
              rowClassName={(_, index) => (index % 2 === 0 ? 'bg-gray-50' : '')}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
