import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { MiembrosService } from '../../../services/miembros-admin.service';

import { Asistente, Miembro, Visita } from '../../../interfaces/miembro-admin.interface';
import { filter, map, Observable, switchMap } from 'rxjs';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { InformeAdminService } from '../../../services/informe-admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';
import { CelulaAutocompleteComponent } from '../../../../components/autocomplete-celula/celula-autocomplete.component';
import { MaterialModule } from '../../../../material/material.module';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import { QrImageService } from '../../../services/qrImage.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../../qr/image_modal/image_modal.component';

@Component({
  selector: 'app-celula-form-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomLabelDirective,
    CelulaAutocompleteComponent,
    MaterialModule,
    AsyncPipe,
  ],
  templateUrl: './form-informe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormInformeComponent implements OnDestroy, OnInit {

  @ViewChild('photo') photoElement!: ElementRef;
  @ViewChild('voucher') voucherElement!: ElementRef;
  photoDefault: string = '../../../../../assets/images/empty_image.jpg';
  selectFile: File | null = null;
  voucherFile: File | null = null;
  titulo = signal<string>('Regristar');
  previewUrl = signal<string | null | File | undefined>(this.photoDefault);
  previewQrImage = signal<string | null | File | undefined>(this.photoDefault);
  isEdit = signal<boolean>(false);
  showQrColumn = signal<boolean>(false);
  public selectedMiembro?: Miembro;

  private readonly srcPhoto: string = environment.baseUrl;
  private decimalPipe!: DecimalPipe;
  private router = inject(Router);
  private activateRouter = inject(ActivatedRoute)
  private dialog = inject(MatDialog);

  map: L.Map | undefined;
  marker: L.Marker | undefined;
  latitude: number | undefined;
  length: number | undefined;

  isEditable = true;
  isOptional = true;

  maxFileSize = 1048576; // 1MB en bytes
  allowedTypes = ['image/jpeg', 'image/png'];

  asistenciaColumns: string[] = ['position', 'name', 'lastname', 'contact', 'remove'];

  public statusResponse = output<void>();

  private celulaService = inject(CelulaAdminService);
  private miebroService = inject(MiembrosService);
  private qrImageService = inject(QrImageService);
  private informeService = inject(InformeAdminService);
  private fb = inject(FormBuilder);

  public miembrosValue = computed(() => this.miebroService._miembros());
  public qrImages = computed(() => this.qrImageService.qrImages());
  public celulaValue = computed(() => this.celulaService._celula());
  public qrImageValue = computed(() => this.qrImageService.qrImage());
  public asisteciaValue = computed(() => this.miebroService._asistencia());
  public visitaValue = computed(() => this.miebroService._visita());
  public editCelula = computed(() => this.celulaService._editCelula());

  public tipesOfrenda = [
    { value: 0, label: 'Efectivo' },
    { value: 1, label: 'QR' },
  ];

  public informeForm: FormGroup = this.fb.group({
    celula_id: ['', [Validators.required]],
    addres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    photo: [''],
    lider: [''],
    celula: [''],
    latitude: [''],
    length: [''],
  });

  public ofrendaForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
    type: ['', [Validators.required]],
    voucher: [''],
  });

  public asistenciaForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    contact: ['', [Validators.nullValidator, Validators.minLength(8), Validators.maxLength(11)]],
    id: [''],
  });

  public visitaForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    contact: ['', [Validators.nullValidator, Validators.minLength(8), Validators.maxLength(11)]],
    id: [''],
  });

  stepperOrientation: Observable<StepperOrientation>;

  constructor() {

    const breakpointObserver = inject(BreakpointObserver);

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 600px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.activateRouter.params
      .pipe(
        filter(params => params.hasOwnProperty('id')),
        switchMap(({ id }) => this.informeService.getInformeById(id)),
      )
      .subscribe(
        {
          next: () => {
            this.titulo.set('Editar');
            this.celulaService._celula.set(this.informeService.informe()!.celula);
            this.miebroService._asistencia.set(this.informeService.informe()!.asistencia);
            this.miebroService._visita.set(this.informeService.informe()!.visita);

            let ofrenda = this.informeService.informe()!.offering;
            //let ofrenda: string = this.decimalPipe.transform(this.informeService.informe()!.offering, '1.2-2')!;

            this.informeForm.patchValue({
              celula_id: this.informeService.informe()?.celula_id,
              offering: ofrenda,
              addres: this.informeService.informe()?.celula.addres,
              latitude: this.informeService.informe()?.latitude,
              length: this.informeService.informe()?.length,
              photo: '',
            });

            this.previewUrl.set(this.srcPhoto + this.informeService.informe()?.photo);
            this.isEdit.update(value => true);

            this.marker = L.marker([this.informeService.informe()!.latitude, this.informeService.informe()!.length]).addTo(this.map!);
          },
          error: (message) => {
            Swal.fire('Error', message, 'error')
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.miebroService._asistencia.set(null);
    this.miebroService._visita.set(null);
    this.celulaService._celula.set(null);
  }

  isValidField(field: string) {
    return this.informeForm.controls[field].errors
      && this.informeForm.controls[field].touched;
  }

  isValidFieldAsistencia(field: string) {
    return this.asistenciaForm.controls[field].errors
      && this.asistenciaForm.controls[field].touched;
  }

  isValidFieldVisita(field: string) {
    return this.visitaForm.controls[field].errors
      && this.visitaForm.controls[field].touched;
  }

  isValidFieldOfrenda(field: string) {
    return this.ofrendaForm.controls[field].errors
      && this.ofrendaForm.controls[field].touched;
  }

  initMap(): void {

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([this.celulaService.celula()!.latitude, this.celulaService.celula()!.length], 15);
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

      this.informeForm.patchValue({
        latitude: this.celulaValue()?.latitude,
        length: this.celulaValue()?.length,
      });
    });


  }

  onSubmit(): void {
    if (this.informeForm.valid) {
      console.log(this.informeForm.value);
      const formData = new FormData();
      for (const key of Object.keys(this.informeForm.value)) {
        formData.append(key, this.informeForm.value[key]);
      }

      formData.append('offering', this.ofrendaForm.value.amount);
      formData.append('payment_method', this.ofrendaForm.value.type);
      //formData.append('voucher', this.ofrendaForm.value.voucher);
      //
      //if (this.ofrendaForm.value.voucher instanceof File) {
        //formData.append('voucher', this.ofrendaForm.value.voucher);
      //}
      formData.append('voucher', this.voucherFile || '');

      formData.append('photo', this.selectFile || '');

      this.miebroService.asistencia()!.forEach((asistencia: any, index: number) => {
        for (const key in asistencia) {
          formData.append(`asistencia[${index}][${key}]`, asistencia[key]);
        }
      });

      this.miebroService.visita()?.forEach((visita: any, index: number) => {
        for (const key in visita) {
          formData.append(`visita[${index}][${key}]`, visita[key]);
        }
      });

      if (this.isEdit()) {
        this.updateInforme(formData, this.informeService.informe()!.id)
      }
      else {
        this.addInforme(formData);
      }

    }
    else {
      // Mostrar mensajes de error
      this.informeForm.markAllAsTouched();

      if (this.informeForm.controls['celula_id'].errors) {
        Swal.fire('Error', 'Debe seleccionar una Celula', 'error')
      }
    }
  }

  public checkStateCelula = effect(() => {
    console.log(this.celulaValue());
    if (this.celulaValue()) {
      this.informeForm.patchValue({
        celula_id: this.celulaValue()?.id,
        addres: this.celulaValue()?.addres,
        lider: this.celulaValue()?.lider?.name + ' ' + this.celulaValue()?.lider?.lastname,
        celula: this.celulaValue()?.name,
        latitude: this.celulaValue()?.latitude,
        length: this.celulaValue()?.length,
      });

      this.initMap();
      this.marker = L.marker([this.celulaService.celula()!.latitude, this.celulaService.celula()!.length]).addTo(this.map!);

    }
    else {
      this.informeForm.patchValue({
        celula_id: '',
        addres: ''
      });
    }
  });

  selectCelula(id: number | null): void {
    /*console.log(this.celulaValue());
    if (id) {
      this.informeForm.patchValue({
        celula_id: id,
        addres: this.celulaValue()?.addres,
      });
    }
    else {
      this.informeForm.patchValue({
        celula_id: '',
        addres: ''
      });
    }*/
  }

  addInforme(informeForm: any) {
    this.informeService.addInforme(informeForm).subscribe(
      {
        next: () => {
          //    this._isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire({
            icon: "success",
            title: "Informe Creado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.informeService.status()) {
            this.miebroService._asistencia.set(null);
            this.miebroService._visita.set(null);
            this.celulaService._celula.set(null);

            this.router.navigateByUrl('/admin/informe');
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
          //  this._isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire('Error', message, 'error')
        },
      }
    )
  }

  updateInforme(informeForm: any, id: number) {
    this.informeService.updateInforme(informeForm, id).subscribe(
      {
        next: () => {
          //this._isWaitResponse._isWaitResponse.update(value => false);
          Swal.fire({
            icon: "success",
            title: "informe modificado correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          if (this.informeService.status()) {
            this.miebroService._asistencia.set(null);
            this.miebroService._visita.set(null);
            this.celulaService._celula.set(null);

            this.router.navigateByUrl('/admin/informe');
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error al modificar informe",
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

  addAsistencia() {
    if (this.validFormAsistencia()) {
      const { name, lastname, contact, id } = this.asistenciaForm.value;

      const asistencia: Asistente = {
        name: name,
        lastname: lastname,
        contact: contact,
        celula_id: this.celulaValue()!.id,
        tipe: 0,
        status: 1,
        id: id,
        pivot: null
      }

      if (this.miebroService.addAsistencia(asistencia)) {
        this.asistenciaForm.reset();
        this.miebroService._miembros.set(null);
      }
      else
        Swal.fire('Error', 'Ocurrio un error al agregar una asistencia', 'error');
    }
  }

  addVisita() {
    if (this.validFormVisita()) {
      const { name, lastname, contact, id } = this.visitaForm.value;

      const visita: Visita = {
        name: name,
        lastname: lastname,
        contact: contact,
        celula_id: this.celulaValue()!.id,
        tipe: 2,
        status: 1,
        id: id,
        pivot: null,
      }
      if (this.miebroService.addVisita(visita)) {
        this.visitaForm.reset();
        this.miebroService._miembros.set(null);
        this.visitaValue();
      }
      else
        Swal.fire('Error', 'Ocurrio un error al agregar una visita', 'error');
    }
  }

  validFormInforme(): boolean {
    if (this.informeForm.valid) {
      return true
    }
    else {
      // Mostrar mensajes de error
      this.informeForm.markAllAsTouched();

      if (this.informeForm.controls['celula_id'].errors) {
        Swal.fire('Error', 'Debe seleccionar una Celula', 'error')
      }
      return false
    }
  }

  validFormAsistencia(): boolean {
    if (this.asistenciaForm.valid) {
      return true
    }
    else {
      // Mostrar mensajes de error
      this.asistenciaForm.markAllAsTouched();
      return false
    }
  }

  validFormVisita(): boolean {
    if (this.visitaForm.valid) {
      return true
    }
    else {
      // Mostrar mensajes de error
      this.visitaForm.markAllAsTouched();
      return false
    }
  }

  removeRowAsistencia(index: number) {
    const asistenciaData = this.asisteciaValue()!.slice();
    asistenciaData.splice(index, 1);
    this.miebroService._asistencia.set(asistenciaData);
  }

  removeRowVisita(index: number) {
    const visitaData = this.visitaValue()!.slice();
    visitaData.splice(index, 1);
    this.miebroService._visita.set(visitaData);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      if (file.size > this.maxFileSize) {
        Swal.fire('Error', 'El archivo es demasiado grande. El tamaño máximo permitido es 1MB.', 'error');
        this.photoElement.nativeElement.value = null;
        reader.onload = (e) => this.previewUrl.set(this.photoDefault);
        reader.readAsDataURL(file);
        return;
      }

      if (!this.allowedTypes.includes(file.type)) {
        Swal.fire('Error', 'Solo se permiten archivos de tipo JPG y PNG.', 'error');
        this.photoElement.nativeElement.value = null;
        reader.onload = (e) => this.previewUrl.set(this.photoDefault);
        reader.readAsDataURL(file)
        return;
      }

      this.selectFile = file

      reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  cancelar(): void {
    this.router.navigateByUrl('/admin/informe')
  }

  searchAsistente() {
    const { name } = this.asistenciaForm.value || "";
    this.miebroService.getAsistente(this.celulaValue()!.id, name).subscribe();
    console.log(this.miebroService.miembros());
  }

  onSelectedOptionAsistente(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedMiembro = undefined;
      return
    }

    const miembro: Miembro = event.option.value;
    this.asistenciaForm.patchValue({
      name: miembro.name,
      lastname: miembro.lastname,
      contact: miembro.contact,
      id: miembro.id
    });
  }

  searchVisita() {
    const { name } = this.visitaForm.value || "";
    this.miebroService.getVisita(this.celulaValue()!.id, name).subscribe();
  }

  onSelectedOptionVisita(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedMiembro = undefined;
      return
    }

    const miembro: Miembro = event.option.value;
    console.log(miembro);
    this.visitaForm.patchValue({
      name: miembro.name,
      lastname: miembro.lastname,
      contact: miembro.contact,
      id: miembro.id
    });
  }

  onTypeChange(value: number) {
    this.showQrColumn.set(value === 1);

    if (!this.showQrColumn()) {
      this.ofrendaForm.patchValue({
        voucher: ''
      });
      this.previewQrImage.set(this.photoDefault);
      this.voucherElement.nativeElement.value = null;
    }
    else {
      this.qrImageService.getShowActiveQrImages().subscribe({
        next: () => {
          console.log(this.qrImageService.qrImage()?.image);
          this.previewQrImage.set(this.srcPhoto + '/storage/' + this.qrImageService.qrImage()?.image);
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      });
    }
  }

  downloadQrImage() {
    if (this.qrImageService.qrImage()) {
      this.qrImageService.downloadImage(this.qrImageService.qrImage()!);
    }
  }

  openImageModal(qrImage: any) {
    this.dialog.open(ImageModalComponent, {
      data: qrImage,
      width: '500px',
      //panelClass: 'custom-dialog-container',
    });
  }

  onVoucherSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.ofrendaForm.patchValue({ voucher: file }); // Guardamos el File
      this.voucherFile = file;
      this.ofrendaForm.get('voucher')?.updateValueAndValidity();
    }
  }


}