import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor, RouterLink, LogoComponent],
  template: `
    <div class="relative">
      <div class="border-t border-neutral-900 px-8 pt-20 pb-32 relative bg-primary">
        <div class="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start">
          <div>
            <div class="mr-4 md:flex mb-4">
              @if (data?.logo?.image) {
                <app-logo [image]="data.logo.image" />
              }
            </div>
            <div class="max-w-xs">{{ data?.description }}</div>
            <div class="mt-4">{{ data?.copyright }}</div>
            <div class="mt-10">
              Designed and Developed by
              <a class="text-white underline" href="https://aceternity.com">Aceternity</a>
              &amp;
              <a class="text-white underline" href="https://strapi.io">Strapi</a>
            </div>
            <div class="mt-2">
              built with
              <a class="text-white underline" href="https://strapi.io">Strapi</a>,
              <a class="text-white underline" href="https://angular.dev">Angular</a>,
              <a class="text-white underline" href="https://tailwindcss.com">Tailwind CSS</a>,
              <a class="text-white underline" href="https://gsap.com">GSAP</a>, and
              <a class="text-white underline" href="https://ui.aceternity.com">Aceternity UI</a>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
            <div class="flex justify-center space-y-4 flex-col mt-4">
              @for (link of data?.internal_links; track link.text) {
                <a
                  class="transition-colors hover:text-neutral-400 text-muted text-xs sm:text-sm"
                  [routerLink]="getLinkHref(link)"
                >{{ link.text }}</a>
              }
            </div>
            <div class="flex justify-center space-y-4 flex-col mt-4">
              @for (link of data?.policy_links; track link.text) {
                <a
                  class="transition-colors hover:text-neutral-400 text-muted text-xs sm:text-sm"
                  [routerLink]="getLinkHref(link)"
                >{{ link.text }}</a>
              }
            </div>
            <div class="flex justify-center space-y-4 flex-col mt-4">
              @for (link of data?.social_media_links; track link.text) {
                <a
                  class="transition-colors hover:text-neutral-400 text-muted text-xs sm:text-sm"
                  [attr.href]="link.URL.startsWith('http') ? link.URL : null"
                  [routerLink]="link.URL.startsWith('http') ? null : '/' + locale + link.URL"
                  [attr.target]="link.URL.startsWith('http') ? '_blank' : null"
                >{{ link.text }}</a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FooterComponent {
  @Input() data: any;
  @Input() locale = 'en';

  getLinkHref(link: any): string | null {
    if (link.URL.startsWith('http')) return null;
    return '/' + this.locale + link.URL;
  }
}
