import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { oddsApi, OddsSport, Game } from './api';

export const QUERY_KEYS = {
  SPORTS: 'sports',
  SPORT_ODDS: 'sportOdds',
  GAME: 'game',
};

export function useSports(): UseQueryResult<OddsSport[], unknown> {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORTS],
    queryFn: () => oddsApi.getSports(),
  });
}

export function useActiveSports(): UseQueryResult<OddsSport[], unknown> {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORTS, 'active'],
    queryFn: async () => {
      const sports = await oddsApi.getSports();
      return sports.filter((sport) => sport.active);
    },
  });
}

export function useSportOdds(
  sportKey: string,
  regions: string = 'us',
  markets: string = 'h2h,spreads,totals'
): UseQueryResult<Game[], unknown> {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORT_ODDS, sportKey, regions, markets],
    queryFn: () => oddsApi.getOddsBySport(sportKey, regions, markets),
    enabled: !!sportKey,
  });
}

export function useGameById(
  gameId: string,
  regions: string = 'us',
  markets: string = 'h2h,spreads,totals'
): UseQueryResult<Game | null, unknown> {
  return useQuery({
    queryKey: [QUERY_KEYS.GAME, gameId, regions, markets],
    queryFn: () => oddsApi.getGameById(gameId, regions, markets),
    enabled: !!gameId,
  });
}

export function usePopularSports(
  limit: number = 6
): UseQueryResult<OddsSport[], unknown> {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORTS, 'popular', limit],
    queryFn: async () => {
      const sports = await oddsApi.getSports();
      return sports.filter((sport) => sport.active).slice(0, limit);
    },
  });
}

export function useEvents(
  sportLimit: number = 3,
  eventLimit: number = 5
): UseQueryResult<{ featured: Game[]; live: Game[] }, unknown> {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORT_ODDS, 'events', sportLimit, eventLimit],
    queryFn: async () => {
      const sports = await oddsApi.getSports();
      const popularSportKeys = sports
        .filter((s) => s.active)
        .slice(0, sportLimit)
        .map((s) => s.key);

      let allGames: Game[] = [];
      for (const sportKey of popularSportKeys) {
        const games = await oddsApi.getOddsBySport(sportKey, 'eu,us,uk', 'h2h');
        allGames = [...allGames, ...games];
      }

      allGames.sort(
        (a, b) =>
          new Date(a.commence_time).getTime() -
          new Date(b.commence_time).getTime()
      );

      const featured = allGames
        .filter((game) => new Date(game.commence_time) > new Date())
        .slice(0, eventLimit);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const live = allGames
        .filter((game) => {
          const gameDate = new Date(game.commence_time);
          return gameDate >= today && gameDate <= tomorrow;
        })
        .slice(0, eventLimit);

      return { featured, live };
    },
  });
}
