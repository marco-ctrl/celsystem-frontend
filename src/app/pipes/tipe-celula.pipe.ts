import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTipeCelula',
  standalone: true,
})
export class TipeCelulaPipe implements PipeTransform {

  transform(value: number): string {
    let tipe: string = ''
    switch (value) {
      case 1:
        tipe = 'VARONES';
        break;

      case 2:
        tipe = 'MUJERES';
        break;

      case 3:
        tipe = 'NIÑOS/PREJUVENILES';
        break;

    }

    return tipe;
  }

}
