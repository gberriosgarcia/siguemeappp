import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>('assets/avatar.png');
  avatar$ = this.avatarSubject.asObservable();

  private readonly AVATAR_KEY_PREFIX = 'avatar_';

  actualizarAvatar(base64: string, correo: string) {
    const key = this.AVATAR_KEY_PREFIX + correo;
    Preferences.set({ key, value: base64 });
    this.avatarSubject.next(base64);
  }

  async cargarAvatar(correo: string) {
    const key = this.AVATAR_KEY_PREFIX + correo;
    const { value } = await Preferences.get({ key });
    if (value) {
      this.avatarSubject.next(value);
    }
  }

  resetAvatar() {
    this.avatarSubject.next('assets/avatar.png');
  }
}