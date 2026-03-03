import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cn } from '../../utils/utils';

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

@Component({
  selector: 'app-star-background',
  standalone: true,
  template: `
    <canvas #canvas [class]="canvasClass"></canvas>
  `,
})
export class StarBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() className = '';
  @Input() starDensity = 0.00015;
  private platformId = inject(PLATFORM_ID);

  private stars: StarProps[] = [];
  private animationFrameId?: number;
  private resizeObserver?: ResizeObserver;

  get canvasClass() {
    return cn('h-full w-full absolute inset-0', this.className);
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateStars = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      this.generateStars(width, height);
    };

    updateStars();

    this.resizeObserver = new ResizeObserver(updateStars);
    this.resizeObserver.observe(canvas);

    this.render(ctx, canvas);
  }

  private generateStars(width: number, height: number) {
    const area = width * height;
    const numStars = Math.floor(area * this.starDensity);
    this.stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 0.05 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() < 0.7
        ? 0.5 + Math.random() * 0.5
        : null,
    }));
  }

  private render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
      if (star.twinkleSpeed !== null) {
        star.opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
      }
    });
    this.animationFrameId = requestAnimationFrame(() => this.render(ctx, canvas));
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
