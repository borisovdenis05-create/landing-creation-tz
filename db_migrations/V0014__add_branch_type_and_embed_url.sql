ALTER TABLE t_p1235792_landing_creation_tz.gosash_branches
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Учебный класс',
  ADD COLUMN IF NOT EXISTS embed_url TEXT NOT NULL DEFAULT '';

-- Заполняем embed_url и тип для существующих филиалов (по аналогии с fallback)
UPDATE t_p1235792_landing_creation_tz.gosash_branches SET
  embed_url = 'https://yandex.ru/map-widget/v1/?ll=34.0993%2C44.9354&z=17&pt=34.0993,44.9354,pm2rdm',
  type = 'Учебный класс'
WHERE id = 1 AND embed_url = '';

UPDATE t_p1235792_landing_creation_tz.gosash_branches SET
  embed_url = 'https://yandex.ru/map-widget/v1/?ll=34.0869%2C44.9527&z=17&pt=34.0869,44.9527,pm2rdm',
  type = 'Учебный класс'
WHERE id = 2 AND embed_url = '';

UPDATE t_p1235792_landing_creation_tz.gosash_branches SET
  embed_url = 'https://yandex.ru/map-widget/v1/?ll=34.0417%2C44.9763&z=17&pt=34.0417,44.9763,pm2rdm',
  type = 'Учебный класс'
WHERE id = 3 AND embed_url = '';

UPDATE t_p1235792_landing_creation_tz.gosash_branches SET
  embed_url = 'https://yandex.ru/map-widget/v1/?ll=34.0950%2C44.9480&z=17&pt=34.0950,44.9480,pm2rdm',
  type = 'Учебный класс'
WHERE id = 4 AND embed_url = '';

UPDATE t_p1235792_landing_creation_tz.gosash_branches SET
  embed_url = 'https://yandex.ru/map-widget/v1/?ll=34.0807%2C44.9434&z=17&pt=34.0807,44.9434,pm2rdm',
  type = 'Учебный класс'
WHERE id = 5 AND embed_url = '';

UPDATE t_p1235792_landing_creation_tz.gosash_branches SET
  embed_url = 'https://yandex.ru/map-widget/v1/?ll=34.0700%2C44.9310&z=17&pt=34.0700,44.9310,pm2rdm',
  type = 'Автодром'
WHERE id = 6 AND embed_url = '';