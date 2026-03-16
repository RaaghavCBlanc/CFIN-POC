import { Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreviewComponent } from './components/preview/preview.component';
import { DraftModeService } from './services/draft-mode.service';
import { SeoService } from './services/seo.service';
import { AuthService } from './services/auth.service';
import { StrapiService } from './services/strapi.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PreviewComponent],
  template: '<app-preview />\n    <router-outlet />',
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private draftModeService: DraftModeService,
    private strapiService: StrapiService,
    private seoService: SeoService,
    private authService: AuthService
  ) {
    effect(() => {
      this.strapiService.setDraftMode(this.draftModeService.isDraftMode());
    });
  }

  ngOnInit() {
    this.draftModeService.checkFromCookie();
    this.seoService.setDefaults();
    void this.authService.bootstrapSession();
  }
}
