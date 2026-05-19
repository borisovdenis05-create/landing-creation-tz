-- Логотип (новый, корректный по цвету — не требует brightness-фильтра)
UPDATE t_p1235792_landing_creation_tz.gosash_settings
SET value = 'https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/bucket/184ab2ba-1e40-4542-989a-d62d95c2301c.png',
    updated_at = NOW()
WHERE key = 'logo_url';

-- Новые настройки для редактирования через админку
INSERT INTO t_p1235792_landing_creation_tz.gosash_settings (key, value) VALUES
  ('phone_caption', 'Бесплатно по России с любых операторов:'),
  ('info_url', 'https://автошкола82.рф/info/'),
  ('info_label', 'Сведения об образовательной организации'),
  ('btn_lead_submit', 'Записаться на обучение →'),
  ('btn_callback_submit', 'Жду звонка'),
  ('btn_promo_submit', 'Отправить заявку'),
  ('btn_promo_apply', 'Оставить заявку'),
  ('policy_privacy_title', 'Политика конфиденциальности'),
  ('policy_consent_title', 'Согласие на обработку ПД'),
  ('policy_privacy_text', ''),
  ('policy_consent_text', '')
ON CONFLICT (key) DO NOTHING;