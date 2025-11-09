import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { MatTableDataSource } from '@angular/material/table';
import { LiderAdminService } from '../../../services/lider-admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormLiderComponent } from '../form-lider/form-lider.component';
import Swal from 'sweetalert2';
import { LinkWhatsapPipe } from '../../../../pipes/link-whatsap.pipe';
import { ImageProfilePipe } from '../../../../pipes/image-profile.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-list-lider',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    PaginationComponent,
    ReactiveFormsModule,
    ImageProfilePipe,
    LinkWhatsapPipe,
    RouterModule
  ],
  templateUrl: './list-lider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListLiderComponent {
  displayedColumns: string[] = ['id', 'photo', 'name', 'lastname', 'contact', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  currentPage = 1;
  searchTerm: string = '';
  
  private fb              = inject(FormBuilder);
  private liderService = inject(LiderAdminService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private _isLoading = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);

  public lideres = computed(() => this.liderService.lideresResponse());
  public liderList = computed(() => this.liderService.lideresList());
  public isLoading = computed(() => this._isLoading());

  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.loadLideres(1, '');
  }

  loadLideres(page: number, term: string) {
    this.liderService.getAllLideres(page, term, 10).subscribe(
      {
        next: () => {
          this._isLoading.update(value => true);
          this.dataSource.data = this.liderService.lideres()!;
          this.totalItems = this.liderService.lideresList()?.total || 0;
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    );
  }

  onPageChange(event: number) {
    this.currentPage = event;
    this.loadLideres(this.currentPage, '');
  }

  openLiderForm(lider: any = null) {
    const dialogRef = this.dialog.open(FormLiderComponent, {
      width: '1000px',
      data: lider
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLideres(this.currentPage, '');
        //this.snackBar.open('lider guardado con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  editLider(lider: any) {
    this.openLiderForm(lider);
  }

  deleteLider(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.liderService.changeStatusLider(id).subscribe(
          {
            next: () => {
              this.loadLideres(this.currentPage, '');
              this.snackBar.open('Categoría eliminada con éxito', 'Cerrar', { duration: 3000 });
            },
            error: (message) => {
              Swal.fire('Error', message, 'error')
            }
          }
        );
      }
    });
  }

  onSearch() {
    const { search } = this.formSearch.value;
    this._isLoading.update(value => false);
    this.loadLideres(1, search)
  }
 }
