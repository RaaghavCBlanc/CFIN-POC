import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-gradient-container',
  standalone: true,
  template: `
    <div
      #containerRef
      [style.--top]="'rgba(97, 106, 115, .12)'"
      [style.--bottom]="'transparent'"
      [style.--conic-size]="'600px'"
      [class]="computedClass"
    >
      <div
        class="w-full h-[var(--conic-size)] mb-[calc(-1*var(--conic-size))] pointer-events-none select-none relative z-0 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[var(--charcoal)] after:opacity-100"
        [style.background]="conicGradient"
        [style.opacity]="0.901567"
      ></div>
      <ng-content />
    </div>
  `,
})
export class GradientContainerComponent implements AfterViewInit, OnDestroy {
  @Input() className?: string;
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  percentage = 0;
  private observer?: IntersectionObserver;
  private scrollHandler?: () => void;

  get computedClass() {
    return cn('relative z-20', this.className);
  }

  get conicGradient(): string {
    const p = this.percentage;
    return `conic-gradient(from 90deg at ${100 - p}% 0%, var(--top), var(--bottom) 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at ${p}% 0%, var(--bottom) 180deg, var(--top)) 100% 0% / 50% 100% no-repeat`;
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    this.scrollHandler = () => this.updatePercentage();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.updatePercentage();
  }

  private updatePercentage() {
    if (!this.containerRef?.nativeElement) return;
    const el = this.containerRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollProgress = 1 - (rect.bottom / (vh + rect.height));
    const limited = Math.max(0, Math.min(1, scrollProgress * 2));
    this.percentage = Math.min(100, Math.max(0, (limited - 0.1) * (100 / 0.9)));
  }

  ngOnDestroy() {
    if (this.scrollHandler && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
