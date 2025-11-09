import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DayWeekPipe } from '../../../../pipes/day-week.pipe';
import Swal from 'sweetalert2';
import { Celula, ListCelulasResponse } from '../../../interfaces/celula-admin.interface';
import { CelulaAdminService } from '../../../services/celula-admin.service';
import { TipeCelulaPipe } from '../../../../pipes/tipe-celula.pipe';
import { TipeMember } from '../../../interfaces/tipe-member';
import { PdfService } from '../../../services/pdf.service';
import { MaterialModule } from '../../../../material/material.module';
import { CustomLabelDirective } from '../../../../directives/customLabel.directive';

@Component({
  selector: 'app-celulas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DayWeekPipe,
    TipeCelulaPipe,
    MaterialModule,
    CustomLabelDirective,
  ],
  templateUrl: './celulas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CelulasComponent {

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listCelulas?:     ListCelulasResponse;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','nombre', 'numero', 'dia', 'hora', 'lider', 'tipo'];

  private fb              = inject(FormBuilder);
  private celulaService   = inject(CelulaAdminService);
  private pdfService      = inject(PdfService);
  
  private _isLoading     = signal<Boolean>(false);
  
  public celulas        = computed(() => this.celulaService.celulas());
  public isLoading      = computed(() => this._isLoading());
  public selectedcelula = computed(() => this.celulaService.celula());

  tipes: TipeMember[] = [
    {id: 0, name: "Todos"},
    {id: 1, name: "Varones"},
    {id: 2, name: "Mujeres"},
    {id: 3, name: "Niños/Prejuveniles"}
  ]

  public formSearch: FormGroup = this.fb.group({
    tipe: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.loadcelulaes(1, 0);
  }

  loadcelulaes(page: number, tipe: number) {
    this.celulaService.getCelulaesByTipe(page, tipe).subscribe(
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

  isValidField(field: string) {
    return this.formSearch.controls[field].errors
      && this.formSearch.controls[field].touched;
  }

  onSearch() {
    const { tipe } = this.formSearch.value;
    this._isLoading.update(value => false);
    this.loadcelulaes(1, tipe)
  }

  onPageChange(page: number) {
    const { tipe } = this.formSearch.value();

    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadcelulaes(page, tipe);
  }

  onDownloadPDF() {
    // Lógica para descargar PDF
    const { tipe } = this.formSearch.value;
    
    this.pdfService.getPdfReporteCelulas(tipe).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      window.open(url);
      window.URL.revokeObjectURL(url);
    });
  }

  onDownloadExcel() {
    /*const { start, end } = this.range.value;
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
    });*/

  }

 }
