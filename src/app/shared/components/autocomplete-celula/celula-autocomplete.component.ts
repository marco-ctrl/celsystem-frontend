import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, computed, effect, inject, Inject, input, output, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CelulaAdminService } from '../../../admin/services/celula-admin.service';
import DashboardComponent from "../../../dashboard/dashboard.component";
import { Celula } from '../../../admin/interfaces/celula-admin.interface';
import { CelulaAutocompleteService } from '@services/celula-autocomplete.service';

@Component({
  selector: 'app-celula-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DashboardComponent
],
  templateUrl: './celula-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CelulaAutocompleteComponent {
  

  public celulaId = output<number | null>();

  public searchInput = new FormControl('')
  public selectedCelula?: Celula;

  private celulaService = inject(CelulaAdminService);
  private celulaAutocompleteService = inject(CelulaAutocompleteService);

  public celulas = computed(() => this.celulaService.celulaes());
  public valueForm = computed(() => this.celulaAutocompleteService._valueForm());
  
  public checkStateCelula = effect(() => {
    if(this.celulaService.celula()){
      this.searchInput.setValue(this.celulaService.celula()?.number + ' - ' + this.celulaService.celula()?.name);
    }
    else{
      this.searchInput.setValue('');
    }
  });

  searchLider(){
    const value: string = this.searchInput.value || "";
    if(value){
      this.celulaService.getAllcelulaes(1, value).subscribe();
    }
    else{
      this.celulaId.emit(null);
      this.celulaService._celula.set(null);
    }
    
  }

  onSelectedOption( event: MatAutocompleteSelectedEvent ):void {
    if ( !event.option.value ){
      this.selectedCelula = undefined;
      return
    }

    const celula: Celula = event.option.value;
    this.searchInput.setValue( celula.number + ' - ' + celula.name);
    this.selectedCelula = celula;

    this.celulaId.emit(celula.id);

    this.celulaService._celula.set(celula);
  }

  public checkValueFormStatus = effect(() => {
    if(this.valueForm()){
      this.searchInput.setValue(this.valueForm());
    }
  });

 }