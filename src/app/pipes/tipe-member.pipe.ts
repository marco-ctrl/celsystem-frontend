import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTipeMember',
  standalone: true,
})
export class TipeMemberPipe implements PipeTransform {

  transform(value: number): string {
    let tipe: string = ''
    switch (value) {
      case 0:
        tipe = 'ASISTENTE';
        break;

      case 1:
        tipe = 'ANFITRION';
        break;

      case 2:
        tipe = 'VISITA';
        break;

      case 3:
        tipe = 'MIEMBRO';
        break;
    }

    return tipe;
  }

}
