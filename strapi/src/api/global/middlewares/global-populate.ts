/**
 * `global-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  navbar: {
    populate: {
      logo: {
        populate: {
          image: true,
        },
      },
      top_navbar: {
        populate: {
          icon: true,
        },
      },
      bottom_navbar: {
        populate: {
          icon: true,
          dropdown_items: true,
        },
      },
    },
  },
  footer: {
    populate: {
      policy_links: true,
      social_media_links: {
        populate: {
          icon: true,
        },
      },
      logo: {
        populate: {
          image: true,
        },
      },
      footer_columns: {
        populate: {
          links: true,
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
