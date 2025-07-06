import { Injectable } from '@angular/core';
import { GeoPoint, Firestore, collection, doc, setDoc, query, where, getDocs } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { UsuarioCercano } from '../models/usuario-cercano.model';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { addDoc, getFirestore, CollectionReference } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class UbicacionGeoService {
  constructor(private firestore: Firestore) {}

  async guardarUbicacion(perfil: { correo: string; usuario?: string; avatar?: string }) {
    const posicion = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = posicion.coords;

    console.log('[UbicacionGeoService] Ubicación obtenida:', latitude, longitude);

    const userRef = doc(this.firestore, 'usuarios', this.emailToKey(perfil.correo));
    const data = {
      correo: perfil.correo,
      nombre: perfil.usuario || 'Usuario',
      avatar: perfil.avatar || '',
      ubicacion: new GeoPoint(latitude, longitude),
      timestamp: Date.now(),
    };

    await setDoc(userRef, data);
  }

  obtenerUsuariosCercanos(lat: number, lon: number, distanciaMax = 500): Observable<UsuarioCercano[]> {
    const colRef = collection(this.firestore, 'usuarios') as CollectionReference<any>;

    return from(getDocs(colRef)).pipe(
      map(snapshot => {
        const usuarios: UsuarioCercano[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const ubicacion = data.ubicacion as GeoPoint;
          const distancia = this.calcularDistancia(lat, lon, ubicacion.latitude, ubicacion.longitude);
          if (distancia <= distanciaMax) {
            usuarios.push({
              correo: data.correo,
              nombre: data.nombre,
              avatar: data.avatar,
              lat: ubicacion.latitude,
              lon: ubicacion.longitude,
            });
          }
        });
        return usuarios;
      })
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

    return R * c;
  }
}