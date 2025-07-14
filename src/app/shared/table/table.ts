import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css']
})
export class Table implements OnChanges {
  @Input() columns: { label: string; field: string; pipe?: string }[] = [];
  @Input() data: any[] = [];
  @Input() actions: { icon: string; tooltip?: string; type: string; color?: string }[] = [];
  @Input() loading: boolean = false;
  @Input() striped: boolean = false;
  @Input() hoverable: boolean = true;
  @Input() caption: string = '';
  @Input() itemsPerPage: number = 5;

  @Output() actionClick = new EventEmitter<{ type: string; row: any }>();

  currentPage: number = 1;
  private document = inject(DOCUMENT);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('🔍 Table received data:', this.data);
      console.log('🔍 Table data length:', this.data?.length);
      console.log('🔍 Table columns:', this.columns);
      console.log('🔍 Paginated data:', this.paginatedData);
      console.log('🔍 Loading state:', this.loading);
    }
  }

  get isDarkMode(): boolean {
    return this.document.body.classList.contains('dark-mode');
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const result = this.data.slice(start, start + this.itemsPerPage);
    console.log('🔍 Paginated data calculation:', {
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      start: start,
      dataLength: this.data.length,
      resultLength: result.length,
      result: result
    });
    return result;
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  handleActionClick(type: string, row: any) {
    this.actionClick.emit({ type, row });
  }
}