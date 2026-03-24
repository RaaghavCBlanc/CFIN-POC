import { Component, Input, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { format, formatDistanceToNow } from 'date-fns';
import { truncate } from '../utils/utils';

@Component({
  selector: 'app-blog-post-rows',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="w-full">
      <!-- Search (right-aligned) -->
      <div class="flex justify-end mb-6">
        <input
          type="text"
          [value]="search()"
          (input)="onSearch($event)"
          placeholder="Search articles"
          class="text-sm w-full sm:w-72 px-3 py-1.5 rounded border border-gray-300 focus:ring-1 focus:ring-[#7a9e8e] focus:outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      <div class="divide-y divide-gray-200">
        @if (filteredResults().length === 0) {
          <p class="text-gray-400 text-center py-8">No results found</p>
        } @else {
          @for (article of filteredResults(); track article.slug + $index) {
            <div [class]="getRowClass(article)">
              <!-- Title row with CFIN icon -->
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-[#7a9e8e] flex items-center justify-center">
                  <span class="text-white text-xs font-bold">C</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <a
                      [routerLink]="'/' + locale + '/blog/' + article.slug"
                      class="text-[#2a6496] text-base font-semibold hover:underline leading-snug"
                    >
                      {{ article.title }}
                    </a>
                    @if (article.pin) {
                      <span class="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                        Pinned
                      </span>
                    }
                  </div>
                  <!-- Author & date row -->
                  <div class="flex items-center justify-between mt-1">
                    <p class="text-xs text-gray-500">
                      By <span class="text-[#2a6496]">Community Manager</span>
                      <span class="ml-1">posted {{ relativeDate(article.publishedAt) }}</span>
                    </p>
                    <span class="text-xs text-gray-400 hidden sm:inline">Be the first person to like this</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="mt-3 pl-11">
                <p class="text-sm text-gray-700 leading-relaxed">
                  {{ truncateText(article.description, 500) }}
                </p>
              </div>

              <!-- Footer: categories + comments badge -->
              <div class="flex items-center justify-between mt-3 pl-11">
                <div class="flex gap-2 flex-wrap">
                  @for (category of article.categories || []; track $index) {
                    <span class="text-xs text-white px-2 py-0.5 rounded bg-gray-600 capitalize">
                      {{ category.name }}
                    </span>
                  }
                </div>
                <span class="text-xs text-white bg-gray-500 rounded px-2 py-0.5">0 comments</span>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class BlogPostRowsComponent implements OnChanges {
  @Input() articles: any[] = [];
  @Input() locale = 'en';

  search = signal('');
  truncateText = truncate;

  private allArticles = signal<any[]>([]);

  filteredResults = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.allArticles();
    return this.allArticles().filter((article: any) =>
      article.title?.toLowerCase().includes(term)
    );
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['articles']) {
      this.allArticles.set(this.articles || []);
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
  }

  getRowClass(article: any): string {
    const baseClass = 'py-6';
    const pinnedClass = 'rounded-md border border-amber-200 bg-amber-50/50 px-3';
    return article?.pin ? `${baseClass} ${pinnedClass}` : baseClass;
  }

  relativeDate(dateStr: string): string {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: false }) + ' ago';
    } catch {
      return dateStr;
    }
  }

  formatDate(dateStr: string): string {
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  }
}
