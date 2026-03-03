import { Component } from '@angular/core';

@Component({
  selector: 'app-ambient-color',
  standalone: true,
  template: `
    <div class="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none">
      <div
        class="absolute top-0 left-0"
        style="transform: translateY(-350px) rotate(-45deg); width: 560px; height: 1380px; background: radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%);"
      ></div>
      <div
        class="absolute top-0 left-0"
        style="transform: rotate(-45deg) translate(5%, -50%); transform-origin: top left; width: 240px; height: 1380px; background: radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%);"
      ></div>
      <div
        class="absolute top-0 left-0"
        style="position: absolute; border-radius: 20px; transform: rotate(-45deg) translate(-180%, -70%); transform-origin: top left; top: 0; left: 0; width: 240px; height: 1380px; background: radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%);"
      ></div>
    </div>
  `,
})
export class AmbientColorComponent {}
