import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';
import { DayWeekPipe } from '../../../../pipes/day-week.pipe';
import { ListCelulas, Celula } from '../../../interfaces/celula-admin.interface';
import { StateWaitResponseService } from '@services/state-wait-response.service';
import { StateModalService } from '@services/state-modal.service';
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { ButtonAddComponent }      from "../../../../shared/components/button-add/button-add.component";
import { ButtonEditComponent }     from "../../../../shared/components/button-edit/button-edit.component";
import { ButtonDeleteComponent }   from "../../../../shared/components/button-delete/button-delete.component";
import { PaginatorComponent }      from "../../../../shared/components/paginator/paginator.component";
import { ModalComponent }          from "../../../../shared/components/modal/modal.component";
import { CelulaFormComponent } from '../celula-form/celula-form.component';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-celula-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ButtonAddComponent,
    DataStatusPipe,
    ButtonEditComponent,
    ButtonDeleteComponent,
    PaginatorComponent,
    ModalComponent,
    CelulaFormComponent,
    DayWeekPipe
],
  templateUrl: './celula-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CelulaListComponent {

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listCelulas?:     ListCelulas;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','nombre', 'numero', 'dia', 'hora', 'lider', 'estado'];

  private fb              = inject(FormBuilder);
  private celulaService   = inject(CelulaAdminService);
  private _isWaitResponse = inject(StateWaitResponseService);
  private stateModal      = inject(StateModalService);
  
  private _isLoading     = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);
  
  public celulas        = computed(() => this.celulaService.celulaes());
  public isLoading      = computed(() => this._isLoading());
  public isWaitResponse = computed(() => this._isWaitResponse._isWaitResponse());
  public isModalVisible = computed(() => this.stateModal._stateModal());
  public selectedcelula = computed(() => this.celulaService.celula());

  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.loadcelulaes(1, '');
  }

  loadcelulaes(page: number, term: string) {
    this.celulaService.getAllcelulaes(page, term).subscribe(
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
    this.loadcelulaes(1, search)
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadcelulaes(page, '');
  }

  
  openModalAdd() {
    this.titleModal = "Agregar celula";
    this.celulaService._editCelula.update(value => false);
    this.stateModal._stateModal.update(value => true);
  }

  openModalEdit(celula: Celula) {
    console.log(celula.id);
    this.celulaService._editCelula.update(value => true);
    this.celulaService.getcelulaById(celula.id).subscribe(
      {
        next: () => {
          this.stateModal._stateModal.update(value => true);
          this.titleModal = "Editar celula";
          console.log(this.selectedcelula());
          
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
        this.celulaService.changeStatuscelula(id).subscribe(
          {
            next: () => {
              Swal.fire({
                icon: "success",
                title: this.celulaService.message(),
                showConfirmButton: false,
                timer: 3000
              });
              this.loadcelulaes(1, '');
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
    this.celulaService._celula.update(value => null);
    this.stateModal._stateModal.update(value => false);
  }

 }
