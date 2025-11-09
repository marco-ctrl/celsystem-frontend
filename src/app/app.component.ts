import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { MaterialModule } from './material/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mrfsoft';

  authStatus = AuthStatus;

  public authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  public authStatusChangedEffect = effect(() => {

    const currentUrl = this.router.url;

    switch (this.authService.authStatus()) {

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        //this.router.navigateByUrl('/admin');
        this.authService.currentUser()?.tipe === 0 ? this.router.navigateByUrl('/admin') : this.router.navigateByUrl('/app');
        return;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/login');
        return;

    }
  });
}