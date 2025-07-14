import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
<<<<<<< Updated upstream
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
=======
import { Confirm } from "./shared/confirm/confirm";
// import { Header } from './layout/header/header';
// import { Footer } from './layout/footer/footer';
>>>>>>> Stashed changes

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
<<<<<<< Updated upstream
    Header,
    Footer,
  ],
=======
    Confirm
],
>>>>>>> Stashed changes
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Exam System';
}
