import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CelulaAdminService } from '../../services/celula-admin.service';
import Swal from 'sweetalert2';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: 'mapa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MapaComponent {

  map: L.Map | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  marker: L.Marker | undefined;

  celulaService = inject(CelulaAdminService);
  celulas = computed(() => this.celulaService.mapCelulas());

  ngOnInit(): void {
    this.loadcelulaes(1, '');
  }

  ngAfterViewInit(): void {
  }

  initMap(): void {

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([-22.735938864584394, -64.34173274785282], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.celulas()?.celulas) {
      let plantilla;
      this.celulas()?.celulas.forEach(celula => {
        plantilla = `<h6 align="center" class="font-semibold">INFORMACION CELULA</h6><hr>
                        <div>
                          <p style="margin: 2px 0;"><strong>Nombre:</strong> ${celula.name}</p>
                          <p style="margin: 2px 0;"><strong>Numero:</strong> ${celula.number}</p>
                          <p style="margin: 2px 0;"><strong>Lider:</strong> ${celula.lider?.name} ${celula.lider?.lastname}</p>
                        </div>`;
        this.marker = L.marker([celula.latitude, celula.length]).addTo(this.map!).bindPopup(plantilla);
      });
    }

    this.showCurrentLocation();
  }

  loadcelulaes(page: number, term: string) {
    this.celulaService.getMapCelula(page, term).subscribe(
      {
        next: () => {
          this.initMap();
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      }
    );
  }

  showCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.latitude = lat;
        this.longitude = lon;
        this.map!.setView([lat, lon], 15);

        L.marker([lat, lon]).addTo(this.map!).bindPopup('Estas Aqui!').openPopup();
      }, (error) => {
        console.error('Error getting location: ', error);
        Swal.fire('Error', 'Error getting location', 'error')
      });
    } else {
      Swal.fire('Error', 'Geolocation is not supported by this browser.', 'error')
      console.error('Geolocation is not supported by this browser.');
    }
  }

 }
