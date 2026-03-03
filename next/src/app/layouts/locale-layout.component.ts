import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ToastComponent } from '../components/toast/toast.component';
import { DraftModeBannerComponent } from '../components/draft-mode-banner/draft-mode-banner.component';
import { StrapiService } from '../services/strapi.service';
import { LocaleService } from '../services/locale.service';
import { DraftModeService } from '../services/draft-mode.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-locale-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    DraftModeBannerComponent,
  ],
  template: `
    <div class="font-sans bg-charcoal antialiased h-full w-full">
      @if (navbarData) {
        <app-navbar [data]="navbarData" [locale]="locale" />
      }
      <router-outlet />
      @if (footerData) {
        <app-footer [data]="footerData" [locale]="locale" />
      }
      <app-toast />
      @if (isDraftMode) {
        <app-draft-mode-banner />
      }
    </div>
  `,
  styles: []
})
export class LocaleLayoutComponent implements OnInit {
  navbarData: any = null;
  footerData: any = null;
  locale = 'en';
  isDraftMode = false;

  constructor(
    private route: ActivatedRoute,
    private strapiService: StrapiService,
    private localeService: LocaleService,
    private draftModeService: DraftModeService,
    private seoService: SeoService,
  ) {}

  ngOnInit() {
    this.isDraftMode = this.draftModeService.isDraftMode();

    this.route.paramMap.subscribe(params => {
      this.locale = params.get('locale') || 'en';
      this.localeService.setLocale(this.locale);
      this.loadGlobalData();
    });
  }

  private async loadGlobalData() {
    try {
      const pageData = await this.strapiService.fetchSingleType('global', {
        locale: this.locale,
      });

      this.navbarData = pageData.navbar;
      this.footerData = pageData.footer;

      if (pageData.seo) {
        this.seoService.updateMeta(pageData.seo);
      }
    } catch (error) {
      console.error('Failed to load global data:', error);
    }
  }
}
