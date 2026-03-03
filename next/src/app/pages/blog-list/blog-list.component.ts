import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '../../components/container/container.component';
import { AmbientColorComponent } from '../../components/decorations/ambient-color.component';
import { FeatureIconContainerComponent } from '../../components/dynamic-zone/features/feature-icon-container.component';
import { HeadingComponent } from '../../components/elements/heading.component';
import { SubheadingComponent } from '../../components/elements/subheading.component';
import { BlogCardComponent } from '../../components/blog-card.component';
import { BlogPostRowsComponent } from '../../components/blog-post-rows.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    ContainerComponent,
    AmbientColorComponent,
    FeatureIconContainerComponent,
    HeadingComponent,
    SubheadingComponent,
    BlogCardComponent,
    BlogPostRowsComponent,
  ],
  template: `
    <div class="relative overflow-hidden py-20 md:py-0">
      <app-ambient-color />
      <app-container className="flex flex-col items-center justify-between pb-20">
        <div class="relative z-20 py-10 md:pt-40">
          <app-feature-icon-container className="flex justify-center items-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
          </app-feature-icon-container>
          <app-heading as="h1" className="mt-4">{{ pageData?.heading }}</app-heading>
          <app-subheading className="max-w-3xl mx-auto">{{ pageData?.sub_heading }}</app-subheading>
        </div>

        @if (firstArticle) {
          <app-blog-card [article]="firstArticle" [locale]="locale" />
        }

        @if (restArticles.length) {
          <app-blog-post-rows [articles]="restArticles" [locale]="locale" />
        }
      </app-container>
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  pageData: any = null;
  firstArticle: any = null;
  restArticles: any[] = [];
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
      const [pageData, articles] = await Promise.all([
        this.strapiService.fetchSingleType('blog-page', { locale: this.locale }),
        this.strapiService.fetchCollectionType<any[]>('articles', {
          filters: { locale: { $eq: this.locale } },
        }),
      ]);

      this.pageData = pageData;
      if (articles.length) {
        this.firstArticle = articles[0];
        this.restArticles = articles.slice(1);
      }

      if (pageData?.seo) {
        this.seoService.updateMeta(pageData.seo);
      }

      const localizedSlugs = pageData?.localizations?.reduce(
        (acc: Record<string, string>, loc: any) => {
          acc[loc.locale] = 'blog';
          return acc;
        },
        { [this.locale]: 'blog' }
      ) || {};
      this.slugService.setLocalizedSlugs(localizedSlugs);
    } catch (error) {
      console.error('Failed to load blog list:', error);
    }
  }
}
