import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>('assets/avatar.png');
  avatar$ = this.avatarSubject.asObservable();

  actualizarAvatar(url: string) {
    this.avatarSubject.next(url);
  }
}
