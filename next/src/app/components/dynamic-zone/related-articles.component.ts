import { Component, Input } from '@angular/core';
import { BlogCardVerticalComponent } from '../blog-card.component';

@Component({
  selector: 'app-related-articles',
  standalone: true,
  imports: [BlogCardVerticalComponent],
  template: `
    <div class="mt-12 pb-20">
      <h2 class="text-2xl font-bold text-neutral-200 mb-10">{{ heading }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        @for (article of articles; track article.title) {
          <app-blog-card-vertical [article]="article" [locale]="locale" />
        }
      </div>
    </div>
  `,
})
export class RelatedArticlesComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() articles: any[] = [];
  @Input() locale = 'en';
}
