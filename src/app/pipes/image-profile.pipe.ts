import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '../../environments/environments';

@Pipe({
  name: 'appImageProfile',
  standalone: true,
})
export class ImageProfilePipe implements PipeTransform {

  private readonly baseUrl: string = environment.baseUrl;

  transform(value: string): string {

    if(!value || value == ''){
      return '../../assets/images/user-default.png';
    }

    return this.baseUrl + `/${value}`;
  }

}
