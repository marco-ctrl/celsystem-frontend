import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { CardComponent } from "../ui/card/card.component";
import { Product } from '../../../interfaces/product.interface';
import { interval, take, tap } from 'rxjs';

@Component({
  selector: 'app-input-ouput',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
  ],
  templateUrl: './input-ouput.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InputOuputComponent implements OnDestroy {

  public products = signal<Product[]>([
    {
      id: 1,
      name: 'product 1',
      quantity: 10
    },
    {
      id: 2,
      name: 'product 2',
      quantity: 20
    }
  ]);

  private intervalSubscription = interval(1000)
    .pipe(
      tap(() => {
        this.products.update((products) => [
          ...products,
          {
            id: products.length + 1,
            name: `product ${products.length + 1}`,
            quantity: 0,
          }
        ])
      }),
      take(7)
    )
    .subscribe();
  
  public updateProduct(product: Product, quantity: number){
    this.products.update((products) => 
      products.map((p) => (p.id === product.id ? { ...p, quantity } : p))
    )
  }

  ngOnDestroy(): void {
    this.intervalSubscription.unsubscribe();
  }


}
