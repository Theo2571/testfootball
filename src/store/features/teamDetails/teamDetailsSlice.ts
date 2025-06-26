import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { Match, TeamDetails } from '@/types/football';

interface TeamState {
  entity: TeamDetails | null;
  matches: Match[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TeamState = {
  entity: null,
  matches: [],
  status: 'idle',
  error: null,
};

export const fetchTeam = createAsyncThunk<TeamDetails, number>(
  'team/fetchTeam',
  async id => {
    const response = await api.get<TeamDetails>(`/teams/${id}`);
    return response.data;
  },
);

export const fetchMatches = createAsyncThunk<Match[], number>(
  'team/fetchMatches',
  async teamId => {
    const response = await api.get<{ matches: Match[] }>(
      `/teams/${teamId}/matches?limit=10`,
    );
    return response.data.matches;
  },
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTeam.pending, state => {
        state.status = 'loading';
        state.entity = null;
        state.matches = [];
      })
      .addCase(fetchTeam.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.entity = payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        console.log(action, 'action');
        state.status = 'failed';
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(fetchMatches.fulfilled, (state, { payload }) => {
        state.matches = payload;
      });
  },
});

export default teamSlice.reducer;
