import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false,
})
export class StartPage implements OnInit {
  bubbles: any[] = [];

  ngOnInit() {
    this.generateBubbles(20);
  }

  generateBubbles(count: number) {
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        left: Math.random() * 100 + '%',
        size: 10 + Math.random() * 30 + 'px',
        delay: Math.random() * 10 + 's',
        duration: 4 + Math.random() * 3 + 's',
        opacity: 0.1 + Math.random() * 0.4
      });
    }
  }
}
