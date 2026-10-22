import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://devkumar.is-a.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-preview.png`;

/**
 * SEOHead — renders per-page <title>, meta description, canonical, OG, Twitter, and JSON-LD.
 *
 * @param {object}  props
 * @param {string}  props.title       — Page title
 * @param {string}  props.description — Meta description (max ~155 chars)
 * @param {string}  props.path        — Canonical path, e.g. "/" or "/casestudy"
 * @param {string}  [props.ogImage]   — OG image URL (absolute)
 * @param {string}  [props.ogType]    — og:type, default "website"
 * @param {object}  [props.jsonLd]    — JSON-LD structured data object
 */
export default function SEOHead({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Dev Kumar | Portfolio" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Dev3807" />
      <meta name="twitter:creator" content="@Dev3807" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
