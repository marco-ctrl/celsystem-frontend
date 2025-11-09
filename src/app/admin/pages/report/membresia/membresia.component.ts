import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-membresia',
  standalone: true,
  imports: [],
  templateUrl: './membresia.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MembresiaComponent { }
