import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Temas } from '../../../admin/interfaces/temas.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { LeccionPipe } from '../../../pipes/leccion.pipe';
import { TemasService } from '../../../admin/services/temas.service';

@Component({
  selector: 'app-lecciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LeccionPipe,
    MaterialModule,
    PaginationComponent
  ],
  templateUrl: './lecciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeccionesComponent {

  public currentPage: number = 1;
  public perPage: number = 10;
  public listCelulas?: Temas;
  public titleModal!: string;
  public headersTable: string[] = ['#', 'tema', 'descripcion', 'fecha', 'archivo'];

  private fb = inject(FormBuilder);
  private temasService = inject(TemasService);

  private _isLoading = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);

  public temas = computed(() => this.temasService.temas());
  public isLoading = computed(() => this._isLoading());

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

  onChangeStatus(id: number, status: number) {

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

}
