import { configureStore } from '@reduxjs/toolkit';
import teamReducer from '@/store/features/teamDetails/teamDetailsSlice';
import teamsReducer from '@/store/features/teams/teamsSlice.ts';

export const store = configureStore({
  reducer: {
    teams: teamsReducer,
    teamDetails: teamReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
