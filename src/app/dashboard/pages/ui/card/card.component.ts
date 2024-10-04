import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Output, output } from '@angular/core';
import { Product } from '../../../../interfaces/product.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {

  public product = input.required<Product>();
  public onIncrementQuantity = output<number>();

  public incrementQuantity(): void{
    this.onIncrementQuantity.emit(this.product().quantity + 1);
  }

 }
