import { booleanAttribute, Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template: `
    <h1 class="text-3xl mb-5">{{ title }} - {{ withShadow }}</h1>
  `,
  styleUrl: './title.component.css'
})
export class TitleComponent {
  @Input({ required: true }) title?: string;
  @Input({ transform: booleanAttribute }) withShadow: boolean = false;
}
