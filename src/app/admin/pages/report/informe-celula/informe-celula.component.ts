import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InformeAdminService } from '../../../services/informe-admin.service';
import { ListInformesResponse } from '../../../interfaces/informe-admin.interface';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyBoliviaPipe } from '../../../../pipes/currency-bolivia.pipe';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PdfService } from '../../../services/pdf.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExcelService } from '../../../services/excel.service';
import { MaterialModule } from '../../../../material/material.module';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';

@Component({
  selector: 'app-informe-celula',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    CurrencyBoliviaPipe,
    RouterModule,
    MaterialModule,
    PaginationComponent
  ],
  providers: [DatePipe],
  templateUrl: './informe-celula.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InformeCelulaComponent {

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listInformes?:    ListInformesResponse;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','celula', 'lider', 'fecha y hora', 'asistencia', 'visitas', 'ofrenda bs.', 'direccion'];

  private fb              = inject(FormBuilder);
  private informeService    = inject(InformeAdminService);

  private _isLoading     = signal<Boolean>(true);
  public _isModalVisible = signal<boolean>(false);

  public informes       = computed(() => this.informeService.informees());
  public isLoading      = computed(() => this._isLoading());

  private pdfService = inject(PdfService);
  private excelService = inject(ExcelService);
  private http = inject(HttpClient);

  //private datePipe = inject(DatePipe);

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private datePipe: DatePipe) {}

  public formSearch: FormGroup = this.fb.group({
    inicio: ['', [Validators.required]],
    final: ['', [Validators.required]]
  })

  ngOnInit(): void {
    //this.loadInformes(1, '');
  }

  loadInformes(page: number, inicio: string, final: string) {
    this.informeService.getReportInformees(page, inicio, final).subscribe(
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
    const { start, end } = this.range.value;
    const inicio = new Date(start!);
    const final = new Date(end!);

    let inicioFormated = this.datePipe.transform(inicio, 'yyyy-MM-dd');
    let finalFormated = this.datePipe.transform(final, 'yyyy-MM-dd');

    console.log({inicioFormated, finalFormated});
    this._isLoading.update(value => false);
    this.loadInformes(1, inicioFormated!, finalFormated!)
  }

  onPageChange(page: number) {
    const { start, end } = this.range.value;
    const inicio = new Date(start!);
    const final = new Date(end!);

    let inicioFormated = this.datePipe.transform(inicio, 'yyyy-MM-dd');
    let finalFormated = this.datePipe.transform(final, 'yyyy-MM-dd');

    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadInformes(1, inicioFormated!, finalFormated!)
  }

  onDownloadPDF() {
    // Lógica para descargar PDF
    const { start, end } = this.range.value;
    const inicio = new Date(start!);
    const final = new Date(end!);

    let inicioFormated = this.datePipe.transform(inicio, 'yyyy-MM-dd');
    let finalFormated = this.datePipe.transform(final, 'yyyy-MM-dd');

    this.pdfService.getPdfAllInformes(inicioFormated!, finalFormated!).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      window.open(url);
      window.URL.revokeObjectURL(url);
    });
  }

  onDownloadExcel() {
    const { start, end } = this.range.value;
    const inicio = new Date(start!);
    const final = new Date(end!);

    let inicioFormated = this.datePipe.transform(inicio, 'yyyy-MM-dd');
    let finalFormated = this.datePipe.transform(final, 'yyyy-MM-dd');

    this.excelService.getExcelAllInformes(inicioFormated!, finalFormated!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reports.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }

}
