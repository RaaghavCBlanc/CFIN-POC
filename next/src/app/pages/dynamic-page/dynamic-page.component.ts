import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContentComponent } from '../../shared/page-content.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [PageContentComponent],
  template: `
    @if (pageData) {
      <app-page-content [pageData]="pageData" />
    } @else if (notFound) {
      <div class="flex items-center justify-center h-96 text-white text-xl">Page not found</div>
    }
  `,
})
export class DynamicPageComponent implements OnInit {
  pageData: any = null;
  notFound = false;

  private route = inject(ActivatedRoute);
  private strapiService = inject(StrapiService);
  private slugService = inject(SlugService);
  private seoService = inject(SeoService);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      const parentParams = this.route.parent?.snapshot.paramMap;
      const locale = parentParams?.get('locale') || 'en';
      this.loadData(slug, locale);
    });
  }

  private async loadData(slug: string, locale: string) {
    try {
      const [pageData] = await this.strapiService.fetchCollectionType('pages', {
        filters: { slug: { $eq: slug }, locale },
      });

      if (!pageData) {
        this.notFound = true;
        return;
      }

      this.pageData = pageData;

      if (pageData?.seo) {
        this.seoService.updateMeta(pageData.seo);
      }

      const localizedSlugs = pageData?.localizations?.reduce(
        (acc: Record<string, string>, loc: any) => {
          acc[loc.locale] = loc.slug;
          return acc;
        },
        { [locale]: slug }
      ) || {};
      this.slugService.setLocalizedSlugs(localizedSlugs);
    } catch (error) {
      console.error('Failed to load page:', error);
      this.notFound = true;
    }
  }
}
