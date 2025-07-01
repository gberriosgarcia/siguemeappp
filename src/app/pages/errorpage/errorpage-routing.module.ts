import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorpagePage } from './errorpage.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorpagePageRoutingModule {}
