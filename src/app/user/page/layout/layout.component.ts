import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { ImageProfilePipe } from '../../../pipes/image-profile.pipe';
import { A11yModule } from '@angular/cdk/a11y';
import { AuthService } from '../../../auth/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarItem } from '../../../interfaces/sidebarItem';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
        MaterialModule,
        ImageProfilePipe,
        A11yModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  private authService = inject(AuthService);
  
    public user = computed(() => this.authService.currentUser());
    public isUserMenuOpen: boolean = false;
    public isSidebarVisible = signal<Boolean>(true);
    public userName!: string;
    public titulo?: string;
  
    constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
      this.userName = this.user()?.lider.name + ' ' + this.user()?.lider.lastname;
    }
  
    itemSideBar: SidebarItem[] = [
      { url: 'home', title: 'Inicio', icon: 'analytics', subItems: undefined },
      { url: 'celula', title: 'Celula', icon: 'home', subItems: undefined },
      { url: 'map-celula', title: 'Mapa Celula', icon: 'map', subItems: undefined },
      { url: 'informe', title: 'Informe Celula', icon: 'list_all', subItems: undefined },
      {
        url: 'member', title: 'Membresia', icon: 'groups', subItems: undefined
      },
      { url: 'lecciones', title: 'Lecciones Celula', icon: 'article', subItems: undefined },
      {
        url: 'reporte', title: 'Reportes', icon: 'description', subItems: [
          { title: 'Informe Celula', url: 'reporte/informe-celula', icon: 'text_snippet' },
          { title: 'Reporte Celulas', url: 'reporte/celulas', icon: 'text_snippet' }
        ]
      }
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
  
    setTitulo(titulo: string): void {
      this.titulo = titulo;
    }
  
      sidenavMode: 'side' | 'over' = 'side';
    sidenavOpened = true;
  
    ngOnInit(): void {
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
        if (result.matches) {
          this.sidenavMode = 'over';
          this.sidenavOpened = false;
  
          this.router.events.subscribe(() => {
            this.sidenavOpened = false;
          });
        } else {
          this.sidenavMode = 'side';
          this.sidenavOpened = true;
        }
      });
    }
 }
