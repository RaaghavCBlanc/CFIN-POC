import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreviewComponent } from './components/preview/preview.component';
import { DraftModeService } from './services/draft-mode.service';
import { SeoService } from './services/seo.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PreviewComponent],
  template: `
    <app-preview />
    <router-outlet />
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private draftModeService: DraftModeService,
    private seoService: SeoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.draftModeService.checkFromCookie();
    this.seoService.setDefaults();
    void this.authService.bootstrapSession();
  }
}
