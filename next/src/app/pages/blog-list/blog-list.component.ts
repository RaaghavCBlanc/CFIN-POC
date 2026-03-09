import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '../../components/container/container.component';
import { BlogPostRowsComponent } from '../../components/blog-post-rows.component';
import { StrapiService } from '../../services/strapi.service';
import { SlugService } from '../../services/slug.service';
import { SeoService } from '../../services/seo.service';
import { AuthService } from '../../services/auth.service';
import { strapiImage } from '../../utils/utils';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    ContainerComponent,
    BlogPostRowsComponent,
  ],
  template: `
    <div class="relative overflow-hidden">
      <!-- Teal Banner -->
      <div class="py-10 px-8" [style.background-color]="pageData?.banner_background_color || '#7a9e8e'">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <h1 class="text-3xl font-bold text-white">{{ pageData?.heading || 'Articles' }}</h1>
          @if (bannerImageUrl) {
            <img [src]="bannerImageUrl" alt="" class="h-16 md:h-20 object-contain" />
          }
        </div>
      </div>

      <app-container className="py-10">
        <!-- Featured Content -->
        @if (featuredItems.length) {
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Content</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              @for (item of featuredItems; track $index) {
                <a
                  [href]="item.URL"
                  [target]="item.open_newtab ? '_blank' : '_self'"
                  rel="noopener noreferrer"
                  class="block overflow-hidden rounded-md border border-gray-200 hover:shadow-md transition"
                >
                  @if (item.image?.url) {
                    <img [src]="getImageUrl(item.image.url)" [alt]="'Featured content'" class="w-full h-40 object-cover" />
                  }
                </a>
              }
            </div>
          </div>
        }

        <!-- CTA text -->
        @if (pageData?.cta_text) {
          <p class="text-sm text-gray-600 mb-6">
            {{ pageData.cta_text }}
            @if (pageData.cta_link) {
              <a [href]="pageData.cta_link" class="text-blue-600 underline hover:text-blue-800">here</a>.
            }
          </p>
        }

        <!-- Sort dropdown -->
        <div class="flex justify-end mb-4">
          <select
            [value]="sortOrder()"
            (change)="onSortChange($event)"
            class="text-sm border border-gray-300 rounded px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#7a9e8e]"
          >
            <option value="most_recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <!-- Article rows -->
        @if (sortedArticles().length) {
          <app-blog-post-rows [articles]="sortedArticles()" [locale]="locale" />
        }
      </app-container>
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  pageData: any = null;
  allArticles = signal<any[]>([]);
  featuredItems: any[] = [];
  bannerImageUrl: string | null = null;
  locale = 'en';

  sortOrder = signal<string>('most_recent');

  sortedArticles = computed(() => {
    const arts = [...this.allArticles()];
    if (this.sortOrder() === 'oldest') {
      arts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else {
      arts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    return arts;
  });

  private route = inject(ActivatedRoute);
  private strapiService = inject(StrapiService);
  private slugService = inject(SlugService);
  private seoService = inject(SeoService);
  private authService = inject(AuthService);

  getImageUrl(url: string): string {
    return strapiImage(url);
  }

  onSortChange(event: Event) {
    this.sortOrder.set((event.target as HTMLSelectElement).value);
  }

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
      const visibleArticles = this.authService.isAuthenticated()
        ? (articles || [])
        : (articles || []).filter((article: any) => !article?.premium);
      this.allArticles.set(visibleArticles);
      this.featuredItems = pageData?.featured_content_items || [];

      // Resolve banner image
      if (pageData?.banner_image?.url) {
        this.bannerImageUrl = strapiImage(pageData.banner_image.url);
      }

      // Default sort from CMS
      if (pageData?.sort_options) {
        this.sortOrder.set(pageData.sort_options);
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

