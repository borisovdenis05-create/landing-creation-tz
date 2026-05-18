CREATE TABLE IF NOT EXISTS t_p1235792_landing_creation_tz.gosash_media (
  id serial PRIMARY KEY,
  url text NOT NULL,
  filename text NOT NULL,
  s3_key text,
  size_bytes integer,
  mime_type text,
  alt text DEFAULT '',
  tag text DEFAULT '',
  created_at timestamp without time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gosash_media_created_at ON t_p1235792_landing_creation_tz.gosash_media(created_at DESC);

-- SEO дефолты (если ещё нет)
INSERT INTO t_p1235792_landing_creation_tz.gosash_settings (key, value, updated_at)
VALUES
  ('seo_og_image', '', NOW()),
  ('seo_canonical_url', '', NOW()),
  ('seo_robots', 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml', NOW()),
  ('seo_sitemap', '', NOW()),
  ('seo_redirects', '[]', NOW()),
  ('seo_favicon', '', NOW())
ON CONFLICT (key) DO NOTHING;