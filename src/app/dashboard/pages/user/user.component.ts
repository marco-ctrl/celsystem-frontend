import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { User } from '../../../interfaces/req-response';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UserService } from '@services/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './user.component.html',
  styles: ``
})
export default class UserComponent {

  private route = inject( ActivatedRoute );
  private userService = inject( UserService );

  //public user = signal< User | undefined>(undefined);
  public user = toSignal(
    this.route.params.pipe(
      switchMap( ({id}) => this.userService.getUserById(id) )
    )
  );

  public labelTitle = computed( () => {
    if( this.user() ){
      return `Informacion del Usuario ${this.user()?.first_name} ${this.user()?.last_name}`
    }

    return `Informacion del usuario`
  })
}
