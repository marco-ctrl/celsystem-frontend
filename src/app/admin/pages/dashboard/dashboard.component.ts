import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CardComponent } from '@shared/components/card/card.component';
import { ChartsComponent } from '@shared/components/charts/charts.component';
import { HomeService } from '../../services/home.service';
import Swal from 'sweetalert2';
import { MaterialModule } from '@shared/material/material.module';
import { Card } from '../../interfaces/home.interface';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ChartsComponent,
    MaterialModule,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  
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
