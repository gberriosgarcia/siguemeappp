import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
  
})
export class RegisterPage implements OnInit {
  registroForm!: FormGroup;
  hoy = new Date().toISOString().split('T')[0];
  bubbles: any[] = [];
  registroExitoso = false;

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private sqlite: SqliteService
  ) {}

  ngOnInit() {
    this.registroForm = this.fb.group(
      {
        usuario: ['', [Validators.required, Validators.minLength(4)]],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
      },
      { validators: this.matchPasswords('contrasena', 'confirmarContrasena') }
    );

    this.generateBubbles(20);
  }

  private matchPasswords(pass: string, confirm: string): ValidatorFn {
    return (form: AbstractControl) => {
      if (form.get(pass)?.value !== form.get(confirm)?.value) {
        form.get(confirm)?.setErrors({ noCoincide: true });
      }
      return null;
    };
  }

  async onSubmit() {
    if (this.registroForm.invalid) return;

    const { usuario, correo, contrasena, fechaNacimiento } = this.registroForm.value;
    await this.sqlite.addUser(usuario, correo, contrasena, fechaNacimiento);
    this.registroExitoso = true;

    (await this.toastCtrl.create({
      message: '¡Registro exitoso!',
      duration: 2000,
      color: 'success',
    })).present();

    this.registroForm.reset();
  }

  private generateBubbles(count: number) {
    this.bubbles = Array.from({ length: count }).map(() => ({
      left: Math.random() * 100 + '%',
      size: 10 + Math.random() * 30 + 'px',
      delay: Math.random() * 10 + 's',
      duration: 4 + Math.random() * 3 + 's',
      opacity: 0.1 + Math.random() * 0.4,
    }));
  }
}