// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';

// SQLite y servicios
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SessionService } from 'src/app/services/session.service';

// ✅ AngularFire compat
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // ✅ Necesario
    AngularFirestoreModule // ✅ Firestore compat
  ],
  providers: [
    WebView,
    SQLite,
    SqliteService,
    SessionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
