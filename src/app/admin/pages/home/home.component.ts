import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HomeService } from '../../services/home.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { CardComponent } from '../../../components/card/card.component';
import { ChartsComponent } from '../../../components/charts/charts.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ChartsComponent,
    MaterialModule,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {

  public homeService = inject(HomeService);

  public cards = computed(() => this.homeService.cards());

  ngOnInit(): void {
    this.loadCardsData();
  }

  loadCardsData(){
    this.homeService.getCards().subscribe(
      {
        next: () => {
          
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    );
  }

 }
