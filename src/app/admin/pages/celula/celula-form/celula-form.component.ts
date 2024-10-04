import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StateModalService } from '@services/state-modal.service';
import { CustomLabelDirective } from '@shared/directives/customLabel.directive';
import * as L from 'leaflet';
import { DiaSemana } from '../../../interfaces/dia-semana.interface';
import { ButtonCancelComponent } from '@shared/components/button-cancel/button-cancel.component';
import { ButtonSaveComponent } from '@shared/components/button-save/button-save.component';
import { LiderAutocompleteComponent } from '@shared/components/autocomplete-lider/lider-autocomplete.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { StateWaitResponseService } from '@services/state-wait-response.service';
import { CelulaForm } from '../../../interfaces/celula-admin.interface';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import { Format } from '../../../../function/format.function';

@Component({
  selector: 'app-celula-form-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomLabelDirective,
    ButtonCancelComponent,
    ButtonSaveComponent,
    LiderAutocompleteComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './celula-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CelulaFormComponent implements AfterContentInit {
  
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  latitude: number | undefined;
  length: number | undefined;

  public closeModal = output<void>();
  public statusResponse = output<void>();

  formatHour: Format = new Format();

  days: DiaSemana[] = [
    { id: 1, name: "Lunes" },
    { id: 2, name: "Martes" },
    { id: 3, name: "Miercoles" },
    { id: 4, name: "Jueves" },
    { id: 5, name: "Viernes" },
    { id: 6, name: "Sabado" },
    { id: 7, name: "Domingo" }];

  private stateModal = inject(StateModalService);
  private isWaitResponse = inject(StateWaitResponseService);
  private celulaService = inject(CelulaAdminService);
  private fb = inject(FormBuilder);

  public celulaValue = computed(() => this.celulaService.celula());
  public editCelula  = computed(() => this.celulaService._editCelula());


  public celulaForm: FormGroup = this.fb.group({
    number: ['', [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    addres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    day: ['', [Validators.required, Validators.min(1), Validators.max(7)]],
    hour: ['', [Validators.required]],
    lider_id: ['', [Validators.required]],
  });

  public checkStateModal = effect(() => {
    if (!this.stateModal.stateModal()) {
      this.celulaForm.reset();
      if (this.marker) {
        this.map!.removeLayer(this.marker);
      }

    }
    else {
      if (this.celulaService.celula()) {
        this.celulaForm.patchValue({
          number: this.celulaService.celula()?.number,
          name: this.celulaService.celula()?.name,
          addres: this.celulaService.celula()?.addres,
          day: this.celulaService.celula()?.day,
          hour: this.formatHour.formatHour(this.celulaService.celula()?.hour),
          lider_id: this.celulaService.celula()?.lider_id,
        });

        this.latitude = this.celulaService.celula()?.latitude;
        this.length = this.celulaService.celula()?.length;

        setTimeout(() => { 
          this.initMap();
          this.marker = L.marker([this.celulaService.celula()!.latitude, this.celulaService.celula()!.length]).addTo(this.map!);     
        }, 3000);
      }
      else{
        setTimeout(() => { 
          this.initMap();
        }, 3000);
      }
    }
  });

  isValidField(field: string) {
    return this.celulaForm.controls[field].errors
      && this.celulaForm.controls[field].touched;
  }

  ngAfterContentInit(): void {
    /*setTimeout(() => { 
      this.initMap();
    }, 10000);*/
  }

  initMap(): void {

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([-22.735938864584394, -64.34173274785282], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    //this.marker = L.marker([-22.735938864584394, -64.34173274785282]).addTo(this.map);

    this.map.doubleClickZoom.disable()//evitar que el mapa se haga zoom al hacer dobleclic

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.latitude = e.latlng.lat;
      this.length = e.latlng.lng;

      if (this.marker != undefined) {
        this.map!.removeLayer(this.marker);
      };

      this.marker = L.marker([this.latitude, this.length]).addTo(this.map!);
    });


  }

  onSubmit(): void {
    if (this.celulaForm.valid) {
      if (this.latitude && this.length) {

        const celulaData = {
          ...this.celulaForm.value,
          latitude: this.latitude,
          length: this.length
        };
        console.log('House added successfully', celulaData);
        // Enviar datos al backend
        this.isWaitResponse._isWaitResponse.update(value => true);
        if(this.editCelula()){
        this.updateCelula(celulaData, this.celulaValue()!.id);
        }
        else{
        this.addCelula(celulaData);
        }
      }
      else {
        Swal.fire('Error', 'Debe seleccionar una ubicacion', 'error');
      }

    } else {
      // Mostrar mensajes de error
      this.celulaForm.markAllAsTouched();

      if (this.celulaForm.controls['lider_id'].errors) {
        Swal.fire('Error', 'Debe seleccionar un Lider de Celula', 'error')
      }

    }
  }

  close() {
    this.celulaForm.reset();
    this.closeModal.emit();
    this.stateModal._stateModal.update(value => false);
  }

  selectLider(id: number | null): void {
    if (id) {
      this.celulaForm.patchValue({
        lider_id: id
      });
    }
    else {
      this.celulaForm.patchValue({
        lider_id: ''
      });
    }
  }

  addCelula(celulaForm: CelulaForm) {
    this.celulaService.addcelula(celulaForm).subscribe(
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
          if (this.celulaService.status()) {
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
    )
  }

  updateCelula(celulaForm: CelulaForm, id: number){
    this.celulaService.updateCelula(celulaForm, id).subscribe(
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
          if(this.celulaService.status()){
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
    )
  }
}
