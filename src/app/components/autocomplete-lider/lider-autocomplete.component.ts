import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, computed, effect, inject, Inject, input, output, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Lider } from '../../auth/interfaces';
import { LiderAdminService } from '../../admin/services/lider-admin.service';
import { CelulaAdminService } from '../../admin/services/celula-admin.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-lider-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
],
  templateUrl: './lider-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiderAutocompleteComponent {
  

  public liderId = output<number | null>();

  public searchInput = new FormControl('')
  public selectedLider?: Lider;

  private liderService = inject(LiderAdminService);
  private celulaService = inject(CelulaAdminService);

  public lideres = computed(() => this.liderService.lideres());
  
  public checkStateCelula = effect(() => {
    if(this.celulaService.celula()){
      this.searchInput.setValue(this.celulaService.celula()?.lider?.name + ' ' + this.celulaService.celula()?.lider?.lastname);
    }
    else{
      this.searchInput.setValue('');
    }
  });

  searchLider(){
    const value: string = this.searchInput.value || "";
    if(value){
      this.liderService.getAllLideres(1, value, 5).subscribe();
    }
    else{
      this.liderId.emit(null);
    }
    
  }

  onSelectedOption( event: MatAutocompleteSelectedEvent ):void {
    if ( !event.option.value ){
      this.selectedLider = undefined;
      return
    }

    const lider: Lider = event.option.value;
    this.searchInput.setValue( lider.name + ' ' + lider.lastname);
    this.selectedLider = lider;

    this.liderId.emit(lider.id);
  }

 }
