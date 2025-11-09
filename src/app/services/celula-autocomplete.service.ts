import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CelulaAutocompleteService {

  public _valueForm = signal<string>('');

  constructor() { }

}
