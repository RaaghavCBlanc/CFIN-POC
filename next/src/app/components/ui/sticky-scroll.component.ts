import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-sticky-scroll',
  standalone: true,
  template: `
    <div class="py-4 md:py-20">
      <!-- Desktop -->
      <div class="hidden lg:flex h-full flex-col max-w-7xl mx-auto justify-between relative p-10">
        @for (item of content; track item.title; let i = $index) {
          <div
            #scrollItem
            class="my-40 relative grid grid-cols-2 gap-8"
            [attr.data-index]="i"
          >
            <div class="h-full w-full rounded-md self-start">
              @if (item.content) {
                <p class="text-4xl md:text-7xl font-bold text-neutral-800">
                  {{ item.mission_number }}
                </p>
              }
            </div>
            <div class="w-full">
              <div>
                @if (item.icon) {
                  <span [innerHTML]="item.iconHtml"></span>
                }
                <h2 class="max-w-md mt-2 font-bold text-2xl lg:text-4xl inline-block bg-clip-text text-left text-transparent bg-gradient-to-b from-white to-white">
                  {{ item.title }}
                </h2>
                <p class="text-lg text-neutral-500 font-regular max-w-sm mt-2">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        }
      </div>
      <!-- Mobile -->
      <div class="flex lg:hidden flex-col max-w-7xl mx-auto justify-between relative p-10">
        @for (item of content; track item.title; let i = $index) {
          <div class="my-10 relative flex flex-col md:flex-row md:space-x-4">
            <div class="w-full rounded-md self-start mb-8">
              @if (item.content) {
                <p class="text-4xl md:text-7xl font-bold text-neutral-800">
                  {{ item.mission_number }}
                </p>
              }
            </div>
            <div class="w-full">
              <div class="mb-6">
                <h2 class="mt-2 font-bold text-2xl lg:text-4xl inline-block bg-clip-text text-left text-transparent bg-gradient-to-b from-white to-white">
                  {{ item.title }}
                </h2>
                <p class="text-sm md:text-base text-neutral-500 font-bold max-w-sm mt-2">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class StickyScrollComponent {
  @Input() content: any[] = [];
}
