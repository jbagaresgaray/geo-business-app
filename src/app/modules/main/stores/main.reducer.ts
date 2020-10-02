import { MainActionTypes, MainActions } from './main.actions';
import { Business } from '../models/business.model';

export interface MainState {
  businesses?: Business[];
}

export const initialMainState: MainState = {
  businesses: undefined,
};

export function mainReducer(
  // tslint:disable-next-line:no-shadowed-variable
  MainState = initialMainState,
  action: MainActions
): MainState {
  switch (action.type) {
    case MainActionTypes.businessAction:
      return Object.assign({}, MainState, {
        businesses: action.payload.businesses,
      });

    default:
      return MainState;
  }
}
