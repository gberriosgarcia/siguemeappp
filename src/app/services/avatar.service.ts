import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Database, ref, set, get } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>('assets/avatar.png');
  avatar$ = this.avatarSubject.asObservable();
  private readonly AVATAR_KEY_PREFIX = 'avatar_';

  constructor(
    private platform: Platform,
    private db: Database
  ) {}

  /**
   * Actualiza el avatar local y en Realtime Database
   * @param base64 Cadena base64 de la imagen
   * @param correo Identificador del usuario
   */
  async actualizarAvatar(base64: string, correo: string): Promise<void> {
    const key = this.AVATAR_KEY_PREFIX + correo;
    if (this.platform.is('hybrid')) {
      await Preferences.set({ key, value: base64 });
    }
    const sanitized = correo.replace(/\./g, '_').replace(/@/g, '-at-');
    await set(ref(this.db, `profiles/${sanitized}/avatar`), base64);
    this.avatarSubject.next(base64);
  }

  /**
   * Carga el avatar desde preferencias o Realtime Database
   * @param correo Identificador del usuario
   */
  async cargarAvatar(correo: string): Promise<void> {
    const key = this.AVATAR_KEY_PREFIX + correo;
    let base64: string | null = null;

    if (this.platform.is('hybrid')) {
      const { value } = await Preferences.get({ key });
      base64 = value;
    }

    if (!base64) {
      const sanitized = correo.replace(/\./g, '_').replace(/@/g, '-at-');
      const snap = await get(ref(this.db, `profiles/${sanitized}/avatar`));
      base64 = snap.exists() ? snap.val() : null;
    }

    this.avatarSubject.next(base64 || 'assets/avatar.png');
  }

  /**
   * Restaura el avatar por defecto
   */
  resetAvatar(): void {
    this.avatarSubject.next('assets/avatar.png');
  }
}

