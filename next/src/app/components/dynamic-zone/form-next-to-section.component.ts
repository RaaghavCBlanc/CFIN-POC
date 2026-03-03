import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../elements/button.component';
import { ShootingStarsComponent } from '../decorations/shooting-stars.component';
import { StarBackgroundComponent } from '../decorations/star-background.component';
import { AnimatedTooltipComponent } from '../ui/animated-tooltip.component';

@Component({
  selector: 'app-form-next-to-section',
  standalone: true,
  imports: [
    ButtonComponent,
    ShootingStarsComponent,
    StarBackgroundComponent,
    AnimatedTooltipComponent,
  ],
  template: `
    <div class="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
      <!-- Left: Form -->
      <div class="flex relative z-20 items-center w-full justify-center px-4 py-4 lg:py-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div class="mx-auto w-full max-w-md">
          <div>
            <h1 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-white">{{ heading }}</h1>
            <p class="mt-4 text-muted text-sm max-w-sm">{{ sub_heading }}</p>
          </div>

          <div class="py-10">
            <form class="space-y-4">
              @if (form?.inputs) {
                @for (input of form.inputs; track $index) {
                  <div>
                    @if (input.type !== 'submit') {
                      <label class="block text-sm font-medium leading-6 text-neutral-400">
                        {{ input.name }}
                      </label>
                    }
                    <div class="mt-2">
                      @if (input.type === 'textarea') {
                        <textarea
                          [rows]="5"
                          [placeholder]="input.placeholder"
                          class="block w-full bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6"
                        ></textarea>
                      } @else if (input.type === 'submit') {
                        <app-button className="w-full mt-6">{{ input.name }}</app-button>
                      } @else {
                        <input
                          [type]="input.type"
                          [placeholder]="input.placeholder"
                          class="block w-full bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6"
                        />
                      }
                    </div>
                  </div>
                }
              }
            </form>
          </div>

          <div class="flex items-center justify-center space-x-4 py-4">
            @for (social of socials; track social.title) {
              <a [href]="social.href" target="_blank" rel="noopener noreferrer">
                <svg [attr.viewBox]="social.viewBox" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted hover:text-neutral-100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="social.path"></svg>
              </a>
            }
          </div>
        </div>
      </div>

      <!-- Right: Section -->
      <div class="relative w-full z-20 hidden md:flex border-l border-charcoal overflow-hidden bg-neutral-900 items-center justify-center">
        <app-star-background />
        <app-shooting-stars />
        <div class="max-w-sm mx-auto">
          @if (section?.users) {
            <div class="flex flex-row items-center justify-center mb-10 w-full">
              <app-animated-tooltip [items]="section.users" />
            </div>
          }
          <p class="font-semibold text-xl text-center text-muted">{{ section?.heading }}</p>
          <p class="font-normal text-base text-center text-neutral-500 mt-8">{{ section?.sub_heading }}</p>
        </div>
      </div>
    </div>
  `,
})
export class FormNextToSectionComponent {
  @Input() heading = '';
  @Input() sub_heading = '';
  @Input() form: any;
  @Input() section: any;
  @Input() social_media_icon_links: any;

  socials = [
    {
      title: 'twitter',
      href: 'https://twitter.com/strapijs',
      viewBox: '0 0 24 24',
      path: '<path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>',
    },
    {
      title: 'github',
      href: 'https://github.com/strapi',
      viewBox: '0 0 24 24',
      path: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    },
    {
      title: 'linkedin',
      href: 'https://linkedin.com/strapi',
      viewBox: '0 0 24 24',
      path: '<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M8 11l0 5"/><path d="M8 8l0 .01"/><path d="M12 16l0 -5"/><path d="M16 16v-3a2 2 0 0 0 -4 0"/>',
    },
  ];
}
