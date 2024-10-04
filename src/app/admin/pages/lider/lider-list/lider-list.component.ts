import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { ButtonAddComponent } from '@shared/components/button-add/button-add.component';
import { ButtonEditComponent } from '@shared/components/button-edit/button-edit.component';
import { ButtonDeleteComponent } from '@shared/components/button-delete/button-delete.component';
import { StateModalService } from '@services/state-modal.service';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { StateWaitResponseService } from '@services/state-wait-response.service';

import Swal from 'sweetalert2';
import { Lider, Lideres, ListLideres } from '../../../interfaces/lider-admin.interface';
import { LiderAdminService } from '../../../services/lider-admin.service';
import { LiderFormComponent } from '../lider-form/lider-form.component';
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';
import { ImageProfilePipe } from '../../../../pipes/image-profile.pipe';
import { CamaraComponent } from '@shared/components/camara/camara.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lider-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginatorComponent,
    MatIconModule,
    LiderFormComponent,
    ButtonAddComponent,
    ButtonEditComponent,
    ButtonDeleteComponent,
    ModalComponent,
    LoadingSpinnerComponent,

    DataStatusPipe,
    ImageProfilePipe,
  ],
  templateUrl: './lider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LiderListComponent {

  titulo = output<string>();

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listLideres?:     ListLideres;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','foto', 'nombre', 'apellido', 'fec. nacimiento', 'contacto', 'estado'];

  private fb              = inject(FormBuilder);
  private liderService    = inject(LiderAdminService);
  private _isWaitResponse = inject(StateWaitResponseService);
  private stateModal      = inject(StateModalService);
  
  private _isLoading     = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);
  
  public lideres        = computed(() => this.liderService.lideres());
  public isLoading      = computed(() => this._isLoading());
  public isWaitResponse = computed(() => this._isWaitResponse._isWaitResponse());
  public isModalVisible = computed(() => this.stateModal._stateModal());
  public selectedLider  = computed(() => this.liderService.lider());

  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.titulo.emit('Lista de Lideres')
    this.loadLideres(1, '');
  }

  loadLideres(page: number, term: string) {
    this.liderService.getAllLideres(page, term).subscribe(
      {
        next: () => {
          this._isLoading.update(value => true);
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    );
  }

  onSearch() {
    const { search } = this.formSearch.value;
    this._isLoading.update(value => false);
    this.loadLideres(1, search)
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadLideres(page, '');
  }

  
  openModalAdd() {
    this.titleModal = "Agregar Lider";
    this.liderService._editLider.update(value => false);
    this.stateModal._stateModal.update(value => true);
  }

  openModalEdit(lider: Lider) {
    this.liderService._editLider.update(value => true);
    this.liderService.getLiderById(lider.id).subscribe(
      {
        next: () => {
          this.stateModal._stateModal.update(value => true);
          this.titleModal = "Editar Lider";
          console.log(this.selectedLider());
          
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    )
  }

  onChangeStatus(id: number, status: number){
    
    let message = status == 0 ? 'Habilitar' : 'Inhabilitar';

    Swal.fire({
      title: `Esta seguro que desea ${message} este registro?`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.liderService.changeStatusLider(id).subscribe(
          {
            next: () => {
              Swal.fire({
                icon: "success",
                title: this.liderService.message(),
                showConfirmButton: false,
                timer: 3000
              });
              this.loadLideres(1, '');
            },
            error: (message) => {
              Swal.fire('Error', message, 'error')
            },
          }
        )
      } 
    });
  }

  closeModal() {
    this.liderService._lider.update(value => null);
    this.stateModal._stateModal.update(value => false);
  }
}
