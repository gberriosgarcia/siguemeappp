import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-previewuser',
  templateUrl: './previewuser.page.html',
  styleUrls: ['./previewuser.page.scss'],
  standalone: false,
})
export class PreviewuserPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
segment = 'photos';

  photos = [
    'assets/jonny/jonny1.JPEG',
    'assets/jonny/jonny2.JPEG',
    'assets/jonny/jonny3.JPEG',
    'assets/jonny/jonny4.JPEG',
    'assets/jonny/jonny5.JPEG',
    'assets/jonny/jonny6.JPEG',
    'assets/jonny/jonny7.JPEG',
    'assets/jonny/jonny8.JPEG',
    'assets/jonny/jonny9.JPEG',
  ];

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }
}

