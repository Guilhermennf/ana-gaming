'use client';

import { GlobeAmericasIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useActiveSports } from '@/lib/queries';

export const getSportIcon = (sportKey: string) => {
  const icons: Record<string, string> = {
    soccer: '⚽',
    football: '🏈',
    basketball: '🏀',
    baseball: '⚾',
    hockey: '🏒',
    tennis: '🎾',
    golf: '⛳',
    mma: '🥊',
    boxing: '🥊',
    cricket: '🏏',
    rugbyunion: '🏉',
    rugbyleague: '🏉',
    volleyball: '🏐',
  };

  for (const key in icons) {
    if (sportKey.toLowerCase().includes(key.toLowerCase())) {
      return icons[key];
    }
  }

  return '🎮';
};

export function Sidebar() {
  const { data: sports = [], isLoading } = useActiveSports();

  const sidebarSports = sports.slice(0, 10);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
      <div className="p-4 border-b">
        <h3 className="text-gray-500 font-medium text-sm mb-4">POPULARES</h3>
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <GlobeAmericasIcon className="w-5 h-5 text-green-600" />
            <span>Copa do Mundo</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <GlobeAmericasIcon className="w-5 h-5 text-green-600" />
            <span>Copa América</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <GlobeAmericasIcon className="w-5 h-5 text-green-600" />
            <span>Eurocopa</span>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-gray-500 font-medium text-sm mb-4">ESPORTES</h3>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {sidebarSports.length > 0
              ? sidebarSports.map((sport) => (
                  <Link
                    key={sport.key}
                    href={`/sports/${sport.key}`}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <span className="text-gray-600">
                      {getSportIcon(sport.key)}
                    </span>
                    <span>{sport.title}</span>
                  </Link>
                ))
              : null}
          </div>
        )}
      </div>
    </div>
  );
}
