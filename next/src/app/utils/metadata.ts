import { strapiImage } from '../utils/utils';

export function generateMetadataObject(seo: any) {
  return {
    title: seo?.metaTitle || 'Default Title',
    description: seo?.metaDescription || 'Default Description',
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || 'Default OG Title',
      description:
        seo?.ogDescription || seo?.metaDescription || 'Default OG Description',
      images: seo?.metaImage ? [{ url: strapiImage(seo?.metaImage.url) }] : [],
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || 'Default Twitter Title',
      description:
        seo?.twitterDescription ||
        seo?.metaDescription ||
        'Default Twitter Description',
      images: seo?.twitterImage ? [{ url: seo.twitterImage }] : [],
    },
  };
}
