import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../../../auth/services/auth.service';
import { MenuItemDesplegableComponent } from '@shared/components/menu-item-desplegable/menu-item-desplegable.component';
import { ImageProfilePipe } from '../../../pipes/image-profile.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MenuItemDesplegableComponent,
    ImageProfilePipe,
  ],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent { 

  public userName = input.required<String>();
  public isSidebarVisible = output<Boolean>();
  
  public authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());

  public isSideBar: Boolean = false; 
  isUserMenuOpen = false;
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarVisible.emit(!this.isSidebarVisible);
    this.isSideBar = !this.isSideBar;
  }

  onLogout() {
    //console.log('cerrando sesion')
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-menu') && this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }
}
