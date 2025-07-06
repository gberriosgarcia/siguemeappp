import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Perfil } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private perfilSubject = new BehaviorSubject<Perfil | null>(null);
  perfil$ = this.perfilSubject.asObservable();

  setPerfil(usuario: string, correo: string, avatar?: string) {
    const perfil: Perfil = { usuario, correo, avatar };
    this.perfilSubject.next(perfil);
    localStorage.setItem('perfil', JSON.stringify(perfil)); // 🔐 persistencia
  }

  getPerfil(): Perfil | null {
    return this.perfilSubject.getValue();
  }

  async obtenerPerfil(): Promise<Perfil | null> {
    const local = localStorage.getItem('perfil');
    const perfil = local ? (JSON.parse(local) as Perfil) : null;
    this.perfilSubject.next(perfil);
    return perfil;
  }

  clearPerfil() {
    this.perfilSubject.next(null);
    localStorage.removeItem('perfil');
  }
}

