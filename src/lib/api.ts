import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const oddsApiClient = axios.create({
  baseURL: 'https://api.the-odds-api.com/v4',
});

oddsApiClient.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    apiKey: process.env.NEXT_PUBLIC_ODDS_API_KEY,
  };
  return config;
});

export interface Sport {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  sport: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  stats: {
    homeForm: string;
    awayForm: string;
    homeGoals: number;
    awayGoals: number;
  };
}

export const sportsApi = {
  getSports: async (): Promise<Sport[]> => {
    const response = await api.get('/sports');
    return response.data;
  },

  getLeagues: async (sportId: string): Promise<League[]> => {
    const response = await api.get(`/sports/${sportId}/leagues`);
    return response.data;
  },

  getMatches: async (leagueId: string): Promise<Match[]> => {
    const response = await api.get(`/leagues/${leagueId}/matches`);
    return response.data;
  },

  getMatch: async (matchId: string): Promise<Match> => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },
};

export type Outcome = {
  name: string;
  price: number;
};

export type Market = {
  key: string;
  outcomes: Outcome[];
};

export type Bookmaker = {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
};

export type Game = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
};

export type OddsSport = {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
};

export const oddsApi = {
  getSports: async (): Promise<OddsSport[]> => {
    const response = await oddsApiClient.get('/sports');
    return response.data;
  },

  getOddsBySport: async (
    sportKey: string,
    regions: string = 'us',
    markets: string = 'h2h,spreads,totals'
  ): Promise<Game[]> => {
    const response = await oddsApiClient.get(`/sports/${sportKey}/odds`, {
      params: {
        regions,
        markets,
      },
    });
    return response.data;
  },

  getGameById: async (
    gameId: string,
    regions: string = 'us',
    markets: string = 'h2h,spreads,totals'
  ): Promise<Game | null> => {
    const sportsResponse = await oddsApiClient.get('/sports');
    const sports: OddsSport[] = sportsResponse.data;

    for (const sport of sports) {
      const gamesResponse = await oddsApiClient.get(
        `/sports/${sport.key}/odds`,
        {
          params: {
            regions,
            markets,
          },
        }
      );

      const games: Game[] = gamesResponse.data;
      const game = games.find((g) => g.id === gameId);

      if (game) {
        return game;
      }
    }

    return null;
  },
};
