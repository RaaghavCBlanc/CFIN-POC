import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-beam',
  standalone: true,
  template: `
    @if (showBeam) {
      <span
        #meteorRef
        [class]="meteorClass"
      ></span>
    }
  `,
  styles: [`
    .meteor {
      transform: rotate(-180deg);
      animation: meteor 3s linear;
      animation-delay: var(--meteor-delay, 0s);
      animation-duration: var(--meteor-duration, 2s);
    }
    .meteor::before {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: var(--meteor-width, 50px);
      height: 1px;
      background: linear-gradient(90deg, var(--cyan-500), var(--blue-500), transparent);
    }
    @keyframes meteor {
      0% { left: 0; opacity: 0; }
      70% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }
  `],
})
export class BeamComponent implements AfterViewInit, OnDestroy {
  @Input() showBeam = true;
  @Input() className?: string;
  @ViewChild('meteorRef') meteorRef?: ElementRef<HTMLSpanElement>;
  private platformId = inject(PLATFORM_ID);

  private animationEndHandler?: () => void;
  private animationStartHandler?: () => void;

  get meteorClass(): string {
    return cn(
      'absolute z-[40] -top-4 h-[0.1rem] w-[0.1rem] rounded-[9999px] bg-blue-700 shadow-[0_0_0_1px_#ffffff10] rotate-[180deg] meteor',
      this.className
    );
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.showBeam || !this.meteorRef?.nativeElement) return;
    const meteor = this.meteorRef.nativeElement;

    this.animationEndHandler = () => {
      meteor.style.visibility = 'hidden';
      const delay = Math.floor(Math.random() * 2);
      const duration = Math.floor(Math.random() * 4);
      const width = Math.floor(Math.random() * 70 + 80);
      meteor.style.setProperty('--meteor-delay', `${delay}s`);
      meteor.style.setProperty('--meteor-duration', `${duration}s`);
      meteor.style.setProperty('--meteor-width', `${width}px`);
      this.restartAnimation();
    };

    this.animationStartHandler = () => {
      meteor.style.visibility = 'visible';
    };

    meteor.addEventListener('animationend', this.animationEndHandler);
    meteor.addEventListener('animationstart', this.animationStartHandler);
  }

  private restartAnimation() {
    const meteor = this.meteorRef?.nativeElement;
    if (!meteor) return;
    meteor.style.animation = 'none';
    void meteor.offsetWidth;
    meteor.style.animation = '';
  }

  ngOnDestroy() {
    if (this.meteorRef?.nativeElement) {
      const meteor = this.meteorRef.nativeElement;
      if (this.animationEndHandler) meteor.removeEventListener('animationend', this.animationEndHandler);
      if (this.animationStartHandler) meteor.removeEventListener('animationstart', this.animationStartHandler);
    }
  }
}
