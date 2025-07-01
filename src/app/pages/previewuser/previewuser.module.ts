import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewuserPageRoutingModule } from './previewuser-routing.module';

import { PreviewuserPage } from './previewuser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewuserPageRoutingModule
  ],
  declarations: [PreviewuserPage]
})
export class PreviewuserPageModule {}
