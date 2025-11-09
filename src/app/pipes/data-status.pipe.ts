import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDataStatus',
  standalone: true,
})
export class DataStatusPipe implements PipeTransform {

  transform(value: number, ...args: any[]): string {
    return value === 1 ? 'Activo' : 'Inhabilitado' ;
  }

}
