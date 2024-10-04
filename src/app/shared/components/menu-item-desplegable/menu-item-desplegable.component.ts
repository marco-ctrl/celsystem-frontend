import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-item-desplegable',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './menu-item-desplegable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemDesplegableComponent { 
  public name = input.required<String>();
  public icon = input.required<string>();
}
