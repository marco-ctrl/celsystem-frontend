import { AfterViewInit, ChangeDetectionStrategy, Component, computed, Inject, inject, output, signal, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { LiderAdminService } from '../../../services/lider-admin.service';
import { Country } from '../../../../interfaces/country';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiderForm } from '../../../interfaces/lider-admin.interface';
import { CameraComponent } from '../../../../components/camera/camera.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-form-lider',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomLabelDirective,
    CameraComponent
  ],
  templateUrl: './form-lider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLiderComponent implements AfterViewInit {
  private readonly baseUrl: string = environment.baseUrl;
  public liderForm: FormGroup;

  public photo = output<string>();
  public statusResponse = output<void>();

  private liderService = inject(LiderAdminService);
  private _isWaitResponse = signal<Boolean>(false);
  public isWaitResponse = computed(() => this._isWaitResponse());

  public liderValue = computed(() => this.liderService.lider());
  //public editLider  = computed(() => this.liderService._editLider());

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDate = new Date(this._currentYear - 12, 0, 0);

  selectedCode?: string;

  countries: Country[] = [
    {
      name: 'Bolivia',
      code: '+591',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg'
    },
    {
      name: 'Argentina',
      code: '+54',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg'
    }
  ];

  @ViewChild('cameraComponent') cameraComponent!: CameraComponent;

  constructor(
    public dialogRef: MatDialogRef<FormLiderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.liderForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastname: [data?.lastname || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      birthdate: [data?.birthdate || '', [Validators.required]],
      addres: [data?.addres || '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      code: [data?.code || '', [Validators.required]],
      contact: [data?.contact || '', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      foto: [data?.foto || ''],
      email: [data?.user.email || '', [Validators.required, Validators.email]],

    });

  }

  ngAfterViewInit(): void {
    if (this.data?.foto) {
      this.cameraComponent.srcPhoto = this.baseUrl + `/storage/${this.data.foto}`;
    } else {
      this.cameraComponent.srcPhoto = '../../../../assets/images/user-default.png';
    }
  }

  onSubmit() {
    this._isWaitResponse.update(value => true);
    if (this.liderForm.valid) {
      // Enviar datos al backend
      if (this.data?.id) {
        this.updateLider(this.liderForm.value, this.data.id);
      }
      else {
        this.addLider(this.liderForm.value);
      }
    } else {
      // Mostrar mensajes de error
      this.liderForm.markAllAsTouched();
    }
  }

  isValidField(field: string) {
    return this.liderForm.controls[field].errors
      && this.liderForm.controls[field].touched;
  }


  updatePhoto(photo: string): void {
    this.liderForm.patchValue({ foto: photo })
  }

  addLider(liderForm: LiderForm) {
    this.liderService.addLider(liderForm).subscribe(
      {
        next: () => {
          this._isWaitResponse.update(value => false);
          this.dialogRef.close(this.liderForm.value);
          Swal.fire({
            icon: "success",
            title: "Lider Creado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.liderService.status()) {
            this.statusResponse.emit();
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al crear Lider",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          ///*this.isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  updateLider(liderForm: LiderForm, id: number) {
    this.liderService.updateLider(liderForm, id).subscribe(
      {
        next: () => {
          this._isWaitResponse.update(value => false);
          this.dialogRef.close(this.liderForm.value);
          Swal.fire({
            icon: "success",
            title: "Lider modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.liderService.status()) {
            this.statusResponse.emit();
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al modificar Lider",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          //this.isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  close() {
    this.dialogRef.close(this.liderForm.value);
  }
}
