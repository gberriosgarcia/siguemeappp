import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-instalogin',
  templateUrl: './instalogin.page.html',
  styleUrls: ['./instalogin.page.scss'],
  standalone: false,

})
export class InstaloginPage {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}