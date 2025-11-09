import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Input() sidenavOpened: boolean = true;
 }
