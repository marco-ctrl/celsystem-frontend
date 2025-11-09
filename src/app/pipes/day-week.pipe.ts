import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDayWeek',
  standalone: true,
})
export class DayWeekPipe implements PipeTransform {

  transform(value: number): string {

    let day = '';
    switch (value) {
      case 1:
        day = 'Lunes';
        break;

      case 2:
        day = 'Martes';
        break;

      case 3:
        day = 'Miercoles';
        break;

      case 4:
        day = 'Jueves';
        break;

      case 5:
        day = 'Viernes';
        break;

      case 6:
        day = 'Sabado';
        break;

      case 7:
        day = 'Domingo';
        break;

      default:
        day = ''
        break;

    }

    return day;
  }

}
