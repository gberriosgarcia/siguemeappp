import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Geolocation } from '@capacitor/geolocation';
import { UsuarioCercano } from '../models/usuario-cercano.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  constructor(
    private db: AngularFireDatabase,
    private zone: NgZone
  ) {}

  async guardarUbicacion(perfil: { correo: string; usuario?: string; avatar?: string }) {
    const posicion = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = posicion.coords;

    console.log('[UbicacionService] Ubicación obtenida:', latitude, longitude);

    const key = this.emailToKey(perfil.correo);
    const data = {
      correo: perfil.correo,
      nombre: perfil.usuario || 'Usuario',
      avatar: perfil.avatar || '',
      lat: latitude,
      lon: longitude,
      timestamp: Date.now()
    };

    this.zone.run(() => {
      this.db.object(`usuarios/${key}`).set(data)
        .then(() => {
          console.log('[UbicacionService] Ubicación guardada con éxito');
        })
        .catch((error) => {
          console.error('[UbicacionService] Error al guardar en Firebase:', error);
        });
    });
  }

  obtenerUsuariosCercanos(lat: number, lon: number, distanciaMax = 500): Observable<UsuarioCercano[]> {
    return this.db
      .list<UsuarioCercano>('usuarios')
      .valueChanges()
      .pipe(
        map((usuarios: UsuarioCercano[]) =>
          usuarios.filter((u) =>
            this.calcularDistancia(lat, lon, u.lat, u.lon) <= distanciaMax
          )
        )
      );
  }

  emailToKey(correo: string): string {
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

    return R * c; // metros
  }
}
