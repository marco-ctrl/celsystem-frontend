import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-options-buttom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
  ],
  templateUrl: './options-buttom-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsButtomSheetComponent { 

  
openLink(event: MouseEvent): void {
  console.log('open link', event)
  //event.preventDefault();
}

 }
