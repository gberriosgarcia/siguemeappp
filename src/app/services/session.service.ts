import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private perfilSubject = new BehaviorSubject<{ usuario: string; correo: string } | null>(null);
  perfil$ = this.perfilSubject.asObservable();

  setPerfil(usuario: string, correo: string) {
    this.perfilSubject.next({ usuario, correo });
  }

  getPerfil() {
    return this.perfilSubject.getValue();
  }

  clearPerfil() {
    this.perfilSubject.next(null);
  }
}