import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-video-embed',
  standalone: true,
  template: `
    <div class="relative w-full overflow-hidden rounded-lg bg-black" style="padding-top: 56.25%;">
      <div #host class="absolute inset-0 h-full w-full"></div>
    </div>
  `,
})
export class VideoEmbedComponent implements AfterViewInit, OnChanges {
  @Input() src: string | null = null;
  @Input() title = 'Embedded video';
  @Input() allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

  @ViewChild('host') private host?: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    this.renderIframe();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.renderIframe();
  }

  private renderIframe(): void {
    if (!this.host || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.host.nativeElement;
    container.innerHTML = '';

    const embedSrc = this.src?.trim();
    if (!embedSrc) {
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.className = 'h-full w-full';
    iframe.src = embedSrc;
    iframe.title = this.title;
    iframe.loading = 'lazy';
    iframe.allow = this.allow;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');

    container.appendChild(iframe);
  }
}