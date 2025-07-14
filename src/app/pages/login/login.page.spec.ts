// src/app/pages/login/login.page.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LoginPage } from './login.page';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SessionService } from 'src/app/services/session.service';

// Stubs para dependencias
class SqliteServiceStub {
  getAllUsers = jasmine.createSpy('getAllUsers').and.returnValue(Promise.resolve());
  isValid      = jasmine.createSpy('isValid');
  getPerfil    = jasmine.createSpy('getPerfil');
}
class SessionServiceStub {
  setPerfil = jasmine.createSpy('setPerfil');
}
class NavControllerStub {
  navigateRoot = jasmine.createSpy('navigateRoot');
}
class ToastControllerStub {
  create(opts: any) {
    return Promise.resolve({
      present: jasmine.createSpy('present'),
      ...opts
    });
  }
}

describe('LoginPage (prueba crítica)', () => {
  let component: LoginPage;
  let fixture:   ComponentFixture<LoginPage>;
  let sqlite:    SqliteServiceStub;
  let session:   SessionServiceStub;
  let nav:       NavControllerStub;
  let toastCtrl: ToastController;

  beforeEach(waitForAsync(() => {
    sqlite  = new SqliteServiceStub();
    session = new SessionServiceStub();
    nav     = new NavControllerStub();

    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: SqliteService, useValue: sqlite },
        { provide: SessionService, useValue: session },
        { provide: NavController, useValue: nav },
        { provide: ToastController, useClass: ToastControllerStub },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    toastCtrl = TestBed.inject(ToastController);
    spyOn(toastCtrl, 'create').and.callThrough();

    fixture.detectChanges();
  }));

  it('flujo de login exitoso: valida, guarda perfil y navega a /home', fakeAsync(() => {
    // 1) Datos de entrada
    component.email    = 'user@example.com';
    component.password = 'correctpass';

    // 2) Simula validación y perfil
    sqlite.isValid.and.returnValue(Promise.resolve(true));
    const perfilMock = { correo: 'user@example.com', usuario: 'User' };
    sqlite.getPerfil.and.returnValue(Promise.resolve(perfilMock));

    // 3) Ejecuta el método
    component.login();
    tick(); // getAllUsers
    tick(); // isValid
    tick(); // getPerfil

    // 4) Verificaciones
    expect(session.setPerfil)
      .toHaveBeenCalledWith('User', 'user@example.com');
    expect(toastCtrl.create)
      .toHaveBeenCalledWith({
        message: 'Inicio de sesión exitoso',
        duration: 1500,
        color: 'success'
      });
    expect(nav.navigateRoot)
      .toHaveBeenCalledWith('/home');
  }));
});
