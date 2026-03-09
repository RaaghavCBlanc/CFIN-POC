/**
 * `article-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const premiumNonPremiumFilter = {
  $or: [
    { premium: { $eq: false } },
    { premium: { $null: true } },
  ],
};
const debugPrefix = '[premium-debug][article-populate]';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function mergeFilters(existing: unknown, extra: Record<string, unknown>): Record<string, unknown> {
  if (!isRecord(existing)) {
    return extra;
  }

  const andCondition = existing.$and;
  if (Array.isArray(andCondition)) {
    return {
      ...existing,
      $and: [...andCondition, extra],
    };
  }

  return {
    $and: [existing, extra],
  };
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

function summarizeData(data: any): string {
  if (Array.isArray(data)) {
    const premiums = data.map((item: any) => Boolean(item?.premium ?? item?.attributes?.premium));
    return `array(len=${data.length},premiumFlags=${safeJson(premiums)})`;
  }

  if (data && typeof data === 'object') {
    const id = data?.id ?? data?.documentId ?? 'n/a';
    const premium = Boolean(data?.premium ?? data?.attributes?.premium);
    return `object(id=${id},premium=${premium})`;
  }

  return String(data);
}

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
    const userId = ctx.state?.user?.id ?? null;
    const isAuthenticated = Boolean(userId);

    console.info(
      `${debugPrefix} start method=${ctx.method} path=${ctx.path} userId=${userId} filtersBefore=${safeJson(ctx.query?.filters)}`
    );

    ctx.query.populate = populate;

    if (!isAuthenticated) {
      ctx.query.filters = mergeFilters(ctx.query.filters, premiumNonPremiumFilter);
      console.info(
        `${debugPrefix} anon-filter-applied filtersAfter=${safeJson(ctx.query?.filters)}`
      );
    }

    await next();

    const responseData = (ctx.body as any)?.data;
    console.info(
      `${debugPrefix} end method=${ctx.method} path=${ctx.path} userId=${userId} payload=${summarizeData(responseData)}`
    );
  };
};


