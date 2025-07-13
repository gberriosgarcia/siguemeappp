// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Ionic Native / Capacitor plugins
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { Camera }  from '@awesome-cordova-plugins/camera/ngx';
import { SQLite }  from '@awesome-cordova-plugins/sqlite/ngx';

// Servicios propios
import { SqliteService }  from './services/sqlite.service';
import { SessionService } from './services/session.service';

// Firebase modular (AngularFire)
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase }     from '@angular/fire/database';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

  
  ],
  providers: [
    WebView,
    Camera,
    SQLite,
    SqliteService,
    SessionService,
      // ← Aquí inicializamos FirebaseApp y RTDB
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

