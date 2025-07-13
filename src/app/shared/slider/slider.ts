// import { Component, Input, HostListener } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-slider',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './slider.html',
//   styleUrls: ['./slider.css']
// })
// export class Slider {
//   @Input() slides: { title?: string; description?: string; image?: string }[] = [];
//   @Input() interval: number = 5000;
//   @Input() showIndicators: boolean = true;
//   @Input() showButtons: boolean = true;
//   @Input() height: string = '300px';

//   current = 0;
//   timer: any;

//   startX = 0;
//   endX = 0;

//   ngOnInit() {
//     this.startAutoSlide();
//   }

//   ngOnDestroy() {
//     clearInterval(this.timer);
//   }

//   startAutoSlide() {
//     this.timer = setInterval(() => this.next(), this.interval);
//   }

//   next() {
//     this.current = (this.current + 1) % this.slides.length;
//   }

//   prev() {
//     this.current = (this.current - 1 + this.slides.length) % this.slides.length;
//   }

//   goTo(index: number) {
//     this.current = index;
//   }

//   @HostListener('touchstart', ['$event'])
//   onTouchStart(event: TouchEvent) {
//     this.startX = event.touches[0].clientX;
//   }

//   @HostListener('touchend', ['$event'])
//   onTouchEnd(event: TouchEvent) {
//     this.endX = event.changedTouches[0].clientX;
//     const diff = this.startX - this.endX;
//     if (diff > 50) this.next();
//     else if (diff < -50) this.prev();
//   }

//   isDarkMode() {
//     return document.body.classList.contains('dark-mode');
//   }

// }
