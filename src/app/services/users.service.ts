// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = 'https://api.example.com/users'; // Reemplaza por tu endpoint real

  constructor(private http: HttpClient) {}

  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }

  getUsuariosCercanos(lat: number, lon: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/nearby?lat=${lat}&lon=${lon}`);
  }

  subirFoto(userId: number, fotoUrl: string): Observable<any> {
    return this.http.post(`${this.api}/${userId}/photos`, { foto: fotoUrl });
  }
}