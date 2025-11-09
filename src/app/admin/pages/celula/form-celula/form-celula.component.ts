import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, Inject, inject, OnDestroy, OnInit, output } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Format } from '../../../../function/format.function';
import { DiaSemana } from '../../../interfaces/dia-semana.interface';
import { TipeMember } from '../../../interfaces/tipe-member';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { CelulaForm } from '../../../interfaces/celula-admin.interface';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LiderAutocompleteComponent } from '../../../../components/autocomplete-lider/lider-autocomplete.component';

@Component({
  selector: 'app-admin-form-celula',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomLabelDirective,
    LiderAutocompleteComponent,
  ],
  templateUrl: 'form-celula.component.html',
  styles: `#map {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCelulaComponent implements OnDestroy, AfterViewInit {

  map: L.Map | undefined;
  marker: L.Marker | undefined;
  latitude: number | undefined;
  length: number | undefined;

  formatHour: Format = new Format();

  days: DiaSemana[] = [
    { id: 1, name: "Lunes" },
    { id: 2, name: "Martes" },
    { id: 3, name: "Miercoles" },
    { id: 4, name: "Jueves" },
    { id: 5, name: "Viernes" },
    { id: 6, name: "Sabado" },
    { id: 7, name: "Domingo" }];

  tipes: TipeMember[] = [
    { id: 1, name: "Varones" },
    { id: 2, name: "Mujeres" },
    { id: 3, name: "Niños/Prejuveniles" }
  ]

  private celulaService = inject(CelulaAdminService);
  private fb = inject(FormBuilder);

  public celulaValue = computed(() => this.celulaService.celula());
  
  public celulaForm: FormGroup;

  ngOnDestroy(): void {
    this.celulaService._celula.set(null);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  constructor(
    public dialogRef: MatDialogRef<FormCelulaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    this.celulaService._celula.set(data);

    this.celulaForm = this.fb.group({
      number: [data?.number || '', [Validators.required, Validators.min(1)]],
      name: [data?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      addres: [data?.addres || '', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      day: [data?.day || '', [Validators.required, Validators.min(1), Validators.max(7)]],
      hour: [this.formatHour.formatHour(data?.hour) || '', [Validators.required]],
      lider_id: [data?.lider_id || '', [Validators.required]],
      tipe: [data?.tipe || '', [Validators.required]],
    });

    if (data?.latitude) {
      this.latitude = data.latitude;
      this.length = data.length;

      setTimeout(() => {
        this.initMap();
        this.marker = L.marker([
          data.latitude,
          data.length
        ]).addTo(this.map!);
      }, 3000);
    }
  }

  isValidField(field: string) {
    return this.celulaForm.controls[field].errors
      && this.celulaForm.controls[field].touched;
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

    setTimeout(() => {
      this.map!.invalidateSize();
    }, 300);

  }

  onSubmit(): void {
    if (this.celulaForm.valid) {
      if (this.latitude && this.length) {

        const celulaData = {
          ...this.celulaForm.value,
          latitude: this.latitude,
          length: this.length
        };
        // Enviar datos al backend
        //this.isWaitResponse._isWaitResponse.update(value => true);
        if (this.data?.id) {
          this.updateCelula(celulaData, this.data.id);
        }
        else {
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
    this.dialogRef.close(this.celulaForm.value);
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
          this.close();
          Swal.fire({
            icon: "success",
            title: "Celula Creado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.celulaService.status()) {
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
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  updateCelula(celulaForm: CelulaForm, id: number) {
    this.celulaService.updateCelula(celulaForm, id).subscribe(
      {
        next: () => {
          this.close();
          Swal.fire({
            icon: "success",
            title: "Celula modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.celulaService.status()) {
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al modificar Celula",
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
}
