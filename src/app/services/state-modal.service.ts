import { computed, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateModalService {

  public _stateModal = signal<boolean>(false);
  public stateModal = computed(() => this._stateModal());

  constructor() {
    this.checkStateModal().subscribe();
   }

  checkStateModal(): Observable<boolean>
  {
    return of(this.stateModal());
  }

}
