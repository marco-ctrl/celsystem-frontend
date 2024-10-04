import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { Link } from '../../../interfaces/links.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './paginator.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent { 
  
  public prevPageUrl = input<String | null | undefined>();
  public nextPageUrl = input<String | null | undefined>();
  public links = input<Link[]>();
  @Output() pageChange = new EventEmitter<number>();


  onPageClick(url: String | null | undefined) {
    if (url) {
      const page = parseInt(url.split('page=')[1], 10);
      this.pageChange.emit(page);
    }
  }
}
