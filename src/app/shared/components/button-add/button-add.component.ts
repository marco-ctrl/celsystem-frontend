import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-add',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  template: `
    <button
  [title]="title()!"
  class="btn-primary"
>
  <mat-icon fontIcon="add" class="text-white"></mat-icon>
  <span class="hidden sm:inline">Agregar</span>
</button>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonAddComponent {
  public title = input.required<string>();
}
