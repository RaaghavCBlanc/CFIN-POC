import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContainerComponent } from '../../components/container/container.component';
import { AmbientColorComponent } from '../../components/decorations/ambient-color.component';
import { DynamicZoneManagerComponent } from '../../components/dynamic-zone/manager.component';
import { SingleProductComponent } from '../../components/products/single-product.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ContainerComponent,
    AmbientColorComponent,
    DynamicZoneManagerComponent,
    SingleProductComponent,
  ],
  template: `
    <div class="relative overflow-hidden w-full">
      <app-ambient-color />
      <app-container className="py-20 md:py-40">
        @if (product) {
          <app-single-product
            [product]="product"
            [locale]="locale"
            [addToCartText]="addToCartText"
            [buyNowText]="buyNowText"
          />
          @if (product?.dynamic_zone) {
            <app-dynamic-zone-manager
              [dynamicZone]="product.dynamic_zone"
              [locale]="locale"
            />
          }
        }
      </app-container>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  locale = 'en';
  addToCartText?: string;
  buyNowText?: string;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private strapiService = inject(StrapiService);
  private slugService = inject(SlugService);
  private seoService = inject(SeoService);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      const parentParams = this.route.parent?.snapshot.paramMap;
      this.locale = parentParams?.get('locale') || 'en';
      this.loadData(slug);
    });
  }

  private async loadData(slug: string) {
    try {
      const [[product], globalData] = await Promise.all([
        this.strapiService.fetchCollectionType<any[]>('products', {
          filters: { slug: { $eq: slug } },
          locale: this.locale,
        }),
        this.strapiService.fetchSingleType('global', { locale: this.locale }),
      ]);

      if (!product) {
        this.router.navigate(['/', this.locale, 'products']);
        return;
      }

      this.product = product;
      this.addToCartText = globalData?.add_to_cart;
      this.buyNowText = globalData?.buy_now;

      if (product?.seo) {
        this.seoService.updateMeta(product.seo);
      }

      const localizedSlugs = product?.localizations?.reduce(
        (acc: Record<string, string>, loc: any) => {
          acc[loc.locale] = loc.slug;
          return acc;
        },
        { [this.locale]: slug }
      ) || {};
      this.slugService.setLocalizedSlugs(localizedSlugs);
    } catch (error) {
      console.error('Failed to load product:', error);
    }
  }
}
