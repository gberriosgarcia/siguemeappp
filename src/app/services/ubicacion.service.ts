// src/app/services/ubicacion.service.ts
import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  set,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
  onDisconnect
} from '@angular/fire/database';
import { Geolocation } from '@capacitor/geolocation';
import {
  geohashForLocation,
  geohashQueryBounds,
  distanceBetween
} from 'geofire-common';

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  private basePath = 'userLocations';

  constructor(private db: Database) {}

  /**
   * Normaliza un identificador para usarlo como clave en RTDB
   */
  public sanitizeKey(id: string): string {
    return id
      .replace(/\./g, '_')   // punto → guión bajo
      .replace(/@/g, '-at-')  // arroba → "-at-"
      .replace(/#/g, '_')     // elimina caracteres inválidos
      .replace(/\$/g, '_')
      .replace(/\[/g, '_')
      .replace(/]/g, '_');
  }

  /**
   * Guarda la ubicación actual con nombre y avatar, junto con geohash y timestamp,
   * y programa borrado automático al desconectarse.
   * @param userId Email del usuario (se saneará para la clave)
   * @param nombre Nombre para mostrar
   * @param avatar URL o base64 del avatar
   */
  async updateMyLocation(
    userId: string,
    nombre: string = '',
    avatar: string = ''
  ): Promise<void> {
    const pos = await Geolocation.getCurrentPosition();
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const hash = geohashForLocation([lat, lng]);
    const timestamp = Date.now();
    const key = this.sanitizeKey(userId);
    const nodeRef = ref(this.db, `${this.basePath}/${key}`);

    // Publica lat, lng, hash, timestamp, nombre y avatar
    await set(nodeRef, { lat, lng, hash, timestamp, nombre, avatar });

    // Borra automáticamente este nodo al desconectarte
    onDisconnect(nodeRef).remove();
  }

  /**
   * Recupera usuarios dentro de `radiusKm` kilómetros,
   * devolviendo userId, nombre, avatar, distancia y timestamp.
   */
  async queryNearby(
    radiusKm: number
  ): Promise<Array<{ userId: string; name: string; avatar: string; distance: number; timestamp: number }>> {
    const pos = await Geolocation.getCurrentPosition();
    const center: [number, number] = [pos.coords.latitude, pos.coords.longitude];
    const radiusM = radiusKm * 1000;
    const bounds = geohashQueryBounds(center, radiusM);
    const baseRef = ref(this.db, this.basePath);

    // Ejecuta consultas por cada rango de geohash
    const snaps = await Promise.all(
      bounds.map(b =>
        get(query(baseRef, orderByChild('hash'), startAt(b[0]), endAt(b[1])))
      )
    );

    const results: Array<{ userId: string; name: string; avatar: string; distance: number; timestamp: number }> = [];
    for (const snap of snaps) {
      snap.forEach(child => {
        const data = child.val() as any;
        const dist = distanceBetween([data.lat, data.lng], center);
        if (dist <= radiusM && typeof data.timestamp === 'number') {
          results.push({
            userId: child.key as string,
            name: data.nombre as string,
            avatar: data.avatar as string,
            distance: Math.round(dist),
            timestamp: data.timestamp
          });
        }
      });
    }
    return results;
  }
}


