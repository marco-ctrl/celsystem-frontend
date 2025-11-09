import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarItem } from '../../../interfaces/sidebarItem';
// ...existing code...
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MaterialModule, 
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  // ...existing code...
  itemSideBar: SidebarItem[] = [
    { url: 'home', title: 'Inicio', icon: 'analytics', subItems: undefined },
    { url: 'celula', title: 'Celula', icon: 'home', subItems: undefined },
    { url: 'map-celula', title: 'Mapa Celula', icon: 'map', subItems: undefined },
    { url: 'informe', title: 'Informe Celula', icon: 'list_all', subItems: undefined },
    {
      url: 'member', title: 'Membresia', icon: 'groups', subItems: undefined
    },
    { url: 'lecciones', title: 'Lecciones Celula', icon: 'article', subItems: undefined },
  ];
}
