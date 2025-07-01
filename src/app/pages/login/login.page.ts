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

  /* ---------------- Ciclo de vida ------------------- */
  ngOnInit(): void {
    this.generateBubbles(20);
  }

  /* --------------- Utilidades UI ------------------- */
  private generateBubbles(count: number): void {
    this.bubbles = Array.from({ length: count }).map(() => ({
      left: Math.random() * 100 + '%',
      size: 10 + Math.random() * 30 + 'px',
      delay: Math.random() * 10 + 's',
      duration: 4 + Math.random() * 3 + 's',
      opacity: 0.1 + Math.random() * 0.4
    }));
  }

  /* -------------------- Login ---------------------- */
  async login(): Promise<void> {
    /* Validaciones rápidas */
    if (!this.email || !this.password) {
      (await this.toastCtrl.create({
        message: 'Completa ambos campos',
        duration: 2000,
        color: 'warning'
      })).present();
      return;
    }

    /* 1) Verificar credenciales */
    const valido = await this.sqlite.isValid(this.email, this.password);

    (await this.toastCtrl.create({
      message: valido ? 'Inicio de sesión exitoso' : 'Credenciales inválidas',
      duration: 2000,
      color: valido ? 'success' : 'danger'
    })).present();

    if (!valido) return;

    /* 2) Obtener perfil y guardarlo en la sesión */
    const perfil = await this.sqlite.getPerfil(this.email);
    if (perfil) {
      this.session.setPerfil(perfil.usuario, perfil.correo);
    }

    /* 3) Navegar a la página principal */
    this.navCtrl.navigateRoot('/home');
  }
}