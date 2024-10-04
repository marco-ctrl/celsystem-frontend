import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  template: `
    <div>
  <label [for]="formControlName" class="block text-sm font-medium text-gray-700">
    {{ label }}
  </label>
  <input
    [id]="formControlName"
    [type]="type"
    [formControlName]="formControlName"
    [placeholder]="placeholder"
    class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    [ngClass]="{ 'border-red-500': isValidField(formControlName) }"
  />
  <div *ngIf="isValidField(formControlName)" class="text-red-500 text-xs mt-1">
    {{ errorMessage }}
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() formControlName!: string;
  @Input() placeholder: string = '';
  @Input() formGroup!: FormGroup;
  @Input() errorMessage: string = '';

  isValidField(field: string){
    return this.formGroup!.controls[field].errors 
      && this.formGroup!.controls[field].touched;
  }
}
