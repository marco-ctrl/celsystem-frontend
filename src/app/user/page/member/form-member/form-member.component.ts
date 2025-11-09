import { ChangeDetectionStrategy, Component, computed, Inject, inject, signal } from '@angular/core';
import { CelulaAppService } from '../../../services/celula-app.service';
import { MiembrosService } from '../../../services/miembros-app.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Miembro } from '../../../../admin/interfaces/miembro-admin.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';

@Component({
  selector: 'app-form-member',
  standalone: true,
  imports: [
     CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomLabelDirective,
  ],
  templateUrl: './form-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormMemberComponent {

  public tipeOption = [
      { id: 0, value: 'ASISTENTE' },
      { id: 1, value: 'ANFITRION' },
      { id: 2, value: 'VISITA' },
      { id: 3, value: 'MIEMBRO' }
    ]
  
    isEditable = true;
  
    private celulaService = inject(CelulaAppService);
    private miembroService = inject(MiembrosService);
    private fb = inject(FormBuilder);
    public memberForm: FormGroup
  
    public _titulo = signal<string>('Registar');
    public isEdit = signal<boolean>(false);
  
    public miembrosValue = computed(() => this.miembroService._miembros());
    public memberValue = computed(() => this.miembroService._member());
    public celulaValue = computed(() => this.celulaService._celula());
    public titulo = computed(() => this._titulo());
  
    constructor(
      public dialogRef: MatDialogRef<FormMemberComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      
    ) {
      this.memberForm = this.fb.group({
        name: [ data?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        lastname: [ data?.lastname || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        contact: [ data?.contact || '', [Validators.nullValidator, Validators.minLength(8), Validators.maxLength(11)]],
        tipe: [ data?.tipe || '', Validators.required]
      });
  
      if (data?.id) {
        this._titulo.set('Editar Miembro');
        this.isEdit.set(true);
        //this.celulaAutocompleteService._valueForm.set(`${data?.celula?.number} : ${data?.celula?.name}`);
      }
      else {
        this._titulo.set('Registrar Miembro');
        this.isEdit.set(false);
      }
    }
  
    ngOnInit(): void {
    }
  
    ngOnDestroy(): void {
      this.miembroService._asistencia.set(null);
      this.miembroService._visita.set(null);
      this.celulaService._celula.set(null);
      //this.celulaAutocompleteService._valueForm.set('');
    }
  
    isValidField(field: string) {
      return this.memberForm.controls[field].errors
        && this.memberForm.controls[field].touched;
    }
  
    onSubmit(): void {
      if (this.memberForm.valid) {
        // Enviar datos al backend
        const formData: Miembro = {
          ...this.memberForm.value,
          id: null,
          status: 1,
          celula: null,
        };
  
        if (this.data?.id) {
          this.updateMember(formData, this.data.id!)
        }
        else {
          this.addMiembro(formData);
        }
  
      }
      else {
        // Mostrar mensajes de error
        this.memberForm.markAllAsTouched();
  
        if (this.memberForm.controls['celula_id'].errors) {
          Swal.fire('Error', 'Debe seleccionar una Celula', 'error')
        }
      }
    }
  
    addMiembro(informeForm: any) {
      this.miembroService.addMiembro(informeForm).subscribe(
        {
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Miembro Creado correctamente",
              showConfirmButton: false,
              timer: 3000
            });
            if (this.miembroService.status()) {
              this.dialogRef.close(this.memberForm.value);
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
  
    updateMember(memberForm: Miembro, id: number) {
      this.miembroService.updateMiembro(memberForm, id).subscribe(
        {
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Miembro modificado correctamente",
              showConfirmButton: false,
              timer: 3000
            });
            if (this.miembroService.status()) {
              this.dialogRef.close(this.memberForm.value);
            }
            else {
              Swal.fire({
                icon: "error",
                title: "Error al modificar Miembro",
                showConfirmButton: true,
              });
            }
          },
          error: (message) => {
            //this._isWaitResponse._isWaitResponse.update(value => false);
            Swal.fire('Error', message, 'error')
          },
        }
      )
    }
  
  
    validFormInforme(): boolean {
      if (this.memberForm.valid) {
        return true
      }
      else {
        // Mostrar mensajes de error
        this.memberForm.markAllAsTouched();
  
        if (this.memberForm.controls['celula_id'].errors) {
          Swal.fire('Error', 'Debe seleccionar una Celula', 'error')
        }
        return false
      }
    }
  
    close() {
      this.dialogRef.close(this.memberForm.value);
    }

 }
