import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap} from 'rxjs/operators';
import { ExploreBusinessAction, MainActionTypes } from './main.actions';
import { LocalStorageService } from '../../../services/local-storage.service';

@Injectable()
export class MainEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  public reminderData$ = this.actions$.pipe(
    ofType<ExploreBusinessAction>(MainActionTypes.businessAction),
    tap((action) => {
      this.localStorageService.setItem('BUSINESSES', action.payload.businesses);
    })
  );
}
