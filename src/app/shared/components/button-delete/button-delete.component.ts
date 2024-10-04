import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  template: `
  <button
  class="btn-action"
  [class]="color()"
  [title]="titulo()"
>
  <mat-icon [fontIcon]="icon()!" class="text-white"></mat-icon>
</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDeleteComponent { 
  titulo = input<string>();
  color  = input<string>();
  icon   = input<string>();
}
