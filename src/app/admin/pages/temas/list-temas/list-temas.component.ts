import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Lesson, Temas } from '../../../interfaces/temas.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemasService } from '../../../services/temas.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormTemasComponent } from "../form-temas/form-temas.component";
import { LeccionPipe } from '../../../../pipes/leccion.pipe';
import { MaterialModule } from '../../../../material/material.module';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-temas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormTemasComponent,
    LeccionPipe,
    MaterialModule,
    PaginationComponent
],
  templateUrl: './list-temas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListTemasComponent implements OnInit {
  
  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listCelulas?:     Temas;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','tema', 'descripcion', 'fecha', 'archivo', 'quitar'];

  private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

  private fb              = inject(FormBuilder);
  private temasService    = inject(TemasService);
  
  private _isLoading     = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);
  
  public temas          = computed(() => this.temasService.temas());
  public isLoading      = computed(() => this._isLoading());
  
  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  });

  ngOnInit(): void {
    this.loadTemas(1, '');
  }

  loadTemas(page: number, term: string) {
    this.temasService.getAllTemas(page, term).subscribe(
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
    this.loadTemas(1, search)
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadTemas(page, '');
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
      /*if (result.isConfirmed) {
        this.celulaService.changeStatuscelula(id).subscribe(
          {
            next: () => {
              Swal.fire({
                icon: "success",
                title: this.celulaService.message(),
                showConfirmButton: false,
                timer: 3000
              });
              this.loadTemas(1, '');
            },
            error: (message) => {
              Swal.fire('Error', message, 'error')
            },
          }
        )
      }*/ 
    });
  }

  openTemasForm(tema: any = null) {
      const dialogRef = this.dialog.open(FormTemasComponent, {
        width: '1000px',
        data: tema
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTemas(this.currentPage, '');
          //this.snackBar.open('lider guardado con éxito', 'Cerrar', { duration: 3000 });
        }
      });
    }

}
