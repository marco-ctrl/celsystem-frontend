import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, inject, input, output, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StateWaitResponseService } from '@services/state-wait-response.service';

import { ButtonCancelComponent } from "@shared/components/button-cancel/button-cancel.component";
import { ButtonSaveComponent } from '@shared/components/button-save/button-save.component';
import { StateModalService } from '@services/state-modal.service';
import { InputComponent } from '@shared/components/input/input.component';
import { CamaraComponent } from "@shared/components/camara/camara.component";
import { LiderAdminService } from '../../../services/lider-admin.service';
import Swal from 'sweetalert2';
import { Lider, LiderForm } from '../../../interfaces/lider-admin.interface';
import { environment } from '../../../../../environments/environments';
import { CustomLabelDirective } from '@shared/directives/customLabel.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-lider-form-admin',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonCancelComponent,
    ButtonSaveComponent,
    InputComponent,
    CamaraComponent,
    MaterialModule,

    CustomLabelDirective,
],
  templateUrl: './lider-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiderFormComponent {

  ///public liderValue = input<Lider | null>();
  private readonly baseUrl: string = environment.baseUrl;

  public closeModal     = output<void>();
  public photo          = output<string>();
  public statusResponse = output<void>();
  
  private stateModal     = inject(StateModalService);
  private isWaitResponse = inject(StateWaitResponseService);
  private liderService   = inject(LiderAdminService);

  public liderValue = computed(() => this.liderService.lider());
  public editLider  = computed(() => this.liderService._editLider());

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDate = new Date(this._currentYear - 12, 0, 0);
  
  private fb = inject(FormBuilder);

  @ViewChild('cameraComponent') cameraComponent!: CamaraComponent;

  public liderForm: FormGroup = this.fb.group({
    name:      ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastname:  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    birthdate: ['', [Validators.required]],
    addres:    ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    contact:   ['', [Validators.required, Validators.minLength(5), Validators.maxLength(11)]],
    foto:      [''],
    email:     ['', [Validators.required, Validators.email]],
  })

  public checkStateModal = effect(() => {
    if(!this.stateModal.stateModal()){
      this.liderForm.reset();
    }
    else{
      this.liderForm.patchValue({
        name     : this.liderValue()?.name,
        lastname : this.liderValue()?.lastname,
        birthdate: this.liderValue()?.birthdate,
        addres   : this.liderValue()?.addres,
        contact  : this.liderValue()?.contact,
        email    : this.liderValue()?.user.email,
      });
      if(this.liderValue()?.foto !== undefined && this.liderValue()?.foto != null){
        this.cameraComponent.srcPhoto = this.baseUrl + `/storage/${this.liderValue()!.foto}`;  
      }
      else{
        this.cameraComponent.srcPhoto = '../../../../assets/images/user-default.png';
      }
    }
  });
  
  onSubmit() {
    console.log(this.liderForm.value);
    if (this.liderForm.valid) {
      // Enviar datos al backend
      this.isWaitResponse._isWaitResponse.update(value => true);
      if(this.editLider()){
        this.updateLider(this.liderForm.value, this.liderValue()!.id);
      }
      else{
        this.addLider(this.liderForm.value);
      }
    } else {
      // Mostrar mensajes de error
      this.liderForm.markAllAsTouched();
    }
  }

  isValidField(field: string){
    return this.liderForm.controls[field].errors
      && this.liderForm.controls[field].touched;
  }

  close() {
    this.liderForm.reset();
    this.closeModal.emit();
    this.stateModal._stateModal.update(value => false);
  }

  updatePhoto(photo: string): void{
    this.liderForm.patchValue({ foto: photo })
  }

  addLider(liderForm: LiderForm){
    this.liderService.addLider(liderForm).subscribe(
      {
        next: () => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          this.stateModal._stateModal.update((value) => false);
          Swal.fire({
            icon: "success",
            title: "Lider Creado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if(this.liderService.status()){
            this.statusResponse.emit();        
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Error al crear Lider",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  updateLider(liderForm: LiderForm, id: number){
    this.liderService.updateLider(liderForm, id).subscribe(
      {
        next: () => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          this.stateModal._stateModal.update((value) => false);
          Swal.fire({
            icon: "success",
            title: "Lider modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if(this.liderService.status()){
            this.statusResponse.emit();        
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Error al modificar Lider",
              showConfirmButton: true,
            });
          }
        },
        error: (message) => {
          this.isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

}