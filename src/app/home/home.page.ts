import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  grupos = [
    [
      { name: 'Jonny', avatar: 'assets/jonny.JPG' },
      { name: 'Jenny', avatar: 'assets/jenny.JPG' },
      { name: 'Willy', avatar: 'assets/willy.JPG' },
      { name: 'Murci', avatar: 'assets/murci.JPG' },
    ],
  ];

  private map: any;

  constructor() {}

  ngAfterViewInit() {
    this.initMap();
  }

  async initMap() {
    if (!navigator.geolocation) {
      alert('Geolocalización no disponible en este navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.map = L.map('map').setView([latitude, longitude], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        const customIcon = L.icon({
          iconUrl: 'assets/pngegg.png', // Asegúrate de tener esta imagen en /src/assets/
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup('¡Estás aquí!')
          .openPopup();
      },
      (error) => {
        alert('Error obteniendo la ubicación: ' + error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }
}