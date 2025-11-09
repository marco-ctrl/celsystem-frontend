import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Inject, input, output, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CelulaAdminService } from '../../admin/services/celula-admin.service';
import { Celula } from '../../admin/interfaces/celula-admin.interface';
import { CelulaAutocompleteService } from '../../services/celula-autocomplete.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-celula-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
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

  public celulas = computed(() => this.celulaService.celulas());
  public valueForm = computed(() => this.celulaAutocompleteService._valueForm());

  public checkStateCelula = effect(() => {
    if (this.celulaService.celula()) {
      this.searchInput.setValue(this.celulaService.celula()?.number + ' - ' + this.celulaService.celula()?.name);
    }
    else {
      this.searchInput.setValue('');
    }
  });

  public timeout: any = null;
  searchLider() {
    
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      const value: string = this.searchInput.value || "";

      if (value) {
        this.celulaService.getAllcelulaes(1, value).subscribe();
      }
      else {
        this.celulaId.emit(null);
        this.celulaService._celula.set(null);
      }
    }, 1000);

  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedCelula = undefined;
      return
    }

    const celula: Celula = event.option.value;
    this.searchInput.setValue(celula.number + ' - ' + celula.name);
    this.selectedCelula = celula;

    this.celulaId.emit(celula.id);

    this.celulaService._celula.set(celula);
  }

  public checkValueFormStatus = effect(() => {
    if (this.valueForm()) {
      this.searchInput.setValue(this.valueForm());
    }
  });

}