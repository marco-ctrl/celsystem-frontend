import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ListInformes } from '../../../interfaces/informe-admin.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InformeAdminService } from '../../../services/informe-admin.service';
import { StateWaitResponseService } from '@services/state-wait-response.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { ButtonAddComponent } from "../../../../shared/components/button-add/button-add.component";
import { ButtonEditComponent } from "../../../../shared/components/button-edit/button-edit.component";
import { ButtonDeleteComponent } from "../../../../shared/components/button-delete/button-delete.component";
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CurrencyBoliviaPipe } from '../../../../pipes/currency-bolivia.pipe';

@Component({
  selector: 'app-list-informe-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ButtonAddComponent,
    ButtonEditComponent,
    ButtonDeleteComponent,
    DataStatusPipe,
    PaginatorComponent,
    CurrencyBoliviaPipe,
    RouterModule
],
  templateUrl: './list-informe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListInformeComponent { 

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listInformes?:    ListInformes;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','celula', 'lider', 'fecha y hora', 'asistentes', 'visitas', 'ofrenda bs.', 'estado'];

  private fb              = inject(FormBuilder);
  private informeService    = inject(InformeAdminService);
  private _isWaitResponse = inject(StateWaitResponseService);
  
  private _isLoading     = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);
  
  public informes       = computed(() => this.informeService.informees());
  public isLoading      = computed(() => this._isLoading());
  public isWaitResponse = computed(() => this._isWaitResponse._isWaitResponse());
  
  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.loadInformes(1, '');
  }

  loadInformes(page: number, term: string) {
    this.informeService.getAllinformees(page, term).subscribe(
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
    this.loadInformes(1, search)
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadInformes(page, '');
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
        this.informeService.changeStatusInforme(id).subscribe(
          {
            next: () => {
              Swal.fire({
                icon: "success",
                title: this.informeService.message(),
                showConfirmButton: false,
                timer: 3000
              });
              this.loadInformes(1, '');
            },
            error: (message) => {
              Swal.fire('Error', message, 'error')
            },
          }
        )
      } 
    });
  }

}
