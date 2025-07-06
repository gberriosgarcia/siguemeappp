import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { SessionService } from 'src/app/services/session.service';
import { UsuarioCercano } from 'src/app/models/usuario-cercano.model';
import { Perfil } from 'src/app/models/perfil.model';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Geolocation } from '@capacitor/geolocation';
declare const firebase: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit, OnDestroy {
  usuariosCercanos: UsuarioCercano[] = [];
  email = '';
  slideOpts = { initialSlide: 0, speed: 400 };
  private map: any;
  private sub: Subscription | null = null;

  constructor(
    private session: SessionService,
    private firestore: AngularFirestore,
    private zone: NgZone
  ) {}

  async ngAfterViewInit() {
    const perfil: Perfil | null = await this.session.obtenerPerfil();
    if (!perfil?.correo) return;

    this.email = perfil.correo;

    try {
      const posicion = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = posicion.coords;

      await this.firestore
        .collection('usuarios')
        .doc(this.emailToKey(perfil.correo))
        .set({
          correo: perfil.correo,
          nombre: perfil.usuario || 'Usuario',
          avatar: perfil.avatar || '',
          lat: latitude,
          lon: longitude,
          timestamp: Date.now(),
        });

      this.zone.run(() => {
        this.map = L.map('map').setView([latitude, longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        L.marker([latitude, longitude]).addTo(this.map).bindPopup('Tú');

        this.sub = this.firestore
          .collection<UsuarioCercano>('usuarios')
          .valueChanges()
          .subscribe((usuarios) => {
            this.usuariosCercanos = usuarios.filter((u) => {
              const distancia = this.calcularDistancia(
                latitude,
                longitude,
                u.lat,
                u.lon
              );
              return (
                distancia <= 500 &&
                this.emailToKey(u.correo) !== this.emailToKey(this.email)
              );
            });
            console.log('[Home] Usuarios encontrados:', this.usuariosCercanos);
          });
      });
    } catch (err) {
      console.error('[Home] Error general:', err);
    }
  }

  verPerfil(user: UsuarioCercano) {
    window.location.href = `/previewuser/${user.correo}`;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private emailToKey(correo: string): string {
    return correo.replace(/\./g, '_').replace(/@/g, '-at-');
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
