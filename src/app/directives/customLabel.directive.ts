import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[customLabel]',
  standalone: true,
})
export class CustomLabelDirective {

  private _errors?:     ValidationErrors | null;
  private htmlElement?: ElementRef<HTMLElement>;

  @Input() set errors( value: ValidationErrors | null | undefined){
    this._errors = value;
    this.setErrorMessage();
  }

  constructor( private el: ElementRef<HTMLElement> ){
    this.htmlElement = el
  }

  setErrorMessage(): void{
    if( !this.htmlElement ) return;
    if( !this._errors ){
      this.htmlElement.nativeElement.innerHTML = ''
      return;
    }

    const errors = Object.keys(this._errors);

    if( errors.includes('required') ){
      this.htmlElement.nativeElement.innerHTML = 'Este campo es requerido';
      return;
    }

    if( errors.includes('minlength') ){
      const min = this._errors!['minlength']['requiredLength'];
      const current  = this._errors!['minlength']['actualLength'];

      this.htmlElement.nativeElement.innerHTML = `Minimo ${ current }/${ min } caracteres.`;
      return;
    }

    if( errors.includes('maxlength') ){
      const min = this._errors!['maxlength']['requiredLength'];
      const current  = this._errors!['maxlength']['actualLength'];

      this.htmlElement.nativeElement.innerHTML = `Maximo ${ current }/${ min } caracteres.`;
      return;
    }

    if( errors.includes('min') ){
      const min = this._errors!['min']['min'];
      const current = this._errors!['min']['actual'];

      this.htmlElement.nativeElement.innerHTML = `Valor minimo debe ser ${min}`
    }

    if( errors.includes('mail') ){
      this.htmlElement.nativeElement.innerHTML = 'Este campo tiene que ser fomato email';
      return;
    }
  }

 }
