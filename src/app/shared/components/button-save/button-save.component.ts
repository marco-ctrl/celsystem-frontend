import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-save',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  template: `
  <button
  type="submit"
  title="Guardar"
  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
>
  <mat-icon fontIcon="save" class="text-white"></mat-icon>
  <span>Guardar</span>
</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSaveComponent { }
