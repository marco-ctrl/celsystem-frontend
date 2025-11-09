import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse, UsersResponse } from '../interfaces/req-response';
import { delay, map } from 'rxjs';

interface State{
  users: User[],
  loading: boolean,
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private http = inject( HttpClient );

  _state = signal<State>({
    loading: true,
    users: []
  });

  public users = computed( () => this._state().users );
  public loading = computed( () => this._state().loading );

  constructor() { 
    this.http.get<UsersResponse>('https://reqres.in/api/users')
    .pipe( delay(1500) )
    .subscribe( res => {
      this._state.set({
        loading: false,
        users: res.data,
      })
    } )
  }

  getUserById(id: string){
    return this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`)
    .pipe( 
      delay(1500),
      map( resp => resp.data)
    )
    }
}