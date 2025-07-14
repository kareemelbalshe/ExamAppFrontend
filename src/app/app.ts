import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Confirm } from "./shared/confirm/confirm";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    Header,
    Footer,

    Confirm

  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected title = 'Exam System';
}
