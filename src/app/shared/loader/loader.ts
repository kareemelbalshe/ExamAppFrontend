import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
      transition(':leave', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css']
})
export class Loader {
  @Input() loading: boolean = false;
}
