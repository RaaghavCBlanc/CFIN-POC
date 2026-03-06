/**
 * `article-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  localizations: true,
  image: true,
  content_component: {
    on: {
      'shared.content': true,
      'shared.video-embedding': true,
    },
  },
  categories: {
    populate: {
      product: true,
      articles: {
        populate: {
          dynamic_zone: {
            on: {
              'dynamic-zone.related-articles': true,
              'dynamic-zone.cta': {
                populate: {
                  CTAs: true,
                },
              },
            },
          },
        },
      },
    },
  },
  dynamic_zone: {
    on: {
      'dynamic-zone.related-articles': {
        populate: {
          articles: {
            populate: {
              image: true,
            },
          },
        },
      },
      'dynamic-zone.cta': {
        populate: {
          CTAs: true,
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