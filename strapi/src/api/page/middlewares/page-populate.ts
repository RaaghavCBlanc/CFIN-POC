/**
 * `page` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  localizations: true,
  dynamic_zone: {
    on: {
      'dynamic-zone.hero': {
        populate: {
          CTAs: true,
        },
      },
      'dynamic-zone.features': {
        populate: {
          globe_card: true,
          ray_card: {
            populate: {
              before_ray_items: true,
              after_ray_items: true,
            },
          },
          graph_card: {
            populate: {
              top_items: true,
            },
          },
          social_media_card: {
            populate: {
              logos: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
      'dynamic-zone.testimonials': {
        populate: {
          testimonials: {
            populate: {
              user: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
      'dynamic-zone.how-it-works': {
        populate: {
          steps: true,
        },
      },
      'dynamic-zone.brands': {
        populate: {
          logos: {
            populate: {
              image: true,
            },
          },
        },
      },
      'dynamic-zone.pricing': {
        populate: {
          plans: {
            populate: {
              perks: true,
              additional_perks: true,
              CTA: true,
              product: true,
              localizations: {
                populate: {
                  perks: true,
                  additional_perks: true,
                  CTA: true,
                },
              },
            },
          },
        },
      },
      'dynamic-zone.launches': {
        populate: {
          launches: true,
        },
      },
      'dynamic-zone.cta': {
        populate: {
          CTAs: true,
        },
      },
      'dynamic-zone.faq': {
        populate: {
          faqs: true,
        },
      },
      'dynamic-zone.form-next-to-section': {
        populate: {
          form: {
            populate: {
              inputs: true,
            },
          },
          section: {
            populate: {
              users: {
                populate: {
                  image: true,
                },
              },
            },
          },
          social_media_icon_links: {
            populate: {
              image: true,
              link: true,
            },
          },
        },
      },
      'dynamic-zone.home-hero-carousel': {
        populate: {
          slides: {
            populate: {
              primary_cta: true,
              secondary_cta: true,
              desktop_image: true,
            },
          },
        },
      },
      'dynamic-zone.home-what-we-offer': {
        populate: {
          video: true,
          video_poster: true,
          items: {
            populate: {
              icon: true,
            },
          },
        },
      },
      'dynamic-zone.home-community-carousel': {
        populate: {
          cards: {
            populate: {
              author_avatar: true,
            },
          },
        },
      },
      'dynamic-zone.home-trusted-members': {
        populate: {
          logos: {
            populate: {
              image: true,
            },
          },
          testimonials: {
            populate: {
              user: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  },
  seo: {
    populate: {
      metaImage: true,
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query.populate = populate;
    await next();
  };
};