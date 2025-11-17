import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '../../environments/environments';

@Pipe({
  name: 'appLeccion',
  standalone: true,
})
export class LeccionPipe implements PipeTransform {

  private readonly baseUrl: string = environment.baseUrl;

  transform(value: string): string {

    return this.baseUrl + `/${value}`;
  }

}
