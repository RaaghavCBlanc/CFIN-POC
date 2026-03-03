import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private meta: Meta, private title: Title) {}

  updateMeta(seo: any) {
    if (!seo) return;

    if (seo.metaTitle) {
      this.title.setTitle(seo.metaTitle);
    }

    if (seo.metaDescription) {
      this.meta.updateTag({ name: 'description', content: seo.metaDescription });
    }

    // OpenGraph
    if (seo.ogTitle || seo.metaTitle) {
      this.meta.updateTag({ property: 'og:title', content: seo.ogTitle || seo.metaTitle });
    }
    if (seo.ogDescription || seo.metaDescription) {
      this.meta.updateTag({ property: 'og:description', content: seo.ogDescription || seo.metaDescription });
    }
    if (seo.metaImage?.url) {
      this.meta.updateTag({ property: 'og:image', content: seo.metaImage.url });
    }

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: seo.twitterCard || 'summary_large_image' });
    if (seo.twitterTitle || seo.metaTitle) {
      this.meta.updateTag({ name: 'twitter:title', content: seo.twitterTitle || seo.metaTitle });
    }
    if (seo.twitterDescription || seo.metaDescription) {
      this.meta.updateTag({ name: 'twitter:description', content: seo.twitterDescription || seo.metaDescription });
    }
  }

  setDefaults() {
    this.title.setTitle('LaunchPad - Your content delivery partner for large scale applications');
    this.meta.updateTag({ name: 'description', content: 'A platform integrating Aceternity with Strapi for seamless content management.' });
    this.meta.updateTag({ name: 'theme-color', content: '#06b6d4' });
  }
}
