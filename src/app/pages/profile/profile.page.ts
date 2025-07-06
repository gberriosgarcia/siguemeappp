import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Platform } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { Component } from '@angular/core';
import { AvatarService } from 'src/app/services/avatar.service';
import { SessionService } from 'src/app/services/session.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {
  nombreUsuario = 'Usuario';
  fotos: SafeUrl[] = [];
  avatarUrl = 'assets/avatar.png';
  email = '';

  constructor(
    private camera: Camera,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private avatarService: AvatarService,
    private session: SessionService
  ) {
    this.avatarService.avatar$.subscribe(url => {
      this.avatarUrl = url;
    });

    this.session.perfil$.subscribe(p => {
      if (p?.correo) {
        this.email = p.correo;
        this.nombreUsuario = p.usuario || 'Usuario';
        this.cargarFotosGuardadas();
      }
    });
  }

  async subirFoto(index?: number) {
    if (!this.platform.is('cordova') && !this.platform.is('capacitor')) {
      alert('Esta función solo está disponible en dispositivos móviles.');
      return;
    }

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      async (imagePath) => {
        let fileUrl = imagePath;
        if (this.platform.is('android') && !fileUrl.startsWith('file://')) {
          fileUrl = 'file://' + fileUrl;
        }

        const converted = Capacitor.convertFileSrc(fileUrl);
        const safeImg = this.sanitizer.bypassSecurityTrustUrl(converted);

        if (typeof index === 'number') {
          this.fotos[index] = safeImg;
        } else if (this.fotos.length < 9) {
          this.fotos.push(safeImg);
        } else {
          alert('Solo puedes subir hasta 9 fotos.');
        }

        await this.guardarFotos();
      },
      (err) => {
        console.log('Error al subir la foto', err);
      }
    );
  }

  async guardarFotos() {
    const clave = 'fotosPerfil_' + this.email;
    const fotosBase64 = this.fotos.map((f: any) => f.changingThisBreaksApplicationSecurity || f);
    await Preferences.set({ key: clave, value: JSON.stringify(fotosBase64) });
  }

  async cargarFotosGuardadas() {
    const clave = 'fotosPerfil_' + this.email;
    const { value } = await Preferences.get({ key: clave });
    if (value) {
      const urls: string[] = JSON.parse(value);
      this.fotos = urls.map((url) => this.sanitizer.bypassSecurityTrustUrl(url));
    }
  }

  cambiarFoto(index: number) {
    this.subirFoto(index);
  }
}