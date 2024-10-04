import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent {
  // Bar Chart
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        type: 'category', // Asegúrate de que la escala x está configurada como 'category'
      },
      y: {
        beginAtZero: true
      }
    }
  };
  public barChartLabels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    { 
      data: [500, 1000, 750, 1250, 1500, 900, 1300, 1100, 1200, 1400, 1600, 1700], 
      label: 'Ingresos',
      barThickness: 15
    }
  ];

  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public pieChartLabels: string[] = ['Ingresos', 'Egresos'];
  public pieChartData: any = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [12000, 8000]
      }
    ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  constructor() { }

}
