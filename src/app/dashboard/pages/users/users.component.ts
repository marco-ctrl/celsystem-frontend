import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent, RouterLink],
  templateUrl: './users.component.html',
  styles: ``
})
export default class UsersComponent {
  public userServices = inject( UserService )
}
