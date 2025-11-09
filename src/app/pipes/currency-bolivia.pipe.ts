import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrencyBolivia',
  standalone: true,
})
export class CurrencyBoliviaPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'BOB'): string {
    // Configuración para el formato de moneda boliviana
    const formatter = new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    });

    return formatter.format(value);
  }

}
