// import { StudentService } from './../../services/student/student';
import { StudentService } from './../../services/student/student';
import { ResultService } from './../../services/result/result.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Result, ResultWithDetails } from '../../models/result';
import { Student } from '../../models/user';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-show-result',
  imports: [CommonModule,],
  templateUrl: './show-result.html',
  styleUrl: './show-result.css',
  
})
export class ShowResult {

  constructor(){}
}

