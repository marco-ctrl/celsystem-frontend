import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';
import { QrImageService } from '../../../services/qrImage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrImage } from '../../../interfaces/qr-image.interface';
import Swal from 'sweetalert2';
import { Format } from '../../../../function/format.function';
import { ImageProfilePipe } from '../../../../pipes/image-profile.pipe';

@Component({
  selector: 'app-qr-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    CustomLabelDirective,
    ImageProfilePipe,
  ],
  templateUrl: './qr_form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrFormComponent {

  photoDefault: string = '../../../../../assets/images/empty_image.jpg';
  previewUrl = signal<string | null | File | undefined>(this.photoDefault);
  file: File | null = null;

  format = new Format();

  private qrImageService = inject(QrImageService);
  private fb = inject(FormBuilder);

  public qrImageForm: FormGroup;

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 1, 0, 1);
  readonly maxDate = new Date(this._currentYear + 12, 0, 0);

  constructor(
    public dialogRef: MatDialogRef<QrFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.qrImageForm = this.fb.group({
      description: [data?.description || '', [Validators.required, Validators.minLength(3)]],
      valid_from: [data?.valid_from || '', [Validators.required]],
      expired: [data?.expired || '', [Validators.required]],
      image: [data?.image || '', [Validators.required]],
      amount: [data?.amount || '', [Validators.required, Validators.min(0)]],
    });
  }

  isValidField(field: string) {
    return this.qrImageForm.controls[field].errors
      && this.qrImageForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.qrImageForm.valid) {
      const formData = new FormData();
      // Convertir fechas a formato Y-m-d
      const validFrom = this.qrImageForm.get('valid_from')?.value;
      const expired = this.qrImageForm.get('expired')?.value;

      formData.append('valid_from', this.format.formatDate(validFrom));
      formData.append('expired', this.format.formatDate(expired));
      formData.append('amount', this.qrImageForm.get('amount')?.value);
      formData.append('description', this.qrImageForm.get('description')?.value);

      if (this.file) {
        formData.append('image', this.file);
      }

      if (this.data?.id) {
        formData.append('_method', 'PUT');
        this.update(this.data.id, formData);
      }
      else {
        this.addQrImage(formData);
      }
    }
  }

  addQrImage(qrImage: any): void {
    this.qrImageService.addQrImage(qrImage).subscribe(
      {
        next: () => {
          Swal.fire({
            icon: "success",
            title: "Qr Image guardado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.qrImageService.status()) {
            this.dialogRef.close(this.qrImageForm.value);
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al crear miembro",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  update(id: number, qrImage: any): void {
    this.qrImageService.updateQrImage(id, qrImage).subscribe(
      {
        next: () => {
          Swal.fire({
            icon: "success",
            title: "Qr Image modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.qrImageService.status()) {
            this.dialogRef.close(this.qrImageForm.value);
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al modificar Qr Image",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        },
      }
    );
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.qrImageForm.patchValue({
        image: file
      });
      this.qrImageForm.get('image')?.updateValueAndValidity();

      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
      this.file = file;
    }
  }

  close() {
    this.dialogRef.close(this.qrImageForm.value);
  }

}