import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SidebarComponent } from "@shared/components/sidebar/sidebar.component";

import { SidebarItem } from '../../../interfaces/sidebar.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {

  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());
  public isUserMenuOpen: boolean = false;
  public isSidebarVisible = signal<Boolean>(true);
  public userName!: string;
  public titulo?: string;

  constructor() {
    console.log(this.user());
    console.log(localStorage.getItem('token'));
    this.userName = this.user()?.lider.name + ' ' + this.user()?.lider.lastname;
  }

  itemSideBar: SidebarItem[] = [
    { url: 'home', title: 'Inicio', icon: 'analytics' },
    { url: 'lider', title: 'Lider', icon: 'person' },
    { url: 'celula', title: 'Celula', icon: 'home' },
    { url: 'map-celula', title: 'Mapa Celula', icon: 'map' },
    { url: 'informe', title: 'Informe Celula', icon: 'list_all' }
  ]

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  public updateToggleSidebar(value: Boolean) {
    this.isSidebarVisible.update(value => !value)
  }

  onLogout() {
    this.authService.logout();
  }

  setTitulo(titulo: string): void{
    this.titulo = titulo;
  }
}
