// src/store/features/teamsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { TeamShort } from '@/types/football';

interface TeamsState {
  data: TeamShort[];
  page: number;
  total: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: TeamsState = {
  data: [],
  page: 0,
  total: 0,
  status: 'idle',
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (page: number) => {
    const limit = 20;
    const offset = page * limit;

    const response = await api.get(`/teams?limit=${limit}&offset=${offset}`);
    const { teams } = response.data;

    return {
      teams,
      total: 1000,
      page,
    };
  },
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    reset: state => {
      state.data = [];
      state.page = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTeams.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        const { teams, page, total } = action.payload;
        state.data = page === 0 ? teams : [...state.data, ...teams];
        state.page = page + 1;
        state.total = total;
        state.status = 'succeeded';
      })
      .addCase(fetchTeams.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default teamsSlice.reducer;
export const { reset } = teamsSlice.actions;
