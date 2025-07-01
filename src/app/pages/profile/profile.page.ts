import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Platform } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { Component } from '@angular/core';
import { AvatarService } from 'src/app/services/avatar.service';

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

  constructor(
    private camera: Camera,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private avatarService: AvatarService

  ) {
     this.avatarService.avatar$.subscribe(url => {
      this.avatarUrl = url;
    });
    this.cargarFotosGuardadas();
    
  }

  subirFoto(index?: number) {
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

        this.guardarFotos();
      },
      (err) => {
        console.log('Error al subir la foto', err);
      }
    );
  }

  guardarFotos() {
    const fotosBase64 = this.fotos.map((f: any) => f.changingThisBreaksApplicationSecurity || f);
    localStorage.setItem('fotosPerfil', JSON.stringify(fotosBase64));
  }

  cargarFotosGuardadas() {
    const guardadas = localStorage.getItem('fotosPerfil');
    if (guardadas) {
      const urls: string[] = JSON.parse(guardadas);
      this.fotos = urls.map((url) => this.sanitizer.bypassSecurityTrustUrl(url));
    }
  }

  cambiarFoto(index: number) {
    this.subirFoto(index);
  }
}
