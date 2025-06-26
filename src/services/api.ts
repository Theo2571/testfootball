import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': '23b989d0d56b4e82bbfd6dfbe8e226dc' },
  timeout: 4000,
});
