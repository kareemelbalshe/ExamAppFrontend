import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Confirm } from "../../shared/confirm/confirm";
import { Toast } from "../../shared/toast/toast";

@Component({
  selector: 'app-admin-dashboard',
  imports: [SidebarComponent, RouterOutlet, Confirm, Toast],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {

}
