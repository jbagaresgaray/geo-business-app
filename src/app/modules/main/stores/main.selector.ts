import { createSelector } from '@ngrx/store';

export const mainSelectorState = (state) => state.main;

export const mainSelector = createSelector(
  mainSelectorState,
  (businesses) => businesses
);

export const businessSelector = createSelector(
  mainSelectorState,
  (businesses) => businesses
);
