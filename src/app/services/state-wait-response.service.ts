import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateWaitResponseService {

  public _isWaitResponse = signal<Boolean>(false);
  public isWaitResponse = computed(() => this._isWaitResponse());

  constructor() { }

}
