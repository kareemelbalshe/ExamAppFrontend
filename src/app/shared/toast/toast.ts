import { Component, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Toast {
  message = '';
  type: ToastType = 'info';
  icon = '';
  visible = false;
  isDark = false;
  private queue: { msg: string; type: ToastType; duration: number }[] = [];
  private isShowing = false;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.toastService.register(this);
    this.checkDarkMode();
  }

  show(msg: string, type: ToastType = 'info', duration = 3000) {
    this.queue.push({ msg, type, duration });
    if (!this.isShowing) {
      this.next();
    }
  }

  private checkDarkMode() {
    this.isDark = document.body.classList.contains('dark-mode');
  }

  next() {
    if (this.queue.length === 0) return;

    const { msg, type, duration } = this.queue.shift()!;

    this.ngZone.run(() => {
      this.message = msg;
      this.type = type;
      this.icon = this.getIcon(type);
      this.checkDarkMode();
      this.visible = true;
      this.isShowing = true;
      this.cdr.markForCheck();
    });

    setTimeout(() => {
      this.ngZone.run(() => {
        this.visible = false;
        this.isShowing = false;
        this.cdr.markForCheck();

        setTimeout(() => this.next(), 300);
      });
    }, duration);
  }

  close() {
    this.ngZone.run(() => {
      this.visible = false;
      this.isShowing = false;
      this.cdr.markForCheck();

      setTimeout(() => this.next(), 200);
    });
  }

  getIcon(type: ToastType) {
    switch (type) {
      case 'success': return '✔️';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': default: return 'ℹ️';
    }
  }
}
