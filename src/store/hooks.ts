import type { Action, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from './index.ts';

type AppDispatch = Dispatch &
  ThunkDispatch<{ appState: RootState }, null, Action>;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
