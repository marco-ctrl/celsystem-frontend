import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, Inject, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TemasService } from '../../../services/temas.service';
import { Lesson } from '../../../interfaces/temas.interface';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from '../../../../material/material.module';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-form-temas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomLabelDirective,
    MaterialModule,
    PdfViewerModule,
    //BrowserModule,
  ],
  templateUrl: './form-temas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTemasComponent {

  public closeModal = output<void>();
  public statusResponse = output<void>();
  public temaForm: FormGroup;

  private temaService = inject(TemasService);
  private fb = inject(FormBuilder);

  public temaValue = computed(() => this.temaService._tema());
  public editTema = computed(() => this.temaService._editTema());

  ngOnDestroy(): void {
    this.temaService._tema.set(null);
  }

  pdfSrc = signal<string | Uint8Array | null>(null);
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result;
          if (arrayBuffer) {
            //this.pdfSrc = new Uint8Array(arrayBuffer as ArrayBuffer);
            this.pdfSrc.set(new Uint8Array(arrayBuffer as ArrayBuffer));
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        this.pdfSrc.set(null);
        this.selectedFile = null;
        alert('Por favor, selecciona un archivo PDF.');
      }
    }
  }


  constructor(
    public dialogRef: MatDialogRef<FormTemasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.temaForm = this.fb.group({
    tema: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
  });

  
  }

  isValidField(field: string) {
    return this.temaForm.controls[field].errors
      && this.temaForm.controls[field].touched;
  }

onSubmit(): void {
    if (this.temaForm.valid) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        for (const key of Object.keys(this.temaForm.value)) {
          formData.append(key, this.temaForm.value[key]);
        }

        this.temaService.addTema(formData).subscribe(
          {
            next: () => {
              Swal.fire({
                icon: "success",
                title: "Leccion enviada correctamente",
                showConfirmButton: false,
                timer: 3000
              });
              if (this.temaService.status()) {
                this.statusResponse.emit();
              }
              else {
                Swal.fire({
                  icon: "error",
                  title: "Error al enviar la Leccion",
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
    } else {
      // Mostrar mensajes de error
      this.temaForm.markAllAsTouched();

    }
  }

  close() {
    this.dialogRef.close(this.temaForm.value);
  }

  addTema(celulaForm: Lesson) {
    /*this.temaService.addcelula(celulaForm).subscribe(
      {
        next: () => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          this.stateModal._stateModal.update((value) => false);
          Swal.fire({
            icon: "success",
            title: "Celula Creado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.temaService.status()) {
            this.statusResponse.emit();
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al crear Celula",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )*/
  }

  updateCelula(temaForm: Lesson, id: number) {
    /*this.temaService.updateCelula(celulaForm, id).subscribe(
      {
        next: () => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          this.stateModal._stateModal.update((value) => false);
          Swal.fire({
            icon: "success",
            title: "Celula modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if(this.temaService.status()){
            this.statusResponse.emit();        
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Error al modificar Celula",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )*/
  }

}
