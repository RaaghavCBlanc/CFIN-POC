import { Component, Input } from '@angular/core';
import { ProductItemsComponent } from '../products/product-items.component';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [ProductItemsComponent],
  template: `
    <div class="mt-10">
      <app-product-items
        [heading]="heading"
        [sub_heading]="sub_heading"
        [products]="products"
        [locale]="locale"
      />
    </div>
  `,
})
export class RelatedProductsComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() products: any[] = [];
  @Input() locale = 'en';
}
