import { Component } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  bienvenidos = '¡Bienvenid@!';
  email = '';
  avatarUrl: string = 'assets/avatar.png';

  constructor(
    private session: SessionService,
    private avatarService: AvatarService
  ) {
    this.session.perfil$.subscribe((p) => {
      if (p?.correo) {
        this.bienvenidos = `¡Bienvenid@, ${p.usuario}!`;
        this.email = p.correo;

        // Cargar avatar guardado para este usuario
        this.avatarService.cargarAvatar(this.email);
      } else {
        this.bienvenidos = '¡Bienvenid@!';
      }
    });

    this.avatarService.avatar$.subscribe(url => {
      this.avatarUrl = url;
    });
  }

  async cambiarAvatar() {
    try {
      const img = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (img?.dataUrl && this.email) {
        await this.avatarService.actualizarAvatar(img.dataUrl, this.email);
      }
    } catch (err) {
      console.log('Cancelado o error:', err);
    }
  }
}

