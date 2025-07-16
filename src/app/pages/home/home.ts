import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Exam } from '../../models/exam';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CustomInput } from '../../shared/custom-input/custom-input';
import { Card } from './components/card/card';
import { Loader } from "../../shared/loader/loader";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomInput, Card, Loader],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private baseUrl = environment.baseUrl;
  exams: Exam[] = [];
  loading: boolean = false;
  searchControl = new FormControl('');
  sortBy: string = 'createdAt';
  isDesc: boolean = true;
  page: number = 1;
  pageSize: number = 8;
  totalCount: number = 0;
  isActive: boolean = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }


  darkMode: boolean = false;
  ngOnInit(): void {
    this.darkMode = localStorage.getItem('dark') === 'true';

    window.addEventListener('themeChanged', this.handleThemeChange);

    this.searchControl.valueChanges.subscribe(() => {
      this.page = 1;
      this.getExams();
    });

    this.getExams();
  }

  get activeExams(): Exam[] {
    return this.exams.filter(exam => exam.isActive);
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.getExams();
    }
  }

  getExams(): void {
    this.loading = true;
    const searchName = this.searchControl.value ?? '';

    const params = new URLSearchParams({
      name: searchName,
      sortBy: this.sortBy,
      isDesc: this.isDesc.toString(),
      page: this.page.toString(),
      pageSize: this.pageSize.toString(),
      isActive: this.isActive.toString(),
    });

    const url = `${this.baseUrl}/Exam?${params.toString()}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        const dataLayer = res?.data;
        this.exams = dataLayer?.data?.$values || [];
        this.totalCount = dataLayer?.totalCount || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching exams:', err);
      },
    });
  }




  ngOnDestroy() {
    window.removeEventListener('themeChanged', this.handleThemeChange);
  }

  handleThemeChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    this.darkMode = customEvent.detail.dark;
  };
}
