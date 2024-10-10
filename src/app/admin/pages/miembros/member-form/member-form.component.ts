import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateWaitResponseService } from '@services/state-wait-response.service';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import { MiembrosService } from '../../../services/miembros-admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { MaterialModule } from '@shared/material/material.module';
import { CelulaAutocompleteComponent } from "../../../../shared/components/autocomplete-celula/celula-autocomplete.component";
import { CustomLabelDirective } from '@shared/directives/customLabel.directive';
import { ButtonCancelComponent } from "../../../../shared/components/button-cancel/button-cancel.component";
import { ButtonSaveComponent } from "../../../../shared/components/button-save/button-save.component";
import { Members, Miembro } from '../../../interfaces/miembro-admin.interface';
import { CelulaAutocompleteService } from '@services/celula-autocomplete.service';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    CelulaAutocompleteComponent,
    CustomLabelDirective,
    ButtonCancelComponent,
    ButtonSaveComponent
],
  templateUrl: './member-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MemberFormComponent {

  public tipeOption = [
    {id: 0, value: 'ASISTENTE'},
    {id: 1, value: 'ANFITRION'}, 
    {id: 2, value: 'VISITA'}, 
    {id: 3, value: 'MIEMBRO'}
  ] 

  private router = inject(Router);
  private activateRouter = inject(ActivatedRoute)

  isEditable = true;
  
  private _isWaitResponse = inject(StateWaitResponseService);
  private celulaService = inject(CelulaAdminService);
  private miembroService = inject(MiembrosService);
  private celulaAutocompleteService = inject(CelulaAutocompleteService);
  private fb = inject(FormBuilder);

  public _titulo = signal<string>('Registar');
  public isEdit = signal<boolean>(false);

  public miembrosValue = computed(() => this.miembroService._miembros());
  public memberValue = computed(() => this.miembroService._member());
  public celulaValue = computed(() => this.celulaService._celula());
  public isWaitResponse = computed(() => this._isWaitResponse._isWaitResponse());
  public titulo = computed(() => this._titulo());


  public memberForm: FormGroup = this.fb.group({
    celula_id: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    contact: ['', [Validators.nullValidator, Validators.minLength(8), Validators.maxLength(11)]],
    tipe: ['', Validators.required]
  });

  
  constructor() {}
  
  ngOnInit(): void {
    this.activateRouter.params
      .pipe(
        filter(params => params.hasOwnProperty('id')),
        switchMap(({ id }) => this.miembroService.getMemberById(id)),
      )
      .subscribe(
        {
          next: () => {
            this._titulo.set('Editar');
            this.memberForm.patchValue({
              celula_id: this.memberValue()?.celula_id,
              name: this.memberValue()?.name,
              lastname: this.memberValue()?.lastname,
              contact: this.memberValue()?.contact,
              tipe: this.memberValue()?.tipe,
            });

            console.log(this.memberForm.value);
            this.celulaAutocompleteService._valueForm.set(`${this.memberValue()?.celula?.number} : ${this.memberValue()?.celula?.name}`);
            this.isEdit.update(value => true);
          },
          error: (message) => {
            Swal.fire('Error', message, 'error')
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.miembroService._asistencia.set(null);
    this.miembroService._visita.set(null);
    this.celulaService._celula.set(null);
    this.celulaAutocompleteService._valueForm.set('');
  }

  isValidField(field: string) {
    return this.memberForm.controls[field].errors
      && this.memberForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this._isWaitResponse._isWaitResponse.update(value => true);

      const formData: Miembro = {
        ...this.memberForm.value,
        id: null,
        status: 1,
        celula: null,
      };

      if( this.isEdit() )
      {
        this.updateMember(formData, this.memberValue()!.id!)
      }
      else{
        console.log(formData);
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

  selectCelula(id: number | null): void {
    if (id) {
      this.memberForm.patchValue({
        celula_id: id
      });
    }
    else {
      this.memberForm.patchValue({
        celula_id: ''
      });
    }
  }

  addMiembro(informeForm: any) {
    this.miembroService.addMiembro(informeForm).subscribe(
      {
        next: () => {
          this._isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire({
            icon: "success",
            title: "Miembro Creado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.miembroService.status()) {
            this.router.navigateByUrl('/admin/member');
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
          this._isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  updateMember(memberForm: Miembro, id: number) {
    this.miembroService.updateMiembro(memberForm, id).subscribe(
      {
        next: () => {
          this._isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire({
            icon: "success",
            title: "Miembro modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.miembroService.status()) {
            this.router.navigateByUrl('/admin/member');
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
          this._isWaitResponse._isWaitResponse.update(value => false);
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

  
  cancelar(): void
  {
    this.router.navigateByUrl('/admin/member')
  }

}
