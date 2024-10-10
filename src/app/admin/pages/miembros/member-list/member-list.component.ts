import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { ListMember } from '../../../interfaces/miembro-admin.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MiembrosService } from '../../../services/miembros-admin.service';
import { StateWaitResponseService } from '@services/state-wait-response.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material/material.module';
import { TipeMemberPipe } from '../../../../pipes/tipe-member.pipe';
import { DataStatusPipe } from '../../../../pipes/data-status.pipe';
import { ButtonDeleteComponent } from "../../../../shared/components/button-delete/button-delete.component";
import { ButtonEditComponent } from "../../../../shared/components/button-edit/button-edit.component";
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    TipeMemberPipe,
    DataStatusPipe,
    ButtonDeleteComponent,
    ButtonEditComponent,
    PaginatorComponent
],
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MemberListComponent {

  public currentPage:      number = 1;
  public perPage:          number = 10;
  public listMembresia?:    ListMember;
  public titleModal!:      string;
  public headersTable:     string[] = ['#','nombre', 'apellido', 'contacto', 'celula', 'tipo', 'estado', ];

  private fb              = inject(FormBuilder);
  private memberService    = inject(MiembrosService);
  private _isWaitResponse = inject(StateWaitResponseService);
  
  private _isLoading     = signal<Boolean>(false);
  public _isModalVisible = signal<boolean>(false);
  
  public members       = computed(() => this.memberService._members());
  public isLoading      = computed(() => this._isLoading());
  public isWaitResponse = computed(() => this._isWaitResponse._isWaitResponse());
  
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
    this.loadMembers(1, search)
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this._isLoading.update(value => false);
    this.loadMembers(page, '');
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
