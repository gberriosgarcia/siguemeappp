import { Component, OnInit } from '@angular/core';
import { ToastController }     from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { SqliteService }       from 'src/app/services/sqlite.service';

// Inicializa Firebase una sola vez con tu configuración
import { initializeApp } from 'firebase/app';
import { environment }   from 'src/environments/environment';
initializeApp(environment.firebaseConfig);

// Luego importamos los servicios del SDK puro
import { getAuth, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { getFirestore, doc, setDoc }                               from 'firebase/firestore';
import { getDatabase, ref, set }                                   from 'firebase/database';

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
    if (this.registroForm.invalid) {
      return;
    }

    const { usuario, correo, contrasena, fechaNacimiento } = this.registroForm.value;

    try {
      // 1. Registrar localmente en SQLite
      await this.sqlite.addUser(usuario, correo, contrasena, fechaNacimiento);
      console.log('[SQLite] Usuario registrado:', usuario, correo);

      // 2. Registrar en Firebase Authentication
      const auth = getAuth();
      const cred: UserCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = cred.user;
      if (!user || !user.email) {
        throw new Error('Usuario no autenticado');
      }

      // 3. Sanitizar el correo para usarlo como ID
      const sanitizedEmail = user.email.replace(/\./g, '_').replace(/@/g, '-at-');

      // 4. Registrar en Firestore (SDK puro)
      const firestore = getFirestore();
      await setDoc(
        doc(firestore, 'usuarios', sanitizedEmail),
        {
          usuario,
          correo,
          fechaNacimiento,
          registradoEn: new Date().toISOString()
        }
      );
      console.log('[Firestore SDK] Usuario registrado con ID personalizado');

      // 5. Registrar en Realtime Database (SDK puro)
      const db = getDatabase();
      await set(
        ref(db, `profiles/${sanitizedEmail}`),
        {
          nombre: usuario,
          correo,
          fechaNacimiento,
          avatar: '',
          fotos: []
        }
      );
      console.log('[Realtime DB SDK] Perfil guardado');

      // 6. Mostrar toast de éxito
      this.registroExitoso = true;
      (await this.toastCtrl.create({
        message: '¡Registro exitoso!',
        duration: 2000,
        color: 'success'
      })).present();

      this.registroForm.reset();
    } catch (error: any) {
      console.error('[Registro] Error:', error.code, error.message, error);
      (await this.toastCtrl.create({
        message: 'Error: ' + (error.message || 'Error desconocido'),
        duration: 3000,
        color: 'danger'
      })).present();
    }
  }

  private generateBubbles(count: number) {
    this.bubbles = Array.from({ length: count }).map(() => ({
      left: Math.random() * 100 + '%',
      size: 10 + Math.random() * 30 + 'px',
      delay: Math.random() * 10 + 's',
      duration: 4 + Math.random() * 3 + 's',
      opacity: 0.1 + Math.random() * 0.4
    }));
  }
}