import { AfterViewInit, ChangeDetectionStrategy, Component, computed, Inject, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Format } from '../../../function/format.function';
import { DiaSemana } from '../../../admin/interfaces/dia-semana.interface';
import { TipeMember } from '../../../admin/interfaces/tipe-member';
import { CelulaAppService } from '../../services/celula-app.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormCelulaComponent } from '../../../admin/pages/celula/form-celula/form-celula.component';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { CelulaForm } from '../../../admin/interfaces/celula-admin.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { CustomLabelDirective } from '../../../directives/customLabel.directive';

@Component({
  selector: 'app-celula',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomLabelDirective,
  ],
  templateUrl: './celula.component.html',
  styles: `#map {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CelulaComponent implements OnDestroy, AfterViewInit, OnInit {

  map: L.Map | undefined;
  marker: L.Marker | undefined;
  latitude: number | undefined;
  length: number | undefined;

  formatHour: Format = new Format();

  _isWaitResponse = signal<Boolean>(false);
  isWaitResponse = computed(() => this._isWaitResponse());

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

  private celulaService = inject(CelulaAppService);
  private fb = inject(FormBuilder);

  public celulaValue = computed(() => this.celulaService.celula());

  public celulaForm: FormGroup = this.fb.group({
      number: ['', [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      addres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      day: ['', [Validators.required, Validators.min(1), Validators.max(7)]],
      hour: ['', [Validators.required]],
      lider_id: ['', [Validators.required]],
      tipe: ['', [Validators.required]],
    }); ;

  ngOnDestroy(): void {
    this.celulaService._celula.set(null);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.getCelula();  
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

  getCelula() {
    this.celulaService.getCelula().subscribe({
      next: () => {
        if (this.celulaService.status()) {
          if (this.celulaValue()) {
            this.celulaForm.patchValue({
              number: this.celulaValue()?.number || '',
              name: this.celulaValue()?.name || '',
              addres: this.celulaValue()?.addres || '',
              day: this.celulaValue()?.day || '',
              hour: this.formatHour.formatHour(this.celulaValue()?.hour) || '',
              lider_id: this.celulaValue()?.lider_id || '',
              tipe: this.celulaValue()?.tipe || '',
            });
            
            this.latitude = this.celulaValue()?.latitude || undefined;
            this.length = this.celulaValue()?.length || undefined;
            setTimeout(() => {
              if (this.latitude && this.length) {
                this.initMap();
                this.marker = L.marker([
                  this.latitude,
                  this.length
                ]).addTo(this.map!);
              }
            }, 3000);
          }
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error al cargar datos de la Celula",
            showConfirmButton: true,
          });
        }
      },
      error: (message) => {
        Swal.fire('Error', message, 'error')
      },
    });
  }


  onSubmit(): void {
    this._isWaitResponse.set(true);
    if (this.celulaForm.valid) {
      if (this.latitude && this.length) {

        const celulaData = {
          ...this.celulaForm.value,
          latitude: this.latitude,
          length: this.length
        };
        this.updateCelula(celulaData, this.celulaValue()!.id);
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

  updateCelula(celulaForm: CelulaForm, id: number) {
    this.celulaService.updateCelula(celulaForm, id).subscribe(
      {
        next: () => {
          Swal.fire({
            icon: "success",
            title: "Celula modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.celulaService.status()) {
            this.getCelula();
            this._isWaitResponse.set(false);
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
