import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-preview',
  standalone: true,
  template: '',
})
export class PreviewComponent implements OnInit, OnDestroy {
  private messageHandler = (message: MessageEvent<any>) => {
    const { origin, data } = message;
    if (origin !== environment.apiUrl) return;

    if (data.type === 'strapiUpdate') {
      window.location.reload();
    } else if (data.type === 'strapiScript') {
      const script = window.document.createElement('script');
      script.textContent = data.payload.script;
      window.document.head.appendChild(script);
    }
  };

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.messageHandler);
      window.parent?.postMessage({ type: 'previewReady' }, '*');
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.messageHandler);
    }
  }
}
