import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  template: `
    <button
      class="btn-edit"
      title="Editar"
    >
  <mat-icon fontIcon="edit" class="text-white"></mat-icon>
</button>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonEditComponent { }
