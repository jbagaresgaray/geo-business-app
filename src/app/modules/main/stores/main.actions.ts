import { Action } from '@ngrx/store';
import { Business } from '../models/business.model';

export enum MainActionTypes {
  businessAction = '[main] businesses',
}

export class ExploreBusinessAction implements Action {
  readonly type = MainActionTypes.businessAction;

  constructor(public payload: { businesses: Business[] }) {}
}

export type MainActions = ExploreBusinessAction;
