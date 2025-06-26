export interface TeamShort {
  id: number;
  name: string;
  crest: string;
}

export interface Player {
  id: number;
  name: string;
  position: string | null;
  dateOfBirth: string;
  nationality: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string | null;
  type: 'CUP' | 'LEAGUE';
}

export interface Coach {
  id: number;
  name: string;
  nationality: string;
}

export interface TeamDetails extends TeamShort {
  founded: string;
  area: any;
  address: string | null;
  clubColors: string | null;
  website: any;
  venue: string;
  runningCompetitions: Competition[];
  coach: Coach;
  squad: Player[];
}

export interface ResultSet {
  count: number;
  limit: number;
  offset: number;
}

export interface TeamListResponse {
  teams: TeamShort[];
  total: number;
  resultSet: ResultSet;
}
export interface TeamShort {
  id: number;
  name: string;
  crest: string;
}

export interface TeamListApiResponse {
  count: number;
  filters: { limit: number; offset: number; permission?: string };
  teams: TeamShort[];
}

export interface ResultSet {
  count: number;
  limit: number;
  offset: number;
}

export interface TeamListResponse {
  teams: TeamShort[];
  resultSet: ResultSet;
}
export interface Match {
  id: number;
  utcDate: string;
  competition: { name: string };
  homeTeam: { name: string };
  awayTeam: { name: string };
}
