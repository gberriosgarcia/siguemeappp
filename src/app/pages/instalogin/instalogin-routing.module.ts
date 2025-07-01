import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstaloginPage } from './instalogin.page';

const routes: Routes = [
  {
    path: '',
    component: InstaloginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstaloginPageRoutingModule {}
