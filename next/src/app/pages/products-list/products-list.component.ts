import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '../../components/container/container.component';
import { AmbientColorComponent } from '../../components/decorations/ambient-color.component';
import { FeatureIconContainerComponent } from '../../components/dynamic-zone/features/feature-icon-container.component';
import { HeadingComponent } from '../../components/elements/heading.component';
import { SubheadingComponent } from '../../components/elements/subheading.component';
import { FeaturedComponent } from '../../components/products/featured.component';
import { ProductItemsComponent } from '../../components/products/product-items.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    ContainerComponent,
    AmbientColorComponent,
    FeatureIconContainerComponent,
    HeadingComponent,
    SubheadingComponent,
    FeaturedComponent,
    ProductItemsComponent,
  ],
  template: `
    <div class="relative overflow-hidden w-full">
      <app-ambient-color />
      <app-container className="pt-40 pb-40">
        <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/><path d="M9 11V6"/><path d="M9 8.5h6"/></svg>
        </app-feature-icon-container>
        <app-heading as="h1" className="pt-4">{{ pageData?.heading }}</app-heading>
        <app-subheading className="max-w-3xl mx-auto">{{ pageData?.sub_heading }}</app-subheading>
        
        @if (featuredProducts.length) {
          <app-featured
            [products]="featuredProducts"
            [locale]="locale"
            [heading]="pageData?.featured_heading"
            [sub_heading]="pageData?.featured_sub_heading"
          />
        }

        @if (products.length) {
          <app-product-items
            [products]="products"
            [locale]="locale"
            [heading]="pageData?.popular_heading"
            [sub_heading]="pageData?.popular_sub_heading"
          />
        }
      </app-container>
    </div>
  `,
})
export class ProductsListComponent implements OnInit {
  pageData: any = null;
  products: any[] = [];
  featuredProducts: any[] = [];
  locale = 'en';

  private route = inject(ActivatedRoute);
  private strapiService = inject(StrapiService);
  private slugService = inject(SlugService);
  private seoService = inject(SeoService);

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.locale = params.get('locale') || 'en';
      this.loadData();
    });
  }

  private async loadData() {
    try {
      const [pageData, products] = await Promise.all([
        this.strapiService.fetchSingleType('product-page', { locale: this.locale }),
        this.strapiService.fetchCollectionType<any[]>('products', { locale: this.locale }),
      ]);

      this.pageData = pageData;
      this.products = products;
      this.featuredProducts = products.filter((p: any) => p.featured);

      if (pageData?.seo) {
        this.seoService.updateMeta(pageData.seo);
      }

      const localizedSlugs = pageData?.localizations?.reduce(
        (acc: Record<string, string>, loc: any) => {
          acc[loc.locale] = 'products';
          return acc;
        },
        { [this.locale]: 'products' }
      ) || {};
      this.slugService.setLocalizedSlugs(localizedSlugs);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }
}
