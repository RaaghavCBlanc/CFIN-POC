/**
 * article controller
 */
import { factories } from '@strapi/strapi';

const premiumNonPremiumFilter = {
  $or: [
    { premium: { $eq: false } },
    { premium: { $null: true } },
  ],
};
const debugPrefix = '[premium-debug][article-controller]';

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

function readPremiumFlag(entity: any): boolean {
  return Boolean(entity?.premium ?? entity?.attributes?.premium);
}

function extractEntity(result: any): any {
  if (result && typeof result === 'object' && 'data' in result) {
    return result.data;
  }

  return result;
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
    const premiums = data.map((item: any) => readPremiumFlag(item));
    return `array(len=${data.length},premiumFlags=${safeJson(premiums)})`;
  }

  if (data && typeof data === 'object') {
    const id = data?.id ?? data?.documentId ?? 'n/a';
    return `object(id=${id},premium=${readPremiumFlag(data)})`;
  }

  return String(data);
}

export default factories.createCoreController('api::article.article', () => ({
  async find(ctx) {
    const userId = ctx.state?.user?.id ?? null;
    const isAuthenticated = Boolean(userId);

    console.info(
      `${debugPrefix} find:start userId=${userId} filtersBefore=${safeJson(ctx.query?.filters)}`
    );

    if (!isAuthenticated) {
      ctx.query.filters = mergeFilters(ctx.query.filters, premiumNonPremiumFilter);
      console.info(
        `${debugPrefix} find:anon-filter-applied filtersAfter=${safeJson(ctx.query?.filters)}`
      );
    }

    const response = await super.find(ctx);
    const payload = extractEntity(response);
    console.info(
      `${debugPrefix} find:end userId=${userId} payload=${summarizeData(payload)}`
    );

    return response;
  },

  async findOne(ctx) {
    const userId = ctx.state?.user?.id ?? null;
    const isAuthenticated = Boolean(userId);

    console.info(
      `${debugPrefix} findOne:start userId=${userId} filters=${safeJson(ctx.query?.filters)} params=${safeJson(ctx.params)}`
    );

    const response = await super.findOne(ctx);

    if (isAuthenticated) {
      const payload = extractEntity(response);
      console.info(
        `${debugPrefix} findOne:end-auth userId=${userId} payload=${summarizeData(payload)}`
      );
      return response;
    }

    const entity = extractEntity(response);
    console.info(
      `${debugPrefix} findOne:end-anon userId=${userId} payload=${summarizeData(entity)}`
    );

    if (entity && readPremiumFlag(entity)) {
      console.info(`${debugPrefix} findOne:forbidden userId=${userId} reason=premium`);
      return ctx.forbidden('Premium article requires authentication');
    }

    return response;
  },
}));


