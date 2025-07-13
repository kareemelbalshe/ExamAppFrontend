import { Component } from '@angular/core';
import { Footer } from "../../layout/footer/footer";
import { Header } from "../../layout/header/header";

@Component({
  selector: 'app-home',
  imports: [Footer, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
