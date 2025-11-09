import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ListInformesResponse } from '../../../interfaces/informe-admin.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InformeAdminService } from '../../../services/informe-admin.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CurrencyBoliviaPipe } from '../../../../pipes/currency-bolivia.pipe';
import { PdfService } from '../../../services/pdf.service';
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';
import { MaterialModule } from '../../../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../../qr/image_modal/image_modal.component';

@Component({
  selector: 'app-list-informe-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    CurrencyBoliviaPipe,
    RouterModule,
    DataStatusPipe,
    MaterialModule,
    PaginationComponent
],
  templateUrl: './list-informe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListInformeComponent { 

  displayedColumns: string[] = ['id','celula', 'lider', 'datetime', 'asistencia', 'visitas', 'ofrenda', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  searchTerm: string = '';

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listInformes?:    ListInformesResponse;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','celula', 'lider', 'fecha y hora', 'asistencia', 'visitas', 'ofrenda bs.', 'estado'];

  private fb             = inject(FormBuilder);
  private informeService = inject(InformeAdminService);
  private pdfService     = inject(PdfService);
    
  private _isLoading     = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);
  
  public informes       = computed(() => this.informeService.informees());
  public isLoading      = computed(() => this._isLoading());
  
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
           this.dataSource.data = this.informeService.informees()!.data;
          this.totalItems = this.informeService.informees()?.total || 0;
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

  downloadPdf(reportId: number): void {
    this.pdfService.getPdfInforme(reportId).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'informe.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  viewPdf(reportId: number): void {
    this.pdfService.getPdfInforme(reportId).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      window.open(url);
      window.URL.revokeObjectURL(url);
    });
  }

}
