import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class Toast {
  message = '';
  type: ToastType = 'info';
  icon = '';
  visible = false;
  private queue: { msg: string; type: ToastType; duration: number }[] = [];
  private isShowing = false;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.toastService.register(this);
  }

  show(msg: string, type: ToastType = 'info', duration = 3000) {
    this.queue.push({ msg, type, duration });
    if (!this.isShowing) this.next();
  }

  next() {
    if (this.queue.length === 0) return;
    const { msg, type, duration } = this.queue.shift()!;
    this.message = msg;
    this.type = type;
    this.icon = this.getIcon(type);
    this.visible = true;
    this.isShowing = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.visible = false;
      this.isShowing = false;
      this.cdr.detectChanges();
      setTimeout(() => this.next(), 300);
    }, duration);
  }

  close() {
    this.visible = false;
    this.isShowing = false;
    setTimeout(() => this.next(), 200);
  }

  getIcon(type: ToastType) {
    switch (type) {
      case 'success': return '✔️';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': default: return 'ℹ️';
    }
  }

  isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }
}
