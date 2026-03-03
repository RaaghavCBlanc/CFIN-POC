import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogLayoutComponent } from '../../components/blog-layout.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [BlogLayoutComponent],
  template: `
    @if (article) {
      <app-blog-layout [article]="article" [locale]="locale" />
    } @else if (notFound) {
      <div class="flex items-center justify-center h-96 text-white text-xl">Blog not found</div>
    }
  `,
})
export class BlogDetailComponent implements OnInit {
  article: any = null;
  locale = 'en';
  notFound = false;

  private route = inject(ActivatedRoute);
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
      const [article] = await this.strapiService.fetchCollectionType<any[]>('articles', {
        filters: { slug: { $eq: slug } },
        locale: this.locale,
      });

      if (!article) {
        this.notFound = true;
        return;
      }

      this.article = article;

      if (article?.seo) {
        this.seoService.updateMeta(article.seo);
      }

      const localizedSlugs = article?.localizations?.reduce(
        (acc: Record<string, string>, loc: any) => {
          acc[loc.locale] = loc.slug;
          return acc;
        },
        { [this.locale]: slug }
      ) || {};
      this.slugService.setLocalizedSlugs(localizedSlugs);
    } catch (error) {
      console.error('Failed to load article:', error);
      this.notFound = true;
    }
  }
}
