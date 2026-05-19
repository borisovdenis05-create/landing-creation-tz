CREATE TABLE IF NOT EXISTS t_p1235792_landing_creation_tz.gosash_documents (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p1235792_landing_creation_tz.gosash_documents (slug, title, sort_order, content) VALUES
('offer', 'Публичная оферта', 10, ''),
('privacy-policy', 'Политика конфиденциальности', 20, ''),
('user-consent', 'Согласие пользователя', 30, ''),
('cookie-policy', 'Политика использования cookie', 40, ''),
('terms-of-use', 'Пользовательское соглашение', 50, '')
ON CONFLICT (slug) DO NOTHING;