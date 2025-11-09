import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MiembrosService } from '../../../services/miembros-app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { FormMemberComponent } from '../form-member/form-member.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { RouterModule } from '@angular/router';
import { TipeMemberPipe } from '../../../../pipes/tipe-member.pipe';
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';

@Component({
  selector: 'app-list-member',
  standalone: true,
  imports: [
    CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        TipeMemberPipe,
        DataStatusPipe,
        PaginationComponent,
        FormMemberComponent,
  ],
  templateUrl: './list-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListMemberComponent {

  displayedColumns: string[] = ['id', 'name', 'lastname', 'contact', 'celula', 'tipe', 'status', 'actions'];
    dataSource = new MatTableDataSource<any>([]);
    totalItems = 0;
    currentPage = 1;
    searchTerm: string = '';
  
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
  
    private fb = inject(FormBuilder);
    private memberService = inject(MiembrosService);
  
    private _isLoading = signal<Boolean>(false);
  
    public members = computed(() => this.memberService._membersList());
    public isLoading = computed(() => this._isLoading());
  
    public formSearch: FormGroup = this.fb.group({
      search: ['', [Validators.nullValidator]],
    })
  
    ngOnInit(): void {
      this.loadMembers(1, '');
    }
  
    loadMembers(page: number, term: string) {
      this.memberService.getAllMembers(page, term).subscribe(
        {
          next: () => {
            this._isLoading.update(value => true);
            this.dataSource.data = this.memberService._membersList()!.data;
            this.totalItems = this.memberService._membersList()!.total;
          },
          error: (message) => {
            Swal.fire('Error', message, 'error')
          }
        }
      );
    }
  
    openMiembroForm(lider: any = null) {
      const dialogRef = this.dialog.open(FormMemberComponent, {
        width: '1000px',
        data: lider
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadMembers(this.currentPage, '');
          //this.snackBar.open('lider guardado con éxito', 'Cerrar', { duration: 3000 });
        }
      });
    }
  
    editMember(miembro: any) {
      this.openMiembroForm(miembro);
    }
  
    onSearch() {
      const { search } = this.formSearch.value;
      this._isLoading.update(value => false);
      this.loadMembers(1, search)
    }
  
    onPageChange(page: number) {
      this.currentPage = page;
      this._isLoading.update(value => false);
      this.loadMembers(page, '');
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
          this.memberService.changeStatusMember(id).subscribe(
            {
              next: () => {
                Swal.fire({
                  icon: "success",
                  title: this.memberService.message()!,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.loadMembers(1, '');
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
