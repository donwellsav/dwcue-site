const MIME = {
  html: 'text/html; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  ico: 'image/x-icon',
  dmg: 'application/x-apple-diskimage',
  zip: 'application/zip',
  json: 'application/json',
  txt: 'text/plain; charset=utf-8',
  woff2: 'font/woff2',
  map: 'application/json',
  xml: 'application/xml',
  webmanifest: 'application/manifest+json',
};

const LEGACY_DOWNLOADS = new Map([
  ['downloads/DonWells-Cue-2.5.19-arm64.dmg', 'downloads/DonWells-Cue-2.5.21-arm64.dmg'],
  ['downloads/DonWells-Cue-2.5.19-arm64.zip', 'downloads/DonWells-Cue-2.5.21-arm64.zip'],
  ['downloads/DonWells-Cue-2.5.20-arm64.dmg', 'downloads/DonWells-Cue-2.5.21-arm64.dmg'],
  ['downloads/DonWells-Cue-2.5.20-arm64.zip', 'downloads/DonWells-Cue-2.5.21-arm64.zip'],
]);

const NO_CACHE_FILES = new Set(['index.html', 'package.json', 'sitemap.xml', 'robots.txt']);

function extOf(name) {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match ? match[1].toLowerCase() : '';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    let path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    let key = path || 'index.html';
    const legacyTarget = LEGACY_DOWNLOADS.get(key);
    if (legacyTarget) {
      return Response.redirect(new URL(`/${legacyTarget}`, url).toString(), 302);
    }

    let object = await env.SITE.get(key);
    if (!object && !extOf(key)) {
      key = 'index.html';
      object = await env.SITE.get(key);
    }
    if (!object) return new Response('Not found', { status: 404 });

    const extension = extOf(key);
    const contentType = MIME[extension] || (object.httpMetadata && object.httpMetadata.contentType) || 'application/octet-stream';
    const cacheControl = NO_CACHE_FILES.has(key) ? 'no-cache' : 'public, max-age=31536000, immutable';
    const headers = {
      'content-type': contentType,
      'cache-control': cacheControl,
      etag: object.httpEtag,
    };

    if (key.startsWith('downloads/')) {
      headers['content-disposition'] = `attachment; filename="${key.slice(key.lastIndexOf('/') + 1)}"`;
      if (typeof object.size === 'number') headers['content-length'] = String(object.size);
    }

    return new Response(object.body, { headers });
  },
};
