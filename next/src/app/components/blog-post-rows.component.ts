import { Component, Input, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { format } from 'date-fns';
import { truncate } from '../utils/utils';

@Component({
  selector: 'app-blog-post-rows',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="w-full py-20">
      <div class="flex sm:flex-row flex-col justify-between gap-4 items-center mb-10">
        <p class="text-2xl font-bold text-white">More Posts</p>
        <input
          type="text"
          [value]="search()"
          (input)="onSearch($event)"
          placeholder="Search articles"
          class="text-sm min-w-full sm:min-w-96 p-2 rounded-md bg-neutral-800 border-none focus:ring-0 focus:outline-none outline-none text-neutral-200 placeholder-neutral-400"
        />
      </div>

      <div class="divide-y divide-neutral-800">
        @if (filteredResults().length === 0) {
          <p class="text-neutral-400 text-center p-4">No results found</p>
        } @else {
          @for (article of filteredResults(); track article.slug + $index) {
            <a
              [routerLink]="'/' + locale + '/blog/' + article.slug"
              class="flex md:flex-row flex-col items-start justify-between md:items-center group py-4"
            >
              <div>
                <p class="text-neutral-300 text-lg font-medium group-hover:text-white transition duration-200">
                  {{ article.title }}
                </p>
                <p class="text-neutral-300 text-sm mt-2 max-w-xl group-hover:text-white transition duration-200">
                  {{ truncateText(article.description, 80) }}
                </p>
                <div class="flex gap-2 items-center my-4">
                  <p class="text-neutral-300 text-sm max-w-xl group-hover:text-white transition duration-200">
                    {{ formatDate(article.publishedAt) }}
                  </p>
                  <div class="h-1 w-1 rounded-full bg-neutral-800"></div>
                  <div class="flex gap-4 flex-wrap">
                    @for (category of article.categories || []; track $index) {
                      <p class="text-xs font-bold text-muted px-2 py-1 rounded-full bg-neutral-800 capitalize">
                        {{ category.name }}
                      </p>
                    }
                  </div>
                </div>
              </div>
            </a>
          }
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class BlogPostRowsComponent implements OnInit {
  @Input() articles: any[] = [];
  @Input() locale = 'en';

  search = signal('');
  truncateText = truncate;

  private allArticles: any[] = [];

  filteredResults = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.allArticles;
    return this.allArticles.filter((article: any) =>
      article.title?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.allArticles = this.articles || [];
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
  }

  formatDate(dateStr: string): string {
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr;
    }
  }
}
