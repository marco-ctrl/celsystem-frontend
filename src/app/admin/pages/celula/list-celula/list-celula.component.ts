import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import Swal from 'sweetalert2';
import { Celula, ListCelulasResponse } from '../../../interfaces/celula-admin.interface';
import { CommonModule } from '@angular/common';
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';
import { FormCelulaComponent } from '../form-celula/form-celula.component';
import { DayWeekPipe } from '../../../../pipes/day-week.pipe';
import { MaterialModule } from '../../../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-list-celula',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //DataStatusPipe,
    //FormCelulaComponent,
    DayWeekPipe,
    MaterialModule,
    PaginationComponent,
    RouterModule,
  ],
  templateUrl: 'list-celula.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListCelulaComponent {

  displayedColumns: string[] = ['id', 'nombre', 'numero', 'dia', 'hora', 'lider', 'estado', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  searchTerm: string = '';

  public currentPage: number = 1;
  public perPage: number = 10;
  public listCelulas?: ListCelulasResponse;
  public titleModal!: string;
  
  private fb = inject(FormBuilder);
  private celulaService = inject(CelulaAdminService);
  private dialog = inject(MatDialog);

  private _isLoading = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);

  public celulas = computed(() => this.celulaService.celulas());
  public isLoading = computed(() => this._isLoading());
  public selectedcelula = computed(() => this.celulaService.celula());

  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.loadcelulaes(1, "");
  }

  loadcelulaes(page: number, term: string) {
    this.celulaService.getAllcelulaes(page, term).subscribe(
      {
        next: () => {
          this._isLoading.update(value => true);
          this.dataSource.data = this.celulaService.celulas()!.data;
          this.totalItems = this.celulaService.celulas()?.total || 0;

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

  onChangeStatus(id: number, status: number) {

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

  openCelulaForm(lider: any = null) {
    const dialogRef = this.dialog.open(FormCelulaComponent, {
      width: '1000px',
      data: lider
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadcelulaes(this.currentPage, '');
        //this.snackBar.open('lider guardado con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }
  editCelula(celula: any) {
    this.openCelulaForm(celula);
  }
}
