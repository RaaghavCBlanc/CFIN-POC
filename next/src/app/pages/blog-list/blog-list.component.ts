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

        <!-- Category + Sort dropdowns -->
        <div class="flex justify-end gap-3 mb-4 flex-wrap">
          <select
            [value]="selectedCategory()"
            (change)="onCategoryChange($event)"
            class="text-sm border border-gray-300 rounded px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#7a9e8e] min-w-44"
          >
            <option [value]="ALL_CATEGORIES_VALUE">{{ ALL_CATEGORIES_LABEL }}</option>
            @for (category of availableCategories(); track category.value) {
              <option [value]="category.value">{{ category.label }}</option>
            }
          </select>

          <select
            [value]="sortOrder()"
            (change)="onSortChange($event)"
            class="text-sm border border-gray-300 rounded px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#7a9e8e] min-w-32"
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
  readonly ALL_CATEGORIES_VALUE = 'all';
  readonly ALL_CATEGORIES_LABEL = 'All Categories';

  pageData: any = null;
  allArticles = signal<any[]>([]);
  selectedCategory = signal<string>(this.ALL_CATEGORIES_VALUE);
  featuredItems: any[] = [];
  bannerImageUrl: string | null = null;
  locale = 'en';

  sortOrder = signal<string>('most_recent');

  availableCategories = computed(() => {
    const categoryMap = new Map<string, string>();

    for (const article of this.allArticles()) {
      for (const category of article?.categories || []) {
        const label = (category?.name || '').trim();
        const normalized = this.normalizeCategoryName(label);
        if (!normalized || categoryMap.has(normalized)) {
          continue;
        }

        categoryMap.set(normalized, label);
      }
    }

    return [...categoryMap.entries()]
      .sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }))
      .map(([value, label]) => ({ value, label }));
  });

  categoryFilteredArticles = computed(() => {
    const selectedCategory = this.selectedCategory();

    if (selectedCategory === this.ALL_CATEGORIES_VALUE) {
      return this.allArticles();
    }

    return this.allArticles().filter(article =>
      (article?.categories || []).some((category: any) =>
        this.normalizeCategoryName(category?.name) === selectedCategory
      )
    );
  });

  sortedArticles = computed(() => {
    const arts = [...this.categoryFilteredArticles()];
    const pinned = arts
      .filter(article => article?.pin === true)
      .sort((a, b) => this.compareByMostRecent(a, b));
    const regular = arts.filter(article => article?.pin !== true);

    if (this.sortOrder() === 'oldest') {
      regular.sort((a, b) => this.compareByOldest(a, b));
    } else {
      regular.sort((a, b) => this.compareByMostRecent(a, b));
    }

    return [...pinned, ...regular];
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

  onCategoryChange(event: Event) {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  private compareByMostRecent(a: any, b: any): number {
    return this.getPublishedTimestamp(b) - this.getPublishedTimestamp(a);
  }

  private compareByOldest(a: any, b: any): number {
    return this.getPublishedTimestamp(a) - this.getPublishedTimestamp(b);
  }

  private getPublishedTimestamp(article: any): number {
    const publishedAt = Date.parse(article?.publishedAt ?? '');
    if (!Number.isNaN(publishedAt)) {
      return publishedAt;
    }

    const createdAt = Date.parse(article?.createdAt ?? '');
    if (!Number.isNaN(createdAt)) {
      return createdAt;
    }

    return 0;
  }

  private normalizeCategoryName(name: string | null | undefined): string {
    return (name || '').trim().toLocaleLowerCase();
  }

  private ensureSelectedCategoryIsAvailable(articles: any[]) {
    const selected = this.selectedCategory();
    if (selected === this.ALL_CATEGORIES_VALUE) {
      return;
    }

    const availableCategories = new Set<string>();
    for (const article of articles) {
      for (const category of article?.categories || []) {
        const normalized = this.normalizeCategoryName(category?.name);
        if (normalized) {
          availableCategories.add(normalized);
        }
      }
    }

    if (!availableCategories.has(selected)) {
      this.selectedCategory.set(this.ALL_CATEGORIES_VALUE);
    }
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
        }, this.authService.isAuthenticated()),
      ]);

      this.pageData = pageData;
      const visibleArticles = this.authService.isAuthenticated()
        ? (articles || [])
        : (articles || []).filter((article: any) => !article?.premium);
      this.allArticles.set(visibleArticles);
      this.ensureSelectedCategoryIsAvailable(visibleArticles);
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
