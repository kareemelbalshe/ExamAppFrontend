import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  title = '';
  message = '';
  callback: () => void = () => {};

  show(title: string, message: string, onConfirm: () => void) {
    this.title = title;
    this.message = message;
    this.callback = onConfirm;
    this.visible.set(true);
  }

  confirm() {
    this.callback();
    this.visible.set(false);
  }

  cancel() {
    this.visible.set(false);
  }
}
