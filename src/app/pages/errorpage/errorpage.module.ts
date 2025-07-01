import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorpagePageRoutingModule } from './errorpage-routing.module';

import { ErrorpagePage } from './errorpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorpagePageRoutingModule
  ],
  declarations: [ErrorpagePage]
})
export class ErrorpagePageModule {}
