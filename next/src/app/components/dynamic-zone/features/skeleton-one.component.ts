import { Component } from '@angular/core';
import { IconContainerComponent } from './icon-container.component';
import {
  InstagramIconComponent,
  TiktokIconComponent,
  TwitterIconComponent,
  FacebookIconComponent,
  MetaIconComponent,
  LinkedInIconComponent,
  SlackIconComponent,
} from '../../icons/illustrations.component';

/**
 * SkeletonOne - Globe feature skeleton.
 * The original used a 3D Globe (three.js) which is skipped per migration plan.
 * We keep the social media icon grid and show a placeholder where the globe was.
 */
@Component({
  selector: 'app-skeleton-one',
  standalone: true,
  imports: [
    IconContainerComponent,
    InstagramIconComponent,
    TiktokIconComponent,
    TwitterIconComponent,
    FacebookIconComponent,
    MetaIconComponent,
    LinkedInIconComponent,
    SlackIconComponent,
  ],
  template: `
    <div class="relative w-full h-full">
      <div class="flex flex-col gap-4 items-center justify-center h-full relative">
        <div class="flex gap-4 items-center justify-center flex-shrink-0 opacity-40">
          <app-icon-container><app-instagram-icon /></app-icon-container>
          <app-icon-container><app-tiktok-icon /></app-icon-container>
          <app-icon-container><app-twitter-icon /></app-icon-container>
          <app-icon-container><app-facebook-icon /></app-icon-container>
          <app-icon-container><app-meta-icon /></app-icon-container>
          <app-icon-container><app-linkedin-icon /></app-icon-container>
          <app-icon-container><app-slack-icon /></app-icon-container>
          <app-icon-container><app-instagram-icon /></app-icon-container>
        </div>
        <div class="flex gap-4 items-center justify-center flex-shrink-0 ml-8 opacity-40">
          <app-icon-container><app-meta-icon /></app-icon-container>
          <app-icon-container><app-linkedin-icon /></app-icon-container>
          <app-icon-container><app-slack-icon /></app-icon-container>
          <app-icon-container><app-instagram-icon /></app-icon-container>
          <app-icon-container><app-tiktok-icon /></app-icon-container>
          <app-icon-container><app-twitter-icon /></app-icon-container>
          <app-icon-container><app-facebook-icon /></app-icon-container>
        </div>
      </div>
      <!-- Globe placeholder (3D feature skipped) -->
      <div class="h-[300px] w-[300px] md:w-[600px] md:h-[600px] mx-auto absolute -bottom-20 md:-bottom-60 z-20 inset-x-0 flex items-center justify-center">
        <div class="rounded-full w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-neutral-700/50 bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center">
          <span class="text-neutral-600 text-sm">Globe Visualization</span>
        </div>
      </div>
    </div>
  `,
})
export class SkeletonOneComponent {}
