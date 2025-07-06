import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  bubbles: any[] = [];

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private sqlite: SqliteService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.generateBubbles(20);
  }

  private generateBubbles(count: number): void {
    this.bubbles = Array.from({ length: count }).map(() => ({
      left: Math.random() * 100 + '%',
      size: 10 + Math.random() * 30 + 'px',
      delay: Math.random() * 10 + 's',
      duration: 4 + Math.random() * 3 + 's',
      opacity: 0.1 + Math.random() * 0.4
    }));
  }

  async login(): Promise<void> {
    this.email = this.email.trim().toLowerCase();
    this.password = this.password.trim();

    // ✅ Ver todos los usuarios antes de validar (depuración)
    await this.sqlite.getAllUsers();

    if (!this.email || !this.password) {
      (await this.toastCtrl.create({
        message: 'Completa ambos campos',
        duration: 2000,
        color: 'warning'
      })).present();
      return;
    }

    const valido = await this.sqlite.isValid(this.email, this.password);
    console.log('[Login] ¿Es válido?', valido);

    if (!valido) {
      (await this.toastCtrl.create({
        message: 'Credenciales inválidas',
        duration: 2000,
        color: 'danger'
      })).present();
      return;
    }

    const perfil = await this.sqlite.getPerfil(this.email);
    console.log('[Login] Perfil obtenido:', perfil);

    if (!perfil) {
      (await this.toastCtrl.create({
        message: 'No se encontró el perfil',
        duration: 2000,
        color: 'danger'
      })).present();
      return;
    }

    this.session.setPerfil(perfil.usuario, perfil.correo);

    (await this.toastCtrl.create({
      message: 'Inicio de sesión exitoso',
      duration: 1500,
      color: 'success'
    })).present();

    this.navCtrl.navigateRoot('/home');
  }
}
