import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContentComponent } from '../../shared/page-content.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageContentComponent],
  template: `
    @if (pageData) {
      <app-page-content [pageData]="pageData" />
    }
  `,
})
export class HomeComponent implements OnInit {
  pageData: any = null;

  private route = inject(ActivatedRoute);
  private strapiService = inject(StrapiService);
  private slugService = inject(SlugService);
  private seoService = inject(SeoService);

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      const locale = params.get('locale') || 'en';
      this.loadData(locale);
    });
  }

  private async loadData(locale: string) {
    try {
      const [pageData] = await this.strapiService.fetchCollectionType('pages', {
        filters: { slug: { $eq: 'homepage' }, locale },
      });

      this.pageData = pageData;

      if (pageData?.seo) {
        this.seoService.updateMeta(pageData.seo);
      }

      const localizedSlugs = pageData?.localizations?.reduce(
        (acc: Record<string, string>, loc: any) => {
          acc[loc.locale] = '';
          return acc;
        },
        { [locale]: '' }
      ) || {};
      this.slugService.setLocalizedSlugs(localizedSlugs);
    } catch (error) {
      console.error('Failed to load home page:', error);
    }
  }
}
