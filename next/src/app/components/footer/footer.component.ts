import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { strapiImage } from '../../utils/utils';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <!-- Main Footer -->
    <footer class="bg-[#2d3748] text-gray-300">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          <!-- Column 1: Logo + Description + Social -->
          <div>
            @if (logoUrl) {
              <img [src]="logoUrl" alt="CFIN Logo" class="h-10 mb-4" />
            } @else {
              <span class="text-xl font-bold text-white">CFIN</span>
            }
            <p class="text-sm leading-relaxed mb-6">
              {{ data?.description || 'Canadian Financial Innovation Network' }}
            </p>
            <!-- Social Icons -->
            <div class="flex space-x-3">
              @for (social of data?.social_media_links; track social.text) {
                <a
                  [href]="social.URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  [title]="social.text"
                >
                  @if (getSocialIconUrl(social)) {
                    <img [src]="getSocialIconUrl(social)" [alt]="social.text" class="w-4 h-4" />
                  } @else {
                    <span class="text-xs text-white">{{ social.text?.charAt(0) }}</span>
                  }
                </a>
              }
            </div>
          </div>

          <!-- Dynamic Columns from footer_columns -->
          @for (column of data?.footer_columns; track column.heading) {
            <div>
              <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {{ column.heading }}
              </h4>
              <ul class="space-y-2">
                @for (link of column.links; track link.text) {
                  <li>
                    <a
                      [attr.href]="isExternal(link.URL) ? link.URL : null"
                      [routerLink]="isExternal(link.URL) ? null : '/' + locale + link.URL"
                      [attr.target]="isExternal(link.URL) ? '_blank' : null"
                      class="text-sm hover:text-white transition-colors"
                    >{{ link.text }}</a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
          <span>{{ data?.copyright || '\u00A9 2025 CFIN. All rights reserved.' }}</span>
          <div class="flex space-x-4 mt-2 sm:mt-0">
            @for (link of data?.policy_links; track link.text) {
              <a
                [attr.href]="isExternal(link.URL) ? link.URL : null"
                [routerLink]="isExternal(link.URL) ? null : '/' + locale + link.URL"
                class="hover:text-white transition-colors"
              >{{ link.text }}</a>
            }
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  @Input() data: any;
  @Input() locale = 'en';

  get logoUrl(): string | null {
    const img = this.data?.logo?.image;
    if (!img?.url) return null;
    return strapiImage(img.url);
  }

  isExternal(url: string): boolean {
    return url?.startsWith('http');
  }

  getSocialIconUrl(social: any): string | null {
    if (!social?.icon?.url) return null;
    return strapiImage(social.icon.url);
  }
}
