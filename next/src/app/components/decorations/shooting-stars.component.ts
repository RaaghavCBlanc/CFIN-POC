import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

@Component({
  selector: 'app-shooting-stars',
  standalone: true,
  template: `
    <svg #svgEl width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
      @if (star) {
        <rect
          [attr.x]="star.x"
          [attr.y]="star.y"
          [attr.width]="10 * star.scale"
          height="2"
          fill="url(#gradient)"
          [attr.transform]="'rotate(' + star.angle + ', ' + (star.x + (10 * star.scale) / 2) + ', ' + (star.y + 1) + ')'"
        />
      }
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #2EB9DF; stop-opacity: 0;" />
          <stop offset="100%" style="stop-color: #9E00FF; stop-opacity: 1;" />
        </linearGradient>
      </defs>
    </svg>
  `,
})
export class ShootingStarsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('svgEl') svgRef!: ElementRef<SVGSVGElement>;
  star: ShootingStar | null = null;
  private timeoutId?: any;
  private animationFrameId?: number;
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.createStar();
  }

  private getRandomStartPoint() {
    if (typeof window === 'undefined') return { x: 0, y: 0, angle: 45 };
    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * window.innerWidth;
    switch (side) {
      case 0: return { x: offset, y: 0, angle: 45 };
      case 1: return { x: window.innerWidth, y: offset, angle: 135 };
      case 2: return { x: offset, y: window.innerHeight, angle: 225 };
      case 3: return { x: 0, y: offset, angle: 315 };
      default: return { x: 0, y: 0, angle: 45 };
    }
  }

  private createStar() {
    const { x, y, angle } = this.getRandomStartPoint();
    this.star = {
      id: Date.now(),
      x, y, angle,
      scale: 1,
      speed: Math.random() * 20 + 10,
      distance: 0,
    };
    this.moveStar();
    const randomDelay = Math.random() * 4500 + 4200;
    this.timeoutId = setTimeout(() => this.createStar(), randomDelay);
  }

  private moveStar() {
    if (!this.star) return;
    const s = this.star;
    const newX = s.x + s.speed * Math.cos((s.angle * Math.PI) / 180);
    const newY = s.y + s.speed * Math.sin((s.angle * Math.PI) / 180);
    const newDistance = s.distance + s.speed;
    const newScale = 1 + newDistance / 100;

    if (typeof window !== 'undefined' &&
      (newX < -20 || newX > window.innerWidth + 20 || newY < -20 || newY > window.innerHeight + 20)) {
      this.star = null;
      return;
    }

    this.star = { ...s, x: newX, y: newY, distance: newDistance, scale: newScale };
    this.animationFrameId = requestAnimationFrame(() => this.moveStar());
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}
