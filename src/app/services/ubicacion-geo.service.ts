import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { getDatabase, ref, set, get } from 'firebase/database';

interface UsuarioGeo {
  usuario: string;
  lat: number;
  lon: number;
  actualizadoEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class UbicacionGeoService {
  private radioDeteccionMetros = 10;

  async guardarUbicacion(uid: string, usuario: string): Promise<void> {
    const coords = await Geolocation.getCurrentPosition();
    const db = getDatabase();
    const userRef = ref(db, 'usuariosGeo/' + uid);

    await set(userRef, {
      usuario,
      lat: coords.coords.latitude,
      lon: coords.coords.longitude,
      actualizadoEn: new Date().toISOString(),
    });
  }

  async obtenerUsuariosCercanos(uidActual: string): Promise<UsuarioGeo[]> {
    const db = getDatabase();
    const snapshot = await get(ref(db, 'usuariosGeo'));
    const usuarios = snapshot.val() as { [uid: string]: UsuarioGeo };

    if (!usuarios || typeof usuarios !== 'object') return [];

    const actual = usuarios[uidActual];
    if (!actual) return [];

    return Object.entries(usuarios)
      .filter(([uid, user]) => uid !== uidActual)
      .map(([_, user]) => ({
        ...user,
        distancia: this.calcularDistancia(
          actual.lat,
          actual.lon,
          user.lat,
          user.lon
        ),
      }))
      .filter((u) => u.distancia <= this.radioDeteccionMetros);
  }

  private calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // metros
    const rad = (x: number) => (x * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
