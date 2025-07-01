import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewuserPage } from './previewuser.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewuserPageRoutingModule {}
