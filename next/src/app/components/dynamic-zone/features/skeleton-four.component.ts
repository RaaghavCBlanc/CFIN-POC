import { Component, OnInit, OnDestroy, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { IconContainerComponent } from './icon-container.component';
import { StarBackgroundComponent } from '../../decorations/star-background.component';
import { ShootingStarsComponent } from '../../decorations/shooting-stars.component';
import {
  TwitterIconComponent,
  MetaIconComponent,
  InstagramIconComponent,
  LinkedInIconComponent,
  FacebookIconComponent,
  SlackIconComponent,
  TiktokIconComponent,
} from '../../icons/illustrations.component';
import { cn } from '../../../utils/utils';

interface IconItem {
  title: string;
  icon: Type<any>;
  className: string;
}

/**
 * SkeletonFour - Social icon grid with random highlighting.
 * Replaces framer-motion layoutId="bubble" with a CSS ring effect.
 */
@Component({
  selector: 'app-skeleton-four',
  standalone: true,
  imports: [
    NgComponentOutlet,
    IconContainerComponent,
    StarBackgroundComponent,
    ShootingStarsComponent,
  ],
  template: `
    <div class="p-8 overflow-hidden h-full relative flex flex-col group [perspective:8000px] [transform-style:preserve-3d]">
      <app-star-background />
      <app-shooting-stars />

      @for (icon of icons; track icon.title) {
        <app-icon-container
          [className]="getIconClass(icon)"
        >
          <ng-container *ngComponentOutlet="icon.icon" />
          @if (active().title === icon.title) {
            <div class="absolute h-16 w-16 inset-0 rounded-full border-2 -ml-0.5 -mt-0.5 border-indigo-500 transition-all duration-300"></div>
          }
        </app-icon-container>
      }
    </div>
  `,
})
export class SkeletonFourComponent implements OnInit, OnDestroy {
  icons: IconItem[] = [
    { title: 'Twitter', icon: TwitterIconComponent, className: 'left-2 top-2' },
    { title: 'Meta2', icon: MetaIconComponent, className: 'left-32 top-32' },
    { title: 'Instagram', icon: InstagramIconComponent, className: 'left-1/2 top-1/2' },
    { title: 'LinkedIn2', icon: LinkedInIconComponent, className: 'left-1/2 top-20' },
    { title: 'Facebook', icon: FacebookIconComponent, className: 'right-20 top-20' },
    { title: 'Slack2', icon: SlackIconComponent, className: 'right-20 bottom-0' },
    { title: 'Tiktok', icon: TiktokIconComponent, className: 'left-52 bottom-10' },
    { title: 'Meta', icon: MetaIconComponent, className: 'left-32 bottom-60' },
    { title: 'Twitter2', icon: TwitterIconComponent, className: 'right-96 top-24' },
    { title: 'Instagram2', icon: InstagramIconComponent, className: 'left-10 bottom-0' },
    { title: 'LinkedIn', icon: LinkedInIconComponent, className: 'right-40 top-0' },
    { title: 'Facebook2', icon: FacebookIconComponent, className: 'right-40 top-40' },
    { title: 'Slack', icon: SlackIconComponent, className: 'right-0 bottom-60' },
    { title: 'Tiktok2', icon: TiktokIconComponent, className: 'right-10 bottom-80' },
  ];

  active = signal<IconItem>(this.icons[0]);
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.active.set(this.icons[Math.floor(Math.random() * this.icons.length)]);
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  getIconClass(icon: IconItem): string {
    return cn(
      'rounded-full opacity-20 mx-2 absolute',
      icon.className,
      this.active().title === icon.title && 'opacity-100'
    );
  }
}
