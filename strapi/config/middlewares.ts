export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:4000', 'http://localhost:4200', 'http://127.0.0.1:4000'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'strapi-encode-source-maps',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
