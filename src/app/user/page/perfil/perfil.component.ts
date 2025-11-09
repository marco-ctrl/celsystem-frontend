import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  template: `<p>perfil works!</p>`,
  styleUrl: './perfil.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PerfilComponent { }
