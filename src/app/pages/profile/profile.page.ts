// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { AvatarService } from 'src/app/services/avatar.service';
import { SessionService } from 'src/app/services/session.service';
import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute } from '@angular/router';
import { Database, ref, get } from '@angular/fire/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  nombreUsuario = 'Usuario';
  fotos: SafeUrl[] = [];
  avatarUrl = 'assets/avatar.png';
  email = '';
  isOwnProfile = true;

  constructor(
    private camera: Camera,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private avatarService: AvatarService,
    private session: SessionService,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private db: Database
  ) {}

  async ngOnInit() {
    const otherId = this.route.snapshot.paramMap.get('id');
    if (otherId) {
      this.isOwnProfile = false;
      await this.loadOtherProfile(otherId);
    } else {
      this.isOwnProfile = true;
      this.session.perfil$.subscribe(async p => {
        if (p?.correo) {
          this.email = p.correo;
          this.nombreUsuario = p.usuario || 'Usuario';
          await this.avatarService.cargarAvatar(this.email);
          this.avatarService.avatar$.subscribe(url => this.avatarUrl = url);
          await this.cargarFotosGuardadas();
        }
      });
    }
  }

  private async loadOtherProfile(userId: string) {
    const snap = await get(ref(this.db, `profiles/${userId}`));
    if (snap.exists()) {
      const data: any = snap.val();
      this.nombreUsuario = data.nombre || 'Usuario';
      this.avatarUrl = data.avatar || 'assets/default-avatar.png';
      if (Array.isArray(data.fotos)) {
        this.fotos = data.fotos.map((url: string) =>
          this.sanitizer.bypassSecurityTrustUrl(url)
        );
      }
    }
  }

  async subirFoto(index?: number) {
    if (!this.isOwnProfile) return;
    if (!this.platform.is('cordova') && !this.platform.is('capacitor')) {
      alert('Función disponible solo en móvil.');
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
    try {
      let fileUrl = (await this.camera.getPicture(options)) as string;
      if (this.platform.is('android') && !fileUrl.startsWith('file://')) {
        fileUrl = 'file://' + fileUrl;
      }
      const converted = Capacitor.convertFileSrc(fileUrl);
      const safeImg = this.sanitizer.bypassSecurityTrustUrl(converted);
      if (typeof index === 'number') this.fotos[index] = safeImg;
      else if (this.fotos.length < 9) this.fotos.push(safeImg);
      else alert('Solo hasta 9 fotos.');
      await this.guardarFotos();
    } catch (err) {
      console.log('Error al subir foto', err);
    }
  }

  private async guardarFotos() {
    const key = 'fotosPerfil_' + this.email;
    const arr = this.fotos.map((f: any) => f.changingThisBreaksApplicationSecurity || f);
    await Preferences.set({ key, value: JSON.stringify(arr) });
  }

  private async cargarFotosGuardadas() {
    const key = 'fotosPerfil_' + this.email;
    const { value } = await Preferences.get({ key });
    if (value) {
      const urls: string[] = JSON.parse(value);
      this.fotos = urls.map(u => this.sanitizer.bypassSecurityTrustUrl(u));
    }
  }

  cambiarFoto(index: number) {
    if (this.isOwnProfile) this.subirFoto(index);
  }

  /** Renombrado para no usar caracteres especiales en el template */
  async addFriend() {
    const toast = await this.toastCtrl.create({
      message: 'Solicitud de amistad enviada',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
    // Aquí podrías llamar a tu servicio para guardar la petición en BD
  }
}