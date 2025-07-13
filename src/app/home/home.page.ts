// src/app/home/home.page.ts
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {
  usuariosCercanos: Array<{ userId: string; name: string; avatar: string; distance: number }> = [];
  loading = true;
  private intervalId!: any;

  constructor(
    private session: SessionService,
    private ubicSvc: UbicacionService,
    private navCtrl: NavController,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    const perfil = this.session.getPerfil();
    if (!perfil) {
      this.loading = false;
      return;
    }

    const myKey = this.ubicSvc.sanitizeKey(perfil.correo);

    // Publica ubicación con nombre y avatar
    await this.ubicSvc.updateMyLocation(
      perfil.correo,
      perfil.usuario || 'Usuario',
      perfil.avatar || ''
    );
    await this.refreshNearby(myKey);

    // Refresca cada 5 segundos
    this.intervalId = setInterval(async () => {
      await this.ubicSvc.updateMyLocation(
        perfil.correo,
        perfil.usuario || 'Usuario',
        perfil.avatar || ''
      );
      await this.refreshNearby(myKey);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  /** Recarga usuarios activos (últimos 30s) con avatar limpio */
  private async refreshNearby(myKey: string) {
    const THRESHOLD_MS = 30000;
    try {
      const all = await this.ubicSvc.queryNearby(0.5);
      const now = Date.now();

      this.zone.run(() => {
        this.usuariosCercanos = all
          .filter(u => u.userId !== myKey && now - u.timestamp <= THRESHOLD_MS)
          .map(u => {
            let avatarUrl = 'assets/avatar.png';
            if (u.avatar) {
              avatarUrl = (u.avatar.startsWith('http') || u.avatar.startsWith('data:'))
                ? u.avatar
                : `assets/avatars/${u.avatar}`;
            }
            return { userId: u.userId, name: u.name, avatar: avatarUrl, distance: u.distance };
          });
        this.loading = false;
      });
    } catch (err) {
      console.error('HomePage: error refrescando nearby', err);
      this.zone.run(() => { this.loading = false; });
    }
  }

  /** Navega al perfil del usuario seleccionado */
  verPerfil(userId: string) {
    this.navCtrl.navigateForward(`/previewuser/${userId}`);
  }
}



