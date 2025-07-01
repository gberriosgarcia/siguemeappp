import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';

// Plugins y servicios
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SqliteService } from 'src/app/services/sqlite.service';
import { SessionService } from 'src/app/services/session.service';

@NgModule({
  declarations: [AppComponent], // ⬅️ necesario para registrar el componente raíz
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    WebView,
    SQLite,
    SqliteService,
    SessionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent] // ⬅️ necesario para iniciar la app
})
export class AppModule {}
