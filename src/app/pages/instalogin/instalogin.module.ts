import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstaloginPageRoutingModule } from './instalogin-routing.module';

import { InstaloginPage } from './instalogin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstaloginPageRoutingModule
  ],
  declarations: [InstaloginPage]
})
export class InstaloginPageModule {}
