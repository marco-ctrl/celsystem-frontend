import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { QrFormComponent } from '../qr_form/qr_form.component';
import { MaterialModule } from '../../../../material/material.module';
import { QrImageService } from '../../../services/qrImage.service';
import { PaginationComponent } from "../../../../components/pagination/pagination.component";
import { ImageProfilePipe } from '../../../../pipes/image-profile.pipe';
import { ImageModalComponent } from '../image_modal/image_modal.component';

@Component({
  selector: 'app-qr-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    PaginationComponent,
    ImageProfilePipe
],
  templateUrl: './qr_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class QrListComponent {
  displayedColumns: string[] = ['id', 'description', 'valid_from', 'expired', 'image', 'amount', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  currentPage = 1;
  searchTerm: string = '';

  private fb = inject(FormBuilder);
  private qrImageService = inject(QrImageService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private _isLoading = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);

  public qrImages = computed(() => this.qrImageService.qrImages());
  public isLoading = computed(() => this._isLoading());

  public formSearch: FormGroup = this.fb.group({
    search: ['', [Validators.nullValidator]],
  })

  ngOnInit(): void {
    this.loadQrImages(1, '');
  }

  loadQrImages(page: number, term: string) {
    this.qrImageService.getAllQrImages(page, term).subscribe(
      {
        next: () => {
          this._isLoading.update(value => true);
          this.dataSource.data = this.qrImageService.qrImages()!.data;
          this.totalItems = this.qrImageService.qrImages()?.total || 0;
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.loadQrImages(this.currentPage, '');
  }

  openCustomerForm(customer: any = null) {
    const dialogRef = this.dialog.open(QrFormComponent, {
      width: '500px',
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadQrImages(this.currentPage, '');
        //this.snackBar.open('cliente guardado con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  editCustomer(customer: any) {
    this.openCustomerForm(customer);
  }

  deleteCustomer(id: number) {
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
        /*this.customerService.deleteCustomer(id).subscribe(
          {
            next: () => {
              this.loadCustomers(this.currentPage, '');
              this.snackBar.open('Cliente dado de baja con éxito', 'Cerrar', { duration: 3000 });
            },
            error: (message) => {
              Swal.fire('Error', message, 'error')
            }
          }
        );*/
      }
    });
  }

  onSearch() {
    const { search } = this.formSearch.value;
    this._isLoading.update(value => false);
    this.loadQrImages(1, search)
  }

  openImageModal(qrImage: any) {
    this.dialog.open(ImageModalComponent, {
      data: qrImage,
      width: '500px',
      //panelClass: 'custom-dialog-container',
    });
  }

 }
