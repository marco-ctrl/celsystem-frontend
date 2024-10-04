import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div class="absolute inset-0 flex items-center justify-center bg-gray-400 bg-opacity-75 z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-800"></div>
      <h1 class="px-4">Cargando...</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent { }
