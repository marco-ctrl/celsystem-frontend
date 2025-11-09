import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appWhatsappLink]',
  standalone: true,
})
export class WhatsappLinkDirective {

  @Input() whatsappNumber!: string;
  @Input() whatsappMessage: string = '';

  @HostBinding('class') className = 'whatsapp-link';

  constructor(private el: ElementRef) {
    this.el.nativeElement.href = `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${this.whatsappMessage}`;
  }

 }
