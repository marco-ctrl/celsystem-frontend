import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { SidebarItem } from '../../interfaces/sidebarItem';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  //styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  subMenuOpenIndex: number | null = null;

  public sidebarItems = input.required<SidebarItem[]>();

  toggleSubmenu(index: number) {
    this.subMenuOpenIndex = this.subMenuOpenIndex === index ? null : index;
  }

  ngOnInit(): void {
    // Initialize or fetch sidebar items if needed
    if (!this.sidebarItems()) {
      console.error('Sidebar items are not provided');
    }
    else {
      console.log('Sidebar items initialized:', this.sidebarItems());
    }
  }

 }
