import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mapa-celula',
  standalone: true,
  imports: [],
  template: `<p>mapa-celula works!</p>`,
  styleUrl: './mapa-celula.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MapaCelulaComponent { }
