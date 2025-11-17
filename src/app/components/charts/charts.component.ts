import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartService } from '../../admin/services/chart.service';
import Swal from 'sweetalert2';

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
export class ChartsComponent implements OnInit {

  public chartServices = inject(ChartService);
  //public year = new Date().getFullYear();
  years: number[] = [];
  selectedYear!: number;

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

  public barChartLabels = signal<any[]>([]);
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Asistencia',
      barThickness: 15
    }
  ];


  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  //public pieChartLabels: string[] = [];
  public pieChartLabels = signal<string[]>([]);
  public pieChartData = signal<any>({});
  /*public pieChartData: any = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: []
      }
    ]
  };*/
  //public pieChartData = signal<any | null>(null);
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  constructor() { }

  ngOnInit(): void {

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i); // Año actual y 5 anteriores
    this.selectedYear = currentYear;
    this.loadCantidadAsistencia(currentYear);
    this.loadTotalMembers();
  }

  onYearChange(): void {
    this.loadCantidadAsistencia(this.selectedYear);
  }

  loadCantidadAsistencia(year: number){
    this.chartServices.getAllResultBar(year).subscribe(
      {
        next: () => {
          this.barChartData[0].data = this.chartServices.dataBar()!;
          this.barChartLabels.set(this.chartServices.labelBar()!);
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    );
  }

  loadTotalMembers() {
    this.chartServices.getAllResultPie().subscribe(
      {
        next: () => {
          this.pieChartLabels.set(this.chartServices.labelPie()!)
          this.pieChartData.set( {
            labels: this.pieChartLabels(),
            datasets: [
              {
                data: this.chartServices.dataPie()!
              }
            ]
          });
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      },

    );
  }

}
