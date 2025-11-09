import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Link } from '../../auth/interfaces/links.interface';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
  ],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() lastPage: number = 1;
  @Input() links: Link[] = [];
  @Input() prevPageUrl: string | null = null;
  @Input() nextPageUrl: string | null = null;

  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number) {
    if (page > 0 && page <= this.lastPage) {
      this.pageChange.emit(page);
    }
  }

  changePageByUrl(url: string | null) {
    if (url) {
      const page = this.extractPageNumber(url);
      if (page) {
        this.pageChange.emit(page);
      }
    }
  }

  extractPageNumber(url: string): number | null {
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

 }
