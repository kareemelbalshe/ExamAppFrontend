import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  templateUrl: './take-exam.html',
  styleUrls: ['./take-exam.css']
})
export class TakeExam {
  constructor(private router: Router) {}

  // ngOnInit() {
  //   this.enterFullscreen();
  //   document.addEventListener('contextmenu', this.disableContextMenu);
  //   document.body.classList.add('no-select');
  // }

  // ngOnDestroy() {
  //   document.removeEventListener('contextmenu', this.disableContextMenu);
  //   document.body.classList.remove('no-select');
  // }

  // disableContextMenu = (event: MouseEvent) => {
  //   event.preventDefault();
  // };

  // enterFullscreen() {
  //   const elem = document.documentElement;
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if ((<any>elem).webkitRequestFullscreen) {
  //     (<any>elem).webkitRequestFullscreen();
  //   } else if ((<any>elem).msRequestFullscreen) {
  //     (<any>elem).msRequestFullscreen();
  //   }
  // }

  // submitExam() {
  //   document.exitFullscreen();
  //   this.router.navigate(['/exam-result']);
  // }

  // @HostListener('document:keydown', ['$event'])
  // onKeydown(event: KeyboardEvent) {
  //   if (['Escape', 'F11'].includes(event.key)) {
  //     event.preventDefault();
  //   }
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // preventReload(event: BeforeUnloadEvent) {
  //   event.preventDefault();
  //   event.returnValue = false;
  // }
}
