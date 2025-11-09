import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appLinkWhatsap',
  standalone: true,
})
export class LinkWhatsapPipe implements PipeTransform {

  transform(value: string | number): string {
    const mensajePredefinido = 'Hola, me gustaría hablar contigo sobre...';
    return `https://api.whatsapp.com/send?phone=${value}&text=${encodeURIComponent(mensajePredefinido)}`;
  
  }

}
