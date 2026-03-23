
CREATE TABLE IF NOT EXISTS gosash_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO gosash_settings (key, value) VALUES
  ('site_title', 'ГОСАШ — Автошкола Симферополя'),
  ('site_description', 'Городская автошкола Симферополя с вдумчивым подходом'),
  ('site_keywords', 'автошкола симферополь, права категории b, kia rio'),
  ('hero_h1', 'Стань уверенным водителем'),
  ('hero_subtitle', 'Городская автошкола Симферополя с вдумчивым подходом и 6 программами обучения.'),
  ('phone', '+79789937221'),
  ('phone_display', '+7 (978) 993 72 21'),
  ('email', ''),
  ('work_hours', 'Пн–Пт: 10:00–18:30'),
  ('vk_url', ''),
  ('tg_url', ''),
  ('block_hero', 'true'),
  ('block_tariffs', 'true'),
  ('block_fleet', 'true'),
  ('block_finance', 'true'),
  ('block_faq', 'true'),
  ('block_about', 'true'),
  ('block_stats', 'true'),
  ('block_instructors', 'true'),
  ('block_reviews', 'true'),
  ('block_footer', 'true')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS gosash_tariffs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  hours INTEGER DEFAULT 56,
  hours_label TEXT NOT NULL,
  theory TEXT NOT NULL,
  instructor TEXT NOT NULL,
  price INTEGER NOT NULL,
  gsm INTEGER DEFAULT 0,
  badge TEXT,
  color TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  installment TEXT,
  duration TEXT,
  features JSONB DEFAULT '[]',
  restrictions JSONB DEFAULT '[]',
  bonuses JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gosash_branches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  addr TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 5.0,
  map_url TEXT DEFAULT '',
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gosash_instructors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  experience TEXT DEFAULT '',
  specialization TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  is_top BOOLEAN DEFAULT FALSE,
  is_lady BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gosash_reviews (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  photo_url TEXT DEFAULT '',
  source TEXT DEFAULT '',
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
